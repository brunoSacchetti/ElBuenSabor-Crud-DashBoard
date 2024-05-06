import ArticuloInsumo from "./ArticuloInsumo";

interface IArticuloManufacturadoDetalle extends Base<IArticuloManufacturadoDetalle> {
    cantidad: number;
    articuloInsumo: ArticuloInsumo;
}

export default IArticuloManufacturadoDetalle;