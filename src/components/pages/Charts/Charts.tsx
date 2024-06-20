import React, { useEffect, useState } from 'react';
import { PieChart } from '@mui/x-charts';
import axios from 'axios';
import RankingProductosDto from '../../../types/Charts/RankingProductosDto';

import Ingresos from '../../../types/Charts/Ingresos';
import { saveAs } from 'file-saver';
import { Bar, Line } from 'react-chartjs-2';
import CantidadPedidosCliente from '../../../types/Charts/CantidadPedidosCliente';

const API_URL = import.meta.env.VITE_API_URL;

const urlIngresos = `${API_URL}/estadisticasDashboard/excel/ingresos`;
const urlRanking = `${API_URL}/estadisticasDashboard/excel/ranking-productos`;
const urlPedidosClientes = `${API_URL}/estadisticasDashboard/excel/pedidos-clientes`;



const Charts = () => {
  const [rankingData, setRankingData] = useState<RankingProductosDto[]>([]);

  const [ingresos, setIngresos] = useState<Ingresos[]>([]);

  const [cantidadPedidoCliente, setCantidadPedidoCliente] = useState<CantidadPedidosCliente[]>([]);
  
  const [fechaLimiteMin, setFechaLimiteMin] = useState<string>("");
  const [fechaLimiteMax, setFechaLimiteMax] = useState<string>(""); 


  const [fechaDesde,setFechaDesde] = useState("");
  const [fechaHasta,setFechaHasta] = useState("");

 //#region RANKING PRODUCTOS
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await axios.get(`${API_URL}/estadisticasDashboard/rankingProductos`, {
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
        const response = await axios.get(`${API_URL}/estadisticasDashboard/limite-fechas`);
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
          const response = await axios.get(`${API_URL}/estadisticasDashboard/recaudacionesDiarias`, {
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
          const response = await axios.get(`${API_URL}/estadisticasDashboard/pedidosCliente`, {
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
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)', 
        borderWidth: 2, 
        pointBackgroundColor: 'rgba(75, 192, 192, 1)',
        pointBorderColor: 'rgba(75, 192, 192, 1)', 
        pointHoverBackgroundColor: 'rgba(75, 192, 192, 1)', 
        pointHoverBorderColor: 'rgba(75, 192, 192, 1)', 
        fill: true, 
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
  const inputStyle = {
    margin: '0 10px'
  };

  const buttonStyle = {

    padding: '5px 10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '5px'
  };


  /* const handleGenerateExcel = async () => {
    try {
  
      const fechaDesdeFiltro = fechaDesde || fechaLimiteMin; // Supón que 'fecha_minima' es el valor mínimo posible en tu conjunto de datos
      const fechaHastaFiltro = fechaHasta || fechaLimiteMax;
  
      const response = await axios.get("http://localhost:8080/estadisticasDashboard/excel/ingresos", {
        params: {
          fechaDesde: fechaDesdeFiltro,
          fechaHasta: fechaHastaFiltro,
        },
        responseType: 'blob', // la respuesta en formato binario
      });
  
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
  
  
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ingresos.xlsx');
      document.body.appendChild(link);
      link.click();
  
  
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error al generar el reporte en formato .xlsx:", error);
  
    }
  }; */

  const handleGenerateExcel = async (event: React.FormEvent,url:string) => {
    event.preventDefault();
    try {
      const fechaDesdeFiltro = fechaDesde || fechaLimiteMin;
      const fechaHastaFiltro = fechaHasta || fechaLimiteMax;
  
      const response = await axios.get(url, {
        params: {
          fechaDesde: fechaDesdeFiltro,
          fechaHasta: fechaHastaFiltro,
        },
        responseType: 'blob', // Solicitamos la respuesta como un blob
      });
  
      const getFileNameFromUrl = (url: string) => {
        const segments = url.split('/');
        return segments[segments.length - 1];
      };

      saveAs(new Blob([response.data]), `${getFileNameFromUrl(url)}.xls`);

    } catch (error) {
      console.error('Error al generar el reporte en formato .xls:', error);
    }
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-around" }}>
      <div style={{ marginBottom: '90px' }}>
        <h1>Ranking de Productos</h1>
        <PieChart
          xAxis={[{ scaleType: 'band', data: rankingData.map(item => item.denominacion) }]}
          series={[{ data: rankingData.map(item => ({ value: item.cantidad, label: item.denominacion })) }]}
          width={700}
          height={300}
        />
        <div>
          <label style={inputStyle}>
            Fecha Desde:
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)}/>
          </label>
          <label style={inputStyle}>
            Fecha Hasta:
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </label>
          <button style={buttonStyle} onClick={(event) => handleGenerateExcel(event, urlRanking)}>Exportar Excel</button>
        </div>
      </div>


      <div style={{ marginBottom: '80px' }}>
        <div style={{ width: '700px', height: '400px' }}>
          <h1>Ingresos</h1>
          <Bar data={data} options={options} />
          <div>
            <form >
              <label style={inputStyle}>
                Fecha Desde:
                <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)}/>
              </label>
              <label style={inputStyle}>
                Fecha Hasta:
                <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
              </label>
              <button style={buttonStyle} onClick={(event) => handleGenerateExcel(event, urlIngresos)}>Exportar Excel</button>
            </form>
          </div>
        </div>
      </div>

        
  
      <div style={{ width: '700px', height: '300px' }}>
        <h1>Cantidad de Pedidos por Cliente</h1>
        <Line data={dataCantPedidosCliente} options={optionsCantidadPedido} />
        <div style={{marginTop:'20px'}}>
          <label style={inputStyle}>
            Fecha Desde:
            <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)}/>
          </label>
          <label style={inputStyle}>
            Fecha Hasta:
            <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
          </label>
          <button style={buttonStyle} onClick={(event) => handleGenerateExcel(event, urlPedidosClientes)}>Exportar Excel</button>
        </div>
        </div>
        
      </div>
 
  );
}
export default Charts;
