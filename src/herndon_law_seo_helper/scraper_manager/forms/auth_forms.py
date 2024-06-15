from django import forms


class SignInForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onEmailBlur(event)", "id": "signin-email-input"}),
                             label="Email")
    password = forms.CharField(widget=forms.PasswordInput(attrs={"placeholder": "Password", "class": "form-control", "id": "signin-password-input", "onblur": "onPasswordBlur(event)"}),
                               label="Password")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.label_suffix = ""
