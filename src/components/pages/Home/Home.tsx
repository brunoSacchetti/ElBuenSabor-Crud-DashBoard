import { useEffect, useState } from "react";
import { CircularProgress, Button } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import { EmpresaService } from "../../../services/EmpresaService";
import { ModalEmpresa } from "../../ui/modals/ModalEmpresa/ModalEmpresa";
import { setEmpresaActual, setEmpresaId } from "../../../redux/slices/EmpresaReducer";
import { useNavigate } from "react-router-dom";
import { CardEmpresa } from "../../ui/CardEmpresa/CardEmpresa";
import IEmpresa from "../../../types/Empresa";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const Home = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const empresaService = new EmpresaService(API_URL + "/empresa");

  // Obtener los datos de la tabla del estado global
  const dataTable = useAppSelector((state) => state.tablaReducer.dataTable);

  // Función para manejar el borrado de una empresa
  const handleDelete = async (id: number) => {
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
        empresaService.changeEliminado(id).then(() => {
          getEmpresas();
        });
      }
    });
  };

  // Función para manejar la edición de una empresa
  const handleEdit = (empresa: IEmpresa) => {
    setOpenModal(true);
    dispatch(setEmpresaActual(empresa));
  };

  // Función para seleccionar una empresa
  const handleSelectEmpresa = (id: number, empresa: IEmpresa) => {
    dispatch(setEmpresaId(id));
    dispatch(setEmpresaActual(empresa));
    navigate("/sucursales", { state: { empresaId: id } });
  };

  // Función para obtener las empresas
  const getEmpresas = async () => {
    setLoading(true);
    const empresas = await empresaService.getAllIncludingDeleted();
  
    // Fetch images for each empresa
    const empresasWithImages = await Promise.all(empresas.map(async (empresa: IEmpresa) => {
      try {
        const images = await empresaService.getImagesByEmpresaId(empresa.id);
        return { ...empresa, imageUrl: images.length > 0 ? images[0].url : null };
      } catch (error) {
        console.error("Error fetching images:", error);
        return { ...empresa, imageUrl: null };
      }
    }));
  
    dispatch(setDataTable(empresasWithImages));
    setLoading(false);
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    getEmpresas();
  }, []);

  return (
    <>
      <div>
        <div
          style={{
            padding: "2rem",
            display: "flex",
            justifyContent: "flex-end",

          }}
        >
          <h2
            style={{
              flexGrow: 1,
              textAlign: "center",
              margin: 0,
              fontSize: "2.rem",
              color: "#333",
              fontWeight: "bold",
            }}
          >
            ¿Que Empresa desea elegir?
          </h2>
          <Button style={{width:'10%'}} onClick={() => setOpenModal(true)} variant="contained">
            Agregar Empresa
          </Button>
        </div>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4rem", justifyContent: "center" }}>
            {dataTable.map((empresa: IEmpresa) => (
              <CardEmpresa
                key={empresa.id}
                empresa={empresa}
                onDelete={handleDelete}
                onEdit={handleEdit}
                onSelect={handleSelectEmpresa}
                imageUrl={empresa.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
      <ModalEmpresa
        getEmpresa={getEmpresas}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};
