from django.urls import path
from .views import authentication

urlpatterns = [
    path("", authentication.index, name="index"),
    path("signin/", authentication.sign_in, name="sign_in")
]