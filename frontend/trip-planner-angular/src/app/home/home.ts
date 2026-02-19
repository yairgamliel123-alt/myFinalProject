import { Component, OnInit,signal } from '@angular/core';
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
  trips = signal<Trip[]>([]) ;
  allTrips = signal< Trip[] >([]) ; 
  loading = signal(true);
  
  constructor(private tripService: TripsService) {}

  ngOnInit() {
    this.tripService.getTrips().subscribe({
      next: (data:Trip[]) => {
        this.allTrips.set(data); 
        this.trips .set(data.slice(7, 11)) ; 
        this.loading.set(false) ;
      },
      error: () => {
        this.loading .set(false) ;
      },
    });
  }
}
