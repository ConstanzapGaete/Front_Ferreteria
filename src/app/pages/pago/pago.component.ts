import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {
  pedidoId!: number;
  metodoPago: string = '';
  urlTransbank: string = '';
  comprobante!: File;
  clienteId!: number; // Asumimos que este dato está disponible para subida del comprobante
  mensajeEstado: string = '';
  subiendo = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.pedidoId = +this.route.snapshot.paramMap.get('id')!;
    this.metodoPago = this.route.snapshot.queryParamMap.get('metodo') || '';

    // Si el método es transbank, solicitamos la URL al backend
    if (this.metodoPago === 'transbank') {
      this.crearTransaccionWebpay();
    }
  }

  crearTransaccionWebpay() {
    const body = {
      monto: 10000, // Reemplaza por el monto real del pedido
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

    // Simulamos que se sube a un servidor y obtenemos una URL
    const urlSimulada = `https://miservidor.com/comprobantes/${this.comprobante.name}`;

    const body = {
      clienteId: this.clienteId, // Asegúrate de tener este valor
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
