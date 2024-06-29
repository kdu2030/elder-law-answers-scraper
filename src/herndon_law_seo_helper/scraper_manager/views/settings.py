from django.http import HttpResponse, HttpRequest
from django.shortcuts import render
from ..forms.setting_forms import EmailForm


def settings_get(response: HttpRequest) -> HttpResponse:
    email_form = EmailForm()
    return render(response, "scraper_manager/settings.html", {"email_form": email_form})
