from django.db import models
from django.utils.translation import gettext_lazy as _

from .target_group_labels import (
    applicant_type_display_label,
    applicant_type_english_label,
    applicant_type_german_label,
    attachment_type_display_label,
    attachment_type_english_label,
    attachment_type_german_label,
    target_group_display_label,
    target_group_english_label,
    target_group_german_label,
    target_group_variants_de,
)


class Organization(models.Model):
    id = models.AutoField(primary_key=True)
    org_key = models.TextField(unique=True)  # original slug, used in URLs
    name = models.TextField()
    page_start = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    contact_raw = models.TextField(null=True, blank=True)
    address = models.TextField(null=True, blank=True)
    postal_code = models.TextField(null=True, blank=True)
    city = models.TextField(null=True, blank=True)
    phone_numbers_jsonb = models.JSONField(default=list)
    emails_jsonb = models.JSONField(default=list)
    websites_jsonb = models.JSONField(default=list)
    target_group_raw = models.TextField(null=True, blank=True)
    applicants_raw = models.TextField(null=True, blank=True)
    submission_deadline_raw = models.TextField(null=True, blank=True)
    submission_address_raw = models.TextField(null=True, blank=True)
    attachments_raw = models.TextField(null=True, blank=True)
    raw_sections_jsonb = models.JSONField(default=dict)
    parse_warning = models.TextField(null=True, blank=True)
    source_file = models.TextField(null=True, blank=True)

    target_groups = models.ManyToManyField(
        "TargetGroup",
        through="OrganizationTargetGroup",
        related_name="organizations",
    )

    class Meta:
        db_table = "organizations"
        managed = False
        verbose_name = _("organization")
        verbose_name_plural = _("organizations")

    def __str__(self):
        return self.name


class TargetGroup(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField()
    slug = models.TextField(unique=True)

    class Meta:
        db_table = "target_groups"
        managed = False
        verbose_name = _("target group")
        verbose_name_plural = _("target groups")

    def __str__(self):
        return self.name

    @property
    def display_name(self) -> str:
        return target_group_display_label(self.slug, self.name)

    @property
    def german_name(self) -> str:
        return target_group_german_label(self.slug, self.name)

    @property
    def english_name(self) -> str:
        return target_group_english_label(self.slug, self.name)

    @property
    def german_variants(self) -> tuple[str, ...]:
        return target_group_variants_de(self.slug)


class OrganizationTargetGroup(models.Model):
    join_id = models.AutoField(primary_key=True, db_column="join_id")
    org = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        db_column="org_id",
        related_name="organization_target_groups",
    )
    target_group = models.ForeignKey(
        TargetGroup,
        on_delete=models.CASCADE,
        db_column="target_group_id",
        related_name="organization_target_groups",
    )

    class Meta:
        db_table = "organization_target_groups"
        managed = False
        constraints = [
            models.UniqueConstraint(
                fields=["org", "target_group"],
                name="organization_target_groups_pkey",
            ),
        ]


class ApplicantType(models.Model):
    applicant_type_id = models.TextField(primary_key=True)
    label = models.TextField(unique=True)

    class Meta:
        db_table = "applicant_types"
        managed = False
        verbose_name = _("applicant type")
        verbose_name_plural = _("applicant types")

    def __str__(self):
        return self.display_label

    @property
    def display_label(self) -> str:
        return applicant_type_display_label(self.applicant_type_id, self.label)

    @property
    def german_label(self) -> str:
        return applicant_type_german_label(self.applicant_type_id, self.label)

    @property
    def english_label(self) -> str:
        return applicant_type_english_label(self.applicant_type_id, self.label)


class OrganizationApplicantType(models.Model):
    id = models.BigAutoField(primary_key=True)
    org = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        db_column="org_id",
        related_name="organization_applicant_types",
    )
    applicant_type = models.ForeignKey(
        ApplicantType,
        on_delete=models.CASCADE,
        db_column="applicant_type_id",
        related_name="organization_applicant_types",
    )

    class Meta:
        db_table = "organization_applicant_types"
        managed = False
        constraints = [
            models.UniqueConstraint(
                fields=["org", "applicant_type"],
                name="organization_applicant_types_pkey",
            ),
        ]


class AttachmentType(models.Model):
    attachment_type_id = models.TextField(primary_key=True)
    label = models.TextField(unique=True)

    class Meta:
        db_table = "attachment_types"
        managed = False
        verbose_name = _("attachment type")
        verbose_name_plural = _("attachment types")

    def __str__(self):
        return self.display_label

    @property
    def display_label(self) -> str:
        return attachment_type_display_label(self.attachment_type_id, self.label)

    @property
    def german_label(self) -> str:
        return attachment_type_german_label(self.attachment_type_id, self.label)

    @property
    def english_label(self) -> str:
        return attachment_type_english_label(self.attachment_type_id, self.label)


class OrganizationAttachmentType(models.Model):
    id = models.BigAutoField(primary_key=True)
    org = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        db_column="org_id",
        related_name="organization_attachment_types",
    )
    attachment_type = models.ForeignKey(
        AttachmentType,
        on_delete=models.CASCADE,
        db_column="attachment_type_id",
        related_name="organization_attachment_types",
    )

    class Meta:
        db_table = "organization_attachment_types"
        managed = False
        constraints = [
            models.UniqueConstraint(
                fields=["org", "attachment_type"],
                name="organization_attachment_types_pkey",
            ),
        ]


class OverviewDerived(models.Model):
    org = models.OneToOneField(
        Organization,
        on_delete=models.CASCADE,
        db_column="org_id",
        primary_key=True,
        related_name="overview",
    )
    name = models.TextField()
    page = models.IntegerField(null=True, blank=True)
    youth_family = models.BooleanField(default=False)
    elderly = models.BooleanField(default=False)
    disability = models.BooleanField(default=False)
    health = models.BooleanField(default=False)
    migration = models.BooleanField(default=False)
    education = models.BooleanField(default=False)
    poverty = models.BooleanField(default=False)
    individuals = models.BooleanField(default=False)
    institutions = models.BooleanField(default=False)
    exhausted = models.BooleanField(default=False)
    derived_from = models.TextField(null=True, blank=True)
    parse_warning = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "overview_derived"
        managed = False
