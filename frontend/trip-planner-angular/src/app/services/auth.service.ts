import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
export interface MeResponse {
    id: number;
    username: string;
    email: string;
    is_admin: boolean;
    favorites: number[];
  }
export interface MeResponse {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  favorites: number[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';
  private accessKey = 'access_token';
  private refreshKey = 'refresh_token';

  me$ = new BehaviorSubject<MeResponse | null>(null);

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ access: string; refresh: string }> {
    return this.http.post<{ access: string; refresh: string }>(
      `${this.apiUrl}/login/`,
      { username, password }
    ).pipe(
      tap((tokens: { access: string; refresh: string }) => {
        localStorage.setItem(this.accessKey, tokens.access);
        localStorage.setItem(this.refreshKey, tokens.refresh);
      })
    );
  }

  logout() {
    localStorage.removeItem(this.accessKey);
    localStorage.removeItem(this.refreshKey);
    this.me$.next(null);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.accessKey);
  }

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me/`).pipe(
      tap((me :MeResponse) => this.me$.next(me))
    );
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }
}