import { Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar"; // Importamos el componente NavBar
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css";
import { ScreenEmpresa } from "../components/pages/ScreenEmpresa/ScreenEmpresa"; // Importamos el componente ScreenEmpresa
import { ScreenProducto } from "../components/pages/ScreenProducto/ScreenProducto";
import { ScreenUsuario } from "../components/pages/ScreenUsuario/ScreenUsuario";
import { Home } from "../components/pages/Home/Home";
import { ScreenSucursales } from "../components/pages/ScreenSucursales/ScreenSucursales";
import { InicioDashboard } from "../components/pages/InicioDashboard/InicioDashboard";
// Componente AppRouter que define las rutas de la aplicación
export const AppRouter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
      <NavBar />
      <div className="AppContainer">
        {!isHomePage && <SideBar />}
        <div className="Content">
<<<<<<< HEAD
          <Routes>
            
            <Route path="/inicio" element={<InicioDashboard />} />
            <Route path="/empresas" element={<ScreenEmpresa />} />
            <Route
              path="/articulosManufacturados"
              element={<ScreenProducto />}
            />
            <Route path="/usuarios" element={<ScreenUsuario />} />
            <Route
              path="/empresas/:id/sucursales"
              element={<ScreenSucursales />}
            />
            <Route path="/" element={<Home />} />
          </Routes>
=======
        {/* Definición de las rutas */} 
        <Routes>
          {/* Rutas */}
          <Route path="/empresas" element={<ScreenEmpresa />} />
          <Route path="/articulosManufacturados" element={< ScreenProducto/>} />
          <Route path="/usuarios" element={< ScreenUsuario/>} />
          <Route path="/empresas/:id/sucursales" element={<ScreenSucursales />} />
          <Route path="/" element={<Home/>} />
          
        </Routes>
>>>>>>> 9967abc64510cccad4ccd457ffc3638f25507f0d
        </div>
      </div>
    </>
  );
};






      /* <NavBar />
      <div className="AppContainer">
        <SideBar />
        <div className="Content">
        <Routes>
          <Route path="/empresas" element={<ScreenEmpresa />} />
          <Route path="/articulosManufacturados" element={< ScreenProducto/>} />
          <Route path="/usuarios" element={< ScreenUsuario/>} />
          <Route path="/empresas/:id/sucursales" element={<ScreenSucursales />} />
          <Route path="/" element={<Home/>} />
        </Routes>
        </div>
      </div>  */