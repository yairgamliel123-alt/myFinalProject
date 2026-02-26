import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, filter } from 'rxjs';
import { MeResponse } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate() {
    return this.auth.me$.pipe(
      filter((me: MeResponse | null) => me !== null),

      map((me: MeResponse) => {
        if (me.is_admin) {
          return true;
        }

        this.router.navigateByUrl('/');
        return false;
      })
    );
  }
}