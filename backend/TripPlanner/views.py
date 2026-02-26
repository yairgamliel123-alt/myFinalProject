from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from rest_framework import status
from .serializers import TripSerializer
from .models import Trip
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from .serializers import MeSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer
from rest_framework.permissions import IsAdminUser

# Create your views here.
class AdminPanelView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response({"message": "Admin panel data"})

@api_view(["Post"])
def add_trip(request):
    serializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([AllowAny])
def show_all_trips(request):
    trip = Trip.objects.values().all()
    return Response(trip)
    
@api_view(["GET"])
def get_trip_by_id(request, id):
    try:
        trip = Trip.objects.values().get(id=id)
        return Response(trip)
    except Trip.DoesNotExist:
        return Response(
            {"error": "Trip not found"},
            status=status.HTTP_404_NOT_FOUND
        )

@api_view(["DELETE"])
def delete_trip(request, trip_name):
    trip = get_object_or_404(Trip, title=trip_name)
    trip.delete()
    return Response(status=status.HTTP_200_OK)


@api_view(["PUT"])
def update_trip_field(request, trip_name, field_to_change):
    trip = get_object_or_404(Trip, title=trip_name)

    new_value = request.data.get("value")
    if new_value is None:
        return Response(
            {"error": "Missing 'value' in request body"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if not hasattr(trip, field_to_change):
        return Response(
            {"error": "Field does not exist"},
            status=status.HTTP_400_BAD_REQUEST
        )

    setattr(trip, field_to_change, new_value)
    trip.save()

    return Response(
        {"message": "Trip updated successfully"},
        status=status.HTTP_200_OK
    )



# ////////////////////////////// userInfo
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
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            },
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
    trip = Trip.objects.get(id=trip_id)

    profile = request.user.profile

    if profile.favorites.filter(id=trip_id).exists():
        profile.favorites.remove(trip)
        return Response({"status": "removed"})
    else:
        profile.favorites.add(trip)
        return Response({"status": "added"})