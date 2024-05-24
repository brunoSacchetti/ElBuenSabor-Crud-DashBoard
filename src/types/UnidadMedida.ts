import { Base } from "./Base";

interface IUnidadMedida extends Base<IUnidadMedida> {
  denominacion: string;
}

export default IUnidadMedida;