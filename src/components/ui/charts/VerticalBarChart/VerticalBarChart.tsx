import { FC } from "react";
import styles from "./VerticalBarChart.module.css";
import { Bar } from "react-chartjs-2";
interface IVerticalBarChart {
  width?: number;
  heigth?: number;
  title?: string;
  dataIn?: any;
}
export const VerticalBarChart: FC<IVerticalBarChart> = ({
  width,
  heigth,
  title,
}) => {
  // Datos para el gráfico
  const data = {
    labels: ["Coca Cola", "Lomo", "Papas", "Hamburguesa", "Pancho", "Helado"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: [
          "#5D2B35",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "#5D2B35",
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuración del gráfico
  const options: any = {
    indexAxis: "x",
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
      },
    },
  };

  return (
    <div
      className={styles.container__BarChart}
      style={{ width: `${width || 40}vw`, height: `${heigth || 40}vh` }}
    >
      <h2>{title || "Inserte un titulo"}</h2>
      <Bar data={data} options={options} />
      
    </div>
  );
};
