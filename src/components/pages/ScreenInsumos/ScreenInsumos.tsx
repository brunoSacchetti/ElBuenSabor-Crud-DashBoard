import { useEffect, useState } from "react";
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import IArticuloInsumo from "../../../types/ArticuloInsumo";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";
import { ModalArticuloInsumo } from "../../ui/modals/ModalArticuloInsumo/ModalArticuloInsumo";
import { ModalArticuloInsumoEdit } from "../../ui/modals/ModalArticuloInsumo/ModalArticuloInsumoEdit";
import { SucursalService } from "../../../services/SucursalService";
import { setCategoriaData } from "../../../redux/slices/CategoriaReducer";
import { ICategoria } from "../../../types/Categoria";
import { CategoriaService } from "../../../services/CategoriaService";
import InsumoEditDto from "../../../types/Dtos/InsumosDto/InsumoEditDto";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenInsumos = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingArticulo, setEditingArticulo] = useState<InsumoEditDto | undefined>(); // Permitir undefined

  const insumosService = new ArticuloInsumoService(API_URL + "/ArticuloInsumo");
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const dispatch = useAppDispatch();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  
  const ColumnsTableInsumo = [
    {
      label: "ID",
      key: "id",
      render: (insumos: IArticuloInsumo) => (insumos?.id ? insumos.id : 0),
    },
    { label: "Nombre", key: "denominacion" },
    { label: "Precio Venta", key: "precioVenta" },
    {
      label: "Precio Compra",
      key: "precioCompra",
    },
    {
      label: "Para Elaborar",
      key: "esParaElaborar",
      render: (insumos: IArticuloInsumo) => (insumos?.esParaElaborar ? "Si" : "No"),
    },
    {
      label: "Acciones",
      key: "acciones",
      render: (insumos: IArticuloInsumo) => (
        <div>
          <Button onClick={() => handleEdit(insumos)} variant="contained" color="primary">
            Editar
          </Button>
          <Button onClick={() => handleDelete(insumos.id)} variant="contained" color="secondary">
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

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
        insumosService.changeHabilitado(id).then(() => {
          setInsumoXCategoria((prevInsumos) => prevInsumos.filter((insumo) => insumo.id !== id));
          dispatch(setDataTable(insumosXCategoria.filter((insumo) => insumo.id !== id)));
        });
      }
    });
  };

  const handleEdit = (insumos: IArticuloInsumo) => {
    const { id, precioCompra,precioVenta, stockActual, stockMaximo, stockMinimo } = insumos;
    const insumoEdit: InsumoEditDto = {
      id: id,
      precioCompra: precioCompra || 0, 
      precioVenta:precioVenta || 0,
      stockActual: stockActual || 0,
      stockMaximo: stockMaximo || 0,
      stockMinimo: stockMinimo || 0,

    };
    setEditingArticulo(insumoEdit);
    setIsEditing(true);
    setOpenModal(true);
  };

  const [insumosXCategoria, setInsumoXCategoria] = useState<IArticuloInsumo[]>([]);

  const getInsumosCategoria = async () => {
    if (!sucursalActual) {
      console.error("Error al obtener categorias: sucursalActual es null");
      setLoading(false);
      return;
    }
  
    try {
      const categoriasData = await sucursalService.getCategoriasPorSucursal(sucursalActual.id);
      const allInsumos = categoriasData.flatMap((categoria) => categoria.insumos);
      
      // Filtrar los insumos habilitados
      const insumosHabilitados = allInsumos.filter((insumo) => insumo.esHabilitado);
      
      console.log(insumosHabilitados);
      setInsumoXCategoria(insumosHabilitados);
      dispatch(setDataTable(insumosHabilitados));
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
      getInsumosCategoria();
    }
  }, [sucursalActual]);

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
          <Button
            onClick={() => {
              setIsEditing(false);
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
          <TableGeneric<IArticuloInsumo>
            handleDelete={handleDelete}
            columns={ColumnsTableInsumo}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      {isEditing ? (
        <ModalArticuloInsumoEdit
          openModal={openModal}
          setOpenModal={setOpenModal}
          articuloInsumo={editingArticulo} // Pasar el artículo a editar
        />
      ) : (
        <ModalArticuloInsumo
          categorias={categorias}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </>
  );
};
