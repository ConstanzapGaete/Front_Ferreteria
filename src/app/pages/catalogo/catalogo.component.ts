import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CatalogoService } from '../../services/catalogo.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  placeholders: any[] = []; // ← NUEVO: para tarjetas invisibles

  currentPage: number = 1;
  itemsPerPage: number = 6;

  private catalogoService = inject(CatalogoService);

  ngOnInit(): void {
    this.catalogoService.getProductosPaginados(1, 1000).subscribe((res) => {
      const data = Array.isArray(res) ? res : res?.data?.data;
      if (Array.isArray(data)) {
        this.productos = data.map(p => ({
          ...p,
          nombre: this.decodeLatin1(p.nombre),
          descripcion: this.decodeLatin1(p.descripcion),
          imagenUrl: this.fixImagePath(p.imagenUrl)
        }));
        this.actualizarPaginacion();
      } else {
        console.error('Error al cargar productos', res);
      }
    });
  }

  actualizarPaginacion(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.productosFiltrados = this.productos.slice(start, end);

    // ← NUEVO: Calcula cuántos placeholders son necesarios
    const faltantes = this.itemsPerPage - this.productosFiltrados.length;
    this.placeholders = Array(faltantes > 0 ? faltantes : 0).fill(0);
  }

  cambiarPagina(pagina: number): void {
    this.currentPage = pagina;
    this.actualizarPaginacion();
  }

  get totalPaginas(): number[] {
    const total = Math.ceil(this.productos.length / this.itemsPerPage);
    return Array.from({ length: total }, (_, i) => i + 1);
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
