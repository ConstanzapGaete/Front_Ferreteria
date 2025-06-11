export interface Pago {
  id: number;
  clienteId: number;
  monto: number;
  fechaPago: string; 
  estado: 'pendiente' | 'confirmado' | 'rechazado';
}