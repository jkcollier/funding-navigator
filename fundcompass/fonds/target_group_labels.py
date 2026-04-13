import csv
import re
from collections import defaultdict
from functools import lru_cache
from pathlib import Path

from django.conf import settings
from django.utils.translation import get_language


PREFERRED_GERMAN_LABELS = {
    "youth_family": "Jugend & Familie",
    "elderly": "Ältere Menschen",
    "disability": "Menschen mit Behinderungen",
    "health": "Gesundheit/Krankheit",
    "migration": "Migration/Asyl",
    "education": "Ausbildung",
    "poverty": "Armut",
}

APPLICANT_TYPE_ENGLISH_LABELS = {
    "institutionen": "Institutions",
    "privatpersonen": "Private individuals",
    "aber-nur-uber-institutionen-angefragt": "Only via institutions",
    "institution": "Institution",
}

ATTACHMENT_TYPE_ENGLISH_LABELS = {
    "adresse": "Address",
    "ansprechperson": "Contact person",
    "jahresbericht-und-jahresrechnung": "Annual report and annual financial statements",
    "revisionsbericht": "Audit report",
    "arztzeugnis": "Medical certificate",
    "ausbildungsbestatigung": "Proof of education",
    "referenzen": "References",
    "kontoangaben": "Bank account details",
    "e-mail": "Email",
    "familie": "Family",
    "finanzen": "Finances",
    "homepage": "Website",
    "jahresbericht": "Annual report",
    "jahresrechnung": "Annual financial statements",
    "budget": "Budget",
    "mietvertrag": "Rental agreement",
    "monatsbudget": "Monthly budget",
    "projektbeschreibung": "Project description",
    "projektbudget": "Project budget",
    "rechtsform": "Legal form",
    "statuten": "Statutes",
    "studienplan": "Study plan",
    "tel": "Phone",
    "einzahlungsschein": "Payment slip",
    "lebenslauf": "Curriculum vitae",
    "kostenvoranschlag": "Cost estimate",
    "zielgruppe": "Target group",
}


def _databank_target_groups_csv() -> Path:
    return Path(settings.BASE_DIR).parent / "databank" / "01_initial_pdf_import" / "target_groups.csv"


def _databank_csv(filename: str) -> Path:
    return Path(settings.BASE_DIR).parent / "databank" / "01_initial_pdf_import" / filename


def _label_score(label: str) -> tuple[int, int, int, str]:
    cleaned = label.strip()
    words = cleaned.split()
    punctuation_penalty = len(re.findall(r"[,:.;]", cleaned))
    length_penalty = len(cleaned)
    word_penalty = max(0, len(words) - 3)
    return (punctuation_penalty, word_penalty, length_penalty, cleaned.casefold())


@lru_cache(maxsize=1)
def canonical_target_group_labels() -> dict[str, dict[str, object]]:
    csv_path = _databank_target_groups_csv()
    by_slug: dict[str, list[str]] = defaultdict(list)

    if not csv_path.exists():
        return {}

    with csv_path.open("r", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            slug = (row.get("canonical_group_slug") or "").strip()
            raw_label = (row.get("raw_label") or "").strip()
            english_label = (row.get("canonical_group") or "").strip()
            if not slug:
                continue
            if raw_label and raw_label not in by_slug[slug]:
                by_slug[slug].append(raw_label)
            if english_label and english_label not in by_slug[f"__en__:{slug}"]:
                by_slug[f"__en__:{slug}"].append(english_label)

    labels: dict[str, dict[str, object]] = {}
    for slug, variants in by_slug.items():
        if slug.startswith("__en__:"):
            continue

        english_variants = by_slug.get(f"__en__:{slug}", [])
        preferred_german = PREFERRED_GERMAN_LABELS.get(slug)
        if preferred_german not in variants:
            preferred_german = min(variants, key=_label_score) if variants else None

        labels[slug] = {
            "de": preferred_german,
            "en": english_variants[0] if english_variants else None,
            "variants_de": tuple(variants),
        }

    return labels


def target_group_german_label(slug: str, fallback: str) -> str:
    data = canonical_target_group_labels().get(slug, {})
    return data.get("de") or fallback


def target_group_english_label(slug: str, fallback: str) -> str:
    data = canonical_target_group_labels().get(slug, {})
    return data.get("en") or fallback


def target_group_display_label(slug: str, fallback: str) -> str:
    language = (get_language() or "en").lower()
    if language.startswith("de"):
        return target_group_german_label(slug, fallback)
    return target_group_english_label(slug, fallback)


def target_group_variants_de(slug: str) -> tuple[str, ...]:
    data = canonical_target_group_labels().get(slug, {})
    return tuple(data.get("variants_de") or ())


@lru_cache(maxsize=1)
def applicant_type_labels() -> dict[str, dict[str, str | None]]:
    csv_path = _databank_csv("applicant_types.csv")
    if not csv_path.exists():
        return {}

    labels: dict[str, dict[str, str | None]] = {}
    with csv_path.open("r", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            label_id = (row.get("applicant_type_id") or "").strip()
            german_label = (row.get("label") or "").strip()
            if not label_id:
                continue
            labels[label_id] = {
                "de": german_label or None,
                "en": APPLICANT_TYPE_ENGLISH_LABELS.get(label_id) or german_label or None,
            }
    return labels


def applicant_type_german_label(label_id: str, fallback: str) -> str:
    data = applicant_type_labels().get(label_id, {})
    return data.get("de") or fallback


def applicant_type_english_label(label_id: str, fallback: str) -> str:
    data = applicant_type_labels().get(label_id, {})
    return data.get("en") or fallback


def applicant_type_display_label(label_id: str, fallback: str) -> str:
    language = (get_language() or "en").lower()
    if language.startswith("de"):
        return applicant_type_german_label(label_id, fallback)
    return applicant_type_english_label(label_id, fallback)


@lru_cache(maxsize=1)
def attachment_type_labels() -> dict[str, dict[str, str | None]]:
    csv_path = _databank_csv("attachment_types.csv")
    if not csv_path.exists():
        return {}

    labels: dict[str, dict[str, str | None]] = {}
    with csv_path.open("r", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            label_id = (row.get("attachment_type_id") or "").strip()
            german_label = (row.get("label") or "").strip()
            if not label_id:
                continue
            labels[label_id] = {
                "de": german_label or None,
                "en": ATTACHMENT_TYPE_ENGLISH_LABELS.get(label_id) or german_label or None,
            }
    return labels


def attachment_type_german_label(label_id: str, fallback: str) -> str:
    data = attachment_type_labels().get(label_id, {})
    return data.get("de") or fallback


def attachment_type_english_label(label_id: str, fallback: str) -> str:
    data = attachment_type_labels().get(label_id, {})
    return data.get("en") or fallback


def attachment_type_display_label(label_id: str, fallback: str) -> str:
    language = (get_language() or "en").lower()
    if language.startswith("de"):
        return attachment_type_german_label(label_id, fallback)
    return attachment_type_english_label(label_id, fallback)