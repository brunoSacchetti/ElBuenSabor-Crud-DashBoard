import IDomicilio from "./Domicilio";

interface ISucursales extends Base<ISucursales> {

  nombre:string;
  horarioApertura:string;
  horarioCierre:string;
  domicilio:IDomicilio;
}

export default ISucursales;