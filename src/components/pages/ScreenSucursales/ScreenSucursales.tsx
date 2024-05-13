import { useEffect, useState } from "react";
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import ISucursales from "../../../types/Sucursales";
import { SucursalService } from "../../../services/SucursalService";


import { useLocation } from "react-router-dom";
import { EmpresaService } from "../../../services/EmpresaService";

import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";

const API_URL = import.meta.env.VITE_API_URL;

export const ScreenSucursales = () => {

  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const empresa = useAppSelector((state) => state.empresa.empresaActual);

  const location = useLocation();
  const empresaId = location.state?.empresaId;

  const sucursalService = new SucursalService(
    API_URL + "/sucursales"
  );
  const empresaService = new EmpresaService(
    API_URL + `/empresas`
  )
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
    {
      label: "Dirección",
      key: "direccion",
      render: (sucursal:ISucursales) => (
        <span>
          {sucursal.domicilio.calle} {sucursal.domicilio.numero}, {sucursal.domicilio.localidad.nombre}, {sucursal.domicilio.localidad.provincia.nombre}
        </span>
      ),
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
        // Eliminar la sucursal de la base de datos
        sucursalService.delete(id).then(() => {
          // Eliminar la sucursal del estado local de la empresa
          const updatedSucursales = empresa ? empresa.sucursales.filter(sucursal => sucursal.id !== id) : [];
        dispatch(setDataTable(updatedSucursales));
        });
      }
    });
  };
  // Función para obtener las personas
  const getSucursalesEmpresa  = async () => {
    await empresaService.getById(empresaId).then((empresaData) => {
      const empresaSeleccionada = empresaData;
      const sucursalesEmpresa = empresaSeleccionada ? empresaSeleccionada.sucursales : [];
      console.log(sucursalesEmpresa);
      
      dispatch(setDataTable(sucursalesEmpresa));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getSucursalesEmpresa();
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
          <TableGeneric<ISucursales>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalSucursal
        empresaId={empresa ? empresa.id : undefined}
        getSucursales={getSucursalesEmpresa} 
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
