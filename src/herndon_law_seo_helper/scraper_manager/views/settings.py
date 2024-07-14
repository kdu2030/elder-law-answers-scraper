from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render
from ..forms.setting_forms import WebsiteConfigurationForm, UserSettingsForm
from ..models.setting_models import WebsiteConfiguration
from typing import Union
import json
import traceback
from ..helpers.encryption_helpers import encrypt_string
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from typing import Dict
import requests
from PIL import Image
import io


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


@login_required
def user_settings_get(request: HttpRequest) -> HttpResponse:
    user = request.user
    user_form_initial_data = {
        "email": user.email,
        "username": user.username,
    }

    password_read_mode = "**********"
    form = UserSettingsForm(initial=user_form_initial_data)
    return render(request, "scraper_manager/user-settings.html", {"form": form, "password": password_read_mode})


def user_settings_put(request: HttpRequest) -> HttpResponse:
    if request.method != "PUT" or not request.user:
        return JsonResponse({"isError": True}, status=400)

    user: User = request.user
    existing_username = request.user.username
    existing_email = request.user.email

    try:
        request_body: Dict = json.loads(request.body.decode())
        is_form_valid = True
        form_errors = {}

        user.username = request_body.get("username", user.username)
        user.email = request_body.get("email", user.email)

        usernames = list(User.objects.values_list(
            "username", flat=True))
        usernames.remove(existing_username)

        emails = list(User.objects.values_list("email", flat=True))
        emails.remove(existing_email)

        if user.username in usernames:
            is_form_valid = False
            form_errors["username"] = "A user with this username already exists."

        if user.email in emails:
            is_form_valid = False
            form_errors["email"] = "A user with this email already exists."

        if not is_form_valid:
            return JsonResponse({"isError": True, "formErrors": form_errors}, status=400)

        password = request_body.get("password")

        if password:
            user.set_password(password)

        user.save()

        user = User.objects.get(id=user.id)
        update_session_auth_hash(request, user)

        return JsonResponse({"isError": False})
    except:
        print(traceback.format_exc())
        return JsonResponse({"isError": True, "error": traceback.format_exc()}, status=500)


def profile_image_post(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return JsonResponse({"isError": True}, status=400)

    if request.user is None:
        return JsonResponse({"isError": True}, status=400)

    content_type = request.content_type
    if "image" not in content_type:
        return JsonResponse({"isError": True}, status=400)

    filename = f"{request.user.username}_profile_image.{content_type.replace('image/', '')}"
    files = {"file": request.body}
    requests.post("http://127.0.0.1:5000/file-upload",
                  files=files, headers={"Content-Type": "multipart/form-data"})

    return JsonResponse({"isError": False})
