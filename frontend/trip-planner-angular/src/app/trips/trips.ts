import { Component, OnInit,signal} from '@angular/core';
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
  trips = signal<Trip[]>([]);
  loading = signal(true);
  searchText = signal('');

  constructor(private tripService: TripsService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data: Trip[]) => {
        this.trips.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);

      },
    });
  }
  get filteredTrips(): Trip[] {
    const q = this.searchText().trim().toLowerCase();
    const trips = this.trips();

    if (!q) return trips;

    return trips.filter((t:Trip) =>
      (t.title ?? '').toLowerCase().includes(q)
    );
  }


}
