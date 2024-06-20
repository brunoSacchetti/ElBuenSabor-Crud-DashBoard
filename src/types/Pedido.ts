import { Base } from "./Base";

interface IPedido extends Base<IPedido> {
  horaEstimadaFinalizacion:string,
  total:number,
  totalCosto:number,
  estado:string,
  tipoEnvio:string,
  formaPago:string,
  fechaPedido:string,
}

export default IPedido;
