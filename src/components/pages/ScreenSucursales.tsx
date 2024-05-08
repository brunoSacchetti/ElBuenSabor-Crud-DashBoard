import { useEffect, useState } from "react";
import { TableGeneric } from "../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../hooks/redux";
import { setDataTable } from "../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import ISucursales from "../../types/Sucursales";
import { SucursalService } from "../../services/SucursalService";

import { ModalSucursal } from "../ui/modals/SucursalModal/SucursalModal";
import { useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export const ScreenSucursales = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams(); 
  

  const sucursalService = new SucursalService(
    API_URL + `/empresas/${id}/sucursales`
  );
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableEmpresa = [
    {
      label: "ID",
      key: "id",
      render: (sucursal: ISucursales) => (sucursal?.id ? sucursal.id : 0),
    },
    { label: "Nombre", key: "nombre" },
    { label: "Horario de Apertura", key: "horarioApertura" },
    { label: "Horario de Cierre", key: "horarioCierre" },
    /* {
      label: "Dirección",
      key: "direccion",
      render: (sucursal:ISucursales) => (
        <span>
          {sucursal.domicilio.calle} {sucursal.domicilio.numero}, {sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}
        </span>
      ),
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
        sucursalService.delete(id).then(() => {
          getSucursales();
        });
      }
    });
  };
  // Función para obtener las personas
  const getSucursales = async () => {
    await sucursalService.getAll().then((sucursalData) => {
      dispatch(setDataTable(sucursalData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getSucursales();
  }, []);

  if (!id) {
    // Si empresaId es undefined, puedes manejarlo aquí, como redireccionar o mostrar un mensaje de error
    return <p>No se encontró el ID de la empresa.</p>;
  }

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
          <TableGeneric<ISucursales>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalSucursal
        empresaId={id}
        getSucursales={getSucursales}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
