"""
application_session.py
----------------------
Accumulates multi-page form state in Django's server-side session store.
Written to the database only on final submission.
"""
from __future__ import annotations
from dataclasses import dataclass
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from django.http import HttpRequest
    from .models import ApplicationSession

SESSION_KEY = "grant_application_builder"


@dataclass
class ApplicationSessionBuilder:
    support_type: str | None = None       # private | institution | project | education
    residency_status: str | None = None   # permit-b, swiss-citizen, etc.
    zip_code: str | None = None
    description: str | None = None        # main text — feeds vectorization
    additional_info: str | None = None    # optional extra context
    layer1_passed_org_ids: list[int] | None = None
    application_vector: list[float] | None = None

    def update_page1(self, support_type: str, residency_status: str = "", zip_code: str = "") -> None:
        self.support_type = support_type
        self.residency_status = residency_status
        self.zip_code = zip_code

    def update_page2(self, description: str) -> None:
        self.description = description

    def update_page3(self, additional_info: str = "") -> None:
        self.additional_info = additional_info

    def to_text_for_vectorization(self) -> str:
        """Build the query string fed into the embedding model."""
        parts = [p for p in [self.support_type, self.description, self.additional_info] if p]
        return " | ".join(parts)

    def save(self) -> "ApplicationSession":
        from .models import ApplicationSession
        return ApplicationSession.objects.create(
            status=ApplicationSession.Status.SUBMITTED,
            support_type=self.support_type,
            residency_status=self.residency_status,
            zip_code=self.zip_code,
            description=self.description,
            additional_info=self.additional_info,
            layer1_passed_org_ids=self.layer1_passed_org_ids,
            application_vector=self.application_vector,
        )

    def to_session(self, request: "HttpRequest") -> None:
        request.session[SESSION_KEY] = {
            "support_type": self.support_type,
            "residency_status": self.residency_status,
            "zip_code": self.zip_code,
            "description": self.description,
            "additional_info": self.additional_info,
            "layer1_passed_org_ids": self.layer1_passed_org_ids,
            "application_vector": self.application_vector,
        }

    @classmethod
    def from_session(cls, request: "HttpRequest") -> "ApplicationSessionBuilder":
        data = request.session.get(SESSION_KEY, {})
        return cls(
            support_type=data.get("support_type"),
            residency_status=data.get("residency_status"),
            zip_code=data.get("zip_code"),
            description=data.get("description"),
            additional_info=data.get("additional_info"),
            layer1_passed_org_ids=data.get("layer1_passed_org_ids"),
            application_vector=data.get("application_vector"),
        )

    def clear_session(self, request: "HttpRequest") -> None:
        request.session.pop(SESSION_KEY, None)
