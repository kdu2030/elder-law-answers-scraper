from django.http import HttpRequest, JsonResponse
from ..models.setting_models import SourceConfiguration, SourceOptions
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from playwright.sync_api import sync_playwright
from ..scraper.old_elder_law_answers_scraper import OldElderLawAnswersScraper, OldScraperException, OldScraperErrorCode
from ..helpers.encryption_helpers import decrypt_string
import traceback
from ..models.blog_posts import BlogPost
from typing import List
from datetime import datetime
from ..scraper.elder_law_answers_scraper import ElderLawAnswersScraper


def handle_scraper_exception(exception: OldScraperException) -> JsonResponse:
    if (exception.error_code == OldScraperErrorCode.LOGIN_FAILED.value):
        return JsonResponse({"isError": True, "error": "Elder Law Answers login failed."}, status=400)
    if (exception.error_code == OldScraperErrorCode.UNABLE_TO_FIND_ARTICLE.value):
        return JsonResponse({"isWarning": True, "warning": "Unable to find an article to post."}, status=400)

    return JsonResponse({"isError": True}, status=400)


def get_posted_articles() -> List[BlogPost]:
    max_entries = 40
    blog_posts = BlogPost.objects.filter(
        source=SourceOptions.ELDER_LAW_ANSWERS.value).order_by("date_posted").all()[:max_entries]
    return blog_posts


def blog_posts_to_article_names(blog_posts: List[BlogPost]) -> List[str]:
    return map(lambda blog_post: blog_post.post_title, blog_posts)


def scrape_ela_article(configuration: SourceConfiguration):
    posted_articles = get_posted_articles()
    article_names = blog_posts_to_article_names(posted_articles)

    scraper = ElderLawAnswersScraper(website_username="herndonlaw", website_password="Est@teL@w2024")
    article_relative_url = scraper.find_article(article_names)
    scraper.post_article(article_relative_url)

    #
    # with sync_playwright() as playwright:
    #     password = decrypt_string(configuration.encrypted_password)
    #
    #     ela_scraper = OldElderLawAnswersScraper(
    #         playwright, configuration.email, password)
    #     ela_scraper.sign_in()
    #
    #     article_link = ela_scraper.find_article(article_names)
    #     article_title = ela_scraper.post_article(article_link)
    #
    # BlogPost.objects.create(source=SourceOptions.ELDER_LAW_ANSWERS.value,
    #                         post_title=article_title, date_posted=datetime.now())


@csrf_exempt
def scrape_ela_article_get(request: HttpRequest) -> JsonResponse:
    try:
        existing_configuration = SourceConfiguration.objects.get(
            source=SourceOptions.ELDER_LAW_ANSWERS.value)

        if existing_configuration.email is None or existing_configuration.encrypted_password is None:
            raise ObjectDoesNotExist()

        scrape_ela_article(existing_configuration)

        return JsonResponse({"isError": False})

    except ObjectDoesNotExist:
        return JsonResponse({"isError": True, "error": "Elder Law Answers username or password is missing."}, status=400)
    except OldScraperException as e:
        return handle_scraper_exception(e)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"isError": True}, status=500)
