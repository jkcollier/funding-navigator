from django.db import models


class Organization(models.Model):
    org_id = models.TextField(primary_key=True)
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

    class Meta:
        db_table = "organizations"
        managed = False


class TargetGroup(models.Model):
    target_group_id = models.TextField(primary_key=True)
    raw_label = models.TextField(unique=True)
    canonical_group = models.TextField(null=True, blank=True)
    canonical_group_slug = models.TextField(null=True, blank=True)

    class Meta:
        db_table = "target_groups"
        managed = False


class OrganizationTargetGroup(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, db_column="org_id", related_name="organization_target_groups")
    target_group = models.ForeignKey(TargetGroup, on_delete=models.CASCADE, db_column="target_group_id", related_name="organization_target_groups")

    class Meta:
        db_table = "organization_target_groups"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=["org", "target_group"], name="organization_target_groups_pkey"),
        ]


class ApplicantType(models.Model):
    applicant_type_id = models.TextField(primary_key=True)
    label = models.TextField(unique=True)

    class Meta:
        db_table = "applicant_types"
        managed = False


class OrganizationApplicantType(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, db_column="org_id", related_name="organization_applicant_types")
    applicant_type = models.ForeignKey(ApplicantType, on_delete=models.CASCADE, db_column="applicant_type_id", related_name="organization_applicant_types")

    class Meta:
        db_table = "organization_applicant_types"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=["org", "applicant_type"], name="organization_applicant_types_pkey"),
        ]


class AttachmentType(models.Model):
    attachment_type_id = models.TextField(primary_key=True)
    label = models.TextField(unique=True)

    class Meta:
        db_table = "attachment_types"
        managed = False


class OrganizationAttachmentType(models.Model):
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, db_column="org_id", related_name="organization_attachment_types")
    attachment_type = models.ForeignKey(AttachmentType, on_delete=models.CASCADE, db_column="attachment_type_id", related_name="organization_attachment_types")

    class Meta:
        db_table = "organization_attachment_types"
        managed = False
        constraints = [
            models.UniqueConstraint(fields=["org", "attachment_type"], name="organization_attachment_types_pkey"),
        ]


class OverviewDerived(models.Model):
    org = models.OneToOneField(Organization, on_delete=models.CASCADE, db_column="org_id", primary_key=True, related_name="overview")
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
