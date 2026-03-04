import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  username = signal('');
  email = signal('');
  password = signal('');

  error = signal('');
  success = signal('');
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  doSignup() {
    this.error.set('');
    this.success.set('');
    this.loading.set(true);

    this.auth.signup(this.username(), this.email(), this.password()).subscribe({
      next: () => {
        this.success.set('✅ החשבון נוצר בהצלחה! מעביר אותך...');
        this.auth.getMe().subscribe({
          next: () => this.router.navigateByUrl('/trips'),
          error: () => {
            this.loading.set(false);
            this.router.navigateByUrl('/trips');
          },
        });
      },
      error: (err:any) => {
        const e = err?.error;
      
        const message =
          e?.username?.[0] ||
          e?.email?.[0] ||
          e?.password?.[0] ||
          'Signup failed';
      
        this.error.set(message);
        this.loading.set(false);
      }
    });
  }
}