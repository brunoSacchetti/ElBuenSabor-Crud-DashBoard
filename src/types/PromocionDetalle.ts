import IArticuloInsumo from "./ArticuloInsumo";
import IArticuloManufacturado from "./ArticuloManufacturado";
import { Base } from "./Base";

export default interface IPromocionDetalle extends Base<IPromocionDetalle>{
    cantidad: number;
    articulo: IArticuloInsumo | IArticuloManufacturado;
}