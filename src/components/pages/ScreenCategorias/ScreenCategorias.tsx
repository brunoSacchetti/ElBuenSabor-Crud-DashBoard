import { useEffect, useState } from "react";

import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

//Importamos IEmpresa y Empresa Service
import IEmpresa from "../../../types/Empresa";
import { EmpresaService } from "../../../services/EmpresaService";
import { ModalCategoria } from "../../ui/modals/ModalCategoria/ModalCategoria";
import CIcon from "@coreui/icons-react";
import { cilLocationPin, cilLowVision } from "@coreui/icons";
import { Link } from "react-router-dom";
import { CategoriaService } from "../../../services/CategoriaService";
import { setCategoriaData } from "../../../redux/slices/CategoriaReducer";
import { ICategoria } from "../../../types/Categoria";
import { AccordionCategoria } from "../../ui/AccordionCategoria/AccordionCategoria";
import { SucursalService } from "../../../services/SucursalService";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenCategorias = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const dispatch = useAppDispatch();

  //obtenemos el id de la sucursal actual
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalId);

  const sucursalCategoriaService = new SucursalService(API_URL + "/sucursal/getCategorias/{idSucursal}");

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
        categoriaService.delete(id).then(() => {
          getCategorias();
        });
      }
    });
  };

  // Función para obtener las categorías
  const getCategorias = async () => {
    await categoriaService.getAll().then((categoriaData) => {
      dispatch(setCategoriaData(categoriaData));
      setCategorias(categoriaData);
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getCategorias();
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
          {/* Botón para abrir el modal de agregar categoría */}
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
        {/* Aquí utilizamos el componente de acordeón para mostrar las categorías */}
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            width: '100%',
            gap: '2vh',
            height: '100%',
          }}
        >
          <CircularProgress color="secondary" />
          <h2>Cargando...</h2>
        </div>
      ) : (
        <AccordionCategoria categories={categorias} />
      )}
      </div>

      {/* Modal para agregar o editar una categoría */}
      <ModalCategoria
        getCategorias={getCategorias}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
