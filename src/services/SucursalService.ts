import { ICategoria } from "../types/Categoria";
import SucursalPost from "../types/Dtos/SucursalDto/SucursalPost";
import SucursalPut from "../types/Dtos/SucursalDto/SucursalPut";
import ISucursales from "../types/Sucursales";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class SucursalService extends BackendClient<SucursalPost | SucursalPut> {
    async getCategoriasPorSucursal(idSucursal: number): Promise<ICategoria[]> {
        const url = `${this.baseUrl}/getCategorias/${idSucursal}`;
        
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`Error al obtener las categorías para la sucursal con ID ${idSucursal}`);
          }
    
          const data = await response.json();
          return data as ICategoria[];
        } catch (error) {
          console.error(`Error al obtener las categorías para la sucursal con ID ${idSucursal}:`, error);
          throw error;
        }
      }
}