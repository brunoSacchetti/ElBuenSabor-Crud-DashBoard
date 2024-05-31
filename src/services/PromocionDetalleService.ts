

import PromocionDetallePost from "../types/Dtos/PromocionDto/PromocionDetallePost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class PromocionDetalleService extends BackendClient<PromocionDetallePost | IPromocionDetalle> {}
