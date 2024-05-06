import Domicilio from "./Domicilio"
import Provincia from "./Provincia"

interface ILocalidad extends Base<ILocalidad> {
  nombre:string;
  //domicilio: Domicilio[];
  provincia: Provincia;
}

export default ILocalidad;