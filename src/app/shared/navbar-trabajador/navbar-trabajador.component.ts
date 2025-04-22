import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-trabajador',
  standalone: true,
  imports: [],
  templateUrl: './navbar-trabajador.component.html',
  styleUrls: ['./navbar-trabajador.component.css']
})
export class NavbarTrabajadorComponent {
  currentTitle: string = '';

  constructor(private router: Router) {
    this.setTitleByRoute(this.router.url);
    this.router.events.subscribe(() => {
      this.setTitleByRoute(this.router.url);
    });
  }

  setTitleByRoute(url: string): void {
    if (url.includes('/admin')) {
      this.currentTitle = 'ADMINISTRACIÓN';
    } else if (url.includes('/vendedor')) {
      this.currentTitle = 'VENTAS';
    } else if (url.includes('/bodeguero')) {
      this.currentTitle = 'BODEGA';
    } else if (url.includes('/contador')) {
      this.currentTitle = 'FINANZAS';
    } else {
      this.currentTitle = '';
    }
  }
}
