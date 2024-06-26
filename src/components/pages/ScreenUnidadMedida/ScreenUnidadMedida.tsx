import { useEffect, useState } from "react";

import { TableGenericUnidadMedida } from "../../ui/TableUnidadMedida/TableGenericUnidadMedida";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

//Importamos Unidad de medida y su service
import IUnidadMedida from "../../../types/UnidadMedida";
import { UnidadMedidaService } from "../../../services/UnidadMedidaService";
import { ModalUnidadMedida } from "../../ui/modals/ModalUnidadMedida/ModalUnidadMedida";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenUnidadMedida = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const unidadMedidaService = new UnidadMedidaService(API_URL + "/UnidadMedida");
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableUnidadMedida = [

    { label: "Denominacion", key: "denominacion" },
    {
      label: "Habilitado",
      key: "habilitado",
      render: (element: IUnidadMedida) => (element.eliminado  ? "No" : "Si"),
    },
    { label: "Acciones", key: "acciones" },
    
  ];

  // Función para manejar el borrado de una persona
  const handleDelete = async (id: number) => {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: "¿Estás seguro?",
      text: "¿Seguro que quieres habilitar/deshabilitar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la persona si se confirma
        unidadMedidaService.changeEliminado(id).then(() => {
          getUnidadMedida();
        });
      }
    });
  };


  /* const getUnidadMedida = async () => {
    await unidadMedidaService.getAll().then((unidadData) => {
      const data = unidadData as IUnidadMedida[];
      // Filter out the units where eliminado is true
      const filteredData = data.filter((unidad: IUnidadMedida) => !unidad.eliminado);
      dispatch(setDataTable(filteredData));
      setLoading(false);
    });
  }; */
  const getUnidadMedida = async () => {
    await unidadMedidaService.getAllIncludingDeleted().then((unidadData) => {
      const data = unidadData as IUnidadMedida[];
      // Filter out the units where eliminado is true
      /* const filteredData = data.filter((unidad: IUnidadMedida) => !unidad.eliminado); */
      dispatch(setDataTable(data));
      setLoading(false);
    });
  }; 
  
  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getUnidadMedida();
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
            Agregar Unidad de Medida
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
          <TableGenericUnidadMedida<IUnidadMedida>
            handleDelete={handleDelete}
            columns={ColumnsTableUnidadMedida}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalUnidadMedida
        getUnidadMedida={getUnidadMedida}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
