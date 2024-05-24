import IArticulo from "./IArticulo";

interface IArticuloInsumo extends IArticulo {
  esParaElaborar: boolean;
}

export default IArticuloInsumo;