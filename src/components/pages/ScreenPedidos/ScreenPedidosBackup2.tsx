import { useEffect, useState } from "react";
import { Button, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import { PedidoService } from "../../../services/PedidoService";
import PedidoDto from "../../../types/Dtos/Pedido/PedidoDto";
import { TablePedido } from "../../ui/TablePedido/TablePedido";
import { useNavigate } from "react-router-dom";
import PendingIcon from '@mui/icons-material/AccessTime';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import FacturadoIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RejectedIcon from '@mui/icons-material/Cancel';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import DoneAllIcon from '@mui/icons-material/DoneAll';

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenPedido = () => {
  const [loading, setLoading] = useState(false);
  const [, setOpenModal] = useState(false);

  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const getColorAndIcon = (estado: any) => {
    switch (estado) {
      case 'PENDIENTE':
        return { color: 'orange', icon: <PendingIcon /> };
      case 'PREPARACION':
        return { color: '#FFC100', icon: <OutdoorGrillIcon /> };
      case 'FACTURADO':
        return { color: '#AD3700', icon: <ReceiptIcon /> };
      case 'ENTREGADO':
        return { color: 'green', icon: <FacturadoIcon /> };
      case 'RECHAZADO':
        return { color: 'red', icon: <RejectedIcon /> };
      case 'DELIVERY':
        return { color: '#00B558', icon: <DeliveryDiningIcon /> };
      case 'TERMINADO':
        return { color: '#0067FB', icon: <DoneAllIcon /> };
      default:
        return { color: 'default', icon: null };
    }
  };

  const ColumnsTablePedido = [
    {
      label: "Nro",
      key: "id",
      render: (pedido: PedidoDto) => (pedido?.id ? pedido.id : 0),
    },
    { 
      label: "Estado", 
      key: "estado",
      render: (pedido: PedidoDto) => {
        const { color, icon } = getColorAndIcon(pedido.estado);
        return (
          <div style={{ display: 'flex', alignItems: 'center', color }}>
            {icon}
            <Typography variant="body2" style={{ marginLeft: '0.5rem' }}>{pedido.estado}</Typography>
          </div>
        );
      }
    },
    { label: "Hora Finalizacion", key: "horaEstimadaFinalizacion" },
    { label: "Forma Pago", key: "formaPago" },
    { label: "Fecha Pedido", key: "fechaPedido"},
    { label: "Tipo Envio", key: "tipoEnvio"},
    { 
      label: "Cliente", 
      key: "cliente",
      render: (pedido: PedidoDto) => (pedido.cliente.nombre + " " + pedido.cliente.apellido),
    },
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
            onChange={(e) => handleCambiarEstado(pedido.id, pedido.estado, e.target.value)}
            disabled={pedido.estado === 'RECHAZADO' || pedido.estado === 'FACTURADO'}
          >
            <MenuItem value=""><em>Seleccionar</em></MenuItem>
            <MenuItem value="PENDIENTE">Pendiente</MenuItem>
            <MenuItem value="PREPARACION">En Preparacion</MenuItem>
            <MenuItem value="TERMINADO">Terminado</MenuItem>
            <MenuItem value="DELIVERY">Delivery</MenuItem>
            <MenuItem value="ENTREGADO">Entregado</MenuItem>
            <MenuItem value="FACTURADO">Facturado</MenuItem>
            <MenuItem value="RECHAZADO">Rechazado</MenuItem>
          </Select>
          {pedido.estado === "FACTURADO" && (
          <Button variant="contained" color="error" onClick={() => handleDescargarFactura(pedido.id)}>
            Descargar Factura
          </Button>
        )}
        </div>
      )
    }
  ];

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

  useEffect(() => {
    setLoading(true);
    getPedido();
  }, []);

  const handleViewDetails = (id: number) => {
    navigate(`/pedido/${id}`);
  };

  const handleCambiarEstado = async (id: number, currentStatus: string, newStatus: string) => {
    if (currentStatus === 'PENDIENTE' && newStatus !== 'PREPARACION' && newStatus !== 'RECHAZADO') {
      Swal.fire({
        title: "Transición no válida",
        text: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (currentStatus === 'PREPARACION' && newStatus !== 'TERMINADO') {
      Swal.fire({
        title: "Transición no válida",
        text: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (currentStatus === 'TERMINADO' && (newStatus !== 'DELIVERY' && newStatus !== 'ENTREGADO')) {
      Swal.fire({
        title: "Transición no válida",
        text: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (currentStatus === 'DELIVERY' && newStatus !== 'ENTREGADO') {
      Swal.fire({
        title: "Transición no válida",
        text: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (currentStatus === 'ENTREGADO' && newStatus !== 'FACTURADO') {
      Swal.fire({
        title: "Transición no válida",
        text: `No se puede cambiar el estado de ${currentStatus} a ${newStatus}`,
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    if (newStatus === 'DELIVERY') {
      // Verificar si el tipo de envío es DELIVERY
      try {
        const pedido = await pedidoService.getById(id); // Asumiendo que hay un método para obtener un pedido por su ID
        if (pedido?.tipoEnvio !== 'DELIVERY') {
          Swal.fire({
            title: "Transición no válida",
            text: `El pedido no puede ser enviado a ${newStatus} porque el tipo de envío no es DELIVERY`,
            icon: "warning",
            confirmButtonText: "OK",
          });
          return;
        }
      } catch (error) {
        console.error("Error al obtener el pedido", error);
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al verificar el tipo de envío del pedido",
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }
  
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
  
  

  const handleDescargarFactura = async (pedidoId: any) => {
    try {
      const response = await fetch(`${API_URL}/facturas/download-factura/${pedidoId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/pdf",
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        setTimeout(() => {
          link.setAttribute("download", `Factura_Pedido_${pedidoId}.pdf`);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }, 0);
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al descargar la factura",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error al descargar la factura", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al descargar la factura",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

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
