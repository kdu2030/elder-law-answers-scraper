from django.http import HttpResponse, HttpRequest, JsonResponse
from django.shortcuts import render, redirect
from ..forms.setting_forms import WebsiteConfigurationForm, UserSettingsForm
from ..models.setting_models import WebsiteConfiguration
from ..models.user_models import UserProfilePicture, UserPermissionCode, PermissionCode
from typing import Union
import json
import traceback
from ..helpers.encryption_helpers import encrypt_string
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.contrib.auth import update_session_auth_hash
from typing import Dict
import copy


@login_required
def ela_settings_get(request: HttpRequest) -> HttpResponse:
    can_edit_config = UserPermissionCode.objects.filter(
        user=request.user, permission_code=PermissionCode.EDIT_WEBSITE_CONFIG.value).first()

    if not can_edit_config:
        return redirect("/user-settings")

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
    if request.method != "PUT" or not request.user.is_authenticated:
        return JsonResponse({"isError": True}, status=400)

    request_body: Dict = json.loads(request.body.decode())
    user_id = request_body.get("userId")

    user: User = User.objects.get(id=user_id) if user_id else request.user
    existing_username = copy.deepcopy(user.username)
    existing_email = copy.deepcopy(user.email)

    try:

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

        if not user_id:
            user = User.objects.get(id=user.id)
            update_session_auth_hash(request, user)
        elif user_id == request.user.id:
            update_session_auth_hash(request, user)

        return JsonResponse({"isError": False})
    except:
        print(traceback.format_exc())
        return JsonResponse({"isError": True, "error": traceback.format_exc()}, status=500)


def profile_image_put(request: HttpRequest) -> HttpResponse:
    if request.method != "PUT" or not request.user.is_authenticated:
        return JsonResponse({"isError": True}, status=400)

    request_body = json.loads(request.body.decode())
    file_name = request_body.get("fileName")
    image_url = request_body.get("imageUrl")

    existing_profile_picture = UserProfilePicture.objects.filter(
        user=request.user).first()

    if existing_profile_picture:
        existing_profile_picture.file_name = file_name
        existing_profile_picture.image_url = image_url
        existing_profile_picture.save()
        return JsonResponse({"isError": False})

    UserProfilePicture.objects.create(
        user=request.user, file_name=file_name, image_url=image_url)

    return JsonResponse({"isError": False})


def user_permissions_put(request: HttpRequest) -> HttpResponse:
    if request.method != "PUT" or not request.user.is_authenticated:
        return JsonResponse({"isError": True}, status=400)

    request_body = json.loads(request.body.decode())

    user_id = request_body.get("userId")
    can_view_admin = request_body.get("canViewAdmin")
    can_edit_config = request_body.get("canEditConfig")

    try:
        user = User.objects.get(id=user_id)
        existing_permissions = UserPermissionCode.objects.filter(user=user)
        existing_permission_codes = list(map(
            lambda permission: permission.permission_code, existing_permissions))

        for permission in existing_permissions:
            if permission.permission_code == PermissionCode.EDIT_WEBSITE_CONFIG.value and not can_edit_config:
                permission.delete()
                existing_permission_codes.remove(
                    PermissionCode.EDIT_WEBSITE_CONFIG.value)
            elif permission.permission_code == PermissionCode.VIEW_ADMIN.value and not can_view_admin:
                permission.delete()
                existing_permission_codes.remove(
                    PermissionCode.VIEW_ADMIN.value)

        if can_view_admin and PermissionCode.VIEW_ADMIN.value not in existing_permission_codes:
            UserPermissionCode.objects.create(
                user=user, permission_code=PermissionCode.VIEW_ADMIN.value)

        if can_edit_config and PermissionCode.EDIT_WEBSITE_CONFIG.value not in existing_permission_codes:
            UserPermissionCode.objects.create(
                user=user, permission_code=PermissionCode.EDIT_WEBSITE_CONFIG.value)

        return JsonResponse({"isError": False}, status=200)

    except:
        traceback.print_exc()
        return JsonResponse({"isError": True}, status=500)


def user_post(request: HttpRequest) -> HttpResponse:
    if request.method != "POST" or not request.user.is_authenticated:
        return JsonResponse({"isError": True}, status=500)

    request_body = json.loads(request.body.decode())

    user_with_matching_username = User.objects.filter(
        username=request_body["username"]).first()
    user_with_matching_email = User.objects.filter(
        email=request_body["email"]).first()

    if user_with_matching_username or user_with_matching_email:
        form_errors = {
            "username": "A user with this username already exists." if user_with_matching_username else None,
            "email": "A user with this email already exists." if user_with_matching_email else None
        }

        return JsonResponse({"isError": True, "formErrors": form_errors}, status=400)

    try:
        user = User.objects.create_user(
            username=request_body["username"], email=request_body["email"], password=request_body["password"])
        user.save()

        if request_body["canViewAdmin"]:
            admin_permission_code = UserPermissionCode.objects.create(
                user=user, permission_code=PermissionCode.VIEW_ADMIN.value)
            admin_permission_code.save()

        if request_body["canEditConfig"]:
            edit_config_permission_code = UserPermissionCode.objects.create(
                user=user, permission_code=PermissionCode.EDIT_WEBSITE_CONFIG.value)
            edit_config_permission_code.save()

        return JsonResponse({"isError": False}, status=200)
    except:
        traceback.print_exc()
        return JsonResponse({"isError": True}, status=500)


def user_delete(request: HttpRequest, id: int) -> HttpResponse:
    if request.method != "DELETE" or not request.user.is_authenticated:
        return JsonResponse({"isError": True}, status=400)

    view_admin_code = UserPermissionCode.objects.filter(
        user=request.user, permission_code=PermissionCode.VIEW_ADMIN.value)

    if not view_admin_code:
        return JsonResponse({"isError": True}, status=403)

    try:
        user_to_delete = User.objects.get(id=id)
        user_to_delete.delete()

        return JsonResponse({"isError": False})
    except:
        traceback.print_exc()
        return JsonResponse({"isError": True}, status=500)
