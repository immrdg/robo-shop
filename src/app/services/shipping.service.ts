import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Country {
  code: string;
  name: string;
}

export interface Location {
  uuid: string;
  name: string;
}

export interface ShippingInfo {
  distance: number;
  cost: number;
  location: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShippingService {
  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>('/api/shipping/codes');
  }

  getLocations(countryCode: string, term: string): Observable<Location[]> {
    return this.http.get<Location[]>(`/api/shipping/match/${countryCode}/${term}`);
  }

  calculateShipping(locationId: string): Observable<ShippingInfo> {
    return this.http.get<ShippingInfo>(`/api/shipping/calc/${locationId}`);
  }

  confirmShipping(userId: string, shippingInfo: ShippingInfo): Observable<void> {
    return this.http.post<void>(`/api/shipping/confirm/${userId}`, shippingInfo);
  }
}