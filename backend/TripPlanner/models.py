from django.db import models

# Create your models here.
class Trip(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    image = models.URLField(max_length=500)
    youtube_id = models.CharField(max_length=50, blank=True)
    location_name = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    def __str__(self):
        return self.title

