
interface IEmpleadoPost {
  id:number;
  //eliminado: boolean;
  nombre:string;
  apellido:string;
  telefono:string;
  email:string;
  rol:string;
  fechaNacimiento:string;
  idSucursal: number;
}

export default IEmpleadoPost;
