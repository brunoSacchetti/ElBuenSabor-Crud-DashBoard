import { useEffect, useState } from "react";


import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import { EmpleadoService } from "../../../services/EmpleadoService";
import IEmpleado from "../../../types/Empleado";
import { TableEmpleadoGeneric } from "../../ui/TableEmpleado/TableEmpleadoGeneric";
import { ModalEmpleadoPrueba } from "../../ui/modals/ModalEmpleado/ModalEmpleadoPrueba";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenEmpleado = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  const empleadoService = new EmpleadoService(API_URL + "/empleado");

  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableEmpleado = [
    { label : "Nombre" , key: "nombre"},
    { label : "Apellido" , key: "apellido"},
    { label : "Rol", key:"rol"},
    { label : "Email", key:"email"},
    {label: "Habilitado",key:"eliminado",
    render: (element: IEmpleado) => (element.eliminado ? "No" : "Si" )
    },
    { label: "Acciones", key: "acciones" },
    //render de sucursal <-
  ];

  // Función para manejar el borrado de una persona
  const handleDelete = async (id: number) => {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: "¿Estas seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        empleadoService.changeEliminado(id).then(() => {
          getEmpleados();
        });
      }
    });
  };
  // Función para obtener las personas
  const getEmpleados = async () => {
    if (!sucursalActual) {
      console.error('No se ha seleccionado una sucursal.');
      return;
    }
  
    setLoading(true);
    try {
      const empleados = await empleadoService.findAllBySucursalId(sucursalActual.id);
      if (empleados.length === 0) {
        console.log('La sucursal no tiene empleados.');
        // Puedes manejar esta condición como desees, por ejemplo, mostrando un mensaje o realizando alguna acción específica.
      }
      dispatch(setDataTable(empleados));
      console.log(empleados);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getEmpleados();
  }, []);

  return (
    <>
      <div>
        <div
          style={{
            padding: ".4rem",
            display: "flex",
            justifyContent: "flex-end",
            width: "90%",
          }}
        >
          {/* Botón para abrir el modal de agregar unidad de medida */}
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="contained"
          >
            Agregar Empleado
          </Button>
        </div>
        {/* Mostrar indicador de carga mientras se cargan los datos */}
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              width: "100%",
              gap: "2vh",
              height: "100%",
            }}
          >
            <CircularProgress color="secondary" />
            <h2>Cargando...</h2>
          </div>
        ) : (
          // Mostrar la tabla de personas una vez que los datos se han cargado
          <TableEmpleadoGeneric<IEmpleado>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpleado}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      <ModalEmpleadoPrueba
        getEmpleados={getEmpleados}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
