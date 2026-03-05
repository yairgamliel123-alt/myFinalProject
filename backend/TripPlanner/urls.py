from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [

    # ---------------- Auth ----------------
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='refresh'),
    path('register/', views.RegisterView.as_view(), name='register'),
    path("me/", views.MeView.as_view(), name="me"),

    # ---------------- Trips ----------------
    path("all-trips/", views.show_all_trips, name="trips_list"),
    path("trips/<int:id>/", views.get_trip_by_id),
    path("add-trip/", views.add_trip, name="add_trip"),
    path("remove-trip/<str:trip_name>/", views.delete_trip),
    path(
        "update-trip/<str:trip_name>/<str:field_to_change>/",
        views.update_trip_field,
    ),

    # ---------------- Favorites ----------------
    path("favorites/toggle/", views.toggle_favorite),

    # ---------------- fedback ----------------
    path("feedback/send/", views.send_feedback),
    path("admin-feedback/", views.get_feedback_messages),



]