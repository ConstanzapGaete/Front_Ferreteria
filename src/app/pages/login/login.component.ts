import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMsg: string = '';
  showSuccess: boolean = false;
  private jwtHelper = new JwtHelperService();

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.errorMsg = '';
    this.showSuccess = false;

    if (!this.email || !this.password) {
      this.errorMsg = 'Debes completar todos los campos';
      return;
    }

    const emailRegex = /^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMsg = 'Ingresa un correo válido';
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        const token = res.data.token;
        if (token) {
          const decoded = this.jwtHelper.decodeToken(token);
          const rol = decoded.rol;
          this.authService.notifyLogin(token);

          // Mostrar éxito y redirigir después
          this.showSuccess = true;
          setTimeout(() => {
            this.showSuccess = false;

            switch (rol) {
              case 'ADMIN':
                this.router.navigate(['/admin']);
                break;
              case 'VENDEDOR':
                this.router.navigate(['/ventas']);
                break;
              case 'BODEGUERO':
                this.router.navigate(['/bodeguero']);
                break;
              case 'DESPACHADOR':
                this.router.navigate(['/contador']);
                break;
              case 'CLIENTE':
              default:
                this.router.navigate(['/catalogo']);
                break;
            }
          }, 2000); // espera 2 segundos
        } else {
          this.errorMsg = 'No se recibió token válido';
        }
      },
      error: (err: any) => {
        const detalle = err.error?.detalle || 'Error inesperado';
        this.errorMsg = detalle;
        console.error('Error de login:', detalle);
      }
    });
  }
}
