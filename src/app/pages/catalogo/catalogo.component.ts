import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CatalogoService } from '../../services/catalogo.service';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../services/cart.service'; // 👈 Agregado

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  placeholders: any[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 6;

  filtroTexto: string = '';
  filtroMarcas: string[] = [];
  filtroCategorias: string[] = [];
  marcasDisponibles: string[] = [];
  categoriasDisponibles: string[] = [];
  ordenSeleccionado: string = 'default';

  mostrarFiltroMarcas: boolean = false;
  mostrarFiltroCategorias: boolean = false;

  private catalogoService = inject(CatalogoService);
  private cartService = inject(CartService); // 👈 Inyectado

  ngOnInit(): void {
    this.catalogoService.getProductosPaginados(1, 1000).subscribe((res) => {
      const data = Array.isArray(res) ? res : res?.data?.data;
      if (Array.isArray(data)) {
        this.productos = data.map(p => ({
          ...p,
          nombre: this.decodeLatin1(p.nombre),
          descripcion: this.decodeLatin1(p.descripcion),
          imagenUrl: this.fixImagePath(p.imagenUrl),
          marca: this.decodeLatin1(p.marca || 'Sin Marca'),
          categoria: this.decodeLatin1(p.categoria || 'Sin Categoría'),
          cantidadEnCarrito: 0 // ← NUEVO
        }));

        this.marcasDisponibles = [...new Set(this.productos.map(p => p.marca))];
        this.categoriasDisponibles = [...new Set(this.productos.map(p => p.categoria))];

        this.filtrarProductos();
      } else {
        console.error('Error al cargar productos', res);
      }
    });
  }

  filtrarProductos(): void {
    let filtrados = [...this.productos];

    if (this.filtroTexto.trim() !== '') {
      const texto = this.filtroTexto.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
      );
    }

    if (this.filtroMarcas.length > 0) {
      filtrados = filtrados.filter(p => this.filtroMarcas.includes(p.marca));
    }

    if (this.filtroCategorias.length > 0) {
      filtrados = filtrados.filter(p => this.filtroCategorias.includes(p.categoria));
    }

    switch (this.ordenSeleccionado) {
      case 'precioAsc':
        filtrados.sort((a, b) => a.precioActual - b.precioActual);
        break;
      case 'precioDesc':
        filtrados.sort((a, b) => b.precioActual - a.precioActual);
        break;
      case 'marcaAZ':
        filtrados.sort((a, b) => a.marca.localeCompare(b.marca));
        break;
      case 'marcaZA':
        filtrados.sort((a, b) => b.marca.localeCompare(a.marca));
        break;
    }

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.productosFiltrados = filtrados.slice(start, end);

    const faltantes = this.itemsPerPage - this.productosFiltrados.length;
    this.placeholders = Array(faltantes > 0 ? faltantes : 0).fill(0);
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.filtrarProductos();
  }

  get totalPaginas(): number[] {
    const total = Math.ceil(this.filtrarTotal() / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  private filtrarTotal(): number {
    let filtrados = [...this.productos];

    if (this.filtroTexto.trim() !== '') {
      const texto = this.filtroTexto.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(texto) ||
        p.descripcion.toLowerCase().includes(texto)
      );
    }

    if (this.filtroMarcas.length > 0) {
      filtrados = filtrados.filter(p => this.filtroMarcas.includes(p.marca));
    }

    if (this.filtroCategorias.length > 0) {
      filtrados = filtrados.filter(p => this.filtroCategorias.includes(p.categoria));
    }

    return filtrados.length;
  }

  toggleMarca(marca: string): void {
    const index = this.filtroMarcas.indexOf(marca);
    if (index > -1) {
      this.filtroMarcas.splice(index, 1);
    } else {
      this.filtroMarcas.push(marca);
    }
    this.filtrarProductos();
  }

  toggleCategoria(cat: string): void {
    const index = this.filtroCategorias.indexOf(cat);
    if (index > -1) {
      this.filtroCategorias.splice(index, 1);
    } else {
      this.filtroCategorias.push(cat);
    }
    this.filtrarProductos();
  }

  cambiarOrden(orden: string): void {
    this.ordenSeleccionado = orden;
    this.filtrarProductos();
  }

  buscar(): void {
    this.currentPage = 1;
    this.filtrarProductos();
  }

  agregarAlCarrito(producto: any): void {
    if (producto.cantidadEnCarrito === 0) {
      producto.cantidadEnCarrito = 1;
      this.cartService.addToCart(producto); // 👈 Se refleja en localStorage
      alert('Producto agregado al carrito');
    }
  }

  incrementarCantidad(producto: any): void {
    producto.cantidadEnCarrito++;
    this.cartService.updateQuantity(producto.id, producto.cantidadEnCarrito); // 👈 Actualiza en storage
  }

  decrementarCantidad(producto: any): void {
    if (producto.cantidadEnCarrito > 1) {
      producto.cantidadEnCarrito--;
      this.cartService.updateQuantity(producto.id, producto.cantidadEnCarrito); // 👈 Disminuye
    } else if (producto.cantidadEnCarrito === 1) {
      producto.cantidadEnCarrito = 0;
      this.cartService.removeFromCart(producto.id); // 👈 Se quita del carrito
    }
  }

  private decodeLatin1(str: string): string {
    try {
      return decodeURIComponent(escape(str));
    } catch {
      return str;
    }
  }

  private fixImagePath(path: string): string {
    if (!path) return '';
    if (path.startsWith('assets/') || path.startsWith('/assets/')) {
      return path.replace(/^\/?/, '');
    }
    return 'assets/images/' + path;
  }
}
