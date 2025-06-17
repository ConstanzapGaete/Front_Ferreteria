import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/java-api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token')?.trim();
    console.log('Token enviado:', token);

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/pdf',
    });
  }

  obtenerVentaPDF(pedidoId: number): Observable<Blob> {
    const headers = this.getAuthHeaders();

    return this.http.get(`${this.apiUrl}/pedido/${pedidoId}/pdf`, {
      headers: headers,
      responseType: 'blob',
    });
  }
}
