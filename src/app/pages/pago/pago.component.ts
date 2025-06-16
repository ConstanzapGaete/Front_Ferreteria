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
  clienteId!: number; // Asegúrate de asignar esto en tu flujo real
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
      monto: 10000, // Reemplaza con el valor real si lo tienes
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
      window.open(this.urlTransbank, '_blank');
    }
  }

  confirmarTransferencia() {
    if (!this.comprobante) return alert('Debes subir un archivo primero');

    this.subiendo = true;

    // Simulación de subida real
    const urlSimulada = `https://miservidor.com/comprobantes/${this.comprobante.name}`;

    const body = {
      clienteId: this.clienteId, // Reemplaza con el valor real desde sesión si es necesario
      url: urlSimulada,
      tipo: 'pago'
    };

    this.http.post<any>('http://localhost:3000/java-api/pedido/comprobante/guardar', body).subscribe(
      (res) => {
        this.mensajeEstado = 'Comprobante enviado correctamente. Tu pedido será revisado.';
        this.subiendo = false;
      },
      (err) => {
        console.error('Error al enviar comprobante', err);
        this.mensajeEstado = 'Hubo un problema al subir el comprobante.';
        this.subiendo = false;
      }
    );
  }
}
