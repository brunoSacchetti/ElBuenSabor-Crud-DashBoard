
import IUnidadMedida from "../types/UnidadMedida";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class UnidadMedidaGetService extends BackendClient<IUnidadMedida > {
}