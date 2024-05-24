import { Base } from "./Base";
import IDomicilio from "./Domicilio";
import IEmpresa from "./Empresa";

interface ISucursales extends Base<ISucursales> {

  nombre:string;
  horarioApertura:string;
  horarioCierre:string;
  empresa: IEmpresa;
  domicilio:IDomicilio;
  esCasaMatriz: boolean;
}

export default ISucursales;