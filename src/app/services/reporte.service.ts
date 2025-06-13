import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  private apiUrl = 'http://localhost:3000/java-api/reporte';

  constructor(private http: HttpClient) {}

  obtenerVentasPDF(): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf'
    });

    return this.http.get(`${this.apiUrl}/ventas`, {
      headers,
      responseType: 'blob'
    });
  }
}
