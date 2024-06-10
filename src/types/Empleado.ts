import { Base } from "./Base";



interface IEmpleadoPost {
  id:number;
  nombre:string;
  apellido:string;
  telefono:string;
  email:string;
  tipoEmpleado:string;
  fechaNacimiento:string;
  idSucursal: number;
}

export default IEmpleadoPost;
