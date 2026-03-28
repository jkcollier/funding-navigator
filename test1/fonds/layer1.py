"""
layer1.py
---------
Hard requirement filtering.

Each rule is a callable with signature:
    (builder: ApplicationSessionBuilder, overview: OverviewDerived) -> bool

Add new rules by appending to HARD_REQUIREMENT_RULES.
An organisation must pass ALL rules to be included in layer1_passed_org_ids.
"""

from __future__ import annotations

import re
from datetime import date
from typing import Callable, TYPE_CHECKING

if TYPE_CHECKING:
    from .application_session import ApplicationSessionBuilder
    from .models import OverviewDerived


# ---------------------------------------------------------------------------
# Rule implementations
# ---------------------------------------------------------------------------

def _rule_applicant_kind(
    builder: "ApplicationSessionBuilder",
    overview: "OverviewDerived",
) -> bool:
    """Organisation must accept the applicant's kind (individual / institution)."""
    if builder.applicant_kind == "individual":
        return bool(overview.individuals)
    if builder.applicant_kind == "institution":
        return bool(overview.institutions)
    return False


# --- Deadline parsing helpers ---

_GERMAN_MONTHS: dict[str, int] = {
    "januar": 1, "februar": 2, "märz": 3, "april": 4,
    "mai": 5, "juni": 6, "juli": 7, "august": 8,
    "september": 9, "oktober": 10, "november": 11, "dezember": 12,
    "jan": 1, "feb": 2, "mär": 3, "apr": 4,
    "jun": 6, "jul": 7, "aug": 8, "sep": 9, "okt": 10, "nov": 11, "dez": 12,
}


def _parse_deadline(text: str) -> date | None:
    """Try to extract a date from free-text deadline fields.

    Handles:
      - DD.MM.YYYY / DD-MM-YYYY / DD/MM/YYYY
      - DD. Monatsname YYYY  (German month names)
    Returns None when no parseable date is found — the caller treats
    unparseable deadlines as "no restriction" (open deadline).
    """
    if not text:
        return None

    # Numeric: DD.MM.YYYY (also - and /)
    m = re.search(r"\b(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{2,4})\b", text)
    if m:
        day, month, year = int(m.group(1)), int(m.group(2)), int(m.group(3))
        if year < 100:
            year += 2000
        try:
            return date(year, month, day)
        except ValueError:
            pass  # malformed — fall through to next pattern

    # German long form: "31. März 2025"
    m = re.search(
        r"\b(\d{1,2})\.\s*([A-Za-zäöüÄÖÜ]+)\s+(\d{4})\b",
        text,
        re.IGNORECASE,
    )
    if m:
        day = int(m.group(1))
        month_str = m.group(2).lower()
        year = int(m.group(3))
        month = _GERMAN_MONTHS.get(month_str)
        if month:
            try:
                return date(year, month, day)
            except ValueError:
                pass

    return None


def _rule_deadline_not_passed(
    builder: "ApplicationSessionBuilder",
    overview: "OverviewDerived",
) -> bool:
    """Organisation's submission deadline must not have passed.

    If the deadline text cannot be parsed, the organisation is kept
    (open/rolling deadline assumption).
    """
    from .models import Organization

    try:
        org = Organization.objects.get(pk=overview.org_id)
    except Organization.DoesNotExist:
        return False

    deadline = _parse_deadline(org.submission_deadline_raw or "")
    if deadline is None:
        return True  # unparseable → assume open
    return deadline >= date.today()


# ---------------------------------------------------------------------------
# Rule registry — add new callables here to extend the filter
# ---------------------------------------------------------------------------

HARD_REQUIREMENT_RULES: list[
    Callable[["ApplicationSessionBuilder", "OverviewDerived"], bool]
] = [
    _rule_applicant_kind,
    _rule_deadline_not_passed,
]


# ---------------------------------------------------------------------------
# Public entry point
# ---------------------------------------------------------------------------

def run(builder: "ApplicationSessionBuilder") -> list[int]:
    """Filter all organisations against every hard rule.

    Mutates builder.layer1_passed_org_ids in place and also returns the list.
    """
    from .models import OverviewDerived

    passed: list[int] = []
    for overview in OverviewDerived.objects.select_related("org").iterator():
        if overview.exhausted:
            continue
        if all(rule(builder, overview) for rule in HARD_REQUIREMENT_RULES):
            passed.append(overview.org_id)

    builder.layer1_passed_org_ids = passed
    return passed
