import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DesempenoService {
  private apiUrl = 'http://localhost:3000/java-api/pedido';

  constructor(private http: HttpClient) {}

  obtenerPedidosPorMes(): Observable<{ [key: string]: number }> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => {
        const pedidos = res.data;
        const agrupado: { [key: string]: number } = {};

        const meses = [
          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        pedidos.forEach((pedido: any) => {
          const fecha = new Date(pedido.fechaPedido);
          const key = `${meses[fecha.getMonth()]} ${fecha.getFullYear()}`;
          agrupado[key] = (agrupado[key] || 0) + 1;
        });

        return agrupado;
      })
    );
  }
}
