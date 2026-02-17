from rest_framework import serializers
from .models import Trip
from django.core.validators import URLValidator
from .extract_youtube_url import extract_youtube_id
from django.core.exceptions import ValidationError as DjangoValidationError
from .service import geocoding


class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"
        read_only_fields = ("latitude", "longitude")

    def validate(self, attrs):
        # --- YouTube validation ---
        youtube_input = attrs.get("youtube_id")
        if youtube_input:
            url_validator = URLValidator()
            try:
                url_validator(youtube_input)
            except DjangoValidationError:
                raise serializers.ValidationError(
                    {"youtube_id": "יש להזין כתובת URL תקינה"}
                )

            youtube_id = extract_youtube_id(youtube_input)
            if not youtube_id:
                raise serializers.ValidationError(
                    {"youtube_id": "יש להזין קישור יוטיוב תקין"}
                )

            attrs["youtube_id"] = youtube_id

        return attrs

    def create(self, validated_data):
        location_name = validated_data.get("location_name")

        if location_name:
            lat, lon = geocoding(location_name)

            if lat is None or lon is None:
                raise serializers.ValidationError({
                    "location_name": "המיקום לא נמצא, נא להזין שם מיקום תקין"
                })

            validated_data["latitude"] = lat
            validated_data["longitude"] = lon

        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_location = validated_data.get("location_name")

        if new_location and new_location != instance.location_name:
            lat, lon = geocoding(new_location)

            if lat is None or lon is None:
                raise serializers.ValidationError({
                    "location_name": "המיקום לא נמצא, נא להזין שם מיקום תקין"
                })

            instance.latitude = lat
            instance.longitude = lon

        return super().update(instance, validated_data)
