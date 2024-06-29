from django import forms


class EmailForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control d-none"}),
                             label="Email", required=True)
