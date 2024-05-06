import Localidad from "./Localidad"
import Pais from "./Pais"
interface IProvincia extends Base<IProvincia> {
  nombre:string;
  //localidad: Localidad[];
  pais: Pais;

}

export default IProvincia;