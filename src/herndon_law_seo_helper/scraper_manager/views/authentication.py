from django.http import HttpRequest, HttpResponse
from django.shortcuts import render, redirect
from ..forms.auth_forms import SignInForm
from django.contrib.auth import login, logout


def index(request: HttpRequest) -> HttpResponse:
    return render(request, "scraper_manager/index.html")


def sign_in_get(request: HttpRequest) -> HttpResponse:
    signin_form = SignInForm()
    return render(request, "scraper_manager/sign-in.html", {"form": signin_form})


def sign_in_post(request: HttpRequest) -> HttpResponse:
    signin_form = SignInForm(request.POST)
    if signin_form.is_valid() and signin_form.cleaned_data["valid_user"] is not None:
        login(request, signin_form.cleaned_data["valid_user"])
        return redirect("/dashboard")

    return render(request, "scraper_manager/sign-in.html", {"form": signin_form})


def sign_in(request: HttpRequest) -> HttpResponse:
    if request.method == 'POST':
        return sign_in_post(request)

    return sign_in_get(request)


def sign_out(request: HttpRequest) -> HttpResponse:
    if request.method != "POST":
        return render(request, "scraper_manager/index.html")
    logout(request)
    return redirect("/signin")
