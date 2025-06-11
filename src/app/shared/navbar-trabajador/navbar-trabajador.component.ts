import { Component, inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar-trabajador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar-trabajador.component.html',
  styleUrls: ['./navbar-trabajador.component.css']
})
export class NavbarTrabajadorComponent {
  currentTitle: string = '';
  userEmail: string | null = null;
  userRole: string | null = null;
  menuOpen: boolean = false;

  private router = inject(Router);
  private authService = inject(AuthService);

  constructor() {
    this.setTitleByRoute(this.router.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.setTitleByRoute(event.url);
    });

    const token = localStorage.getItem('token');
    if (token) {
      const jwtHelper = new JwtHelperService();
      if (!jwtHelper.isTokenExpired(token)) {
        const decoded: any = jwtHelper.decodeToken(token);
        this.userEmail = decoded.sub;
        this.userRole = decoded.rol;
      }
    }
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

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goTo(ruta: string): void {
    this.router.navigate(['/' + ruta]);
    this.menuOpen = false;
  }

  goToRole(): void {
    if (!this.userRole) return;

    const roleRouteMap: { [key: string]: string } = {
      'ADMIN': 'admin',
      'VENDEDOR': 'vendedor',
      'BODEGUERO': 'bodeguero',
      'DESPACHADOR': 'contador'
    };

    const ruta = roleRouteMap[this.userRole];
    if (ruta) {
      this.router.navigate(['/' + ruta]);
      this.menuOpen = false;
    }
  }
}
