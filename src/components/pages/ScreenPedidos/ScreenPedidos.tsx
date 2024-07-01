import { useEffect, useState } from "react";
import { Button, CircularProgress, MenuItem, Select, Typography } from "@mui/material";
import { useAppDispatch } from "../../../hooks/redux";
import { setDataTable } from "../../../redux/slices/TablaReducer";
import Swal from "sweetalert2";
import { PedidoService } from "../../../services/PedidoService";
import PedidoDto from "../../../types/Dtos/Pedido/PedidoDto";
import { TablePedido } from "../../ui/TablePedido/TablePedido";
import { useNavigate } from "react-router-dom";
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import DoneAllIcon from '@mui/icons-material/DoneAll';

import FacturadoIcon from '@mui/icons-material/CheckCircle';
import ReceiptIcon from '@mui/icons-material/Receipt';
import RejectedIcon from '@mui/icons-material/Cancel';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import PendingIcon from '@mui/icons-material/AccessTime';

import { saveAs } from "file-saver";

import IPedido from "../../../types/Pedido";

// Definición de la URL base de la API
const API_URL = import.meta.env.VITE_API_URL;

export const ScreenPedido = () => {
  const [loading, setLoading] = useState(false);
  const [, setOpenModal] = useState(false);
  const [, setPedidos] = useState<PedidoDto[] | IPedido[]>([]); // Estado local para almacenar los pedidos
  const [, setFilteredPedidos] = useState<PedidoDto[] | IPedido[]>([]); // Estado para almacenar los pedidos filtrados

  //Reporte de pedidos
  const [fechaLimiteMin, setFechaLimiteMin] = useState<string>("");
  const [fechaLimiteMax, setFechaLimiteMax] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState<string>("");
  const [fechaHasta, setFechaHasta] = useState<string>("");

  const pedidoService = new PedidoService(API_URL + "/pedido");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Según el rol que tenga
  const userDataString = sessionStorage.getItem('usuario');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const rol = userData ? userData["https://my-app.example.com/roles"][0] : null;

  const allowedStatesForCajero = ['PENDIENTE', 'PREPARACION', 'TERMINADO', 'RECHAZADO', 'DELIVERY', 'ENTREGADO', 'FACTURADO'];
  const allowedStatesForCocinero = ['PREPARACION', 'TERMINADO']; // Estados permitidos para el cocinero
  const allowedStatesForAdmin = ['PENDIENTE', 'PREPARACION', 'TERMINADO', 'DELIVERY', 'ENTREGADO', 'FACTURADO', 'RECHAZADO'];

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
    { label: "Hora Finalización", key: "horaEstimadaFinalizacion" },
    { label: "Forma Pago", key: "formaPago" },
    { label: "Fecha Pedido", key: "fechaPedido" },
    { label: "Tipo Envío", key: "tipoEnvio" },
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
          <Button variant="contained" color="primary" style={{ height: "40px", fontSize: "12px" }} onClick={() => handleViewDetails(pedido.id)}>
            Ver Detalles
          </Button>
          {rol === 'CAJERO' && (
            <Select
              value={pedido.estado}
              onChange={(e) => handleCambiarEstado(pedido.id, pedido.estado, e.target.value)}
              disabled={!canChangeEstado(pedido.estado)}
            >
              <MenuItem value=""><em>Seleccionar</em></MenuItem>
              {allowedStatesForCajero.map((state) => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          )}
          {rol === 'COCINERO' && pedido.estado === "PREPARACION" && (
            <Button variant="contained" color="primary" style={{ height: "40px", fontSize: "12px" }} onClick={() => handleCambiarEstado(pedido.id, pedido.estado, 'TERMINADO')}>
              Marcar como Terminado
            </Button>
          )}
          {rol === 'ADMIN' && (
            <Select
              value={pedido.estado}
              onChange={(e) => handleCambiarEstado(pedido.id, pedido.estado, e.target.value)}
              disabled={!canChangeEstado(pedido.estado)}
            >
              <MenuItem value=""><em>Seleccionar</em></MenuItem>
              {allowedStatesForAdmin.map((state) => (
                <MenuItem key={state} value={state}>{state}</MenuItem>
              ))}
            </Select>
          )}
          {pedido.estado === "FACTURADO" && (
            <Button variant="contained" color="error" onClick={() => handleDescargarFactura(pedido.id)}>
              Descargar Factura
            </Button>
          )}
        </div>
      )
    }
  ];

  const canChangeEstado = (currentStatus: string) => {
    switch (currentStatus) {
      case 'PENDIENTE':
        return true; // El cajero puede cambiar de PENDIENTE a otros estados permitidos
      case 'PREPARACION':
        return rol === 'COCINERO' || rol === 'ADMIN'; // El cajero, cocinero o admin pueden cambiar de PREPARACION
      case 'TERMINADO':
        return rol === 'CAJERO' || rol === 'ADMIN'; // Solo el cajero o admin pueden cambiar de TERMINADO a DELIVERY o ENTREGADO
      case 'DELIVERY':
      case 'ENTREGADO':
        return rol === 'CAJERO' || rol === 'ADMIN'; // Solo el cajero o admin pueden cambiar de DELIVERY o ENTREGADO a FACTURADO
      default:
        return false;
    }
  };

  const handleDelete = async (id: number) => {
    Swal.fire({
      title: "¿Estás seguro?",
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
      setPedidos(pedidoData); // Guardar todos los pedidos
      const filtered = filterPedidosByRole(pedidoData); // Filtrar los pedidos según el rol
      setFilteredPedidos(filtered); // Guardar los pedidos filtrados
      dispatch(setDataTable(filtered)); // Actualizar el estado global con los pedidos filtrados
    } catch (error) {
      console.error("Failed to fetch pedidos", error);
    } finally {
      setLoading(false);
    }
  };
  

  const filterPedidosByRole = (pedidos: PedidoDto[] | IPedido[]) => {
    switch (rol) {
      case 'CAJERO':
        return pedidos.filter(pedido => allowedStatesForCajero.includes(pedido.estado));
      case 'COCINERO':
        return pedidos.filter(pedido => allowedStatesForCocinero.includes(pedido.estado));
      case 'ADMIN':
        return pedidos; // Admin puede ver todos los pedidos sin filtro
      default:
        return [];
    }
  };

  useEffect(() => {
    setLoading(true);
    getPedido();
  }, []);

  useEffect(() => {
    const fetchFechasLimites = async () => {
      try {
        const response = await fetch(`${API_URL}/estadisticasDashboard/limite-fechas`);
        const data = await response.json();
        const { fechaMinima, fechaMaxima } = data;
        setFechaLimiteMin(fechaMinima);
        setFechaLimiteMax(fechaMaxima);
      } catch (error) {
        console.error("Error al obtener las fechas límites:", error);
      }
    };

    fetchFechasLimites();
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

  //Pedidos Excel
  const urlPedidos = API_URL + "/estadisticasDashboard/excel/pedidos";
  const handleGenerateExcel = async (event: React.FormEvent, url: string) => {
    event.preventDefault();
    try {
      const fechaDesdeFiltro = fechaDesde || fechaLimiteMin;
      const fechaHastaFiltro = fechaHasta || fechaLimiteMax;

      const response = await fetch(
        `${url}?fechaDesde=${fechaDesdeFiltro}&fechaHasta=${fechaHastaFiltro}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const getFileNameFromUrl = (url: string) => {
          const segments = url.split("/");
          return segments[segments.length - 1];
        };
        saveAs(blob, `${getFileNameFromUrl(url)}.xls`);
      } else {
        Swal.fire({
          title: "Error",
          text: "Hubo un problema al generar el reporte en formato .xls",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    } catch (error) {
      console.error("Error al generar el reporte en formato .xls:", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al generar el reporte en formato .xls",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  };

  const inputStyle = {
    margin: "0 10px",
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, campo: "desde" | "hasta") => {
    const value = e.target.value;
    if (campo === "desde") {
      setFechaDesde(value);
    } else if (campo === "hasta") {
      setFechaHasta(value);
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
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <label style={inputStyle}>
            Fecha Desde:
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => handleDateChange(e, "desde")}
            />
          </label>
          <label style={inputStyle}>
            Fecha Hasta:
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => handleDateChange(e, "hasta")}
            />
          </label>
          <button style={buttonStyle} onClick={(event) => handleGenerateExcel(event, urlPedidos)}>
            Exportar Excel
          </button>
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
