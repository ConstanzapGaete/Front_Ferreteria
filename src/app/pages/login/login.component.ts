import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // NECESARIO PARA [(ngModel)]
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

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

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    console.log('onSubmit ejecutado'); // ← Asegura que se ejecuta
    this.authService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log('Respuesta del backend:', res);
        const token = res.data.token;
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/catalogo']); // o donde quieras redirigir
        } else {
          console.warn('No se recibió token');
        }
      },
      error: (err: any) => {
        this.errorMsg = 'Correo o contraseña incorrectos';
        console.error(err);
      }
    });
  }
}
