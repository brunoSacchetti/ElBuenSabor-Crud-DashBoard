
import { PieChart } from "../../ui/charts/PieChart/PieChart";
import { VerticalBarChart } from "../../ui/charts/VerticalBarChart/VerticalBarChart";
import styles from "./Home.module.css";
export const Home = () => {
  return (
    <div style={{width:'100%'}}>
      
      <div className={styles.containerContent}>
      <h1>Bienvenido!</h1>
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
