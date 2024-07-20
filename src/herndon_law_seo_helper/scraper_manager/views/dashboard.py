from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def dashboard_get(request: HttpRequest) -> HttpResponse:
    return render(request, "scraper_manager/dashboard.html")
