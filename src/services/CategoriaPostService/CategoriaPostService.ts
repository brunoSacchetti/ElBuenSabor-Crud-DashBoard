import { CategoriaPost } from "../../types/Dtos/CategoriaDto/CateogoriaPost";
import { BackendClient } from "../BackendClient";


export class CategoriaPostService extends BackendClient<CategoriaPost> {

    constructor(baseUrl: string) {
        super(baseUrl);
    }
    
    async addSubCategoria(idCategoria: number | null, subCategoria: CategoriaPost): Promise<CategoriaPost> {
        try {
          const response = await fetch(`${this.baseUrl}/addSubCategoria/${idCategoria}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(subCategoria),
          });
      
          if (!response.ok) {
            throw new Error('Error al agregar subcategoría');
          }
      
          const newData = await response.json();
          return newData as CategoriaPost;
        } catch (error) {
          throw new Error(`Error en la solicitud`);
        }
      }
      

}
