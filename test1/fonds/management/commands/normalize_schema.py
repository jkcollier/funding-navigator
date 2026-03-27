"""
normalize_schema
================
Normalises the databank schema from the raw-CSV import state to a clean schema:

  * target_groups  → integer PK, keeps only canonical groups (one row per canonical group),
                     removes raw_label column.
  * organizations  → integer PK, old text slug moves to org_key column.
  * organization_target_groups   → FKs point to new integer PKs; de-duped to
                                    (org_key, canonical_group_slug) pairs.
  * organization_applicant_types → org_id FK updated to new integer PK.
  * organization_attachment_types→ org_id FK updated to new integer PK.
  * overview_derived             → org_id FK updated to new integer PK.

Verification: the set of (org_key, canonical_group_slug) pairs is snapshotted
*before* migration and compared *after*.  The command rolls back and aborts if
there is any discrepancy.
"""

from django.core.management.base import BaseCommand, CommandError
from django.db import connection, transaction


class Command(BaseCommand):
    help = (
        "Normalise schema: integer PKs for organizations and target_groups, "
        "rebuild all join tables, verify integrity, swap tables atomically."
    )

    def handle(self, *args, **options):
        self.stdout.write("Starting schema normalisation …")
        try:
            with transaction.atomic():
                with connection.cursor() as cur:
                    self._migrate(cur)
        except CommandError:
            raise
        except Exception as exc:
            raise CommandError(f"Migration failed and was rolled back: {exc}") from exc

        self.stdout.write(self.style.SUCCESS("Schema normalisation complete."))

    # ------------------------------------------------------------------
    # Main migration (runs inside a single atomic transaction)
    # ------------------------------------------------------------------

    def _migrate(self, cur):

        # ── Step 1: snapshot before-state ─────────────────────────────
        self.stdout.write("  [1/9] Snapshotting before-state …")
        cur.execute("""
            CREATE TEMP TABLE _otg_before AS
            SELECT DISTINCT
                o.org_id              AS org_key,
                tg.canonical_group_slug
            FROM organization_target_groups otg
            JOIN organizations  o  ON o.org_id          = otg.org_id
            JOIN target_groups  tg ON tg.target_group_id = otg.target_group_id
            WHERE tg.canonical_group_slug IS NOT NULL
        """)
        cur.execute("SELECT COUNT(*) FROM _otg_before")
        before_count = cur.fetchone()[0]
        self.stdout.write(f"      before: {before_count} (org, canonical_slug) pairs")

        # ── Step 2: new target_groups (canonical only, integer PK) ────
        self.stdout.write("  [2/9] Building target_groups_new …")
        cur.execute("DROP TABLE IF EXISTS target_groups_new")
        cur.execute("""
            CREATE TABLE target_groups_new (
                id   SERIAL PRIMARY KEY,
                name TEXT   NOT NULL,
                slug TEXT   NOT NULL UNIQUE
            )
        """)
        cur.execute("""
            INSERT INTO target_groups_new (name, slug)
            SELECT DISTINCT canonical_group, canonical_group_slug
            FROM   target_groups
            WHERE  canonical_group IS NOT NULL
              AND  canonical_group_slug IS NOT NULL
            ORDER BY canonical_group
        """)
        cur.execute("SELECT COUNT(*) FROM target_groups_new")
        tg_count = cur.fetchone()[0]
        self.stdout.write(f"      {tg_count} canonical target groups created")

        # ── Step 3: new organizations (integer PK, slug → org_key) ────
        self.stdout.write("  [3/9] Building organizations_new …")
        cur.execute("DROP TABLE IF EXISTS organizations_new")
        cur.execute("""
            CREATE TABLE organizations_new (
                id                    SERIAL PRIMARY KEY,
                org_key               TEXT   NOT NULL UNIQUE,
                name                  TEXT   NOT NULL,
                page_start            INTEGER,
                description           TEXT,
                contact_raw           TEXT,
                address               TEXT,
                postal_code           TEXT,
                city                  TEXT,
                phone_numbers_jsonb   JSONB  NOT NULL DEFAULT '[]'::jsonb,
                emails_jsonb          JSONB  NOT NULL DEFAULT '[]'::jsonb,
                websites_jsonb        JSONB  NOT NULL DEFAULT '[]'::jsonb,
                target_group_raw      TEXT,
                applicants_raw        TEXT,
                submission_deadline_raw TEXT,
                submission_address_raw  TEXT,
                attachments_raw       TEXT,
                raw_sections_jsonb    JSONB  NOT NULL DEFAULT '{}'::jsonb,
                parse_warning         TEXT,
                source_file           TEXT
            )
        """)
        cur.execute("""
            INSERT INTO organizations_new (
                org_key, name, page_start, description, contact_raw,
                address, postal_code, city,
                phone_numbers_jsonb, emails_jsonb, websites_jsonb,
                target_group_raw, applicants_raw,
                submission_deadline_raw, submission_address_raw,
                attachments_raw, raw_sections_jsonb, parse_warning, source_file
            )
            SELECT
                org_id, name, page_start, description, contact_raw,
                address, postal_code, city,
                phone_numbers_jsonb, emails_jsonb, websites_jsonb,
                target_group_raw, applicants_raw,
                submission_deadline_raw, submission_address_raw,
                attachments_raw, raw_sections_jsonb, parse_warning, source_file
            FROM organizations
            ORDER BY name
        """)
        cur.execute("SELECT COUNT(*) FROM organizations_new")
        org_count = cur.fetchone()[0]
        self.stdout.write(f"      {org_count} organizations migrated")

        # ── Step 4: organization_target_groups (de-duped to canonical) ─
        self.stdout.write("  [4/9] Rebuilding organization_target_groups_new …")
        cur.execute("DROP TABLE IF EXISTS organization_target_groups_new")
        cur.execute("""
            CREATE TABLE organization_target_groups_new (
                join_id        SERIAL  PRIMARY KEY,
                org_id         INTEGER NOT NULL
                               REFERENCES organizations_new(id) ON DELETE CASCADE,
                target_group_id INTEGER NOT NULL
                               REFERENCES target_groups_new(id) ON DELETE CASCADE,
                UNIQUE (org_id, target_group_id)
            )
        """)
        cur.execute("""
            INSERT INTO organization_target_groups_new (org_id, target_group_id)
            SELECT DISTINCT o2.id, t2.id
            FROM   _otg_before bs
            JOIN   organizations_new  o2 ON o2.org_key = bs.org_key
            JOIN   target_groups_new  t2 ON t2.slug    = bs.canonical_group_slug
        """)
        cur.execute("SELECT COUNT(*) FROM organization_target_groups_new")
        otg_count = cur.fetchone()[0]
        self.stdout.write(f"      {otg_count} org-target links rebuilt")

        # ── Step 5: organization_applicant_types ───────────────────────
        self.stdout.write("  [5/9] Rebuilding organization_applicant_types_new …")
        cur.execute("DROP TABLE IF EXISTS organization_applicant_types_new")
        cur.execute("""
            CREATE TABLE organization_applicant_types_new (
                id              BIGSERIAL PRIMARY KEY,
                org_id          INTEGER NOT NULL
                                REFERENCES organizations_new(id) ON DELETE CASCADE,
                applicant_type_id TEXT  NOT NULL
                                REFERENCES applicant_types(applicant_type_id) ON DELETE CASCADE,
                UNIQUE (org_id, applicant_type_id)
            )
        """)
        cur.execute("""
            INSERT INTO organization_applicant_types_new (org_id, applicant_type_id)
            SELECT DISTINCT o2.id, oat.applicant_type_id
            FROM   organization_applicant_types oat
            JOIN   organizations_new o2 ON o2.org_key = oat.org_id
        """)
        cur.execute("SELECT COUNT(*) FROM organization_applicant_types_new")
        oat_count = cur.fetchone()[0]
        self.stdout.write(f"      {oat_count} org-applicant links rebuilt")

        # ── Step 6: organization_attachment_types ──────────────────────
        self.stdout.write("  [6/9] Rebuilding organization_attachment_types_new …")
        cur.execute("DROP TABLE IF EXISTS organization_attachment_types_new")
        cur.execute("""
            CREATE TABLE organization_attachment_types_new (
                id               BIGSERIAL PRIMARY KEY,
                org_id           INTEGER NOT NULL
                                 REFERENCES organizations_new(id) ON DELETE CASCADE,
                attachment_type_id TEXT  NOT NULL
                                 REFERENCES attachment_types(attachment_type_id) ON DELETE CASCADE,
                UNIQUE (org_id, attachment_type_id)
            )
        """)
        cur.execute("""
            INSERT INTO organization_attachment_types_new (org_id, attachment_type_id)
            SELECT DISTINCT o2.id, oatt.attachment_type_id
            FROM   organization_attachment_types oatt
            JOIN   organizations_new o2 ON o2.org_key = oatt.org_id
        """)
        cur.execute("SELECT COUNT(*) FROM organization_attachment_types_new")
        oatt_count = cur.fetchone()[0]
        self.stdout.write(f"      {oatt_count} org-attachment links rebuilt")

        # ── Step 7: overview_derived ───────────────────────────────────
        self.stdout.write("  [7/9] Rebuilding overview_derived_new …")
        cur.execute("DROP TABLE IF EXISTS overview_derived_new")
        cur.execute("""
            CREATE TABLE overview_derived_new (
                org_id       INTEGER PRIMARY KEY
                             REFERENCES organizations_new(id) ON DELETE CASCADE,
                name         TEXT    NOT NULL,
                page         INTEGER,
                youth_family BOOLEAN NOT NULL DEFAULT FALSE,
                elderly      BOOLEAN NOT NULL DEFAULT FALSE,
                disability   BOOLEAN NOT NULL DEFAULT FALSE,
                health       BOOLEAN NOT NULL DEFAULT FALSE,
                migration    BOOLEAN NOT NULL DEFAULT FALSE,
                education    BOOLEAN NOT NULL DEFAULT FALSE,
                poverty      BOOLEAN NOT NULL DEFAULT FALSE,
                individuals  BOOLEAN NOT NULL DEFAULT FALSE,
                institutions BOOLEAN NOT NULL DEFAULT FALSE,
                exhausted    BOOLEAN NOT NULL DEFAULT FALSE,
                derived_from TEXT,
                parse_warning TEXT
            )
        """)
        cur.execute("""
            INSERT INTO overview_derived_new (
                org_id, name, page,
                youth_family, elderly, disability, health, migration,
                education, poverty, individuals, institutions, exhausted,
                derived_from, parse_warning
            )
            SELECT
                o2.id, od.name, od.page,
                od.youth_family, od.elderly, od.disability, od.health, od.migration,
                od.education, od.poverty, od.individuals, od.institutions, od.exhausted,
                od.derived_from, od.parse_warning
            FROM overview_derived od
            JOIN organizations_new o2 ON o2.org_key = od.org_id
        """)
        cur.execute("SELECT COUNT(*) FROM overview_derived_new")
        od_count = cur.fetchone()[0]
        self.stdout.write(f"      {od_count} overview rows rebuilt")

        # ── Step 8: verify ─────────────────────────────────────────────
        self.stdout.write("  [8/9] Verifying data integrity …")

        # Links present before but absent after
        cur.execute("""
            SELECT COUNT(*) FROM (
                SELECT org_key, canonical_group_slug FROM _otg_before
                EXCEPT
                SELECT o2.org_key, t2.slug
                FROM   organization_target_groups_new otg2
                JOIN   organizations_new  o2 ON o2.id = otg2.org_id
                JOIN   target_groups_new  t2 ON t2.id = otg2.target_group_id
            ) AS missing
        """)
        missing = cur.fetchone()[0]

        # Links absent before but present after
        cur.execute("""
            SELECT COUNT(*) FROM (
                SELECT o2.org_key, t2.slug
                FROM   organization_target_groups_new otg2
                JOIN   organizations_new  o2 ON o2.id = otg2.org_id
                JOIN   target_groups_new  t2 ON t2.id = otg2.target_group_id
                EXCEPT
                SELECT org_key, canonical_group_slug FROM _otg_before
            ) AS extra
        """)
        extra = cur.fetchone()[0]

        if missing or extra:
            raise CommandError(
                f"Verification FAILED — {missing} links missing after migration, "
                f"{extra} unexpected extra links.  Transaction rolled back."
            )

        self.stdout.write(
            self.style.SUCCESS(
                f"      Verification passed: all {before_count} (org, canonical_slug) "
                f"pairs preserved exactly. ✓"
            )
        )

        # Also check row counts match expected
        checks = [
            ("organizations_new",               org_count,  183),
            ("target_groups_new",               tg_count,   None),   # flexible
            ("organization_target_groups_new",  otg_count,  before_count),
            ("overview_derived_new",            od_count,   183),
        ]
        for table, got, expected in checks:
            if expected is not None and got != expected:
                raise CommandError(
                    f"Row-count check failed for {table}: expected {expected}, got {got}."
                )

        # ── Step 9: swap tables ────────────────────────────────────────
        self.stdout.write("  [9/9] Swapping tables …")

        # Drop old tables in dependency order (most dependent first)
        for old_table in [
            "organization_attachment_types",
            "organization_applicant_types",
            "organization_target_groups",
            "overview_derived",
            "organizations",
            "target_groups",
        ]:
            cur.execute(f"DROP TABLE IF EXISTS {old_table}")

        # Rename new tables into place
        for new_name, final_name in [
            ("organizations_new",               "organizations"),
            ("target_groups_new",               "target_groups"),
            ("organization_target_groups_new",  "organization_target_groups"),
            ("organization_applicant_types_new","organization_applicant_types"),
            ("organization_attachment_types_new","organization_attachment_types"),
            ("overview_derived_new",            "overview_derived"),
        ]:
            cur.execute(f"ALTER TABLE {new_name} RENAME TO {final_name}")

        self.stdout.write("      Tables swapped.")
