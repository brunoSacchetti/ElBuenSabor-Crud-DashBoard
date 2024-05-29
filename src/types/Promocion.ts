import ArticuloInsumo from "./ArticuloInsumo";
import { Base } from "./Base";
import Imagenes from "./Imagenes";

interface IPromocion extends Base<IPromocion>{
  id: number;
  denominacion: string;
  fechaDesde: string;
  fechaHasta: string;
  horaDesde: string;
  horaHasta: string;
  descripcionDescuento: string;
  precioPromocional: number;
  tipoPromocion: string;
  idSucursales: number[];
  detalles: {
      cantidad: number;
      idArticulo: number;
  }[];
  imagenes?: Imagenes[];
  }

  export default IPromocion;