export default interface PromocionEditDto{
    id:number;
    fechaDesde: string;
    fechaHasta: string;
    horaDesde:string;
    horaHasta:string;
    precioPromocional: number;
    detalles: {
        cantidad: number,
        idArticulo: number,
    }[];
}