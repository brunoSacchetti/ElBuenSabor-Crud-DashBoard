import { useEffect, useState } from "react";

import { Button, CircularProgress, Typography } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";


import Swal from "sweetalert2";

//Importamos IEmpresa y Empresa Service

import { ModalCategoria } from "../../ui/modals/ModalCategoria/ModalCategoria";

import { CategoriaService } from "../../../services/CategoriaService";
import { setCategoriaData, setCategoriaPadreId } from "../../../redux/slices/CategoriaReducer";
import { ICategoria } from "../../../types/Categoria";
import { AccordionCategoria } from "../../ui/AccordionCategoria/AccordionCategoria";
import { SucursalService } from "../../../services/SucursalService";
import { ModalEditCategoria } from "../../ui/modals/ModalCategoria/ModalEditCategoria";


// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenCategorias = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [,setSubcategoria] = useState<ICategoria>({ id: 0, eliminado: false, denominacion: '', esInsumo: false, subCategoria:[]});
  const [categoriaEdit, setCategoriaEdit] = useState<ICategoria | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
   

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const dispatch = useAppDispatch();

  //obtenemos la sucursal actual
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

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

  const getCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const categoriaData = await sucursalService.getCategoriasPorSucursal(sucursalActual.id);
      dispatch(setCategoriaData(categoriaData));
      setCategorias(categoriaData);
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (sucursalActual) {
      setLoading(true);
      getCategorias();
    }
  }, [sucursalActual]);

  const [isAddingSubcategoria, setIsAddingSubcategoria] = useState(false);
  const handleAddSubcategoria = (parentId: number | null) => {
    console.log(parentId);
    
    if (parentId !== null) {
      // Solo realiza el dispatch si parentId no es null (es una subcategoría)
      dispatch(setCategoriaPadreId(parentId));
    }
    setSubcategoria({ id: 0, eliminado: false, denominacion: '', esInsumo: false, subCategoria:[], parentId: parentId });
    setIsAddingSubcategoria(true);
    setOpenModal(true);
  };

  const handleEditCategoria = (categoria: ICategoria) => {
    setCategoriaEdit(categoria);
    setOpenEditModal(true);
  };


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
          <Typography
          variant="h4"
          component="h1"
          gutterBottom
          style={{ textAlign: "center", alignContent: "center", alignItems: "center", justifyContent: "center", display: "flex", paddingRight: "40%"}}
        >
          Categorías
        </Typography>

          <Button
            onClick={() => {
              setOpenModal(true);
            }}
            variant="contained"
          >
            Agregar
          </Button>
        </div>
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
        <AccordionCategoria 
          categories={categorias}
          onEdit={handleEditCategoria} 
          onAddSubcategoria={(parentId) => handleAddSubcategoria(parentId)} 
          onDelete={handleDelete} 
/>
      )}
      </div>

      {/* Modal para agregar o editar una categoría */}
      <ModalCategoria
        getCategorias={getCategorias}
        openModal={openModal}
        setOpenModal={setOpenModal}
        isAddingSubcategoria={isAddingSubcategoria} // pasa el nuevo estado como prop
        setIsAddingSubcategoria={setIsAddingSubcategoria}
      />
      {/* Modal de edición de categoría */}
      <ModalEditCategoria
        getCategorias={getCategorias}
        categoriaEdit={categoriaEdit}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
    </>
  );
};
