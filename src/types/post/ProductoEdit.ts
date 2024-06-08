import IImagen from "../IImagen";
import ProductoDetalleEdit from "./ProductoDetalleEdit";
import ProductoDetallePost from "./ProductoDetallePost";

export default interface ProductoEdit {
    id:number,
    descripcion: string;
    tiempoEstimadoMinutos: number;
    precioVenta: number
    preparacion: string;
    articuloManufacturadoDetalles: ProductoDetallePost[] | ProductoDetalleEdit[];
    imagenes?: IImagen[];
}