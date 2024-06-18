import React, { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts';

const API_URL = import.meta.env.API_URL;

const Charts = () => {
  const [rankingData, setRankingData] = useState([]);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (fechaDesde && fechaHasta) {
          const url = new URL(API_URL + '/rankingProductos');
          url.searchParams.append('fechaDesde', fechaDesde);
          url.searchParams.append('fechaHasta', fechaHasta);

          const response = await fetch(url.toString());
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const data = await response.json();
          setRankingData(data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (fechaDesde && fechaHasta) {
      fetchData();
    }
  }, [fechaDesde, fechaHasta]);

  useEffect(() => {
    const fetchFechas = async () => {
      try {
        const response = await fetch(API_URL + '/estadisticasDashboard/limite-fechas');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setFechaDesde(data.fechaMinima);
        setFechaHasta(data.fechaMaxima);
      } catch (error) {
        console.log('Error fetching fechas:', error);
      }
    };

    fetchFechas();
  }, []);

  return (
    <>
      <BarChart
        xAxis={[{ scaleType: 'band', data: rankingData.map(item => item.denominacion) }]}
        series={[{ data: rankingData.map(item => item.cantidad) }]}
        width={500}
        height={300}
      />
    </>
  );
};

export default Charts;
