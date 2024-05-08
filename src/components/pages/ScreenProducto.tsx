import { useEffect, useState } from "react";

import { TableGeneric } from "../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../hooks/redux";

import { setDataTable } from "../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

//Importamos IEmpresa y Empresa Service
import IArticuloManufacturado from "../../types/ArticuloManufacturado";
import { ArticuloManufacturadoService } from "../../services/ArticuloManufacturadoService";
import { ModalArticuloManufacturado } from "../ui/modals/ModalArticuloManufacturado/ModalArticuloManufacturado";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenProducto = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const articuloManufacturadoService = new ArticuloManufacturadoService(API_URL + "/articulosManufacturados");
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableEmpresa = [
    {
      label: "ID",
      key: "id",
      render: (articuloManufacturado: IArticuloManufacturado) => (articuloManufacturado?.id ? articuloManufacturado.id : 0),
    },
    { label: "Denominacion", key: "denominacion" },
    { label: "Precio Venta", key: "precioVenta" },
    {
      label: "Descripcion",
      key: "descripcion",
    },
    {
      label: "Tiempo Estimado",
      key: "tiempoEstimadoMinutos",
    },
    /* {
      label: "Sucursal",
      key: "sucursalEmpresa", //OJITO  ABIERTO O CERRADO 
    }, */
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
        articuloManufacturadoService.delete(id).then(() => {
          getArticuloManufacturado();
        });
      }
    });
  };
  // Función para obtener las personas
  const getArticuloManufacturado = async () => {
    await articuloManufacturadoService.getAll().then((articuloManufacturadoData) => {
      dispatch(setDataTable(articuloManufacturadoData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getArticuloManufacturado();
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
            <span className="material-symbols-outlined">add</span>
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
          <TableGeneric<IArticuloManufacturado>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalArticuloManufacturado
        getArticuloManufacturado={getArticuloManufacturado}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
