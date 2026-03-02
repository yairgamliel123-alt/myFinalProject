import { Component, OnInit,signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import {TripsService} from '../services/trips';
import { Trip } from '../Trip.models';
import { TripCard } from '../trip-card/trip-card';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { AuthService, MeResponse } from '../services/auth.service';
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
  me$!: Observable<MeResponse | null>;
  me = signal<MeResponse | null>(null);
  showOnlyFavorites = signal(false);

  constructor(private tripService: TripsService,private auth: AuthService) {}

  ngOnInit() {
    this.me$ = this.auth.me$;
    this.me$.subscribe((m:any) => this.me.set(m));
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
    let trips = this.trips();

    if (q) {
      trips = trips.filter((t:Trip) => (t.title ?? '').toLowerCase().includes(q));
    }

    if (this.showOnlyFavorites()) {
      const favIds = this.me()?.favorites ?? [];
      trips = trips.filter((t:Trip) => favIds.includes(t.id));
    }

    return trips;
  }


}
