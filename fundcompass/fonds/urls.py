from django.urls import path

from . import views

urlpatterns = [
    # ------------------------------------------------------------------
    # Existing API endpoints — unchanged
    # ------------------------------------------------------------------
    path("organizations/", views.organizations_list, name="organizations-list"),
    path("organizations/<str:org_id>/", views.organization_detail, name="organization-detail"),
    path("target-groups/", views.target_groups_list, name="target-groups-list"),
    path("applicant-types/", views.applicant_types_list, name="applicant-types-list"),
    path("attachment-types/", views.attachment_types_list, name="attachment-types-list"),
    path("overview/", views.overview_list, name="overview-list"),

    # ------------------------------------------------------------------
    # Grant application pipeline
    # ------------------------------------------------------------------
    path("apply/page1/", views.apply_page1, name="apply-page1"),
    path("apply/page2/", views.apply_page2, name="apply-page2"),
    path("apply/page3/", views.apply_page3, name="apply-page3"),
    path("apply/submit/", views.apply_submit, name="apply-submit"),
    path("apply/status/", views.apply_status, name="apply-status"),
]
