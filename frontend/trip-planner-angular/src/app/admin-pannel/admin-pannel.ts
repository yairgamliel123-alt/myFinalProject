import { Component, signal } from '@angular/core';
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

  loading = signal(false);
  successMsg = signal('');
  errorMsg = signal('');
  showAddForm = signal(false);
  showRemoveForm = signal(false);
  showUpdateForm = signal(false);

  tripName = signal('');
  fieldToChange = signal('');
  newValue = signal<any>('');

  messages = signal<any[]>([]);
  showMessages = signal(false);
  messagesLoading = signal(false);

  constructor(private tripService: TripsService) {}

  toggleAddTrip() {
    this.showAddForm.set(!this.showAddForm());
  }

  toggleRemoveFrom() {
    this.showRemoveForm.set(!this.showRemoveForm());
  }

  toggleUpdateFrom() {
    this.showUpdateForm.set(!this.showUpdateForm());
  }

  submit() {
    this.loading.set(true);
    this.successMsg.set('');
    this.errorMsg.set('');

    console.log('Trip data:', this.model);

    this.tripService.addTrip(this.model).subscribe({
      next: () => {
        this.successMsg.set('✅ הטיול נוסף בהצלחה');
        this.loading.set(false);

        this.model = {
          title: '',
          image: '',
          description: '',
          location_name: '',
          youtube_id: '',
        };
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg.set('❌ שגיאה בהוספת טיול');
        this.loading.set(false);
      },
    });
  }

  remove() {
    if (!this.tripName().trim()) {
      this.errorMsg.set('יש להזין שם טיול למחיקה');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.tripService.removeTrip(this.tripName()).subscribe({
      next: () => {
        this.successMsg.set('הטיול נמחק בהצלחה');
        this.tripName.set('');
        this.loading.set(false);
        console.log('Trip deleted successfully');
      },
      error: (err: any) => {
        console.error(err);
        this.errorMsg.set('שגיאה במחיקת טיול ❌');
        this.loading.set(false);
      },
    });
  }

  update() {
    if (!this.tripName().trim()) {
      this.errorMsg.set('יש להזין שם טיול');
      return;
    }

    if (!this.fieldToChange().trim()) {
      this.errorMsg.set('יש לבחור שדה לעדכון');
      return;
    }

    if (
      this.newValue() === null ||
      this.newValue() === undefined ||
      String(this.newValue()).trim() === ''
    ) {
      this.errorMsg.set('יש להזין ערך חדש');
      return;
    }

    const ok = confirm(`לעדכן את "${this.fieldToChange()}" בטיול "${this.tripName()}"?`);
    if (!ok) return;

    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');

    this.tripService
      .updateTrip(this.tripName(), this.fieldToChange(), this.newValue())
      .subscribe({
        next: () => {
          this.successMsg.set('עודכן בהצלחה ✅');
          this.loading.set(false);

          this.tripName.set('');
          this.fieldToChange.set('');
          this.newValue.set('');
        },
        error: (err: any) => {
          this.loading.set(false);
          this.errorMsg.set(
            err?.error?.error || err?.error?.message || 'שגיאה בעדכון ❌'
          );
          console.error(err);
        },
      });
  }

  showFeedback() {
    this.showMessages.set(!this.showMessages());

    if (!this.showMessages()) return;

    this.messagesLoading.set(true);

    this.tripService.getAllFeedback().subscribe({
      next: (data: any[]) => {
        this.messages.set(data);
        this.messagesLoading.set(false);
      },
      error: (err: any) => {
        console.error(err);
        this.messagesLoading.set(false);
      },
    });
  }
}