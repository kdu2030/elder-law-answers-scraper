from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from ..forms.auth_forms import SignInForm


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "scraper_manager/index.html")


def sign_in(request: HttpRequest) -> HttpResponse:
    signin_form = SignInForm()
    return render(request, "scraper_manager/sign-in.html", {"form": signin_form})
