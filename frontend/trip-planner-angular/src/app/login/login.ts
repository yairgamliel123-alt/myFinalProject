import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, MeResponse } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username = signal('');
  password = signal('');

  error = signal('');
  loading = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  doLogin() {

    this.error.set('');
    this.loading.set(true);

    this.auth.login(this.username(), this.password()).subscribe({

      next: () => {
        this.auth.getMe().subscribe({
          next: (me: MeResponse) => {
            this.loading.set(false);
            this.router.navigateByUrl('/trips');
          }
        });
      },

      error: (err:any) => {

        this.loading.set(false);
      
        const e = err?.error;
      
        const message =
          e?.detail ||
          e?.username?.[0] ||
          e?.password?.[0] ||
          'Login failed';
      
        this.error.set(message);
      }

    });
  }
}