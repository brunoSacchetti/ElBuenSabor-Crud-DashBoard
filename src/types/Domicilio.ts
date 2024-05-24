import { Base } from "./Base";
import Localidad from "./Localidad"

interface IDomicilio extends Base<IDomicilio> {
  calle:string;
  numero:number;
  codigoPostal:number;
  localidad: Localidad;
}

export default IDomicilio;