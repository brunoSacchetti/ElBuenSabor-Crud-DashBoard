import IEmpresa from "../types/Empresa";
import IImagen from "../types/IImagen";
import { BackendClient } from "./BackendClient";

// Clase PersonaService que extiende BackendClient para interactuar con la API de personas
export class ImagenService extends BackendClient<IImagen> {
    async uploadImages(url: string, formData: FormData): Promise<any> {
      try {
        const response = await fetch(url, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error(`Error al subir las imágenes. Status: ${response.status}`);
        }
  
        const data = await response.json();
        return data as IImagen[];
      } catch (error) {
        console.error('Error al subir las imágenes:', error);
        throw error;
      }
    }

    async getImagesByArticuloId(id: number): Promise<IImagen[]> {
      const response = await fetch(`${this.baseUrl}/getImagesByArticuloId/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al obtener las imágenes del artículo con ID ${id}`);
      }
  
      const data = await response.json();
      return data as IImagen[];
    }

    async deleteImage(publicId: string, id: number) {
      const response = await fetch(`${this.baseUrl}/${publicId}/imagenes/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          // Aquí puedes agregar cualquier encabezado necesario, como tokens de autenticación, etc.
        },
      });
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }
      return response.json(); // Podrías devolver algún tipo de mensaje de confirmación si lo deseas
    }
  }

