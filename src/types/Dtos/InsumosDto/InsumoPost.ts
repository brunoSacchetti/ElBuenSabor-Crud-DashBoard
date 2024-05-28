export default interface InsumoPost{
  id: number;
  denominacion: string;
  precioVenta: number;
  idUnidadMedida: number;
  precioCompra:number;
  stockActual: number;
  stockMaximo: number;
  stockMinimo:number;
  esParaElaborar: boolean;
}