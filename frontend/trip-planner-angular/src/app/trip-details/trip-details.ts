import { Component, OnInit } from '@angular/core';
import { TripsService } from '../services/trips';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Trip } from '../Trip.models';

@Component({
  selector: 'app-trip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-details.html',
  styleUrls: ['./trip-details.css'],
})
export class TripDetails implements OnInit {
  trip: Trip | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private tripService: TripsService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = Number(idStr);

    if (!idStr || Number.isNaN(id)) {
      this.loading = false;
      this.error = true;
      return;
    }

    this.tripService.getTripById(id).subscribe({
      next: (data: Trip) => {
        this.trip = data;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }
}