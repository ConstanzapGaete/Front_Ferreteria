import { Component, inject } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service'; // ✅ servicio del carrito

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  searchTerm: string = '';
  lastNonSearchRoute: string = '/';
  debounceTimeout: any;

  isLoggedIn: boolean = false;
  userEmail: string | null = null;
  userRole: string | null = null;
  menuOpen: boolean = false;

  cartCount: number = 0; // ✅ contador reactivo

  private authService: AuthService = inject(AuthService);
  private cartService: CartService = inject(CartService); // ✅
  private router: Router = inject(Router);

  constructor() {
    // Manejo de búsqueda
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      if (!event.url.includes('/catalogo?q=')) {
        this.lastNonSearchRoute = event.url;
      }
    });

    // Manejo de sesión
    this.authService.isLoggedIn$.subscribe((status: boolean) => {
      this.isLoggedIn = status;

      if (status) {
        const token = localStorage.getItem('token');
        const jwtHelper = new JwtHelperService();
        if (token && !jwtHelper.isTokenExpired(token)) {
          const decoded: any = jwtHelper.decodeToken(token);
          console.log(decoded);
          this.userEmail = decoded.sub;
          this.userRole = decoded.rol || null;
        }
      } else {
        this.userEmail = null;
        this.userRole = null;
      }
    });

    // ✅ Suscripción al contador del carrito
    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });
  }

  onSearchChange() {
    clearTimeout(this.debounceTimeout);
    this.debounceTimeout = setTimeout(() => {
      const termino = this.searchTerm.trim();
      if (termino) {
        this.router.navigate(['/catalogo'], { queryParams: { q: termino } });
      } else {
        this.router.navigateByUrl(this.lastNonSearchRoute);
      }
    }, 300); 
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
