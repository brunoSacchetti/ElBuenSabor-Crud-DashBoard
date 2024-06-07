import IImagen from "../types/IImagen";
import { AbstractBackendClient } from "./AbstractBackendClient";

export abstract class BackendClient<T> extends AbstractBackendClient<T> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getAll(): Promise<T[]> {
    const response = await fetch(`${this.baseUrl}`);
    const data = await response.json();
    return data as T[];
  }

  /* async getById(id: number): Promise<T | null> {
    const response = await fetch(`${this.baseUrl}/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data as T;
  } */

  async getById(id: number| string): Promise<T | null> {
    const url = `${this.baseUrl}/${id}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        return null;
      }
  
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error(`Error al obtener el elemento con ID ${id}:`, error);
      throw error;
    }
  }


  async changeHabilitado(id: number | string): Promise<void> {
    const url = `${this.baseUrl}/changeHabilitado/${id}`;
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        throw new Error(`Error al cambiar el estado del recurso con ID ${id}`);
      }
  
      // Si necesitas manejar alguna respuesta desde el servidor, puedes hacerlo aquí.
      // const responseData = await response.json();
    } catch (error) {
      console.error(`Error al cambiar el estado del recurso con ID ${id}:`, error);
      throw error;
    }
  }

  async post(url: string, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as T;
  }
  async postOnlyData(data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as T;
  }

  async put(id: number | string, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const newData = await response.json();
    return newData as T;
  }

  /* async put(url: string, id: string, data: T): Promise<T> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    console.log(url);
    
    const newData = await response.json();
    return newData as T;
  } */

  // Método para eliminar un elemento por su ID
  async delete(id: number | string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el elemento con ID ${id}`);
    }
  }
}
