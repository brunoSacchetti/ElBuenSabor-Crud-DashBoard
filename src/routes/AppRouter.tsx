import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar";
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css";
import { Home } from "../components/pages/Home/Home";
import { ScreenSucursales } from "../components/pages/ScreenSucursales/ScreenSucursales";
import { InicioDashboard } from "../components/pages/InicioDashboard/InicioDashboard";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { ScreenUnidadMedida } from "../components/pages/ScreenUnidadMedida/ScreenUnidadMedida";
import { ScreenInsumos } from "../components/pages/ScreenInsumos/ScreenInsumos";
import { ArticuloManufacturadoScreen } from "../components/pages/ScreenProducto/ArticuloManufacturadoScreen";
import { useEffect, useState } from "react";
import { setEmpresaActual } from "../redux/slices/EmpresaReducer";
import { ScreenCategorias } from "../components/pages/ScreenCategorias/ScreenCategorias";
import { setDataSucursales, setSucursalActual } from "../redux/slices/SucursalReducer";
import { ScreenPromociones } from "../components/pages/ScreenPromocion/ScreenPromociones";
import { ScreenEmpleado } from "../components/pages/ScreenEmpleados/ScreenEmpleados";
import { Login } from "../components/pages/Login/Login";
import useAuthToken from "../hooks/useAuthToken";
import { useAuth0 } from "@auth0/auth0-react";
import RutaPrivada from "../components/PrivateRoutes/PrivateRoutes";
import ISucursales from "../types/Sucursales";
import { SucursalService } from "../services/SucursalService";
import { ScreenPedido } from "../components/pages/ScreenPedidos/ScreenPedidos";
import { ScreenDetallePedido } from "../components/pages/ScreenPedidos/ScreenDetallePedido";

export const AppRouter = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const SucursalPage = location.pathname === '/sucursales';

  const { isAuthenticated, isLoading, user } = useAuth0();
  const getToken = useAuthToken();
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authToken = await getToken();
        setToken(authToken);
      } catch (error) {
        console.error('Error al obtener el token:', error);
      }
    };

    if (isAuthenticated) {
      fetchToken();
    }
  }, [getToken, isAuthenticated]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated) {
    sessionStorage.setItem('usuario', JSON.stringify(user));
    console.log('User:', user);
    console.log('Token:', token);
  }

  return (
    <>
      {location.pathname !== '/login' && <NavBar />}
      <div className="AppContainer">
        {location.pathname !== '/login' && !isHomePage && !SucursalPage && <SideBar />}
        <div className="Content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/auth-callback" element={<AuthCallback />} />  {/* Nueva ruta para la lógica post-login */}
            <Route path="/inicio" element={<RutaPrivada component={InicioDashboard} roles={['EMPLEADO', 'ADMIN']} />} />
            <Route path="/insumos" element={<RutaPrivada component={ScreenInsumos} roles={['ADMIN']} />} />
            <Route path="/articulosManufacturados" element={<RutaPrivada component={ArticuloManufacturadoScreen} roles={['ADMIN']} />} />
            <Route path="/empleados" element={<RutaPrivada component={ScreenEmpleado} roles={['ADMIN']} />} />
            <Route path="/categorias" element={<RutaPrivada component={ScreenCategorias} roles={['EMPLEADO', 'ADMIN']} />} />
            <Route path="/promociones" element={<RutaPrivada component={ScreenPromociones} roles={['EMPLEADO', 'ADMIN']} />} />
            <Route path="/sucursales" element={<RutaPrivada component={ScreenSucursales} roles={['ADMIN']} />} />
            <Route path="/unidadMedida" element={<RutaPrivada component={ScreenUnidadMedida} roles={['EMPLEADO', 'ADMIN']} />} />
            <Route path="/pedidos" element={<RutaPrivada component={ScreenPedido} roles={['EMPLEADO', 'ADMIN','COCINERO']} />} />
            <Route path="/pedido/:id" element={<RutaPrivada component={ScreenDetallePedido} roles={['EMPLEADO', 'COCINERO', 'ADMIN']} />} />
            <Route path="/" element={<RutaPrivada component={Home} roles={['ADMIN']} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </>
  );
};

// Nueva ruta para manejar la lógica después del login
const AuthCallback = () => {

  const empresaActual = useAppSelector(state => state.empresa.empresaActual);
  const sucursalActual = useAppSelector(state => state.sucursal.sucursalActual);
  const sucursales = useAppSelector(state => state.sucursal.data);
  const API_URL = import.meta.env.VITE_API_URL;

  const sucursalService = new SucursalService(API_URL + "/sucursal");

  const dispatch = useAppDispatch();
  const user = JSON.parse(sessionStorage.getItem('usuario') || '{}');

  useEffect(() => {
    const storedEmpresa = sessionStorage.getItem("empresaActual");
    const storedSucursal = sessionStorage.getItem("sucursalActual");
    const storedSucursalData = sessionStorage.getItem("sucursales");

    if (storedEmpresa) {
      dispatch(setEmpresaActual(JSON.parse(storedEmpresa)));
    }

    if (storedSucursal) {
      dispatch(setSucursalActual(JSON.parse(storedSucursal)));
    }

    if (storedSucursalData) {
      dispatch(setDataSucursales(JSON.parse(storedSucursalData)));
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
    const fetchEmpleado = async () => {
      if (user) {
        try {
          const response = await fetch(`${API_URL}/empleado/findByEmail?email=${user.email}`);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const empleadoData = await response.json();
          dispatch(setSucursalActual(empleadoData.sucursal));
          //dispatch(setEmpresaActual(empleadoData.sucursal.empresa));
          
          const responseSucursal = await sucursalService.getById(empleadoData.sucursal.id) as ISucursales;
          dispatch(setEmpresaActual(responseSucursal.empresa));

          //sessionStorage.setItem("empresaActual", JSON.stringify(empleadoData.sucursal.empresa));
          sessionStorage.setItem("sucursalActual", JSON.stringify(empleadoData.sucursal));
          sessionStorage.setItem("empresaActual", JSON.stringify(responseSucursal.empresa));

        } catch (error) {
          console.error('Error fetching empleado:', error);
        }
      }
    };

    fetchEmpleado();
  }, [user, dispatch]);

  return <Navigate to="/inicio" replace />; 
};
