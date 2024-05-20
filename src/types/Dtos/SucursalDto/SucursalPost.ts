import DomicilioPost from "../DomicilioDto/DomicilioPost";

export default interface SucursalPost{
    id: number,
    nombre: string;
    horarioApertura: string; 
    horarioCierre: string; 
    esCasaMatriz: boolean;
    domicilio: DomicilioPost;
    idEmpresa: number | undefined;
}