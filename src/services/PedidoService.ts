import PedidoDto from "../types/Dtos/Pedido/PedidoDto";
import IPedido from "../types/Pedido";
import { BackendClient } from "./BackendClient";

export class PedidoService extends BackendClient<IPedido | PedidoDto> {
    async cambiarEstado(newStatus: string, id: number): Promise<PedidoDto> {
        const response = await fetch(`${this.baseUrl}/CambiarEstadoPedido/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newStatus),
        });
        if (!response.ok) {
          throw new Error('Failed to update status');
        }
        return response.json();
      }
}