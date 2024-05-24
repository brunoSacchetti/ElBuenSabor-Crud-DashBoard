import { Base } from "./Base";
import IUnidadMedida from "./UnidadMedida";

export default interface IArticulo extends Base<IArticulo>{
  denominacion: string;
  precioVenta: number;
  unidadMedida: IUnidadMedida;
  idCategoria: number;
}