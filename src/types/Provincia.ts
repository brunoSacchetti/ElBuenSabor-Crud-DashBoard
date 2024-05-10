

import Pais from "./Pais"
interface IProvincia extends Base<IProvincia> {
  nombre:string;
  pais: Pais;
}

export default IProvincia;