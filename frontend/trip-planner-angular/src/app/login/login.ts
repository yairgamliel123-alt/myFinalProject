import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService,MeResponse } from '../services/auth.service';




@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';
  me: any = null;

  constructor(private auth: AuthService) {}

  doLogin() {
    this.auth.login(this.username, this.password).subscribe({
      next: () => {
        this.auth.getMe().subscribe((me:MeResponse) => this.me = me);
      },
      error: (err:any) => console.log(err)
    });
  }
}