import { Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar"; // Importamos el componente NavBar
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css";
import { ScreenUsuario } from "../components/pages/ScreenUsuario/ScreenUsuario";
import { Home } from "../components/pages/Home/Home";
import { ScreenSucursales } from "../components/pages/ScreenSucursales/ScreenSucursales";
import { InicioDashboard } from "../components/pages/InicioDashboard/InicioDashboard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ScreenUnidadMedida } from "../components/pages/ScreenUnidadMedida/ScreenUnidadMedida";
import { ScreenInsumos } from "../components/pages/ScreenInsumos/ScreenInsumos";
import { ArticuloManufacturadoScreen } from "../components/pages/ScreenProducto/ArticuloManufacturadoScreen";
import { useEffect } from "react";
import { setEmpresaActual, setEmpresaId } from "../redux/slices/EmpresaReducer";
import { ScreenCategorias } from "../components/pages/ScreenCategorias/ScreenCategorias";
import { setDataSucursales, setSucursalActual } from "../redux/slices/SucursalReducer";
import { ScreenPromociones } from "../components/pages/ScreenPromocion/ScreenPromociones";

export const AppRouter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const SucursalPage = location.pathname === '/sucursales';
  //const selectedCompanyName = useAppSelector(state => state.empresa.empresaActual?.nombre); // Asume que el estado tiene esta forma

  const dispatch = useAppDispatch();

  const empresaActual = useAppSelector(state => state.empresa.empresaActual);
  const sucursalActual = useAppSelector(state => state.sucursal.sucursalActual);
  const sucursales = useAppSelector(state => state.sucursal.data);
  const sucursalId = useAppSelector(state => state.sucursal.sucursalId);


  /* useEffect(() => {
    const storedEmpresa = localStorage.getItem("empresaActual");
    const storedSucursal = localStorage.getItem("sucursalActual");
    const storedSucursalData = localStorage.getItem("sucursales");
    const storedSucursalId = localStorage.getItem("sucursalId");
    
    if (storedEmpresa) {
      dispatch(setEmpresaActual(JSON.parse(storedEmpresa)));
    }

    if (storedSucursal) {
      dispatch(setSucursalActual(JSON.parse(storedSucursal)));
    }

    if(storedSucursalData) {
      dispatch(setDataSucursales(JSON.parse(storedSucursalData)));
    };
    if(storedSucursalId) {
      dispatch(setEmpresaId(JSON.parse(storedSucursalId)));
    };
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("empresaActual", JSON.stringify(empresaActual));
  }, [empresaActual]);

  useEffect(() => {
    localStorage.setItem("sucursalActual", JSON.stringify(sucursalActual));
  }, [sucursalActual]);

  useEffect(() => {
    localStorage.setItem("sucursales", JSON.stringify(sucursales));
  }, [sucursales]);
  
  useEffect(() => {
    localStorage.setItem("sucursalId", JSON.stringify(sucursalId));
  }, [sucursalId]); */

  useEffect(() => {
    const storedEmpresa = sessionStorage.getItem("empresaActual");
    const storedSucursal = sessionStorage.getItem("sucursalActual");
    const storedSucursalData = sessionStorage.getItem("sucursales");
    const storedSucursalId = sessionStorage.getItem("sucursalId");
  
    if (storedEmpresa) {
      dispatch(setEmpresaActual(JSON.parse(storedEmpresa)));
    }
  
    if (storedSucursal) {
      dispatch(setSucursalActual(JSON.parse(storedSucursal)));
    }
  
    if (storedSucursalData) {
      dispatch(setDataSucursales(JSON.parse(storedSucursalData)));
    }
  
    if (storedSucursalId) {
      dispatch(setEmpresaId(JSON.parse(storedSucursalId)));
    }
  }, [dispatch]);
  
  useEffect(() => {
    sessionStorage.setItem("empresaActual", JSON.stringify(empresaActual));
  }, [empresaActual]);
  
  useEffect(() => {
    sessionStorage.setItem("sucursalActual", JSON.stringify(sucursalActual));
  }, [sucursalActual]);
  
  useEffect(() => {
    sessionStorage.setItem("sucursales", JSON.stringify(sucursales));
  }, [sucursales]);
  
  useEffect(() => {
    sessionStorage.setItem("sucursalId", JSON.stringify(sucursalId));
  }, [sucursalId]);

  return (
    <>
      <NavBar/>
      <div className="AppContainer">
        {!isHomePage && !SucursalPage && <SideBar />}
        <div className="Content">
          <Routes>
            <Route path="/inicio" element={<InicioDashboard />} />
            <Route path="/insumos" element={<ScreenInsumos />} />
            <Route
              path="/articulosManufacturados"
              element={<ArticuloManufacturadoScreen />}
            />
            <Route path="/usuarios" element={<ScreenUsuario />} />
            <Route path="/categorias" element={<ScreenCategorias />} />
            <Route path="/promociones" element={<ScreenPromociones />} />
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