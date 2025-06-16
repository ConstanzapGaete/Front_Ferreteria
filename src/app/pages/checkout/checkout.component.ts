import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service';
import { UsuarioService } from '../../services/usuario.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  tipoEntrega: 'retiro' | 'delivery' = 'retiro';
  metodoPago: 'transbank' | 'transferencia' = 'transbank';
  deseaRegistrarse: boolean = false;
  estaLogueado: boolean = false;

  regiones: any[] = [];
  comunas: { id: number, nombre: string }[] = [];

  datosUsuario = {
    nombre: '',
    apellidop: '',
    apellidom: '',
    correo: '',
    telefono: '',
    rut: '',
    fechaNacimiento: '',
    clave: '' // puede ir vacío si no desea registrarse
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
    private router: Router,
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
    const { region, comuna_id, calle, numero } = this.datosDespacho;

    if (!region || !comuna_id || !calle.trim() || !numero.trim()) {
      if (isPlatformBrowser(this.platformId)) alert('Por favor completa todos los campos obligatorios de despacho.');
      return;
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
    const {
      nombre,
      apellidop,
      apellidom,
      correo,
      telefono,
      rut,
      fechaNacimiento,
      clave
    } = this.datosUsuario;

    if (
      !nombre.trim() || !apellidop.trim() || !apellidom.trim() ||
      !correo.trim() || !telefono.trim() || !rut.trim() || !fechaNacimiento
    ) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (!/^\d{7,8}-[0-9kK]{1}$/.test(rut)) {
      alert('Formato de RUT inválido. Debe ser como 12345678-9 o 12345678-K.');
      return;
    }

    if (!/^\d+$/.test(telefono)) {
      alert('El teléfono solo debe contener números.');
      return;
    }

    if (this.deseaRegistrarse && clave.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    // Si no desea registrarse, generamos una contraseña temporal
    const password = this.deseaRegistrarse ? clave : `inv_${rut.replace('-', '')}`;
    const direccionCompleta = `${this.datosDespacho.calle} ${this.datosDespacho.numero}, ${this.datosDespacho.dpto}`.trim();

    const datos = {
      nombre,
      apellidop,
      apellidom,
      email: correo,
      password,
      direccion: direccionCompleta,
      telefono,
      fechaNacimiento,
      fechaRegistro: new Date().toISOString().slice(0, 10),
      ultimoLogin: new Date().toISOString().slice(0, 10),
      rut,
      comuna: this.datosDespacho.comuna_id,
      rol: 2, // Siempre rol cliente
      activo: this.deseaRegistrarse, // true si desea registrarse, false si solo compra como invitado
      sucursal: 1
    };

    this.http.post<any>('http://localhost:3000/java-api/usuario', datos).subscribe({
      next: (usuarioCreado) => {
        console.log('Usuario creado:', usuarioCreado);
        const userId = usuarioCreado?.data?.id;
        if (userId) {
          alert('Usuario registrado correctamente.');
          this.procesarPedido(userId);
        } else {
          console.error('La respuesta no contiene el ID del usuario.');
        }
      },
      error: (error) => {
        console.error('Error al registrar usuario:', error);
        alert('Error al registrar el usuario. Verifica los datos.');
      }
    });
  }

  procesarPedido(clienteId: number) {
    const fechaActual = new Date().toISOString().slice(0, 10);
    const numeroAleatorio = Math.floor(100 + Math.random() * 900);
    const codigoPedido = `PED-${fechaActual}-${numeroAleatorio}`;

    const subtotal = this.totalProductos;
    const descuento = 0;
    const iva = Math.round((subtotal - descuento) * 0.19);
    const total = this.tipoEntrega === 'delivery' ? subtotal + iva + 3500 : subtotal + iva;

    const direccionEntrega = this.tipoEntrega === 'delivery'
      ? `${this.datosDespacho.calle} ${this.datosDespacho.numero}, ${this.datosDespacho.dpto}`.trim()
      : 'Retiro en tienda';

    const pedido = {
      codigo: codigoPedido,
      fechaPedido: fechaActual,
      direccionEntrega,
      subtotal,
      descuento,
      iva,
      total,
      nota: '',
      clienteId,
      vendedorId: 2,
      estadoId: 1,
      tipoEntregaId: this.tipoEntrega === 'delivery' ? 1 : 2,
      sucursalId: 1,
      metodoPago: this.metodoPago === 'transferencia' ? 2 : 1
    };

    console.log('Pedido a enviar:', pedido);

    // --- NUEVO: preparar headers con token si existe ---
    const token = isPlatformBrowser(this.platformId) ? localStorage.getItem('token') : null;

    const headers: any = {
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    this.http.post<any>('http://localhost:3000/java-api/pedido', pedido, { headers }).subscribe({
      next: (response) => {
        if (isPlatformBrowser(this.platformId)) {
          alert('Pedido realizado con éxito.');
          this.cartService.clearCart();
          this.router.navigate(['/pago', response?.data?.id], {
            queryParams: { metodo: this.metodoPago }
          });
        }
      },
      error: (err) => {
        console.error('Error al realizar el pedido:', err);
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
