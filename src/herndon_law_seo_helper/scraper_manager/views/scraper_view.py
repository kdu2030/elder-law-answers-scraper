from django.http import HttpRequest, JsonResponse
from ..models.setting_models import SourceConfiguration, SourceOptions
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from ..helpers.encryption_helpers import decrypt_string
import traceback
from ..models.blog_posts import BlogPost
from typing import List
from datetime import datetime
from ..scraper.elder_law_answers_scraper import ElderLawAnswersScraper, ScraperErrorCode, ScraperException


def handle_scraper_exception(exception: ScraperException) -> JsonResponse:
    if exception.error_code == ScraperException.UNABLE_TO_FIND_ARTICLE.value:
        return JsonResponse({"isWarning": True, "warning": "Unable to find an article to post."}, status=400)

    return JsonResponse({"isError": True}, status=400)


def get_posted_articles() -> List[BlogPost]:
    max_entries = 40
    blog_posts = BlogPost.objects.order_by("date_posted").all()[:max_entries]
    return blog_posts


def blog_posts_to_article_names(blog_posts: List[BlogPost]) -> List[str]:
    return map(lambda blog_post: blog_post.post_title, blog_posts)


def scrape_ela_article(configuration: SourceConfiguration):
    posted_articles = get_posted_articles()
    article_names = blog_posts_to_article_names(posted_articles)

    scraper = ElderLawAnswersScraper(
        website_username="herndonlaw", website_password="Est@teL@w2024")
    article_relative_url = scraper.find_article(article_names)
    article_title = scraper.post_article(article_relative_url)

    BlogPost.objects.create(post_title=article_title,
                            date_posted=datetime.now())


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
    except ScraperException as e:
        return handle_scraper_exception(e)
    except Exception as e:
        print(traceback.format_exc())
        return JsonResponse({"isError": True}, status=500)
