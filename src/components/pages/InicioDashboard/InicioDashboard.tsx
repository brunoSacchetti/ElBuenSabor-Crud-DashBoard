
import { useEffect } from "react";
import { PieChart } from "../../ui/charts/PieChart/PieChart";
import { VerticalBarChart } from "../../ui/charts/VerticalBarChart/VerticalBarChart";
import styles from "./Inicio.module.css";
export const InicioDashboard = () => {

  const user = JSON.parse(sessionStorage.getItem('usuario') || "null");


  return (
    <div style={{width:'100%'}}>
      
      <div className={styles.containerContent}>
      <h1>Bienvenido {user.nickname}!</h1>
        <div className={styles.containerChart}>
          <VerticalBarChart
            width={35}
            heigth={40}
            title="Ranking de productos"
          />
          <PieChart width={35} heigth={40} title="Ventas por categoria" />
        </div>
      </div>
    </div>
  );
};