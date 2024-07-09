from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from ..forms.setting_forms import SourceConfigurationForm
from ..models.setting_models import SourceConfiguration, SourceOptions
from typing import Union
import json
import traceback
from ..helpers.encryption_helpers import encrypt_string


def ela_settings_get(request: HttpRequest) -> HttpResponse:
    existing_ela_configuration = SourceConfiguration.objects.filter(
        source=SourceOptions.ELDER_LAW_ANSWERS.value).first()

    if existing_ela_configuration:
        username = existing_ela_configuration.email if existing_ela_configuration else None
        password_msg = "**********" if existing_ela_configuration.encrypted_password else "Password does not exist."
        source_config_form = SourceConfigurationForm(
            existing_config=existing_ela_configuration)
        return render(request, "scraper_manager/ela-settings.html", {"form": source_config_form, "username": username, "password_msg": password_msg})

    source_config_form = SourceConfigurationForm()
    return render(request, "scraper_manager/ela-settings.html", {"form": source_config_form, "username": "", "password_msg": "Password does not exist."})


def ela_settings_post(request: HttpRequest) -> Union[HttpResponse, JsonResponse]:
    if (request.method != "POST"):
        return ela_settings_get(request)

    request_body = json.loads(request.body.decode())

    email = request_body.get("email")
    password = request_body.get("password")

    existing_ela_configuration = SourceConfiguration.objects.filter(
        source=SourceOptions.ELDER_LAW_ANSWERS.value).first()

    try:
        if existing_ela_configuration is None:
            SourceConfiguration.objects.create(
                source=SourceOptions.ELDER_LAW_ANSWERS.value,
                email=email,
                encrypted_password=encrypt_string(password) if password else None)

            return JsonResponse({"isError": False})

        existing_ela_configuration.email = email or existing_ela_configuration.email
        existing_ela_configuration.encrypted_password = encrypt_string(
            password) if password else existing_ela_configuration.encrypted_password

        existing_ela_configuration.save()

        return JsonResponse({"isError": False})
    except Exception:
        return JsonResponse({"isError": True, "error": traceback.format_exc()})
