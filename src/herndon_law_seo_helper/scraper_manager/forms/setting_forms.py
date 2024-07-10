from django import forms
from ..models.setting_models import WebsiteConfiguration
from typing import Union


class WebsiteConfigurationForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput(attrs={"placeholder": "Username", "class": "form-control", "onblur": "onElaUsernameBlur(event)", "id": "ela-username-input"}),
                               label="Username", required=False)

    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Password", "class": "form-control", "id": "ela-password-input", "onblur": "onElaPasswordBlur()"}),
                               label="Password", required=False)

    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Confirm Password", "class": "form-control", "id": "ela-confirm-password-input", "onblur": "onElaPasswordBlur()"}),
                                       label="Confirm Password", required=False)

    def __init__(self, existing_config: Union[WebsiteConfiguration, None] = None, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if existing_config is None:
            return

        self.fields["username"].widget.attrs["value"] = existing_config.username if existing_config else ""


class UserSettingsForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(
        attrs={"placeholder": "Email", "class": "form-control", "id": "user-settings-email-input", "onblur": "onChangeEmailBlur()"}))

    password = forms.CharField(widget=forms.PasswordInput(
        attrs={"placeholder": "Password", "class": "form-control", "id": "user-settings-password-input", "onblur": "onChangePasswordBlur()"}))

    confirm_password = forms.CharField(widget=forms.PasswordInput(
        attrs={"placeholder": "Password", "class": "form-control", "id": "user-settings-confirm-password-input", "onblur": "onChangePasswordBlur()"}))
