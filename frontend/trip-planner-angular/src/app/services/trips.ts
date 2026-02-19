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
  // update-trip/<str:trip_name>/<str:field_to_change>/
  updateTrip(trip_name: string, field_to_change: string, value: any) {
    const encodedName = encodeURIComponent(trip_name);
    const encodedField = encodeURIComponent(field_to_change);
  
    return this.http.put<Trip>(
      `${this.apiUrl}/update-trip/${encodedName}/${encodedField}/`,
      { value } 
    );
  }
  
}
