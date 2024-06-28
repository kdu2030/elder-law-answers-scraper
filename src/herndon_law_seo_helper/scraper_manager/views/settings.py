from django.http import HttpResponse, HttpRequest
from django.shortcuts import render


def settings_get(response: HttpRequest) -> HttpResponse:
    return render(response, "scraper_manager/settings.html")
