import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  tipoEntrega: 'retiro' | 'delivery' = 'retiro';
  deseaRegistrarse: boolean = false;
  estaLogueado: boolean = false;

  regiones: any[] = [];
  comunas: { id: number, nombre: string }[] = [];

  datosUsuario = {
    nombreCompleto: '',
    correo: '',
    telefono: '',
    rut: '',
    direccion: '',
    clave: 'invitado'
  };

  datosDespacho = {
    region: '',
    comuna_id: 0,
    calle: '',
    numero: '',
    dpto: ''
  };

  carrito: any[] = [];
  totalProductos: number = 0;

  constructor(
    private cartService: CartService,
    private usuarioService: UsuarioService,
    private http: HttpClient,
    private location: Location,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.carrito = this.cartService.getItems();
    this.totalProductos = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

    if (isPlatformBrowser(this.platformId) && localStorage.getItem('token')) {
      this.estaLogueado = true;
    }

    this.cargarRegiones();
  }

  volver() {
    this.location.back();
  }

  cargarRegiones() {
    let headers = {};

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = {
          Authorization: `Bearer ${token}`
        };
      }
    }

    this.http.get<any>('http://localhost:3000/java-api/region', { headers }).subscribe({
      next: (response) => {
        const regionesCrudas = response?.data?.data || [];

        this.regiones = regionesCrudas.map((region: any) => ({
          ...region,
          nombre: decodeURIComponent(escape(region.nombre)),
          ciudades: region.ciudades?.map((nombreCiudad: string, index: number) => ({
            id: index + 1,
            nombre: decodeURIComponent(escape(nombreCiudad))
          })) || []
        }));
      },
      error: (err) => {
        console.error('Error al cargar regiones:', err);
        alert('Error al cargar regiones');
      }
    });
  }

  onRegionChange() {
    const regionSeleccionada = this.regiones.find(r => r.regionId == this.datosDespacho.region);
    this.comunas = regionSeleccionada?.ciudades || [];
    this.datosDespacho.comuna_id = 0;
  }

  get totalFinal() {
    return this.tipoEntrega === 'delivery'
      ? this.totalProductos + 3500
      : this.totalProductos;
  }

  pagarCompra() {
    if (this.tipoEntrega === 'delivery') {
      const { region, comuna_id, calle, numero } = this.datosDespacho;
      if (!region || !comuna_id || !calle.trim() || !numero.trim()) {
        if (isPlatformBrowser(this.platformId)) alert('Por favor completa todos los campos obligatorios de despacho.');
        return;
      }
    }

    if (!this.estaLogueado) {
      this.registrarInvitado();
    } else {
      const tokenData = this.parseToken(localStorage.getItem('token')!);
      const clienteId = tokenData.userId;
      this.procesarPedido(clienteId);
    }
  }

  registrarInvitado() {
    const rol_id = this.deseaRegistrarse ? 2 : 0;
    const activo = this.deseaRegistrarse;

    const direccionCompleta = `${this.datosDespacho.calle} ${this.datosDespacho.numero}, ${this.datosDespacho.dpto}`.trim();

    const datos = {
      nombreCompleto: this.datosUsuario.nombreCompleto,
      correo: this.datosUsuario.correo,
      telefono: this.datosUsuario.telefono,
      rut: this.datosUsuario.rut,
      direccion: direccionCompleta,
      clave: this.datosUsuario.clave,
      activo,
      rol_id,
      comuna_id: this.datosDespacho.comuna_id
    };

    this.usuarioService.registrarInvitado(datos).subscribe({
      next: (usuarioCreado) => {
        if (isPlatformBrowser(this.platformId)) alert('Usuario registrado correctamente.');
        this.procesarPedido(usuarioCreado.id);
      },
      error: () => {
        if (isPlatformBrowser(this.platformId)) alert('Error al registrar el usuario. Verifica los datos.');
      }
    });
  }

  procesarPedido(clienteId: number) {
    const pedido = {
      clienteId,
      tipoEntrega: this.tipoEntrega.toUpperCase(),
      direccionEntrega: this.tipoEntrega === 'delivery'
        ? `${this.datosDespacho.calle} ${this.datosDespacho.numero}, ${this.datosDespacho.dpto}`.trim()
        : null,
      productos: this.carrito.map(item => ({
        productoId: item.id,
        cantidad: item.cantidad
      })),
      total: this.totalFinal
    };

    this.http.post('http://localhost:3000/java-api/pedido', pedido).subscribe({
      next: () => {
        if (isPlatformBrowser(this.platformId)) alert('Pedido realizado con éxito.');
        this.cartService.clearCart();
      },
      error: () => {
        if (isPlatformBrowser(this.platformId)) alert('Error al realizar el pedido.');
      }
    });
  }

  parseToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (e) {
      return {};
    }
  }
}
