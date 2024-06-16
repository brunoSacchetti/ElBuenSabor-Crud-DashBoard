import IArticuloInsumo from "../../ArticuloInsumo";
import IArticuloManufacturado from "../../ArticuloManufacturado";
import { Base } from "../../Base";

export interface DetallePedido extends Base<DetallePedido> {
    cantidad: number;
    subtotal: number;
    insumos: IArticuloInsumo;
    manufacturado: IArticuloManufacturado;
}