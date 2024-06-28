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
import { ICategoria } from "../../../types/Categoria";
import InsumoEditDto from "../../../types/Dtos/InsumosDto/InsumoEditDto";
import { Visibility, VisibilityOff } from "@mui/icons-material";

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
    { label: "Nombre", key: "denominacion" },
    { label: "Precio Venta", key: "precioVenta" },
    { label: "Precio Compra", key: "precioCompra",},
    { label: "Para Elaborar", key: "esParaElaborar",
      render: (insumos: IArticuloInsumo) => (insumos?.esParaElaborar ? "Si" : "No"),
    },
    { label: "Habilitado", key: "habilitado",
      render: (insumos: IArticuloInsumo) => (insumos?.habilitado ? "Si" : "No"),
    },
    {
      label: "Acciones",
      key: "acciones",
      render: (insumos: IArticuloInsumo) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around'}}>
          <Button 
            onClick={() => handleEdit(insumos)}  
            style={{ pointerEvents: !insumos.habilitado ? "none" : "auto", marginRight: '10px' }} 
            variant="contained" 
            color="primary"
          >
            <span className="material-symbols-outlined">edit</span>
          </Button>
          
          <Button 
            onClick={() => handleToggleEnable(insumos)} 
            style={{ borderRadius: '50px' }} 
            variant="contained" 
            color={insumos.habilitado ? "error" : "success"}
          >
            {insumos.habilitado ? (
              <>Deshabilitar <VisibilityOff style={{ marginLeft: '6px' }} /></>
            ) : (
              <>Habilitar <Visibility style={{ marginLeft: '6px' }} /></>
            )}
          </Button>
        </div>
      )
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
      const categoriasData = await sucursalService.getCategoriasPorSucursal(sucursalActual.id);
      const allInsumos = categoriasData.flatMap((categoria) => categoria.insumos);
      setCategorias(categoriasData);
      setInsumoXCategoria(allInsumos);
      dispatch(setDataTable(allInsumos));
    } catch (error) {
      console.error("Error al obtener categorias:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEnable = async (insumo: IArticuloInsumo) => {
    try {
      await insumosService.changeHabilitado(insumo.id);
      const updatedInsumos = insumosXCategoria.map((item) =>
        item.id === insumo.id ? { ...item, habilitado: !item.habilitado } : item
      );
      setInsumoXCategoria(updatedInsumos);
      dispatch(setDataTable(updatedInsumos));
    } catch (error) {
      console.error("Error al cambiar estado de habilitación:", error);
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
          /* setInsumoXCategoria((prevInsumos) => prevInsumos.filter((insumo) => insumo.id !== id));
          dispatch(setDataTable(insumosXCategoria.filter((insumo) => insumo.id !== id))); */
          getInsumosCategoria();
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

      setInsumoXCategoria(allInsumos);
      dispatch(setDataTable(allInsumos));
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
      <h1 style={{
        fontSize: "2.5rem",
        color: "#333",
        textAlign: "center",
        marginBottom: "1rem",
        marginTop: "1rem",
        fontFamily: "'Arial', sans-serif",
        letterSpacing: "0.1rem",
      }}>
        Insumos
      </h1>
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
          articuloInsumo={editingArticulo}
          getInsumosCategoria={getInsumosCategoria}
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
