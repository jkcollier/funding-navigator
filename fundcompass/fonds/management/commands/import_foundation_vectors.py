"""
Management command: import_foundation_vectors

Runs once (and again if organisations are updated) to populate the
foundation_vectors table from the pre-computed .npy file.

Usage:
    python manage.py import_foundation_vectors \
        --npy fundcompass/fonds/static/fonds/foundation_vectors.npy \
        --json fundcompass/fonds/static/fonds/fonds_stiftungen_descriptions.json

The JSON and .npy must be index-aligned (same order, same count).
After this command succeeds the .npy and JSON are no longer needed at runtime.
"""

import json
from pathlib import Path

import numpy as np
from django.core.management.base import BaseCommand, CommandError

from fonds.models import FoundationVector, Organization


class Command(BaseCommand):
    help = "Import pre-computed foundation vectors from .npy file into the database."

    def add_arguments(self, parser):
        parser.add_argument(
            "--npy",
            required=True,
            help="Path to foundation_vectors.npy",
        )
        parser.add_argument(
            "--json",
            required=True,
            help="Path to fonds_stiftungen_descriptions.json (index-aligned with .npy)",
        )
        parser.add_argument(
            "--dry-run",
            action="store_true",
            help="Print matches without writing to DB",
        )

    def handle(self, *args, **options):
        npy_path = Path(options["npy"])
        json_path = Path(options["json"])

        if not npy_path.exists():
            raise CommandError(f"File not found: {npy_path}")
        if not json_path.exists():
            raise CommandError(f"File not found: {json_path}")

        vectors = np.load(npy_path)
        with open(json_path, encoding="utf-8") as f:
            foundations = json.load(f)

        if len(vectors) != len(foundations):
            raise CommandError(
                f"Length mismatch: {len(vectors)} vectors vs {len(foundations)} JSON entries"
            )

        self.stdout.write(f"Loaded {len(vectors)} vectors ({vectors.shape[1]} dims)")

        # Build name → org_id map from Postgres
        org_map = {
            org.name.strip().lower(): org.pk
            for org in Organization.objects.only("id", "name")
        }

        matched = 0
        skipped = 0
        skipped_names = []

        for i, entry in enumerate(foundations):
            name = entry["name"].strip()
            org_id = org_map.get(name.lower())

            if org_id is None:
                skipped += 1
                skipped_names.append(name)
                continue

            if options["dry_run"]:
                self.stdout.write(f"  [DRY RUN] {name} → org_id={org_id}")
                matched += 1
                continue

            FoundationVector.objects.update_or_create(
                org_id=org_id,
                defaults={"vector": vectors[i].tolist()},
            )
            matched += 1

        self.stdout.write(self.style.SUCCESS(f"\nMatched and imported: {matched}"))

        if skipped:
            self.stdout.write(self.style.WARNING(f"Skipped (no Postgres match): {skipped}"))
            for name in skipped_names:
                self.stdout.write(f"  - {name}")
            self.stdout.write(
                "\nTip: name mismatches are usually whitespace or punctuation differences. "
                "Run with --dry-run to inspect without writing."
            )
