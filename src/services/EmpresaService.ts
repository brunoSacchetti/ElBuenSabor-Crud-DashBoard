import IEmpresa from "../types/Empresa";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class EmpresaService extends BackendClient<IEmpresa> {
}