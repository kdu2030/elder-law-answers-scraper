from django.http import HttpRequest, HttpResponse
from django.shortcuts import render
from ..forms.auth_forms import SignInForm


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "scraper_manager/index.html")


def sign_in_get(request: HttpRequest) -> HttpResponse:
    signin_form = SignInForm()
    return render(request, "scraper_manager/sign-in.html", {"form": signin_form})


def sign_in_post(request: HttpRequest) -> HttpResponse:
    signin_form = SignInForm(request.POST)
    if signin_form.is_valid():
        return render(request, "scraper_manager/index.html")
    return render(request, "scraper_manager/sign-in.html", {"form": signin_form})


def sign_in(request: HttpRequest) -> HttpResponse:
    if request.method == 'POST':
        return sign_in_post(request)

    return sign_in_get(request)
