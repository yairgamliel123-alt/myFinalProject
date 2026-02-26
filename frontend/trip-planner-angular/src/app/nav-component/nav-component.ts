import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService, MeResponse } from '../services/auth.service';
@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './nav-component.html',
  styleUrl: './nav-component.css',
})
export class NavComponent implements OnInit {
  me$!: Observable<MeResponse | null>;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit() {

    this.me$ = this.auth.me$;
    this.auth.initAuth();
  }

  logout() {
    this.auth.logout();
    this.router.navigateByUrl('/');
  }
}