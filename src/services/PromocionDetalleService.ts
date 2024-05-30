import PromocionDetallePost from "../types/Dtos/PromocionDto/PromocionDetallePost";
import PromocionPostDto from "../types/Dtos/PromocionDto/PromocionPostDto";
import IPromocion from "../types/Promocion";
import IPromocionDetalle from "../types/PromocionDetalle";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class PromocionDetalleService extends BackendClient<PromocionDetallePost | IPromocionDetalle> {


}