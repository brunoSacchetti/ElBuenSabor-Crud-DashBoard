import { useEffect, useState } from "react";

import { TableGeneric } from "../../ui/TableGeneric/TableGeneric";
import { Button, CircularProgress, MenuItem, Select } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";

import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";

import { PedidoService } from "../../../services/PedidoService";
import IPedido from "../../../types/Pedido";
import PedidoDto from "../../../types/Dtos/Pedido/PedidoDto";
import { TablePedido } from "../../ui/TablePedido/TablePedido";
import { useNavigate } from "react-router-dom";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenPedido = () => {
  // Estado para controlar la carga de datos
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  // Columnas de la tabla de personas
  const ColumnsTablePedido = [
    {
      label: "Nro",
      key: "id",
      render: (pedido: PedidoDto) => (pedido?.id ? pedido.id : 0),
    },
    { label: "Estado", 
      key: "estado",
      render: (pedido: PedidoDto) => (pedido.estado),
    },
    { label: "Hora Finalizacion", key: "horaEstimadaFinalizacion" },
    { label: "Forma Pago", key: "formaPago" },
    { label: "Fecha Pedido", key: "fechaPedido"},
    { label: "Tipo Envio", key: "tipoEnvio"},
    { 
      label: "Acciones", 
      key: "acciones",
      render: (pedido: PedidoDto) => (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button variant="contained" color="primary" style={{height: "40px", fontSize: "12px"}} onClick={() => handleViewDetails(pedido.id)}>
            Ver Detalles
          </Button>
          <Select 
            value={pedido.estado}
            onChange={(e) => handleCambiarEstado(pedido.id, e.target.value)}
          >
            <MenuItem value=""><em>Seleccionar</em></MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="PREPARACION">En Preparacion</MenuItem>
            <MenuItem value="FACTURADO">Facturado</MenuItem>
            <MenuItem value="RECHAZADO">Rechazado</MenuItem>
          </Select>
          {pedido.estado === "FACTURADO" && (
            <Button variant="contained" color="error" /* onClick={() => handleDownloadInvoice(pedido.id)} */>
              Descargar Factura
            </Button>
          )}
        </div>
      )
    }
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
 
  const getPedido = async () => {
    setLoading(true);
    try {
      const pedidoData = await pedidoService.getAll();
      dispatch(setDataTable(pedidoData));
    } catch (error) {
      console.error("Failed to fetch pedidos", error);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los datos al inicio
  useEffect(() => {
    setLoading(true);
    getPedido();
  }, []);

  const handleViewDetails = (id: number) => {
    navigate(`/pedido/${id}`);
  };

  const handleCambiarEstado = async (id: number, newStatus: string) => {

    console.log(id);
    console.log(newStatus);
    
    try {
      await pedidoService.cambiarEstado(newStatus, id);
      getPedido();
      Swal.fire({
        title: "Estado actualizado",
        text: `El estado del pedido ha sido actualizado a ${newStatus}`,
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al actualizar el estado del pedido",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  /* const handleDownloadInvoice = async (id: number) => {
    try {
      const invoiceUrl = await pedidoService.downloadInvoice(id); // Asumiendo que tienes este método en tu servicio
      const link = document.createElement('a');
      link.href = invoiceUrl;
      link.setAttribute('download', `Factura_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al descargar la factura",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  }; */

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
        Listado de Pedidos
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
          
          <TablePedido<PedidoDto>
            handleDelete={handleDelete}
            columns={ColumnsTablePedido}
            setOpenModal={setOpenModal}
          />
        )}
      </div>
    </>
  );
};
