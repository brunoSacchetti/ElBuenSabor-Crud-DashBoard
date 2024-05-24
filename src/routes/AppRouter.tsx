import { Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar"; // Importamos el componente NavBar
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css";
import { ScreenUsuario } from "../components/pages/ScreenUsuario/ScreenUsuario";
import { Home } from "../components/pages/Home/Home";
import { ScreenSucursales } from "../components/pages/ScreenSucursales/ScreenSucursales";
import { InicioDashboard } from "../components/pages/InicioDashboard/InicioDashboard";
import { useAppSelector } from "../hooks/redux";
import { ScreenPromocion } from "../components/pages/ScreenPromocion/ScreenPromociones";
import { ScreenUnidadMedida } from "../components/pages/ScreenUnidadMedida/ScreenUnidadMedida";
import { ScreenInsumos } from "../components/pages/ScreenInsumos/ScreenInsumos";
import { ArticuloManufacturadoScreen } from "../components/pages/ScreenProducto/ArticuloManufacturadoScreen";

export const AppRouter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const selectedCompanyName = useAppSelector(state => state.empresa.empresaActual?.nombre); // Asume que el estado tiene esta forma


  return (
    <>
      <NavBar selectedCompanyName={selectedCompanyName} />
      <div className="AppContainer">
        {!isHomePage && <SideBar />}
        <div className="Content">
          <Routes>
            <Route path="/inicio" element={<InicioDashboard />} />
            <Route path="/insumos" element={<ScreenInsumos />} />
            <Route
              path="/articulosManufacturados"
              element={<ArticuloManufacturadoScreen />}
            />
            <Route path="/usuarios" element={<ScreenUsuario />} />
            <Route path="/promociones" element={<ScreenPromocion />} />
            <Route
              path="/sucursales"
              element={<ScreenSucursales />}
            />
            <Route path="/unidadMedida" element={<ScreenUnidadMedida />} />
            <Route path="/" element={<Home />} />
          </Routes>
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
          <Route path="/empresas" element={<ScreenEmpresa />} />*/