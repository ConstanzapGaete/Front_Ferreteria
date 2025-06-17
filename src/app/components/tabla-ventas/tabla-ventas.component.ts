import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReporteService } from '../../services/reporte.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';

interface Pedido {
  id: number;
  codigo: string;
  fechaPedido: string;
  direccionEntrega: string;
  descuento: number;
  iva: number;
  nota: string | null;
  estado: string;
  tipoentrega: string;
  total: number;
  subtotal: number;
  clienteId: number;
  vendedorId: number;
  // Agrega más campos según necesidad
}

interface ApiResponse {
  cache: boolean;
  data: Pedido[];
}

@Component({
  selector: 'app-tabla-ventas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabla-ventas.component.html',
  styleUrls: ['./tabla-ventas.component.css'],
})
export class TablaVentasComponent implements OnInit {
  urlapi = 'http://localhost:3000/java-api/pedido';
  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  pdfUrl: SafeResourceUrl | null = null;
  cargando = true;
  error = '';

  constructor(
    private reporteService: ReporteService,
    private sanitizer: DomSanitizer,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.cargarPedidos();
  }

  cargarPedidos(): void {
    this.cargando = true;
    this.http.get<ApiResponse>(this.urlapi).subscribe({
      next: (response) => {
        this.pedidos = response.data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los pedidos';
        this.cargando = false;
        console.error('Error al obtener pedidos:', err);
      },
    });
  }

  verDetalle(pedido: Pedido): void {
    this.pedidoSeleccionado = pedido;
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
  }

  descargarPDF(pedidoId: number): void {
    this.reporteService.obtenerVentaPDF(pedidoId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        // Crear enlace temporal para descarga
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedido_${
          this.pedidoSeleccionado?.codigo || pedidoId
        }.pdf`;
        document.body.appendChild(a);
        a.click();

        // Limpiar
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al descargar PDF:', err);
        this.error = 'Error al descargar el PDF';
      },
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-CL');
  }

  formatearMoneda(valor: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
    }).format(valor);
  }

  ngOnDestroy(): void {
    if (this.pdfUrl) {
      URL.revokeObjectURL(this.pdfUrl.toString());
    }
  }
}
