import { useEffect, useState } from "react";

import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import { ModalEmpresa } from "../../ui/modals/ModalEmpresa/ModalEmpresa";
import { PedidoService } from "../../../services/PedidoService";
import IPedido from "../../../types/Pedido";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenPedido = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();
  // Columnas de la tabla de personas
  const ColumnsTablePedido = [
    {
      label: "ID",
      key: "id",
      render: (pedido: IPedido) => (pedido?.id ? pedido.id : 0),
    },
    { label: "Estado", key: "estado" },
    { label: "Hora Finalizacion", key: "horaEstimadaFinalizacion" },
    /* {
      label: "Sucursales",
      key: "sucursales",
      render: (empresa: IEmpresa) => (
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
    }, */
    { label: "Fecha Pedido", key: "fechaPedido"},
    { label: "Tipo Envio", key: "tipoEnvio"},
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
        pedidoService.delete(id).then(() => {
          getPedido();
        });
      }
    });
  };
  // Función para obtener las personas
  const getPedido = async () => {
    await pedidoService.getAll().then((pedidoData) => {
      dispatch(setDataTable(pedidoData));
      setLoading(false);
    });
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getPedido();
  }, []);

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
        Lista de Pedidos
      </h1>

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
          <TableGeneric<IPedido>
            handleDelete={handleDelete}
            columns={ColumnsTablePedido}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
    </>
  );
};
