from django import forms
from django.utils.translation import gettext_lazy as _

from .models import Organization


class OrganizationForm(forms.ModelForm):
    class Meta:
        model = Organization
        fields = [
            "name",   # org_key (slug) is intentionally excluded
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
        labels = {
            "name": _("Name"),
            "page_start": _("Page start"),
            "description": _("Description"),
            "contact_raw": _("Contact"),
            "address": _("Address"),
            "postal_code": _("Postal code"),
            "city": _("City"),
            "target_group_raw": _("Raw target groups"),
            "applicants_raw": _("Applicants"),
            "submission_deadline_raw": _("Submission deadline"),
            "submission_address_raw": _("Submission address"),
            "attachments_raw": _("Attachments"),
            "parse_warning": _("Parse warning"),
            "source_file": _("Source file"),
        }
