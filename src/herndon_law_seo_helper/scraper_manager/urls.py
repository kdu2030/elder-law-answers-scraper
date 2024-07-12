from django.urls import path
from .views import authentication, settings, scraper_view

urlpatterns = [
    path("", authentication.index, name="index"),
    path("settings/", settings.ela_settings_get, name="settings"),
    path("user-settings/", settings.user_settings_get, name="user_settings"),
    path("signin/", authentication.sign_in, name="sign_in"),
    path("signout/", authentication.sign_out, name="sign_out"),
    path("api/ela-settings", settings.ela_settings_post, name="ela_settings_post"),
    path("api/scrape-ela-article", scraper_view.scrape_ela_article_get,
         name="scrape_ela_article"),
    path("api/user-settings", settings.user_settings_put,
         name="user_settings_put")
]
