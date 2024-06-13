import { Base } from "./Base";
import ISucursales from "./Sucursales";

interface IPedido extends Base<IPedido> {
  horaEstimadaFinalizacion:string,
  total:number,
  totalCosto:number,
  estado:string,
  tipoEnvio:string,
  formaPago:string,
  fechaPedido:string,
  sucursal:ISucursales,
}

export default IPedido;
