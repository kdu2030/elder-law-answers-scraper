from django.http import HttpRequest, HttpResponse
from django.shortcuts import render


def page_not_found_get(request: HttpRequest) -> HttpResponse:
    return render(request, "scraper_manager/page-not-found.html")
