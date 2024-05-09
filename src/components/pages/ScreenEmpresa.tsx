import { useEffect, useState } from "react";

import { TableGeneric } from "../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../hooks/redux";

import { setDataTable } from "../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

//Importamos IEmpresa y Empresa Service
import IEmpresa from "../../types/Empresa";
import { EmpresaService } from "../../services/EmpresaService";
import { ModalEmpresa } from "../ui/modals/ModalEmpresa/ModalEmpresa";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilLowVision } from "@coreui/icons";
import { Link } from "react-router-dom";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenEmpresa = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const empresaService = new EmpresaService(API_URL + "/empresas");
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTableEmpresa = [
    {
      label: "ID",
      key: "id",
      render: (empresa: IEmpresa) => (empresa?.id ? empresa.id : 0),
    },
    { label: "Nombre", key: "nombre" },
    { label: "Razon Social", key: "razonSocial" },
    {
      label: "Sucursales",
      key: "sucursales",
      render: (empresa:IEmpresa) => (
        <>
        {empresa.sucursales && empresa.sucursales.length > 0 ? (
          <Link to={`/empresas/${empresa.id}/sucursales`}>
          <Button variant="contained" color="success">
            <CIcon icon={cilLocationPin} />
          </Button>
          </Link>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => alert("No hay sucursales en esta empresa")}
          >
            <CIcon icon={cilLowVision} />
          </Button>
        )}
      </>
    ),
    },

    {
      label: "Cuil",
      key: "cuil",
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
        empresaService.delete(id).then(() => {
          getEmpresas();
        });
      }
    });
  };
  // Función para obtener las personas
  const getEmpresas = async () => {
    await empresaService.getAll().then((empresaData) => {
      dispatch(setDataTable(empresaData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getEmpresas();
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
          <TableGeneric<IEmpresa>
            handleDelete={handleDelete}
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {/* Modal para agregar o editar una persona */}
      <ModalEmpresa
        getEmpresa={getEmpresas}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
