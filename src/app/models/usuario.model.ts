import { Rol } from './rol.model';


export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  contrasena?: string; 
  rol: Rol;
  activo?: boolean;
}
