import IArticuloInsumo from "../types/ArticuloInsumo";
import InsumoPost from "../types/Dtos/InsumosDto/InsumoPost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ArticuloInsumoService extends BackendClient<IArticuloInsumo | InsumoPost> {


}