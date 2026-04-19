from rest_framework import serializers

SUPPORT_TYPE_CHOICES = ["private", "institution", "project", "education"]


class Page1Serializer(serializers.Serializer):
    support_type = serializers.ChoiceField(choices=SUPPORT_TYPE_CHOICES)
    residency_status = serializers.CharField(allow_blank=True, required=False, default="")
    zip_code = serializers.CharField(allow_blank=True, required=False, default="")


class Page2Serializer(serializers.Serializer):
    description = serializers.CharField(min_length=10)


class Page3Serializer(serializers.Serializer):
    additional_info = serializers.CharField(allow_blank=True, required=False, default="")


class MatchResultSerializer(serializers.Serializer):
    org_id = serializers.IntegerField()
    org_name = serializers.CharField()
    similarity_score = serializers.FloatField()
    match_level = serializers.CharField()
