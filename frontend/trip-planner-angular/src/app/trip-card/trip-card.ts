import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { Trip } from '../Trip.models';
import { AuthService, MeResponse } from '../services/auth.service';
import { TripsService } from '../services/trips';

@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard implements OnInit {
  @Input() trip!: Trip;

  me$!: Observable<MeResponse | null>;

  constructor(private auth: AuthService, private trips: TripsService) {}

  ngOnInit(): void {
    this.me$ = this.auth.me$;
  }

  isFav(tripId: number, me: MeResponse | null): boolean {
    return !!me?.favorites?.includes(tripId);
  }

  toggle(tripId: number) {
    this.trips.toggleFavorite(tripId).subscribe({
      next: () => this.auth.getMe().subscribe(), // מרענן favorites
    });
  }
}