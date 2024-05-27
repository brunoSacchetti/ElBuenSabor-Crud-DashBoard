import { Base } from "./Base";

export interface ICategoria extends Base<ICategoria> {
  denominacion: string; 
  esInsumo:boolean;
  subCategoria: ICategoria[] | null;
  idArticulos?:number
}
