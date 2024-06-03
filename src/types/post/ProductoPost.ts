import IImagen from "../IImagen";
import ProductoDetallePost from "./ProductoDetallePost";

export default interface ProductoPost {
  id:number,
  denominacion: string;
  descripcion: string;
  tiempoEstimadoMinutos: number;
  precioVenta: number
  preparacion: string;
  idUnidadMedida: number;
  //idsArticuloManufacturadoDetalles: number[];
  articuloManufacturadoDetalles: ProductoDetallePost[];
  idCategoria: number;
  imagenes?: IImagen[];
}