from django.core.management.base import BaseCommand
from fonds.layer2 import precompute_foundation_vectors


class Command(BaseCommand):
    help = "Embed all foundation descriptions and store vectors in the DB."

    def add_arguments(self, parser):
        parser.add_argument(
            "--org-ids",
            nargs="+",
            type=int,
            help="Limit to specific org primary keys (optional).",
        )

    def handle(self, *args, **options):
        org_ids = options.get("org_ids")
        self.stdout.write("Computing foundation vectors...")
        count = precompute_foundation_vectors(org_ids=org_ids)
        self.stdout.write(self.style.SUCCESS(f"Done. {count} vectors stored."))
