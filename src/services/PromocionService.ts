import PromocionPostDto from "../types/Dtos/PromocionDto/PromocionPostDto";
import IPromocion from "../types/Promocion";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class PromocionService extends BackendClient<IPromocion | PromocionPostDto> {


}