from django import forms


class EmailForm(forms.Form):
    email = forms.EmailField(widget=forms.EmailInput(attrs={"placeholder": "Email", "class": "form-control"}),
                             label="Email", required=True)
