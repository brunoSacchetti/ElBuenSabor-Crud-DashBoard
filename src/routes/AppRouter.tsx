import { Route, Routes } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar"; // Importamos el componente NavBar
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css"
import { ScreenEmpresa } from "../components/pages/ScreenEmpresa";// Importamos el componente ScreenEmpresa
import { ScreenProducto } from "../components/pages/ScreenProducto";
import { ScreenUsuario } from "../components/pages/ScreenUsuario";
import { Home } from "../components/pages/Home/Home";
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
          <Route path="/" element={<Home/>} />
          <Route path="/empresas" element={<ScreenEmpresa />} />
          <Route path="/articulosManufacturados" element={< ScreenProducto/>} />
          <Route path="/usuarios" element={< ScreenUsuario/>} />
        </Routes>
        </div>
      </div>
    </>
  );
};
