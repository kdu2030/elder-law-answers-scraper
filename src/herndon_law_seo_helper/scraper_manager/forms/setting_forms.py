from django import forms


class EmailForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onElaEmailBlur(event)", "id": "ela-email-input"}),
                             label="Email", required=True)
