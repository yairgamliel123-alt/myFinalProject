from django.urls import path
from . import views
urlpatterns = [
    path("all-trips/", views.show_all_trips, name="trips_list"),
    path("add-trip/", views.add_trip, name="add_trip"),
    path("remove-trip/<str:trip_name>/", views.delete_trip, name="remove_trip"),
    path(
    "update-trip/<str:trip_name>/<str:field_to_change>/",
    views.update_trip_field,
    name="update-trip-field"
),

    path("trips/<int:id>/", views.get_trip_by_id)
]