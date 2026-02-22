import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Trip } from '../Trip.models';
@Component({
  selector: 'app-trip-card',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './trip-card.html',
  styleUrl: './trip-card.css',
})
export class TripCard {
  @Input() trip!: Trip;
}
