import { Base } from "../../Base";

export interface CategoriaPost extends Base<CategoriaPost> {
    denominacion: string; 
    esInsumo:boolean;
    idSucursales?: number[]
}
