import { useEffect, useState } from "react";
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress, Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import ISucursales from "../../../types/Sucursales";
import { SucursalService } from "../../../services/SucursalService";

import { useLocation, useNavigate } from "react-router-dom";
import { EmpresaService } from "../../../services/EmpresaService";

import { ModalSucursal } from "../../ui/modals/ModalSucursal/ModalSucursal";
import { setDataSucursales, setSucursalActual, setSucursalId } from "../../../redux/slices/SucursalReducer";
import { CardSucursal } from "../../ui/CardSucursal/CardSucursal";

const API_URL = import.meta.env.VITE_API_URL;

export const ScreenSucursales = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const empresa = useAppSelector((state) => state.empresa.empresaActual);

  const sucursales = useAppSelector((state) => state.sucursal.data);

  const location = useLocation();
  const empresaId = location.state?.empresaId;
  //const empresaId = useAppSelector((state) => state.empresa.empresaId);

  const sucursalService = new SucursalService(
    API_URL + "/sucursal"
  );
  const empresaService = new EmpresaService(
    API_URL + `/empresa/sucursales`
  )
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Columnas de la tabla de personas
  /* const ColumnsTableEmpresa = [
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
      render: (sucursal: ISucursales) => (
        <span>
          {sucursal.domicilio.calle} {sucursal.domicilio.numero},{" "}
          {sucursal.domicilio.localidad.nombre},{" "}
          {sucursal.domicilio.localidad.provincia.nombre}
        </span>
      ),
    },
    { label: "Acciones", key: "acciones" },
  ]; */

  // Función para manejar el borrado de una persona
  const handleDelete = async (id: number) => {
    // Mostrar confirmación antes de eliminar
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Seguro que quieres eliminar?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        // Eliminar la sucursal de la base de datos
        sucursalService.delete(id).then(() => {
          // Eliminar la sucursal del estado de las sucursales
          const updatedSucursales = sucursales.filter((sucursal) => sucursal.id !== id);
          dispatch(setDataSucursales(updatedSucursales));
        }).catch((error) => {
          console.error("Error eliminando la sucursal:", error);
          Swal.fire("Error", "No se pudo eliminar la sucursal. Por favor, intenta nuevamente.", "error");
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
      
      //dispatch(setDataTable(sucursalesEmpresa));
      dispatch(setDataSucursales(sucursalesEmpresa))
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getSucursalesEmpresa();
  }, [empresaId]);


  const handleEdit = (sucursal: ISucursales) => {
    dispatch(setSucursalActual(sucursal));
    setOpenModal(true);
  };

  const handleSelectSucursal = (id: number, sucursal: ISucursales) => {
    dispatch(setSucursalActual(sucursal));
    dispatch(setSucursalId(sucursal.id));
    navigate("/inicio", {state: {sucursalId: id}});
  };

  /* const handleSelectEmpresa = (id: number, empresa: IEmpresa) => {
    dispatch(setEmpresaId(id));
    dispatch(setEmpresaActual(empresa));
    navigate("/sucursales", { state: { empresaId: id } });
  }; */

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
          <Grid container spacing={2} style={{ padding: "20px" }}>
            {sucursales.map((sucursal: ISucursales) => (
              <Grid item key={sucursal.id} xs={12} sm={6} md={4}>
                <CardSucursal
                  sucursal={sucursal}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                  onSelect={handleSelectSucursal}
                />
              </Grid>
            ))}
          </Grid>
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
