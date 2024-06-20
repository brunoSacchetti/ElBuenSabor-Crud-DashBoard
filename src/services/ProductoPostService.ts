
import ProductoEdit from "../types/post/ProductoEdit";
import ProductoPost from "../types/post/ProductoPost";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ProductoPostService extends BackendClient<ProductoPost | ProductoEdit> {}
