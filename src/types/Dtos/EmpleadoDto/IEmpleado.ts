import ISucursales from "../../Sucursales";

interface IEmpleado{
    id:number;
    nombre:string;
    apellido:string;
    telefono:string;
    email:string;
    rol:string;
    fechaNacimiento:string;
    sucursal: ISucursales;
  }
  
  export default IEmpleado;
  