import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripsService } from '../services/trips';
import { Trip } from '../Trip.models';
import { TripCard } from '../trip-card/trip-card';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
@Component({
  selector: 'app-home',
  imports: [ RouterLink,CommonModule, TripCard],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  trips: Trip[] = [];
  loading = true;

  constructor(private tripService: TripsService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data:Trip[]) => {
        this.trips = data.slice(7, 11); // 👈 רק 4 טיולים
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
}
