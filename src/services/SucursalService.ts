import SucursalPost from "../types/Dtos/SucursalPost";
import ISucursales from "../types/Sucursales";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class SucursalService extends BackendClient<ISucursales | SucursalPost> {
}