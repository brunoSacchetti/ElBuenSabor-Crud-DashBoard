import ArticuloInsumo from "./ArticuloInsumo";
import { Base } from "./Base";

interface IArticuloManufacturadoDetalle extends Base<IArticuloManufacturadoDetalle> {
    cantidad: number | string;
    articuloInsumo: ArticuloInsumo;
}

export default IArticuloManufacturadoDetalle;