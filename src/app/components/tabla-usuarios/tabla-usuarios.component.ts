import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tabla-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tabla-usuarios.component.html',
  styleUrl: './tabla-usuarios.component.css'
})
export class TablaUsuariosComponent {
  usuarios = [
    { id: 1, nombre: 'Juan Pérez', correo: 'juan@mail.com', rol: 'Admin' },
    { id: 2, nombre: 'Ana López', correo: 'ana@mail.com', rol: 'Vendedor' }
  ];

  roles = ['Admin', 'Vendedor', 'Cliente'];

  nuevoUsuario = { id: 0, nombre: '', correo: '', rol: 'Cliente' };
  editandoId: number | null = null;

  agregarUsuario() {
    const nuevo = { ...this.nuevoUsuario, id: Date.now() };
    this.usuarios.push(nuevo);
    this.nuevoUsuario = { id: 0, nombre: '', correo: '', rol: 'Cliente' };
  }

  eliminarUsuario(id: number) {
    this.usuarios = this.usuarios.filter(u => u.id !== id);
  }

  editarUsuario(usuario: any) {
    this.editandoId = usuario.id;
    this.nuevoUsuario = { ...usuario };
  }

  guardarEdicion() {
    this.usuarios = this.usuarios.map(u =>
      u.id === this.editandoId ? { ...this.nuevoUsuario } : u
    );
    this.editandoId = null;
    this.nuevoUsuario = { id: 0, nombre: '', correo: '', rol: 'Cliente' };
  }

  cancelarEdicion() {
    this.editandoId = null;
    this.nuevoUsuario = { id: 0, nombre: '', correo: '', rol: 'Cliente' };
  }
}
