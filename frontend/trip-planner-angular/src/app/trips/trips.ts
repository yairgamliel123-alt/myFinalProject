import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TripsService} from '../services/trips';
import { Trip } from '../Trip.models';
import { TripCard } from '../trip-card/trip-card';
import { FormsModule } from '@angular/forms';
@Component({
  standalone: true, 
  selector: 'app-trips',
  imports: [CommonModule,TripCard,FormsModule],
  templateUrl: './trips.html',
  styleUrl: './trips.css',
})
export class Trips implements OnInit {
  trips: Trip[] = [];
  loading = true;


  searchText = '';

  constructor(private tripService: TripsService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data: Trip[]) => {
        this.trips = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }
  get filteredTrips(): Trip[] {
    const q = this.searchText.trim().toLowerCase();
    if (!q) return this.trips;

    return this.trips.filter(t =>
      (t.title ?? '').toLowerCase().includes(q)
    );
  }


}
