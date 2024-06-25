import React, { useEffect, useState } from "react";
import { PieChart } from "@mui/x-charts";
import { saveAs } from "file-saver";
import { Bar, Line } from "react-chartjs-2";
import RankingProductosDto from "../../../types/Charts/RankingProductosDto";
import Ingresos from "../../../types/Charts/Ingresos";
import CantidadPedidosCliente from "../../../types/Charts/CantidadPedidosCliente";
import MontoGanancia from "../../../types/Charts/MontoGananciaDto";

const API_URL = import.meta.env.VITE_API_URL;

const urlIngresos = API_URL + "/estadisticasDashboard/excel/ingresos";
const urlRanking = API_URL + "/estadisticasDashboard/excel/ranking-productos";
const urlPedidosClientes =
  API_URL + "/estadisticasDashboard/excel/pedidos-clientes";
const urlGanancia = API_URL + "/estadisticasDashboard/excel/resultado-economico";

const Charts2 = () => {
  const [rankingData, setRankingData] = useState<RankingProductosDto[]>([]);
  const [ingresos, setIngresos] = useState<Ingresos[]>([]);
  const [cantidadPedidoCliente, setCantidadPedidoCliente] = useState<
    CantidadPedidosCliente[]
  >([]);
  const [resultadoEconomico, setResultadoEconomico] = useState<MontoGanancia>();
  const [fechaLimiteMin, setFechaLimiteMin] = useState<string>("");
  const [fechaLimiteMax, setFechaLimiteMax] = useState<string>("");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");

  //#region RANKING PRODUCTOS
  useEffect(() => {
    const fetchRankingData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await fetch(
            `${API_URL}/estadisticasDashboard/rankingProductos?fechaDesde=${fechaLimiteMin}&fechaHasta=${fechaLimiteMax}`
          );
          const data = await response.json();
          setRankingData(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
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
        const response = await fetch(
          `${API_URL}/estadisticasDashboard/limite-fechas`
        );
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

  //#region INGRESOS
  useEffect(() => {
    const fetchIngresosData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await fetch(
            `${API_URL}/estadisticasDashboard/recaudacionesDiarias?fechaDesde=${fechaLimiteMin}&fechaHasta=${fechaLimiteMax}`
          );
          const data = await response.json();
          const ingresosData: Ingresos[] = data.map((item: any) => ({
            ...item,
            dia: new Date(item.dia).toISOString().split("T")[0],
          }));
          setIngresos(ingresosData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchIngresosData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

  //#region CANTIDAD PEDIDOS CLIENTE
  useEffect(() => {
    const fetchPedidosClienteData = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await fetch(
            `${API_URL}/estadisticasDashboard/pedidosCliente?fechaDesde=${fechaLimiteMin}&fechaHasta=${fechaLimiteMax}`
          );
          const data = await response.json();
          setCantidadPedidoCliente(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchPedidosClienteData();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

  //#region RESULTADO ECONOMICO
  useEffect(() => {
    const fetchResultadoEconomico = async () => {
      try {
        if (fechaLimiteMin && fechaLimiteMax) {
          const response = await fetch(
            `${API_URL}/estadisticasDashboard/resultadoEconomico?fechaDesde=${fechaLimiteMin}&fechaHasta=${fechaLimiteMax}`
          );
          const data = await response.json();
          //setResultadoEconomico(Array.isArray(data) ? data : []); //Verificamos que sea un array
          setResultadoEconomico(data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (fechaLimiteMin && fechaLimiteMax) {
      fetchResultadoEconomico();
    }
  }, [fechaLimiteMin, fechaLimiteMax]);

  // Configuración de Ingresos
  const data = {
    labels: ingresos.map((item) => item.dia),
    datasets: [
      {
        label: "Ingresos",
        data: ingresos.map((item) => item.ingresos),
        backgroundColor: "rgba(75, 192, 192, 0.6)",
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

  // Configuración de Cantidad pedidos por Cliente
  const dataCantPedidosCliente = {
    labels: cantidadPedidoCliente.map(
      (item) => `${item.nombre} ${item.apellido}`
    ),
    datasets: [
      {
        label: "Cantidad de Pedidos",
        data: cantidadPedidoCliente.map((item) => item.cantidad_pedidos),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        pointBackgroundColor: "rgba(75, 192, 192, 1)",
        pointBorderColor: "rgba(75, 192, 192, 1)",
        pointHoverBackgroundColor: "rgba(75, 192, 192, 1)",
        pointHoverBorderColor: "rgba(75, 192, 192, 1)",
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

  // Configuración de Resultado Económico
  const dataResultadoEconomico = {
    labels: ["Costos", "Ganancias", "Resultado"],
    datasets: [
      {
        label: "Resultado Económico",
        data: resultadoEconomico
          ? [
              resultadoEconomico.costos,
              resultadoEconomico.ganancias,
              resultadoEconomico.resultado,
            ]
          : [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const optionsResultadoEconomico = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const inputStyle = {
    margin: "0 10px",
  };

  const buttonStyle = {
    padding: "5px 10px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    cursor: "pointer",
    borderRadius: "5px",
  };

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

      const blob = await response.blob();
      const getFileNameFromUrl = (url: string) => {
        const segments = url.split("/");
        return segments[segments.length - 1];
      };

      saveAs(blob, `${getFileNameFromUrl(url)}.xls`);
    } catch (error) {
      console.error("Error al generar el reporte en formato .xls:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
      }}
    >
      <div style={{ marginBottom: "90px" }}>
        <h1>Ranking de Productos</h1>
        <PieChart
          xAxis={[
            {
              scaleType: "band",
              data: rankingData.map((item) => item.denominacion),
            },
          ]}
          series={[
            {
              data: rankingData.map((item) => ({
                value: item.cantidad,
                label: item.denominacion,
              })),
            },
          ]}
          width={700}
          height={300}
        />
        <div>
          <label style={inputStyle}>
            Fecha Desde:
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </label>
          <label style={inputStyle}>
            Fecha Hasta:
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </label>
          <button
            style={buttonStyle}
            onClick={(event) => handleGenerateExcel(event, urlRanking)}
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "80px" }}>
        <div style={{ width: "700px", height: "400px" }}>
          <h1>Ingresos</h1>
          <Bar data={data} options={options} />
          <div>
            <form>
              <label style={inputStyle}>
                Fecha Desde:
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => setFechaDesde(e.target.value)}
                />
              </label>
              <label style={inputStyle}>
                Fecha Hasta:
                <input
                  type="date"
                  value={fechaHasta}
                  onChange={(e) => setFechaHasta(e.target.value)}
                />
              </label>
              <button
                style={buttonStyle}
                onClick={(event) => handleGenerateExcel(event, urlIngresos)}
              >
                Exportar Excel
              </button>
            </form>
          </div>
        </div>
      </div>

      <div style={{ width: "700px", height: "300px" }}>
        <h1>Cantidad de Pedidos por Cliente</h1>
        <Line data={dataCantPedidosCliente} options={optionsCantidadPedido} />
        <div style={{ marginTop: "20px" }}>
          <label style={inputStyle}>
            Fecha Desde:
            <input
              type="date"
              value={fechaDesde}
              onChange={(e) => setFechaDesde(e.target.value)}
            />
          </label>
          <label style={inputStyle}>
            Fecha Hasta:
            <input
              type="date"
              value={fechaHasta}
              onChange={(e) => setFechaHasta(e.target.value)}
            />
          </label>
          <button
            style={buttonStyle}
            onClick={(event) => handleGenerateExcel(event, urlPedidosClientes)}
          >
            Exportar Excel
          </button>
        </div>
      </div>

      <div style={{ width: '700px', height: '300px' }}>
      <h1>Resultado Económico</h1>
      <Bar data={dataResultadoEconomico} options={optionsResultadoEconomico} />
      <div style={{ marginTop: '20px' }}>
        <label style={inputStyle}>
          Fecha Desde:
          <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
        </label>
        <label style={inputStyle}>
          Fecha Hasta:
          <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
        </label>
        <button
            style={buttonStyle}
            onClick={(event) => handleGenerateExcel(event, urlGanancia)}
          >
            Exportar Excel
          </button>
      </div>
    </div>
    </div>
  );
};

export default Charts2;
