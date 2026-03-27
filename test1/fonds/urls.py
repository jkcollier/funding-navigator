from django.urls import path

from . import views

urlpatterns = [
    path("organizations/", views.organizations_list, name="organizations-list"),
    path("organizations/<str:org_id>/", views.organization_detail, name="organization-detail"),
    path("target-groups/", views.target_groups_list, name="target-groups-list"),
    path("applicant-types/", views.applicant_types_list, name="applicant-types-list"),
    path("attachment-types/", views.attachment_types_list, name="attachment-types-list"),
    path("overview/", views.overview_list, name="overview-list"),
]
