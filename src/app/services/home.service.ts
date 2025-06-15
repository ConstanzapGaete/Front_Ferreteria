import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private baseUrl = 'http://localhost:3000/java-api'; // Backend Java a través del gateway

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/categoria`);
  }

  getProductos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/producto`);
  }
}
