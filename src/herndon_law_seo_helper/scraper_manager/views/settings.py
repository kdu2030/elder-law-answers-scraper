from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from ..forms.setting_forms import SourceConfigurationForm
from ..models.setting_models import SourceConfiguration, SourceOptions
from typing import Union
from django.conf import settings
from cryptography.fernet import Fernet
import json
import base64
import traceback


def encrypt_string(value: str) -> str:
    key_bytes = settings.ENCRYPTION_KEY.encode()
    fernet = Fernet(base64.b64encode(key_bytes))
    return fernet.encrypt(value.encode()).decode("utf-8")


def ela_settings_get(request: HttpRequest) -> HttpResponse:
    existing_ela_configuration = SourceConfiguration.objects.filter(
        source=SourceOptions.ELDER_LAW_ANSWERS.value).first()

    email = existing_ela_configuration.email if existing_ela_configuration else None
    password_msg = "*****" if existing_ela_configuration.encrypted_password else "Password does not exist."

    source_config_form = SourceConfigurationForm(
        existing_config=existing_ela_configuration)
    return render(request, "scraper_manager/settings.html", {"email_form": source_config_form, "email": email, "password_msg": password_msg})


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
