import Sucursales from "./Sucursales"

interface IEmpresa extends Base<IEmpresa> {
 nombre:string; 
 razonSocial:string;
 cuil:number;
 sucursales: Sucursales[];
}

export default IEmpresa;