import React, { useEffect, useState } from "react";
import {
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import Swal from "sweetalert2";
import { ModalCategoria } from "../../ui/modals/ModalCategoria/ModalCategoria";
import { CategoriaService } from "../../../services/CategoriaService";
import { setCategoriaData, setCategoriaPadreId } from "../../../redux/slices/CategoriaReducer";
import { ICategoria } from "../../../types/Categoria";
import { AccordionCategoria } from "../../ui/AccordionCategoria/AccordionCategoria";
import { SucursalService } from "../../../services/SucursalService";
import { ModalEditCategoria } from "../../ui/modals/ModalCategoria/ModalEditCategoria";

const API_URL = import.meta.env.VITE_API_URL;

export const ScreenCategorias = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [categoriaEdit, setCategoriaEdit] = useState<ICategoria | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategorias, setFilteredCategorias] = useState<ICategoria[]>([]);

  const categoriaService = new CategoriaService(API_URL + "/categoria");
  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const dispatch = useAppDispatch();
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  const handleDelete = async (id: number) => {
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
        categoriaService.changeEliminado(id).then(() => {
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
      const processedData = processCategorias(categoriaData);
      dispatch(setCategoriaData(processedData));
      setCategorias(processedData);
      setFilteredCategorias(processedData); // Actualiza el estado inicial de filteredCategorias
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  // Método para procesar las categorías e insumos y asegurar la estructura correcta
  const processCategorias = (data: ICategoria[]): ICategoria[] => {
    // Obtener solo las categorías principales (categorías que no son subcategorías de otras)
    const categoriaIds = new Set(data.flatMap(categoria => categoria.subCategorias?.map((subcategoria:any) => subcategoria.id) || []));
  
    const filteredData = data.filter(categoria => !categoriaIds.has(categoria.id));
  
    return filteredData;
  };

  useEffect(() => {
    if (sucursalActual) {
      setLoading(true);
      getCategorias();
    }
  }, [sucursalActual]);

  const [isAddingSubcategoria, setIsAddingSubcategoria] = useState(false);
  const handleAddSubcategoria = (parentId: number | null) => {
    if (parentId !== null) {
      dispatch(setCategoriaPadreId(parentId));
    }
    setIsAddingSubcategoria(true);
    setOpenModal(true);
  };

  const  handleEditCategoria = async (id: number)  => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      setLoading(false);
      return;
    }
    const categoriaData = await sucursalService.getCategoriasPorSucursal(sucursalActual.id);
  
    const categoria = categoriaData.find(c => c.id === id);
 
    
    if (categoria) {
      setCategoriaEdit(categoria);
      setOpenEditModal(true);
    } else {
      console.error(`No se encontró la categoría con ID ${id}`);
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredCategorias(categorias.filter(categoria => categoria.denominacion.toLowerCase().includes(term)));
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
            style={{ textAlign: "center", alignContent: "center", alignItems: "center", justifyContent: "center", display: "flex", paddingRight: "40%" }}
          >
            Categorías
          </Typography>
          <TextField
            label="Buscar Categoría"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            style={{ marginRight: "1rem" }}
          />
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
          categories={filteredCategorias} // Utiliza filteredCategorias aquí
          onEdit={handleEditCategoria} 
          onAddSubcategoria={handleAddSubcategoria} 
          onDelete={handleDelete} 
        />
        )}
      </div>
  
      <ModalCategoria
        getCategorias={getCategorias}
        openModal={openModal}
        setOpenModal={setOpenModal}
        isAddingSubcategoria={isAddingSubcategoria}
        setIsAddingSubcategoria={setIsAddingSubcategoria}
      />
      <ModalEditCategoria
        getCategorias={getCategorias}
        categoriaEdit={categoriaEdit}
        openEditModal={openEditModal}
        setOpenEditModal={setOpenEditModal}
      />
    </>
  );  
};
