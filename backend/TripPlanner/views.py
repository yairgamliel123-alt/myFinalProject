from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Feedback
from .serializers import FeedbackSerializer
from .models import Trip, UserProfile
from .serializers import (
    TripSerializer,
    MeSerializer,
    RegisterSerializer,
)

# -------------------- Admin / Trips --------------------

class AdminPanelView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Admin panel data"})


@api_view(["POST"])
@permission_classes([IsAdminUser])
def add_trip(request):
    serializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def show_all_trips(request):
    trips = Trip.objects.values().all()
    return Response(trips)


@api_view(["GET"])
@permission_classes([AllowAny])
def get_trip_by_id(request, id):
    trip = get_object_or_404(Trip, id=id)
    return Response(TripSerializer(trip).data)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_trip(request, trip_name):
    trip = get_object_or_404(Trip, title=trip_name)
    trip.delete()
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
@permission_classes([IsAdminUser])
def update_trip_field(request, trip_name, field_to_change):
    trip = get_object_or_404(Trip, title=trip_name)

    new_value = request.data.get("value")
    if new_value is None:
        return Response({"error": "Missing 'value' in request body"}, status=status.HTTP_400_BAD_REQUEST)

    if not hasattr(trip, field_to_change):
        return Response({"error": "Field does not exist"}, status=status.HTTP_400_BAD_REQUEST)

    setattr(trip, field_to_change, new_value)
    trip.save()

    return Response({"message": "Trip updated successfully"}, status=status.HTTP_200_OK)

# -------------------- Auth / User --------------------

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        UserProfile.objects.create(user=user)

        refresh = RefreshToken.for_user(user)
        return Response(
            {"access": str(refresh.access_token), "refresh": str(refresh)},
            status=status.HTTP_201_CREATED,
        )


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(MeSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_favorite(request):
    trip_id = request.data.get("trip_id")
    if not trip_id:
        return Response({"error": "trip_id is required"}, status=status.HTTP_400_BAD_REQUEST)

    trip = get_object_or_404(Trip, id=trip_id)
    profile = request.user.profile

    if profile.favorites.filter(id=trip_id).exists():
        profile.favorites.remove(trip)
        return Response({"status": "removed"})
    else:
        profile.favorites.add(trip)
        return Response({"status": "added"})
    
# -------------------- fedback --------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_feedback(request):
    serializer = FeedbackSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user)
        return Response(serializer.data, status=201)
    print("FEEDBACK ERRORS:", serializer.errors)
    return Response(serializer.errors, status=400)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def get_feedback_messages(request):
    messages = Feedback.objects.all().order_by("-created_at")
    serializer = FeedbackSerializer(messages, many=True)

    return Response(serializer.data)