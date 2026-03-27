from django.db.models import Count, Prefetch, Q
from django.http import JsonResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.urls import reverse
from django.utils.translation import gettext as _
from django.views.decorators.http import require_GET

from .forms import OrganizationForm
from .models import (
    ApplicantType,
    AttachmentType,
    Organization,
    OrganizationApplicantType,
    OrganizationAttachmentType,
    OrganizationTargetGroup,
    OverviewDerived,
    TargetGroup,
)


@require_GET
def home_page(request):
    return render(request, "fonds/home.html")


def organizations_page(request):
    query = request.GET.get("q", "").strip()
    queryset = Organization.objects.all().order_by("name")

    if query:
        queryset = queryset.filter(
            Q(name__icontains=query)
            | Q(city__icontains=query)
            | Q(description__icontains=query)
            | Q(target_group_raw__icontains=query)
        )

    organizations = queryset[:300]
    return render(
        request,
        "fonds/organizations_list.html",
        {
            "organizations": organizations,
            "query": query,
        },
    )


def _organization_queryset():
    return Organization.objects.prefetch_related(
        Prefetch(
            "organization_target_groups",
            queryset=OrganizationTargetGroup.objects.select_related("target_group"),
        ),
        Prefetch(
            "organization_applicant_types",
            queryset=OrganizationApplicantType.objects.select_related("applicant_type"),
        ),
        Prefetch(
            "organization_attachment_types",
            queryset=OrganizationAttachmentType.objects.select_related("attachment_type"),
        ),
    )


def _serialized_organization(organization):
    try:
        overview = organization.overview
    except OverviewDerived.DoesNotExist:
        overview = None

    return {
        "id": organization.pk,
        "org_id": organization.org_key,
        "org_key": organization.org_key,
        "name": organization.name,
        "page_start": organization.page_start,
        "description": organization.description,
        "contact_raw": organization.contact_raw,
        "address": organization.address,
        "postal_code": organization.postal_code,
        "city": organization.city,
        "phone_numbers": organization.phone_numbers_jsonb,
        "emails": organization.emails_jsonb,
        "websites": organization.websites_jsonb,
        "target_group_raw": organization.target_group_raw,
        "applicants_raw": organization.applicants_raw,
        "submission_deadline_raw": organization.submission_deadline_raw,
        "submission_address_raw": organization.submission_address_raw,
        "attachments_raw": organization.attachments_raw,
        "raw_sections": organization.raw_sections_jsonb,
        "parse_warning": organization.parse_warning,
        "source_file": organization.source_file,
        "content_language": "de",
        "target_groups": [
            {
                "id": link.target_group.pk,
                "name": link.target_group.display_name,
                "english_name": link.target_group.english_name,
                "german_name": link.target_group.german_name,
                "german_variants": list(link.target_group.german_variants),
                "slug": link.target_group.slug,
            }
            for link in organization.organization_target_groups.all()
        ],
        "applicant_types": [
            {
                "applicant_type_id": link.applicant_type.applicant_type_id,
                "label": link.applicant_type.display_label,
                "english_label": link.applicant_type.english_label,
                "german_label": link.applicant_type.german_label,
            }
            for link in organization.organization_applicant_types.all()
        ],
        "attachment_types": [
            {
                "attachment_type_id": link.attachment_type.attachment_type_id,
                "label": link.attachment_type.display_label,
                "english_label": link.attachment_type.english_label,
                "german_label": link.attachment_type.german_label,
            }
            for link in organization.organization_attachment_types.all()
        ],
        "overview": None
        if overview is None
        else {
            "name": overview.name,
            "page": overview.page,
            "youth_family": overview.youth_family,
            "elderly": overview.elderly,
            "disability": overview.disability,
            "health": overview.health,
            "migration": overview.migration,
            "education": overview.education,
            "poverty": overview.poverty,
            "individuals": overview.individuals,
            "institutions": overview.institutions,
            "exhausted": overview.exhausted,
            "derived_from": overview.derived_from,
            "parse_warning": overview.parse_warning,
        },
    }


def organization_edit_page(request, org_id: str):
    organization = get_object_or_404(Organization, org_key=org_id)

    if request.method == "POST":
        form = OrganizationForm(request.POST, instance=organization)
        if form.is_valid():
            form.save()
            return redirect(reverse("ui-organizations") + "?saved=1")
    else:
        form = OrganizationForm(instance=organization)

    return render(
        request,
        "fonds/organization_edit.html",
        {
            "organization": organization,
            "form": form,
        },
    )


@require_GET
def organization_detail_page(request, org_id: str):
    organization = get_object_or_404(_organization_queryset(), org_key=org_id)

    return render(
        request,
        "fonds/organization_detail.html",
        {
            "organization": organization,
            "content_language": "de",
        },
    )


@require_GET
def target_groups_page(request):
    groups = list(TargetGroup.objects.annotate(
        org_count=Count("organization_target_groups__org_id", distinct=True)
    ))
    groups.sort(key=lambda group: group.display_name.casefold())

    grouped_targets = [
        {
            "group_key": tg.slug,
            "canonical_group": tg.display_name,
            "canonical_group_en": tg.english_name,
            "canonical_group_de": tg.german_name,
            "canonical_group_slug": tg.slug,
            "org_count": tg.org_count,
        }
        for tg in groups
    ]

    return render(
        request,
        "fonds/target_groups_list.html",
        {
            "grouped_targets": grouped_targets,
        },
    )


@require_GET
def target_group_detail_page(request, target_group_id: str):
    target_group = get_object_or_404(TargetGroup, slug=target_group_id)
    organizations = (
        Organization.objects.filter(organization_target_groups__target_group__slug=target_group_id)
        .order_by("name")
        .distinct()
    )
    return render(
        request,
        "fonds/target_group_detail.html",
        {
            "target_group": target_group,
            "organizations": organizations,
        },
    )


def _parse_limit(value: str | None, *, default: int = 100, max_limit: int = 500) -> int:
    if value is None:
        return default
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return default
    return max(1, min(parsed, max_limit))


@require_GET
def organizations_list(request):
    queryset = Organization.objects.all().order_by("name")

    q = request.GET.get("q")
    city = request.GET.get("city")
    target_group_id = request.GET.get("target_group_id")
    canonical_group_slug = request.GET.get("canonical_group_slug")
    uncategorized_targets = request.GET.get("uncategorized_targets")
    applicant_type_id = request.GET.get("applicant_type_id")
    attachment_type_id = request.GET.get("attachment_type_id")

    if q:
        queryset = queryset.filter(
            Q(name__icontains=q)
            | Q(description__icontains=q)
            | Q(city__icontains=q)
            | Q(target_group_raw__icontains=q)
            | Q(applicants_raw__icontains=q)
        )

    if city:
        queryset = queryset.filter(city__icontains=city)

    if target_group_id:
        queryset = queryset.filter(organization_target_groups__target_group__slug=target_group_id)

    if canonical_group_slug:
        queryset = queryset.filter(
            organization_target_groups__target_group__slug=canonical_group_slug
        )

    if uncategorized_targets in {"1", "true", "yes"}:
        # Organizations with no canonical target group links
        queryset = queryset.filter(organization_target_groups__isnull=True)

    if applicant_type_id:
        queryset = queryset.filter(organization_applicant_types__applicant_type_id=applicant_type_id)

    if attachment_type_id:
        queryset = queryset.filter(organization_attachment_types__attachment_type_id=attachment_type_id)

    queryset = queryset.distinct()

    limit = _parse_limit(request.GET.get("limit"))
    raw_rows = list(
        queryset.values(
            "id",
            "org_key",
            "name",
            "city",
            "postal_code",
            "page_start",
            "parse_warning",
        )[:limit]
    )
    rows = [{**r, "org_id": r["org_key"]} for r in raw_rows]

    return JsonResponse({"count": queryset.count(), "results": rows})


@require_GET
def organization_detail(request, org_id: str):
    organization = _organization_queryset().filter(org_key=org_id).first()

    if organization is None:
        return JsonResponse({"detail": _("Not found.")}, status=404)

    return JsonResponse(_serialized_organization(organization))


@require_GET
def target_groups_list(request):
    groups = list(TargetGroup.objects.all())
    groups.sort(key=lambda group: group.display_name.casefold())
    rows = [
        {
            "id": group.id,
            "name": group.display_name,
            "english_name": group.english_name,
            "german_name": group.german_name,
            "german_variants": list(group.german_variants),
            "slug": group.slug,
        }
        for group in groups
    ]
    return JsonResponse({"count": len(rows), "results": rows})


@require_GET
def applicant_types_list(request):
    applicant_types = list(ApplicantType.objects.all())
    applicant_types.sort(key=lambda item: item.display_label.casefold())
    rows = [
        {
            "applicant_type_id": item.applicant_type_id,
            "label": item.display_label,
            "english_label": item.english_label,
            "german_label": item.german_label,
        }
        for item in applicant_types
    ]
    return JsonResponse({"count": len(rows), "results": rows})


@require_GET
def attachment_types_list(request):
    attachment_types = list(AttachmentType.objects.all())
    attachment_types.sort(key=lambda item: item.display_label.casefold())
    rows = [
        {
            "attachment_type_id": item.attachment_type_id,
            "label": item.display_label,
            "english_label": item.english_label,
            "german_label": item.german_label,
        }
        for item in attachment_types
    ]
    return JsonResponse({"count": len(rows), "results": rows})


@require_GET
def overview_list(request):
    rows = list(OverviewDerived.objects.order_by("name").values())
    return JsonResponse({"count": len(rows), "results": rows})
