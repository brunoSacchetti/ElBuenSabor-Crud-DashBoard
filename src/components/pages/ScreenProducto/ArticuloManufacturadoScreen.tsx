import { useEffect, useState } from "react";
import { NavBar } from "../../ui/NavBar/NavBar";
import { TableGeneric } from "../../ui/TableScreenProducto/TableGeneric";
import { ArticuloManufacturadoService } from "../../../services/ArticuloManufacturadoService";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { removeElementActive, setDataTable } from "../../../redux/slices/TablaProductoReducer";
import { Button, CircularProgress, styled } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

import { CategoriaService } from "../../../services/CategoriaService";
import { ICategoria } from "../../../types/Categoria";
import IArticuloManufacturado from "../../../types/ArticuloManufacturado";
import { PruebaModal2 } from "../../ui/modals/PruebaManufacturadoModal2/PruebaModal2";
import { SucursalService } from "../../../services/SucursalService";
import ProductoPost from "../../../types/post/ProductoPost";


import { useDispatch } from "react-redux";
// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

const StyledButton = styled(Button)({
  backgroundColor: '#607d8b', // Gris
  color: 'white',
  fontFamily: 'Arial, sans-serif',
  fontSize: '16px',
  padding: '10px 20px',
  textTransform: 'none',
  '&:hover': {
    backgroundColor: '#455a64', // Gris más oscuro
  },
});

const ColumnsProductosManufacturados = (categorias: ICategoria[]) => [
  { label: "Id", key: "id" },
  { label: "Nombre", key: "denominacion" },
  { 
    label: "Categoria", 
    key: "categoria",
    render: (element: IArticuloManufacturado) => {
      // Buscar la categoría correspondiente al artículo manufacturado
      const categoria = categorias.find(cat =>
        cat.articulosManufacturados.some((am: IArticuloManufacturado) => am.id === element.id)
      );
      return categoria ? categoria.denominacion : 'Categoría no encontrada';
    },
  },
  {
    label: "Tiempo de cocina",
    key: "tiempoEstimadoMinutos",
  },
  {
    label: "Habilitado",
    key: "eliminado",
    render: (element: IArticuloManufacturado) => (element.eliminado ? "Si" : "No"),
  },
  {
    label: "Precio",
    key: "precioVenta",
  },
  {
    label: "Acciones",
    key: "actions",
  },
];

export const ArticuloManufacturadoScreen = () => {
  // manejo de estado del modal
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setOpenModal(false);
    dispatch(removeElementActive()); // al cerrar el modal siempre reseteamos el elemento activo
  };

  // instanciamos el loader de la carga de datos
  const [loading, setLoading] = useState<boolean>(true);

  // useState para categorias
  const [categorias, setCategorias] = useState<ICategoria[]>([]);

  // instanciamos el dispatch

  //obtenemos la sucursal actual
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  // #region SERVICIOS
  const productoManufacturadoService = new ArticuloManufacturadoService(
    `${API_URL}/ArticuloManufacturado`
  );

  const categoriaService = new CategoriaService(`${API_URL}/categoria`);
  
  const sucursalService = new SucursalService(`${API_URL}/sucursal`);

  // Función para obtener las categorías
  /* const fetchCategorias = async () => {
    if (!sucursalActual) {
      console.error("Error: sucursalActual is null");
      return; // Return early if sucursalActual is null
    }
  
    setLoading(true);
    try {
      const data = await sucursalService.getCategoriasPorSucursal(sucursalActual?.id);
      setCategorias(data);
    } catch (error) {
      console.error("Error fetching categorias:", error);
      // Handle the error, display a message, or retry fetching categories
    } finally {
      setLoading(false);
    }
  }; */

  const fetchCategorias = async () => {
    try {
      const data = await categoriaService.getAll();
      setCategorias(data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  // Función para obtener los productos manufacturados
  const getDataTable = (dispatch: any) => {
  productoManufacturadoService.getAll().then(dataTable => {
    const filteredArticulos = dataTable.filter((item) =>
      categorias.some(cat =>
        cat.articulosManufacturados.some((am: IArticuloManufacturado) => am.id === item.id)
      )
    );
    const productoPosts = filteredArticulos.map((item) => item as IArticuloManufacturado);
    dispatch(setDataTable(productoPosts));
  });
};


const dispatch = useDispatch();

getDataTable(dispatch); 



  // Efecto para cargar los datos al inicio
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchCategorias(), getDataTable(dispatch)]);
      setLoading(false);
    };
    fetchData();
  }, [sucursalActual]);

  // Función para recargar datos (categorías y productos)
  const reloadData = async () => {
    setLoading(true);
    await Promise.all([fetchCategorias(), getDataTable(dispatch)]);
    setLoading(false);
  };


  // función para eliminar un elemento
  const handleDelete = async (id: number | string) => {
    await productoManufacturadoService.delete(id);
    dispatch(removeElementActive());
    reloadData();
  };

  // función para dar de baja o alta un elemento
  const handleCancelOrRegister = async (
    id: number | string,
    data: IArticuloManufacturado
  ) => {
    await productoManufacturadoService.put(id, data);
    dispatch(removeElementActive());
    reloadData();
  };

  return (
    <div>
      <div
        style={{
          height: "6vh",
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "20%",
            padding: ".4rem",
          }}
        >
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Añadir Producto
          </Button>
        </div>
      </div>

      {!loading ? (
        <TableGeneric<IArticuloManufacturado>
          handleDelete={handleDelete}
          columns={ColumnsProductosManufacturados(categorias)}
          setOpenModal={setOpenModal}
          handleCancelOrRegister={handleCancelOrRegister}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <PruebaModal2         
        getData={reloadData}
        open={openModal}
        handleClose={handleCloseModal}
      />
    </div>
  );
};
