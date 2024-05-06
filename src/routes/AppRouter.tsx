import { Route, Routes } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar"; // Importamos el componente NavBar
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css"
import { ScreenEmpresa } from "../components/pages/ScreenEmpresa";// Importamos el componente ScreenEmpresa

// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  return (
    <>
      {/* Barra de navegación */}
      <NavBar />
      <div className="AppContainer">
        <SideBar />
        <div className="Content">
        {/* Definición de las rutas */} 
        <Routes>
          {/* Ruta para la pantalla de personas */}
          <Route path="/" element={<ScreenEmpresa />} />
        </Routes>
        </div>
      </div>
    </>
  );
};
