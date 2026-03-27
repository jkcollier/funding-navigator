from django.urls import path

from . import views

urlpatterns = [
    path("", views.home_page, name="home"),
    path("organizations/", views.organizations_page, name="ui-organizations"),
    path("organizations/<str:org_id>/edit/", views.organization_edit_page, name="ui-organization-edit"),
    path("targets/", views.target_groups_page, name="ui-target-groups"),
    path("targets/<str:target_group_id>/", views.target_group_detail_page, name="ui-target-group-detail"),
]
