export interface Pedido {
  id: number;
  clienteId: number;
  fecha: string;
  total: number;
  estado: string;
  tipoEntrega: 'retiro' | 'delivery';
}
