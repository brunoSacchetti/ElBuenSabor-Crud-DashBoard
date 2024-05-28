import { useEffect, useState } from "react";
import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import IArticuloInsumo from "../../../types/ArticuloInsumo";
import { ArticuloInsumoService } from "../../../services/ArticuloInsumoService";
import { ModalArticuloInsumo } from "../../ui/modals/ModalArticuloInsumo/ModalArticuloInsumo";
import { SucursalService } from "../../../services/SucursalService";
import { setCategoriaData } from "../../../redux/slices/CategoriaReducer";
import { ICategoria } from "../../../types/Categoria";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenInsumos = () => {
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  
  const insumosService = new ArticuloInsumoService(API_URL + "/ArticuloInsumo");
  const sucursalService = new SucursalService(API_URL + "/sucursal");
  const dispatch = useAppDispatch();
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const sucursalActual = useAppSelector((state) => state.sucursal.sucursalActual);

  const ColumnsTableEmpresa = [
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
    { label: "Acciones", key: "acciones" },
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
      setCategorias(categoriaData); // Aquí se establecen las categorías en el estado local
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
        insumosService.delete(id).then(() => {
          getInsumos();
        });
      }
    });
  };

  const getInsumos = async () => {
    await insumosService.getAll().then((insumosData) => {
      dispatch(setDataTable(insumosData));
      setLoading(false);
    });
  };

  useEffect(() => {
    setLoading(true);
    getInsumos();
  }, []);


  useEffect(() => {
    if (sucursalActual) {
      setLoading(true);
      getCategorias();
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
          <Button onClick={() => setOpenModal(true)} variant="contained">
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
            columns={ColumnsTableEmpresa}
            setOpenModal={setOpenModal}
          />
        )}
      </div>

      <ModalArticuloInsumo
        categorias={categorias}
        getInsumos={getInsumos}
        openModal={openModal}
        setOpenModal={setOpenModal}
      />
    </>
  );
};