import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NavbarTrabajadorComponent } from './shared/navbar-trabajador/navbar-trabajador.component';
import { AuthService } from './services/auth.service';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, CommonModule, NavbarTrabajadorComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public showSessionWarning = false;

  public isPublicRoute(): boolean {
    return !['/admin', '/vendedor', '/bodeguero', '/contador'].includes(this.router.url);
  }

  public isPrivateRoute(): boolean {
    return ['/admin', '/vendedor', '/bodeguero', '/contador'].includes(this.router.url);
  }

  private messages = [
    '🛻 <strong>Retiro en sucursal o envío a domicilio.</strong> ¡Tú decides!',
    '🔧 <strong>Tenemos todo lo que buscas</strong> en ferretería y construcción.',
    '💳 <strong>Compra online con múltiples medios de pago</strong> y recibe en casa.',
    '📦 <strong>Despachos a todo Chile</strong> en 24 a 72 horas.',
  ];

  currentMessage = this.messages[0];
  private index = 0;
  bannerClass = 'fade-enter';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public router: Router,
    private authService: AuthService
  ) {
    if (isPlatformBrowser(this.platformId)) {
      setInterval(() => {
        if (this.router.url !== '/login') {
          this.bannerClass = 'fade-enter';
          setTimeout(() => {
            this.index = (this.index + 1) % this.messages.length;
            this.currentMessage = this.messages[this.index];
            this.bannerClass = 'fade-enter-active';
          }, 100);
        }
      }, 4000);

      this.authService.sessionExpiring$.subscribe(() => {
        this.showSessionWarning = true;
      });
    }
  }

  renovarSesion(): void {
    this.authService.renewSession();
    this.showSessionWarning = false;
  }

  cerrarAviso(): void {
    this.showSessionWarning = false;
  }
}
