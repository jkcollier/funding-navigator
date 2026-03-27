from django import forms

from .models import Organization


class OrganizationForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = [
            "name",
            "page_start",
            "description",
            "contact_raw",
            "address",
            "postal_code",
            "city",
            "target_group_raw",
            "applicants_raw",
            "submission_deadline_raw",
            "submission_address_raw",
            "attachments_raw",
            "parse_warning",
            "source_file",
        ]
        widgets = {
            "description": forms.Textarea(attrs={"rows": 4}),
            "contact_raw": forms.Textarea(attrs={"rows": 4}),
            "target_group_raw": forms.Textarea(attrs={"rows": 3}),
            "applicants_raw": forms.Textarea(attrs={"rows": 3}),
            "submission_deadline_raw": forms.Textarea(attrs={"rows": 2}),
            "submission_address_raw": forms.Textarea(attrs={"rows": 3}),
            "attachments_raw": forms.Textarea(attrs={"rows": 3}),
            "parse_warning": forms.Textarea(attrs={"rows": 2}),
        }
