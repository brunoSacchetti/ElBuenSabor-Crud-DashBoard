import SucursalPost from "../types/Dtos/SucursalDto/SucursalPost";
import SucursalPut from "../types/Dtos/SucursalDto/SucursalPut";
import ISucursales from "../types/Sucursales";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class SucursalService extends BackendClient<SucursalPost | SucursalPut> {
}