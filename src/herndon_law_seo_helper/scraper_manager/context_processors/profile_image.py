from ..models.user_models import UserProfilePicture
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
