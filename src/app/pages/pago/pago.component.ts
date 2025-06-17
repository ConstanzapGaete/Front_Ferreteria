import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pedidoId!: number;
  metodoPago: string = '';
  urlTransbank: string = '';
  comprobante!: File;
  clienteId: number = 1; // Reemplazar dinámicamente si corresponde
  mensajeEstado: string = '';
  subiendo = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const metodoParam = this.route.snapshot.queryParamMap.get('metodo');

    if (idParam) {
      this.pedidoId = +idParam;
    }

    if (metodoParam) {
      this.metodoPago = metodoParam;

      if (this.metodoPago === 'transbank') {
        this.crearTransaccionWebpay();
      }
    } else {
      console.error('No se especificó el método de pago en la URL');
    }
  }

  crearTransaccionWebpay() {
    const body = {
      monto: 10000, // Idealmente lo traes desde backend
      ordenCompra: `ORD${this.pedidoId}`,
      sesionId: `SES${this.pedidoId}`
    };

    this.http.post<any>('http://localhost:3000/webpay/crear', body).subscribe(
      (res) => {
        this.urlTransbank = res.redirect;
      },
      (err) => {
        console.error('Error al crear transacción Webpay', err);
      }
    );
  }

  subirComprobante(event: any) {
    this.comprobante = event.target.files[0];
  }

  abrirWebpay() {
    if (this.urlTransbank) {
      const nuevaVentana = window.open(this.urlTransbank, '_blank');

      if (nuevaVentana) {
        const intervalo = setInterval(() => {
          if (nuevaVentana.closed) {
            clearInterval(intervalo);
            this.router.navigate(['/']); // Cambiar si deseas otra ruta
          }
        }, 1000);
      }
    }
  }

  confirmarTransferencia() {
    if (!this.comprobante) return alert('Debes subir un archivo primero');

    this.subiendo = true;

    const formData = new FormData();
    formData.append('archivo', this.comprobante);
    formData.append('clienteId', this.clienteId.toString());
    formData.append('pedidoId', this.pedidoId.toString());
    formData.append('tipo', 'TRANSFERENCIA');

    this.http.post<any>('http://localhost:3000/archivo', formData).subscribe(
      (res) => {
        this.mensajeEstado = 'Tu comprobante ha sido enviado. Espera la validación del contador.';
        this.subiendo = false;
      },
      (err) => {
        console.error('Error al subir comprobante', err);
        const errorMsg = err?.error?.mensajeJava || 'Hubo un problema al subir el comprobante.';
        this.mensajeEstado = errorMsg;
        this.subiendo = false;
      }
    );
  }
}
