import IArticuloManufacturado from "../types/ArticuloManufacturado";
import { BackendClient } from "./BackendClient";

export class ProductoGet extends BackendClient<IArticuloManufacturado> {}