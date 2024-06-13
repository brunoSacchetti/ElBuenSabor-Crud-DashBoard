import IEmpresa from "../types/Empresa";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class EmpresaService extends BackendClient<IEmpresa> {

    
  async getEmpresaSucursales(idEmpresa: number): Promise<IEmpresa> {
    const url = `${this.baseUrl}/empresa/sucursales/${idEmpresa}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al obtener la empresa con sucursales para el ID ${idEmpresa}`);
      }

      const empresaConSucursales = await response.json();
      return empresaConSucursales;
    } catch (error) {
      console.error(`Error al obtener la empresa con sucursales para el ID ${idEmpresa}:`, error);
      throw error;
    }
  }
  async getImagesByEmpresaId(id: number | string): Promise<any> {
        const url = `${this.baseUrl}/getImagesByEmpresaId/${id}`;
    
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error(`Error al obtener las imágenes de la empresa con ID ${id}`);
          }
    
          const imageData = await response.json();
          return imageData;
        } catch (error) {
          console.error(`Error al obtener las imágenes de la empresa con ID ${id}:`, error);
          throw error;
        }
      }

}