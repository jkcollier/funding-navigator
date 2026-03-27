from pathlib import Path

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import connection


CREATE_TABLES_SQL = """
CREATE TABLE IF NOT EXISTS organizations (
    org_id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    page_start INTEGER,
    description TEXT,
    contact_raw TEXT,
    address TEXT,
    postal_code TEXT,
    city TEXT,
    phone_numbers_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    emails_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    websites_jsonb JSONB NOT NULL DEFAULT '[]'::jsonb,
    target_group_raw TEXT,
    applicants_raw TEXT,
    submission_deadline_raw TEXT,
    submission_address_raw TEXT,
    attachments_raw TEXT,
    raw_sections_jsonb JSONB NOT NULL DEFAULT '{}'::jsonb,
    parse_warning TEXT,
    source_file TEXT
);

CREATE TABLE IF NOT EXISTS target_groups (
    target_group_id TEXT PRIMARY KEY,
    raw_label TEXT NOT NULL UNIQUE,
    canonical_group TEXT,
    canonical_group_slug TEXT
);

CREATE TABLE IF NOT EXISTS organization_target_groups (
    id BIGSERIAL UNIQUE NOT NULL,
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    target_group_id TEXT NOT NULL REFERENCES target_groups(target_group_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, target_group_id)
);

CREATE TABLE IF NOT EXISTS applicant_types (
    applicant_type_id TEXT PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS organization_applicant_types (
    id BIGSERIAL UNIQUE NOT NULL,
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    applicant_type_id TEXT NOT NULL REFERENCES applicant_types(applicant_type_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, applicant_type_id)
);

CREATE TABLE IF NOT EXISTS attachment_types (
    attachment_type_id TEXT PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS organization_attachment_types (
    id BIGSERIAL UNIQUE NOT NULL,
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    attachment_type_id TEXT NOT NULL REFERENCES attachment_types(attachment_type_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, attachment_type_id)
);

CREATE TABLE IF NOT EXISTS overview_derived (
    org_id TEXT PRIMARY KEY REFERENCES organizations(org_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    page INTEGER,
    youth_family BOOLEAN NOT NULL DEFAULT FALSE,
    elderly BOOLEAN NOT NULL DEFAULT FALSE,
    disability BOOLEAN NOT NULL DEFAULT FALSE,
    health BOOLEAN NOT NULL DEFAULT FALSE,
    migration BOOLEAN NOT NULL DEFAULT FALSE,
    education BOOLEAN NOT NULL DEFAULT FALSE,
    poverty BOOLEAN NOT NULL DEFAULT FALSE,
    individuals BOOLEAN NOT NULL DEFAULT FALSE,
    institutions BOOLEAN NOT NULL DEFAULT FALSE,
    exhausted BOOLEAN NOT NULL DEFAULT FALSE,
    derived_from TEXT,
    parse_warning TEXT
);
"""


POST_CREATE_SQL = """
ALTER TABLE organization_target_groups ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE organization_applicant_types ADD COLUMN IF NOT EXISTS id BIGSERIAL;
ALTER TABLE organization_attachment_types ADD COLUMN IF NOT EXISTS id BIGSERIAL;

UPDATE organization_target_groups
SET id = nextval(pg_get_serial_sequence('organization_target_groups', 'id'))
WHERE id IS NULL;
UPDATE organization_applicant_types
SET id = nextval(pg_get_serial_sequence('organization_applicant_types', 'id'))
WHERE id IS NULL;
UPDATE organization_attachment_types
SET id = nextval(pg_get_serial_sequence('organization_attachment_types', 'id'))
WHERE id IS NULL;

ALTER TABLE organization_target_groups ALTER COLUMN id SET NOT NULL;
ALTER TABLE organization_applicant_types ALTER COLUMN id SET NOT NULL;
ALTER TABLE organization_attachment_types ALTER COLUMN id SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS organization_target_groups_id_uniq ON organization_target_groups(id);
CREATE UNIQUE INDEX IF NOT EXISTS organization_applicant_types_id_uniq ON organization_applicant_types(id);
CREATE UNIQUE INDEX IF NOT EXISTS organization_attachment_types_id_uniq ON organization_attachment_types(id);
"""


TABLES = [
    {
        "name": "organizations",
        "columns": [
            "org_id",
            "name",
            "page_start",
            "description",
            "contact_raw",
            "address",
            "postal_code",
            "city",
            "phone_numbers_jsonb",
            "emails_jsonb",
            "websites_jsonb",
            "target_group_raw",
            "applicants_raw",
            "submission_deadline_raw",
            "submission_address_raw",
            "attachments_raw",
            "raw_sections_jsonb",
            "parse_warning",
            "source_file",
        ],
        "pk": ["org_id"],
    },
    {
        "name": "target_groups",
        "columns": ["target_group_id", "raw_label", "canonical_group", "canonical_group_slug"],
        "pk": ["target_group_id"],
    },
    {
        "name": "organization_target_groups",
        "columns": ["org_id", "target_group_id"],
        "pk": ["org_id", "target_group_id"],
    },
    {
        "name": "applicant_types",
        "columns": ["applicant_type_id", "label"],
        "pk": ["applicant_type_id"],
    },
    {
        "name": "organization_applicant_types",
        "columns": ["org_id", "applicant_type_id"],
        "pk": ["org_id", "applicant_type_id"],
    },
    {
        "name": "attachment_types",
        "columns": ["attachment_type_id", "label"],
        "pk": ["attachment_type_id"],
    },
    {
        "name": "organization_attachment_types",
        "columns": ["org_id", "attachment_type_id"],
        "pk": ["org_id", "attachment_type_id"],
    },
    {
        "name": "overview_derived",
        "columns": [
            "org_id",
            "name",
            "page",
            "youth_family",
            "elderly",
            "disability",
            "health",
            "migration",
            "education",
            "poverty",
            "individuals",
            "institutions",
            "exhausted",
            "derived_from",
            "parse_warning",
        ],
        "pk": ["org_id"],
    },
]


class Command(BaseCommand):
    help = "Create databank tables and import CSV data into PostgreSQL"

    def add_arguments(self, parser):
        parser.add_argument(
            "--databank-dir",
            default=str(Path(settings.BASE_DIR).parent / "databank"),
            help="Directory containing CSV files",
        )
        parser.add_argument(
            "--no-truncate",
            action="store_true",
            help="Do not truncate existing databank tables before import",
        )

    def handle(self, *args, **options):
        if connection.vendor != "postgresql":
            raise CommandError("This command requires PostgreSQL.")

        databank_dir = Path(options["databank_dir"]).resolve()
        if not databank_dir.exists():
            raise CommandError(f"Databank directory not found: {databank_dir}")

        missing = [table["name"] for table in TABLES if not (databank_dir / f"{table['name']}.csv").exists()]
        if missing:
            missing_text = ", ".join(f"{name}.csv" for name in missing)
            raise CommandError(f"Missing CSV files: {missing_text}")

        connection.ensure_connection()
        raw_conn = connection.connection

        with raw_conn.cursor() as cur:
            cur.execute(CREATE_TABLES_SQL)
            cur.execute(POST_CREATE_SQL)

            if not options["no_truncate"]:
                cur.execute(
                    """
                    TRUNCATE TABLE
                        overview_derived,
                        organization_attachment_types,
                        organization_applicant_types,
                        organization_target_groups,
                        attachment_types,
                        applicant_types,
                        target_groups,
                        organizations
                    RESTART IDENTITY CASCADE;
                    """
                )

            for table in TABLES:
                table_name = table["name"]
                columns = table["columns"]
                pk_columns = table["pk"]
                csv_path = databank_dir / f"{table_name}.csv"
                self.stdout.write(f"Importing {csv_path.name}...")

                temp_table = f"tmp_{table_name}"
                cur.execute(f"DROP TABLE IF EXISTS {temp_table};")
                cur.execute(f"CREATE TEMP TABLE {temp_table} (LIKE {table_name} INCLUDING DEFAULTS);")

                with csv_path.open("r", encoding="utf-8") as f, cur.copy(
                    f"COPY {temp_table} ({', '.join(columns)}) FROM STDIN WITH (FORMAT CSV, HEADER TRUE, ENCODING 'UTF8')"
                ) as copy:
                    while chunk := f.read(65536):
                        copy.write(chunk)

                non_pk_columns = [column for column in columns if column not in pk_columns]

                if len(pk_columns) == 1:
                    pk = pk_columns[0]
                    assignment_sql = ", ".join(
                        f"{column} = EXCLUDED.{column}" for column in non_pk_columns
                    )
                    cur.execute(
                        f"""
                        INSERT INTO {table_name} ({', '.join(columns)})
                        SELECT DISTINCT ON ({pk}) {', '.join(columns)}
                        FROM {temp_table}
                        ORDER BY {pk}
                        ON CONFLICT ({pk}) DO UPDATE
                        SET {assignment_sql};
                        """
                    )
                else:
                    cur.execute(
                        f"""
                        INSERT INTO {table_name} ({', '.join(columns)})
                        SELECT DISTINCT {', '.join(columns)}
                        FROM {temp_table}
                        ON CONFLICT ({', '.join(pk_columns)}) DO NOTHING;
                        """
                    )

        raw_conn.commit()
        self.stdout.write(self.style.SUCCESS("Databank import completed."))
