import IEmpleadoPost from "../types/Empleado";
import { BackendClient } from "./BackendClient";

export class EmpleadoService extends BackendClient<IEmpleadoPost> {

    async findAllBySucursalId(id: number): Promise<IEmpleadoPost[]> {
        const url = `${this.baseUrl}/sucursalEmpleado/${id}`;
    
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (!response.ok) {
            throw new Error('No se pudo obtener la lista de empleados');
          }
    
          const data = await response.json();
          return data as IEmpleadoPost[];
        } catch (error) {
          console.error(`Error al obtener empleados de la sucursal con ID ${id}:`, error);
          throw error;
        }
      }



}