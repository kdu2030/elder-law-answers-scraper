from django import forms
from ..models.setting_models import SourceConfiguration
from typing import Union


class SourceConfigurationForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onElaEmailBlur(event)", "id": "ela-email-input"}),
                             label="Email", required=False)

    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Password", "class": "form-control", "id": "ela-password-input", "onblur": "onElaPasswordBlur()"}),
                               label="Password", required=False)

    confirm_password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Confirm Password", "class": "form-control", "id": "ela-confirm-password-input", "onblur": "onElaPasswordBlur()"}),
                                       label="Confirm Password", required=False)

    def __init__(self, existing_config: Union[SourceConfiguration, None] = None, *args, **kwargs):
        super().__init__(*args, **kwargs)

        if existing_config is None:
            return

        self.fields["email"].widget.attrs["value"] = existing_config.email if existing_config else ""
