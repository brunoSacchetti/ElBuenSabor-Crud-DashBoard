import { Base } from "../../Base";

export interface CategoriaDto extends Base<CategoriaDto> {
    denominacion: string; 
    esInsumo:boolean;
    subCategoria: CategoriaDto[] | null;
}
  