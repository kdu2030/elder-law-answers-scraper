from django.http import HttpRequest, JsonResponse
from ..models.setting_models import SourceConfiguration, SourceOptions
from django.core.exceptions import ObjectDoesNotExist
from django.views.decorators.csrf import csrf_exempt


@csrf_exempt
def scrape_ela_article_get(request: HttpRequest) -> JsonResponse:
    try:
        existing_configuration = SourceConfiguration.objects.get(
            source=SourceOptions.ELDER_LAW_ANSWERS.value)

        if existing_configuration.email is None or existing_configuration.encrypted_password is None:
            raise ObjectDoesNotExist()

    except ObjectDoesNotExist:
        return JsonResponse({"isError": True, "error": "Elder Law Answers username or password is missing."}, status=400)
    except:
        return JsonResponse({"isError": True}, status=500)
    return JsonResponse({"isError": False})
