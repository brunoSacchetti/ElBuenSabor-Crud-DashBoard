import IImagenes from "./Imagenes";
import UnidadMedida from "./UnidadMedida"
interface IArticuloInsumo extends Base<IArticuloInsumo> {
  id:number;
  denominacion: string;
  precioVenta: number;
  imagenes: IImagenes[];
  unidadMedida: UnidadMedida;
  precioCompra: number;
  stockActual: number;
  stockMaximo: number;
  esParaElaborar: boolean; //como casaMatriz
}

export default IArticuloInsumo;