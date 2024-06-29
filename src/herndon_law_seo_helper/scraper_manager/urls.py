from django.urls import path
from .views import authentication, settings

urlpatterns = [
    path("", authentication.index, name="index"),
    path("settings/", settings.settings_get, name="settings"),
    path("signin/", authentication.sign_in, name="sign_in"),
    path("signout/", authentication.sign_out, name="sign_out"),
    path("api/ela-settings", settings.ela_settings_post, name="ela_settings_post")
]
