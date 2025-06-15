import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { HomeService } from '../../services/home.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  categorias: any[] = [];
  todasLasCategorias: any[] = [];
  productos: any[] = [];
  mostrarTodasCategorias = false;

  private homeService = inject(HomeService);

  ngOnInit(): void {
    this.homeService.getProductos().subscribe((res) => {
      const productos = Array.isArray(res) ? res : res?.data?.data;
      if (Array.isArray(productos)) {
        this.productos = productos.slice(0, 6).map(p => ({
          ...p,
          nombre: this.decodeLatin1(p.nombre),
          descripcion: this.decodeLatin1(p.descripcion),
          imagen_url: this.fixImagePath(p.imagen_url)
        }));
      } else {
        console.error('Formato de respuesta inesperado (productos)', res);
      }
    });

    this.homeService.getCategorias().subscribe((res) => {
      const categorias = Array.isArray(res) ? res : res?.data?.data;
      if (Array.isArray(categorias)) {
        this.todasLasCategorias = categorias.map(c => ({
          ...c,
          nombre: this.decodeLatin1(c.nombre),
          descripcion: this.decodeLatin1(c.descripcion)
        }));
        this.categorias = this.todasLasCategorias.slice(0, 3);
      } else {
        console.error('Formato de respuesta inesperado (categorías)', res);
      }
    });
  }

  alternarCategorias(): void {
    this.mostrarTodasCategorias = !this.mostrarTodasCategorias;
    this.categorias = this.mostrarTodasCategorias
      ? this.todasLasCategorias
      : this.todasLasCategorias.slice(0, 3);
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
