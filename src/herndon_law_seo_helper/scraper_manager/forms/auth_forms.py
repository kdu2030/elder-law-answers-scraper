from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate


class SignInForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onEmailBlur(event)", "id": "signin-email-input"}),
                             label="Email", required=True)
    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Password", "class": "form-control", "id": "signin-password-input", "onblur": "onPasswordBlur(event)"}),
                               label="Password", required=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ""

    def clean(self):
        super(SignInForm, self).clean()

        email = self.cleaned_data.get("email")
        password = self.cleaned_data.get("password")

        user = User.objects.filter(email=email).first()
        error_input_class = "form-control is-invalid"

        if user is None:
            self.add_error("email", ValidationError(
                "A user with this email was not found."))
            self.fields["email"].widget.attrs["class"] = error_input_class
        elif authenticate(username=user.username, password=password) is None:
            self.add_error("password", ValidationError(
                "Your password is incorrect."))
            self.fields["password"].widget.attrs["class"] = error_input_class
            self.fields["password"].widget.attrs["value"] = password
        else:
            self.cleaned_data["valid_user"] = user

        return self.cleaned_data
