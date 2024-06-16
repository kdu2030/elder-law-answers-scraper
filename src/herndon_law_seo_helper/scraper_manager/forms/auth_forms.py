from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


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

        if user is None:
            self.add_error("email", ValidationError(
                "A user with this email was not found"))
            self.fields["email"].widget.attrs["class"] = "form-control is-invalid"

        return self.cleaned_data
