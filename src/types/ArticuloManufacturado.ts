import IArticuloManufacturadoDetalle from "./ArticuloManufacturadoDetalle";
import IArticulo from "./IArticulo";



interface IArticuloManufacturado extends IArticulo{
  descripcion: string;
  preparacion: string;
  tiempoEstimadoMinutos: number;
  productoDetalle: IArticuloManufacturadoDetalle[];
}

export default IArticuloManufacturado;

 