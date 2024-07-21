from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from ..models.user_models import UserProfilePicture
from typing import List, Dict


def get_table_row_for_user(user: User) -> Dict[str, str]:
    email = user.email
    username = user.username
    profile_picture = UserProfilePicture.objects.filter(user=user).first()
    image_src = "https://i.ibb.co/y4KL53m/Default-Profile-Picture-Transparent.png"
    if profile_picture:
        image_src = profile_picture.image_url
    return {"email": email, "username": username, "image_src": image_src}


def get_admin_data() -> List[Dict[str, str]]:
    all_users = User.objects.all()
    return list(map(lambda user: get_table_row_for_user(user), all_users))


def admin_get(request: HttpRequest) -> HttpResponse:
    admin_table_data = get_admin_data()
    return render(request, "scraper_manager/admin.html", {"table_data": admin_table_data})
