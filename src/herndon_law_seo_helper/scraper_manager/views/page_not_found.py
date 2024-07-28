from django.http import HttpRequest, HttpResponse, Http404
from django.shortcuts import render


def page_not_found_get(request: HttpRequest, exception: Http404) -> HttpResponse:
    return render(request, "scraper_manager/page-not-found.html")
