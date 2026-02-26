import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object   
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (!isPlatformBrowser(this.platformId)) {
      return next.handle(req);
    }

    const token = this.auth.getAccessToken();
    if (!token) {
      return next.handle(req);
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });

    return next.handle(cloned);
  }
}