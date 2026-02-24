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
  removeTrip(trip_name:string){
    const encodedName = encodeURIComponent(trip_name);
    return this.http.delete<Trip>(`${this.apiUrl}/remove-trip/${encodedName}/` );
  }
 
  updateTrip(trip_name: string, field_to_change: string, value: any) {
    const encodedName = encodeURIComponent(trip_name);
    const encodedField = encodeURIComponent(field_to_change);
  
    return this.http.put<Trip>(
      `${this.apiUrl}/update-trip/${encodedName}/${encodedField}/`,
      { value } 
    );
  }
  getTripById(id: number) {
    return this.http.get<Trip>(`${this.apiUrl}/trips/${id}/`);
  }

  getWeather(lat: number, lon: number) {
    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${lat}&longitude=${lon}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation_probability,wind_speed_10m` +
      `&timezone=auto`;
  
    return this.http.get<any>(url);
  }

  
  
}
