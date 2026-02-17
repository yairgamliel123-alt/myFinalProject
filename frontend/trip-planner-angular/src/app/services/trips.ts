import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trips } from '../trips/trips';
import { Trip } from '../Trip.models';
@Injectable({
  providedIn: 'root',
})
export class TripsService {
  private apiUrl = 'http://localhost:8000/api/all-trips/';
  constructor(private http: HttpClient) {}
  getTrips() {
    return this.http.get<Trip[]>(this.apiUrl);
  }

}
