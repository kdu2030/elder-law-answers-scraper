from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from ..forms.setting_forms import SourceConfigurationForm
from ..models.setting_models import SourceConfiguration, SourceOptions
from typing import Union
from django.conf import settings


def settings_get(request: HttpRequest) -> HttpResponse:
    source_config_form = SourceConfigurationForm()
    return render(request, "scraper_manager/settings.html", {"email_form": source_config_form})


def ela_settings_post(request: HttpRequest) -> Union[HttpResponse, JsonResponse]:
    if (request.method != "POST"):
        return settings_get(request)

    source_config_form = SourceConfigurationForm(request.POST).cleaned_data

    existing_ela_configuration = SourceConfiguration.objects.filter(
        source=SourceOptions.ELDER_LAW_ANSWERS).first()

    print(settings.SECRET_KEY)

    # if existing_ela_configuration is None:
    #     new_source_config = SourceConfiguration.objects.create(
    #         source=SourceOptions.ELDER_LAW_ANSWERS, email=source_config_form["email"])
