import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trips } from '../trips/trips';
import { Trip } from '../Trip.models';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private apiUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {}
  getTrips() {
    return this.http.get<Trip[]>(`${this.apiUrl}/all-trips/`);
  }
  addTrip(trip: Partial<Trip>): Observable<Trip> {
    return this.http.post<Trip>(`${this.apiUrl}/add-trip/`, trip);
  }
}
