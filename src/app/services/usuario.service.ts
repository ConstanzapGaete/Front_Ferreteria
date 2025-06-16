import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UsuarioCreado {
  id: number;
  nombreCompleto: string;
  correo: string;
  telefono: string;
  rut: string;
  direccion: string;
  rol_id: number;
  activo: boolean;
  comuna_id: number;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/java-api/usuario';

  constructor(private http: HttpClient) {}

  registrarInvitado(datos: any): Observable<UsuarioCreado> {
    const payload = {
      nombreCompleto: datos.nombreCompleto,
      correo: datos.correo,
      telefono: datos.telefono,
      rut: datos.rut,
      direccion: datos.direccion,
      clave: datos.clave,
      activo: datos.activo,
      rol_id: datos.rol_id,
      comuna_id: datos.comuna_id
    };

    return this.http.post<UsuarioCreado>(this.apiUrl, payload);
  }
}
