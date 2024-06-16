import LocalidadDto from "../Localidad/LocalidadDto";

export default interface DomicilioDto {
    calle: string;
    numero: number;
    cp: number;
    piso: number;
    nroDpto: number;
    localidad: LocalidadDto;
}