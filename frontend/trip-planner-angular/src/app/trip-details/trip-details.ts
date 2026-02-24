import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { TripsService } from '../services/trips';
import { Trip } from '../Trip.models';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-details.html',
  styleUrls: ['./trip-details.css'],
})
export class TripDetails implements OnInit {
  // ✅ הכל signals
  trip = signal<Trip | null>(null);

  loading = signal(true);
  error = signal(false);

  weather = signal<any>(null);
  loadingWeather = signal(false);
  weatherError = signal(false);

  constructor(private route: ActivatedRoute, private tripService: TripsService) {}

  private loadWeatherForTrip(t: Trip) {
    if (t.latitude == null || t.longitude == null) return;

    this.loadingWeather.set(true);
    this.weatherError.set(false);

    this.tripService.getWeather(t.latitude, t.longitude).subscribe({
      next: (res:any) => this.weather.set(res),
      error: () => this.weatherError.set(true),
      complete: () => this.loadingWeather.set(false),
    });
  }

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);

    if (!idStr || Number.isNaN(id)) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    this.loading.set(true);
    this.error.set(false);

    this.tripService.getTripById(id).subscribe({
      next: (data: Trip) => {
        this.trip.set(data);
        this.loading.set(false);

        this.loadWeatherForTrip(data);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      },
    });
  }
}