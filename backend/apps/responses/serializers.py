# apps/forms/serializers.py
from rest_framework import serializers
from .models import Response

class ResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Response
        fields = ["id", "form", "submitted_by", "data", "created_at"]
        read_only_fields = ["id", "submitted_by", "created_at"]
