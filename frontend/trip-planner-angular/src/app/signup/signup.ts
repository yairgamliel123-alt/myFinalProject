import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
})
export class Signup {
  username = '';
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  doSignup() {
    this.error = '';

    this.auth.signup(this.username, this.email, this.password).subscribe({
      next: () => {
        this.auth.getMe().subscribe(() => {
          this.router.navigateByUrl('/trips');
        });
      },
      error: (err:any) => {
        this.error = err?.error?.error || 'Signup failed';
      }
    });
  }
}