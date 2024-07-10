from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from ..forms.setting_forms import WebsiteConfigurationForm, UserSettingsForm
from ..models.setting_models import WebsiteConfiguration
from typing import Union
import json
import traceback
from ..helpers.encryption_helpers import encrypt_string


def ela_settings_get(request: HttpRequest) -> HttpResponse:
    existing_website_configuration: WebsiteConfiguration = WebsiteConfiguration.objects.all().first()

    if existing_website_configuration:
        username = existing_website_configuration.username if existing_website_configuration else None
        password_msg = "**********" if existing_website_configuration.encrypted_password else "Password does not exist."
        source_config_form = WebsiteConfigurationForm(
            existing_config=existing_website_configuration)
        return render(request, "scraper_manager/ela-settings.html", {"form": source_config_form, "username": username, "password_msg": password_msg})

    source_config_form = WebsiteConfigurationForm()
    return render(request, "scraper_manager/ela-settings.html", {"form": source_config_form, "username": "", "password_msg": "Password does not exist."})


def ela_settings_post(request: HttpRequest) -> Union[HttpResponse, JsonResponse]:
    if request.method != "POST":
        return ela_settings_get(request)

    request_body = json.loads(request.body.decode())

    username = request_body.get("username")
    password = request_body.get("password")

    existing_website_configuration: WebsiteConfiguration = WebsiteConfiguration.objects.all().first()

    try:
        if existing_website_configuration is None:
            WebsiteConfiguration.objects.create(
                username=username,
                encrypted_password=encrypt_string(password) if password else None)

            return JsonResponse({"isError": False})

        existing_website_configuration.username = username or existing_website_configuration.username
        existing_website_configuration.encrypted_password = encrypt_string(
            password) if password else existing_website_configuration.encrypted_password

        existing_website_configuration.save()

        return JsonResponse({"isError": False})
    except Exception:
        return JsonResponse({"isError": True, "error": traceback.format_exc()})


def user_settings_get(request: HttpRequest) -> HttpResponse:
    form = UserSettingsForm()
    return render(request, "scraper_manager/user-settings.html", {"form": form})
