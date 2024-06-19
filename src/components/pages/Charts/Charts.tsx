import React, { useEffect, useState } from 'react';
import { BarChart, LineChart, PieChart } from '@mui/x-charts';
import axios from 'axios';
import RankingProductosDto from '../../../types/Charts/RankingProductosDto';
import FechaLimite from '../../../types/Charts/FechaLimite';
import Ingresos from '../../../types/Charts/Ingresos';
import { Bar, Line } from 'react-chartjs-2';
import CantidadPedidosCliente from '../../../types/Charts/CantidadPedidosCliente';


const API_URL = import.meta.env.API_URL;

const Charts = () => {
  const [rankingData, setRankingData] = useState<RankingProductosDto[]>([]);

  const [ingresos, setIngresos] = useState<Ingresos[]>([]);

  const [cantidadPedidoCliente, setCantidadPedidoCliente] = useState<CantidadPedidosCliente[]>([]);
  
  const [fechaLimiteMin, setFechaLimiteMin] = useState<string>("");
  const [fechaLimiteMax, setFechaLimiteMax] = useState<string>(""); 


 //#region RANKING PRODUCTOS
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await axios.get("http://localhost:8080/estadisticasDashboard/rankingProductos", {
            params: {
              fechaDesde: fechaLimiteMin,
              fechaHasta: fechaLimiteMax  
            }
          });
          setRankingData(response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchRankingData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

  //#region LIMITES FECHAS
  useEffect(() => {
    const fetchFechasLimites = async () => {
      try {
        const response = await axios.get("http://localhost:8080/estadisticasDashboard/limite-fechas");
        const { fechaMinima, fechaMaxima } = response.data;

        console.log(response.data);

        // Establecer las fechas límites en el estado
        setFechaLimiteMin(fechaMinima);
        setFechaLimiteMax(fechaMaxima);

      } catch (error) {
        console.error("Error al obtener las fechas límites:", error);
      }
    };

    fetchFechasLimites();
  }, []);

  //#region INGRESOS
  useEffect(() => {
    const fetchIngresosData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await axios.get("http://localhost:8080/estadisticasDashboard/recaudacionesDiarias", {
            params: {
              fechaDesde: fechaLimiteMin,
              fechaHasta: fechaLimiteMax
            }
          });

          // Parsear las fechas en la respuesta
          const ingresosData: Ingresos[] = response.data.map((item: any) => ({
            ...item,
            dia: new Date(item.dia).toISOString().split('T')[0] // Convertir a string en formato "YYYY-MM-dd"
          }));

          setIngresos(ingresosData);
          
          console.log(ingresos);
          
          
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchIngresosData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);


  //#region Cantidad Pedidos Cliente
  useEffect(() => {
    const fetchPedidosClienteData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await axios.get("http://localhost:8080/estadisticasDashboard/pedidosCliente", {
            params: {
              fechaDesde: fechaLimiteMin,
              fechaHasta: fechaLimiteMax
            }
          });;

          setCantidadPedidoCliente(response.data);
          
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchPedidosClienteData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

  // Configuracion de Ingresos
  const data = {
    labels: ingresos.map(item => item.dia),
    datasets: [
      {
        label: 'Ingresos',
        data: ingresos.map(item => item.ingresos),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  
  // Configuracion de Cantidad pedidos por Cliente
  const dataCantPedidosCliente = {
    labels: cantidadPedidoCliente.map(item => `${item.nombre} ${item.apellido}`),
    datasets: [
      {
        label: 'Cantidad de Pedidos',
        data: cantidadPedidoCliente.map(item => item.cantidad_pedidos),
        backgroundColor: 'rgba(75, 192, 192, 0.2)', // Fondo debajo de la línea
        borderColor: 'rgba(75, 192, 192, 1)', // Color de la línea
        borderWidth: 2, // Grosor de la línea
        pointBackgroundColor: 'rgba(75, 192, 192, 1)', // Color de los puntos
        pointBorderColor: 'rgba(75, 192, 192, 1)', // Color del borde de los puntos
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)', // Color de los puntos al hacer hover
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)', // Color del borde de los puntos al hacer hover
        fill: true, // Rellenar el área debajo de la línea
      },
    ],
  };

  const optionsCantidadPedido = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };


  return (
    <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around"}}>
 
    <div style={{ marginBottom: '20px' }}>
    <h1>Ranking de Productos</h1>
        <PieChart
          xAxis={[{ scaleType: 'band', data: rankingData.map(item => item.denominacion) }]}
          series={[{ data: rankingData.map(item => ({ value: item.cantidad, label: item.denominacion })) }]}
          width={500}
          height={200}
        />
      </div>

      <div style={{ width: '600px', height: '400px' }}>
        <h1>Ingresos</h1>
        <Bar data={data} options={options} />
      </div>

      
      <div style={{ width: '800px', height: '400px' }}>
      <h1>Cantidad de Pedidos por Cliente</h1>
        <Line data={dataCantPedidosCliente} options={optionsCantidadPedido} />
      </div>

    </div>
  );
};

export default Charts;
