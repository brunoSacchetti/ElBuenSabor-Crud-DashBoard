import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CircularProgress, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { PedidoService } from '../../../services/PedidoService';
import PedidoDto from '../../../types/Dtos/Pedido/PedidoDto';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL;

export const ScreenDetallePedido = () => {
  const { id } = useParams(); // Obtener el ID del pedido de los parámetros de la URL
  const [pedido, setPedido] = useState<PedidoDto | null>(null);
  const [loading, setLoading] = useState(false);
  const pedidoService = new PedidoService(API_URL + '/pedido');

  useEffect(() => {
    setLoading(true);
    // Llamar al servicio para obtener los detalles del pedido por su ID
    pedidoService.getById(Number(id))
      .then((data) => {
        setPedido(data as PedidoDto);
        setLoading(false);
      })
      .catch((error) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar los detalles del pedido',
          icon: 'error',
          confirmButtonText: 'OK'
        });
        setLoading(false);
      });
  }, [id]); // Se ejecuta cada vez que el ID cambia

  return (
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
        Informacion del Pedido {pedido?.id}
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
          <Typography variant="h6">Cargando...</Typography>
        </div>
      ) : pedido ? (
        <>
          <TableContainer component={Paper} style={{ margin: '0 auto', maxWidth: '80%', marginBottom: '2rem' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Informacion</strong></TableCell>
                  <TableCell><strong></strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Numero Pedido</TableCell>
                  <TableCell>{pedido.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Estado</TableCell>
                  <TableCell>{pedido.estado}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Hora Estimada de Finalización</TableCell>
                  <TableCell>{pedido.horaEstimadaFinalizacion}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Forma de Pago</TableCell>
                  <TableCell>{pedido.formaPago}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Fecha del Pedido</TableCell>
                  <TableCell>{pedido.fechaPedido}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Tipo de Envío</TableCell>
                  <TableCell>{pedido.tipoEnvio}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" style={{ textAlign: 'center', marginBottom: '1rem' }}>
            Detalles del Pedido
          </Typography>
          <TableContainer component={Paper} style={{ margin: '0 auto', maxWidth: '80%' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Cantidad</strong></TableCell>
                  <TableCell><strong>Insumo</strong></TableCell>
                  <TableCell><strong>Producto Manufacturado</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pedido.detallePedidos && pedido.detallePedidos.length > 0 ? (
                  pedido.detallePedidos.map((detalle, index) => (
                    <TableRow key={index}>
                      {/* <TableCell>{detalle.id}</TableCell> */}
                      <TableCell>{detalle.cantidad}</TableCell>
                      <TableCell>{detalle.insumo ? detalle.insumo.denominacion : 'N/A'}</TableCell>
                      <TableCell>{detalle.manufacturado ? detalle.manufacturado.denominacion : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} style={{ textAlign: 'center' }}>No se encontraron detalles para este pedido.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography variant="h6" style={{ textAlign: 'center', marginTop: '2rem' }}>No se encontraron detalles para este pedido.</Typography>
      )}
    </div>
  );
};
