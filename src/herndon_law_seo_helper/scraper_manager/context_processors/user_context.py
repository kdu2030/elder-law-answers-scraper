from ..models.user_models import UserProfilePicture, UserPermissionCode, PermissionCode
from django.http import HttpResponse


def get_profile_image(request: HttpResponse):
    if not request.user.is_authenticated:
        return {}
    profile_picture = UserProfilePicture.objects.filter(
        user=request.user).first()
    image_src = "https://i.ibb.co/y4KL53m/Default-Profile-Picture-Transparent.png"
    if profile_picture:
        image_src = profile_picture.image_url

    return {"profile_image": image_src}


def get_user_permissions(request: HttpResponse):
    if not request.user.is_authenticated:
        return {}

    edit_config_permission = UserPermissionCode.objects.filter(
        user=request.user, permission_code=PermissionCode.EDIT_WEBSITE_CONFIG.value).first()
    view_admin_permission = UserPermissionCode.objects.filter(
        user=request.user, permission_code=PermissionCode.VIEW_ADMIN.value).first()

    return {
        "can_edit_config": edit_config_permission is not None,
        "can_view_admin": view_admin_permission is not None,
    }
