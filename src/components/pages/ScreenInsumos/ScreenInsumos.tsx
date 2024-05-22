import { useEffect, useState } from "react";

import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";


import IArticuloInsumo from "../../../types/ArticuloInsumo";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";
import { ModalArticuloInsumo } from "../../ui/modals/ModalArticuloInsumo/ModalArticuloInsumo";


// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenInsumos = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  
  const insumosService = new ArticuloInsumoService(API_URL + "/ArticuloInsumo");
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableEmpresa = [
    {
      label: "ID",
      key: "id",
      render: (insumos: IArticuloInsumo) => (insumos?.id ? insumos.id : 0),
    },
    { label: "Nombre", key: "denominacion" },
    { label: "Precio Venta", key: "precioVenta" },
    {
      label: "Precio Compra",
      key: "precioCompra",
    },
    {
      label:"Para Elaborar",
      key:"esParaElaborar",
      render: (insumos: IArticuloInsumo) => (insumos?.esParaElaborar ? "Si" : "No"),
    },
    { label: "Acciones", key: "acciones" },
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
        // Eliminar la persona si se confirma
        insumosService.delete(id).then(() => {
          getInsumos();
        });
      }
    });
  };
  // Función para obtener las personas
  const getInsumos = async () => {
    await insumosService.getAll().then((insumosData) => {
      dispatch(setDataTable(insumosData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getInsumos();
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
          {/* Botón para abrir el modal de agregar persona */}
          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="contained"
          >
            Agregar
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
          <TableGeneric<IArticuloInsumo>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalArticuloInsumo
        getInsumos={getInsumos}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
