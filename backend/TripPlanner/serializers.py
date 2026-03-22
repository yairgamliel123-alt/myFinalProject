from django.contrib.auth.models import User
from django.core.exceptions import ValidationError as DjangoValidationError
from django.core.validators import URLValidator
from rest_framework import serializers

from .extract_youtube_url import extract_youtube_id
from .models import Feedback, Trip
from .service.geocoding import geocode


# =========================
# Trip Serializers
# =========================
class TripSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trip
        fields = "__all__"
        read_only_fields = ("latitude", "longitude")

    def validate(self, attrs):
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
            lat, lon = geocode(location_name)

            if lat is not None and lon is not None:
                validated_data["latitude"] = lat
                validated_data["longitude"] = lon
            else:
                validated_data["latitude"] = None
                validated_data["longitude"] = None

        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_location = validated_data.get("location_name")

        if new_location and new_location != instance.location_name:
            lat, lon = geocode(new_location)

            if lat is not None and lon is not None:
                validated_data["latitude"] = lat
                validated_data["longitude"] = lon
            else:
                validated_data["latitude"] = None
                validated_data["longitude"] = None

        return super().update(instance, validated_data)


# =========================
# User Serializers
# =========================
class MeSerializer(serializers.ModelSerializer):
    is_admin = serializers.BooleanField(source="is_staff")
    favorites = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "username", "email", "is_admin", "favorites"]

    def get_favorites(self, obj):
        profile = getattr(obj, "profile", None)
        if not profile:
            return []
        return list(profile.favorites.values_list("id", flat=True))


class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(min_length=4, write_only=True)

    class Meta:
        model = User
        fields = ("username", "email", "password")

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already exists")
        return value

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already exists")
        return value

    def create(self, validated_data):
        return User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )


# =========================
# Feedback Serializers
# =========================
class FeedbackSerializer(serializers.ModelSerializer):
    email = serializers.CharField(source="user.email", read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "message", "created_at", "email"]
        read_only_fields = ("user", "email", "created_at")