import React, { useEffect, useState } from 'react';
import { BarChart, PieChart } from '@mui/x-charts';
import axios from 'axios';
import RankingProductosDto from '../../../types/Charts/RankingProductosDto';
import FechaLimite from '../../../types/Charts/FechaLimite';


const API_URL = import.meta.env.API_URL;

const Charts = () => {
  const [rankingData, setRankingData] = useState<RankingProductosDto[]>([]);
  const [fechaLimiteMin, setFechaLimiteMin] = useState<string>("");
  const [fechaLimiteMax, setFechaLimiteMax] = useState<string>(""); 

  useEffect(() => {
    const fetchData = async () => {
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
      fetchData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

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

  return (
    <>
 
    <div style={{ marginBottom: '20px' }}>
    <h1>Ranking de Productos</h1>
        <PieChart
          xAxis={[{ scaleType: 'band', data: rankingData.map(item => item.denominacion) }]}
          series={[{ data: rankingData.map(item => ({ value: item.cantidad, label: item.denominacion })) }]}
          width={400}
          height={200}
        />
      </div>

      <div>
      <h1>Ranking de Productos</h1>
      <BarChart
        xAxis={[{ scaleType: 'band', data: rankingData.map(item => item.denominacion) }]}
        series={[{ data: rankingData.map(item => item.cantidad) }]}
        width={800}
        height={300}
      />
    </div>




    </>
  );
};

export default Charts;
