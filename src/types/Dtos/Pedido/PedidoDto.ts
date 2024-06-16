import { Base } from "../../Base";
import DomicilioDto from "../DomicilioDto/DomicilioDto";
import { DetallePedido } from "./DetallePedido";


interface PedidoDto extends Base<PedidoDto> {
  horaEstimadaFinalizacion:string,
  total:number,
  totalCosto:number,
  estado:string,
  tipoEnvio:string,
  formaPago:string,
  fechaPedido:string,
  domicilio: DomicilioDto, 
  detallePedidos: DetallePedido[];
}

export default PedidoDto;