from django import forms


class EmailForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control", "onblur": "onElaEmailBlur(event)"}),
                             label="Email", required=True)
