# Fonds und Stiftungen 2024/2025 export

Generated from: `Fonds und Stiftungsverzeichnis_2024_25.docx`

## Files

- `organizations.csv`: one row per organization/foundation
- `organizations.jsonl`: same core data with arrays expanded as JSON
- `target_groups.csv`: dimension table for raw target-group labels
- `organization_target_groups.csv`: bridge table
- `applicant_types.csv`: dimension table for applicant types
- `organization_applicant_types.csv`: bridge table
- `attachment_types.csv`: dimension table for attachment labels
- `organization_attachment_types.csv`: bridge table
- `overview_derived.csv`: CSV equivalent of the page-21+ overview, derived from detailed entries
- `import.sql`: PostgreSQL DDL + sample \copy commands
- `parse_fonds_stiftungen.py`: reproducible parser

## Notes

- The page-21 overview in the source document is visually encoded. The exported `overview_derived.csv` is inferred from the detailed A-Z entries rather than reading the page-21 graphics directly.
- One overview row (`Gertrude von Meissner-Stiftung`) was present in the overview list but its detailed A-Z entry was not recovered cleanly from the DOCX parse. It is included as an organization row with `parse_warning = 'overview_row_only'`.
- Some contact/address fields are semi-structured. The parser keeps raw fields (`contact_raw`, `raw_sections_jsonb`) so nothing important is lost.

## Django + PostgreSQL import (project in `./test1`)

From inside the web container (or any environment where Django can reach Postgres):

1. Run Django migrations for built-in apps:
	- `python manage.py migrate`
2. Import databank tables + CSV data:
	- `python manage.py import_databank`

Optional flags:

- `--databank-dir /app/databank` to override CSV location
- `--no-truncate` to append without truncating existing table rows first

The command creates these PostgreSQL tables if missing and then imports all CSVs in the right FK order:

- `organizations`
- `target_groups`
- `organization_target_groups`
- `applicant_types`
- `organization_applicant_types`
- `attachment_types`
- `organization_attachment_types`
- `overview_derived`

## API endpoints exposed by Django (`./test1`)

Base path: `/api/`

- `GET /api/organizations/`
- `GET /api/organizations/<org_id>/`
- `GET /api/target-groups/`
- `GET /api/applicant-types/`
- `GET /api/attachment-types/`
- `GET /api/overview/`

`GET /api/organizations/` supports query params:

- `q`
- `city`
- `target_group_id`
- `applicant_type_id`
- `attachment_type_id`
- `limit` (default `100`, max `500`)
