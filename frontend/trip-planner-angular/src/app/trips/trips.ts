import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TripsService} from '../services/trips';
import { Trip } from '../Trip.models';
import { TripCard } from '../trip-card/trip-card';
@Component({
  standalone: true, 
  selector: 'app-trips',
  imports: [CommonModule,TripCard],
  templateUrl: './trips.html',
  styleUrl: './trips.css',
})
export class Trips implements OnInit {
  trips: Trip[] = [];
  loading = true;

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
}
