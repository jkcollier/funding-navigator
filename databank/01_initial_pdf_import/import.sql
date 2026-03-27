
CREATE TABLE organizations (
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

CREATE TABLE target_groups (
    target_group_id TEXT PRIMARY KEY,
    raw_label TEXT NOT NULL UNIQUE,
    canonical_group TEXT,
    canonical_group_slug TEXT
);

CREATE TABLE organization_target_groups (
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    target_group_id TEXT NOT NULL REFERENCES target_groups(target_group_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, target_group_id)
);

CREATE TABLE applicant_types (
    applicant_type_id TEXT PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
);

CREATE TABLE organization_applicant_types (
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    applicant_type_id TEXT NOT NULL REFERENCES applicant_types(applicant_type_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, applicant_type_id)
);

CREATE TABLE attachment_types (
    attachment_type_id TEXT PRIMARY KEY,
    label TEXT NOT NULL UNIQUE
);

CREATE TABLE organization_attachment_types (
    org_id TEXT NOT NULL REFERENCES organizations(org_id) ON DELETE CASCADE,
    attachment_type_id TEXT NOT NULL REFERENCES attachment_types(attachment_type_id) ON DELETE CASCADE,
    PRIMARY KEY (org_id, attachment_type_id)
);

CREATE TABLE overview_derived (
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

-- Example import commands (adjust paths as needed)
-- \copy organizations FROM 'organizations.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy target_groups FROM 'target_groups.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy organization_target_groups FROM 'organization_target_groups.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy applicant_types FROM 'applicant_types.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy organization_applicant_types FROM 'organization_applicant_types.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy attachment_types FROM 'attachment_types.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy organization_attachment_types FROM 'organization_attachment_types.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
-- \copy overview_derived FROM 'overview_derived.csv' WITH (FORMAT csv, HEADER true, ENCODING 'UTF8');
