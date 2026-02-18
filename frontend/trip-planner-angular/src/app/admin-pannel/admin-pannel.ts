import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TripsService } from '../services/trips';
import { Trip } from '../Trip.models';

@Component({
  selector: 'app-admin-pannel',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-pannel.html',
  styleUrl: './admin-pannel.css',
})
export class AdminPannel {
  model: Partial<Trip> = {
    title: '',
    image: '',
    description: '',
    location_name: '',
    youtube_id: '',
  };

  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(private tripService: TripsService) {}

  submit() {
    this.loading = true;
    this.successMsg = '';
    this.errorMsg = '';

    console.log('Trip data:', this.model);

    this.tripService.addTrip(this.model).subscribe({
      next: () => {
        this.successMsg = '✅ הטיול נוסף בהצלחה';
        this.loading = false;

       
        this.model = {
          title: '',
          image: '',
          description: '',
          location_name: '',
          youtube_id: '',
        };
      },
      error: (err:any) => {
        console.error(err);
        this.errorMsg = '❌ שגיאה בהוספת טיול';
        this.loading = false;
      },
    });
  }
}
