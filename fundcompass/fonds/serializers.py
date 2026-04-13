"""
serializers.py
--------------
DRF serializers for the grant application pipeline.

Requires 'rest_framework' in INSTALLED_APPS (fundcompass/settings.py).
"""

from rest_framework import serializers


class Page1Serializer(serializers.Serializer):
    applicant_kind = serializers.ChoiceField(choices=["individual", "institution"])
    field_1 = serializers.CharField(allow_blank=True, required=False, default="")


class Page2Serializer(serializers.Serializer):
    # field_2 is the project description — the primary input for vectorization.
    # min_length enforces that the applicant provides enough text to embed.
    field_2 = serializers.CharField(min_length=10)


class Page3Serializer(serializers.Serializer):
    field_3 = serializers.CharField(allow_blank=True, required=False, default="")


class MatchResultSerializer(serializers.Serializer):
    org_id = serializers.IntegerField()
    org_name = serializers.CharField()
    similarity_score = serializers.FloatField()
    match_level = serializers.CharField()
