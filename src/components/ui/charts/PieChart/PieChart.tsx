import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./PieChart.module.css";
import { FC } from "react";

interface IPieChart {
  width?: number;
  heigth?: number;
  title?: string;
  dataIn?: any;
}

export const PieChart: FC<IPieChart> = ({ width, heigth, title }) => {
  // Datos para el gráfico
  const data =
    {
      labels: ["Comida", "Bebida", "Postre", "Otro"],
      datasets: [
        {
          label: "# of Votes",
          data: [50.6, 20, 15, 15],
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
    } ;

  // Configuración del gráfico
  const options: any = {
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
      className={styles.container__pieChart}
      style={{ width: `${width || 40}vw`, height: `${heigth || 40}vh` }}
    >
      <h2>{title || "Inserte un titulo"}</h2>
      <Pie data={data} options={options} />
    </div>
  );
};
