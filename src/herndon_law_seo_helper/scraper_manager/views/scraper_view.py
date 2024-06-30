from django.http import HttpRequest, JsonResponse
from ..models.setting_models import SourceConfiguration, SourceOptions
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt
from playwright.sync_api import sync_playwright
from ..scraper.elder_law_answers_scraper import ElderLawAnswersScraper, ScraperException, ScraperErrorCode
from ..helpers.encryption_helpers import decrypt_string
from traceback import print_tb


def handle_scraper_exception(exception: ScraperException) -> JsonResponse:
    if (exception.error_code == ScraperErrorCode.LOGIN_FAILED.value):
        return JsonResponse({"isError": True, "error": "Elder Law Answers login failed."}, status=400)


def scrape_ela_article(configuration: SourceConfiguration):
    with sync_playwright() as playwright:
        password = decrypt_string(configuration.encrypted_password)

        ela_scraper = ElderLawAnswersScraper(
            playwright, configuration.email, password)
        ela_scraper.sign_in()
        ela_scraper.find_article()


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
        print_tb()
        return JsonResponse({"isError": True}, status=500)
