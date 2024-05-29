import { ICategoria } from "../types/Categoria";
import { CategoriaDto } from "../types/Dtos/CategoriaDto/CategoriaDto";
import { CategoriaPost } from "../types/Dtos/CategoriaDto/CateogoriaPost";
import { BackendClient } from "./BackendClient";

export class CategoriaService extends BackendClient<ICategoria> {


    async addArticuloManufacturado(idCategoria: number, idArticulo: number): Promise<ICategoria> {
        const response = await fetch(`${this.baseUrl}/addArticuloManufacturado/${idCategoria}/${idArticulo}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        return data as ICategoria;
      }

      async deleteArticuloManufacturado(idCategoria: number | string, idArticulo: number | string): Promise<void> {
        const response = await fetch(`${this.baseUrl}/addArticuloManufacturado/${idCategoria}/${idArticulo}`, {
          method: "DELETE",
          
        });
        if (!response.ok) {
          throw new Error(`Error al eliminar el artículo manufacturado con ID ${idArticulo} de la categoría con ID ${idCategoria}`);
        }
      }

      async addInsumoToCategoria(idCategoria: number, idInsumo: number): Promise<ICategoria> {
        const response = await fetch(`${this.baseUrl}/addInsumo/${idCategoria}/${idInsumo}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data as ICategoria;
    }
}
