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
# Create your views here.


@api_view(["Post"])
def add_trip(request):
    serializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
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
    permission_classes = [AllowAny]  # מאפשר להירשם גם בלי להיות מחובר

    def post(self, request):
        # 1) קוראים נתונים מה-JSON שנשלח
        username = request.data.get("username")
        email = request.data.get("email", "")
        password = request.data.get("password")

        # 2) בדיקות בסיסיות
        if not username or not password:
            return Response(
                {"error": "username and password required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 3) בדיקה אם שם משתמש כבר קיים
        if User.objects.filter(username=username).exists():
            return Response(
                {"error": "username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # 4) יצירת משתמש (חשוב: create_user מצפין סיסמה)
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # 5) תשובה
        return Response(
            {"message": "registered successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED
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