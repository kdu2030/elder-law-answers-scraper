from django import forms


class SourceConfigurationForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onElaEmailBlur(event)", "id": "ela-email-input"}),
                             label="Email", required=False)

    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Password", "class": "form-control"}),
                               label="Password", required=False)
