import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { NavBar } from "../components/ui/NavBar/NavBar";
import { SideBar } from "../components/ui/SideBar/SideBar";
import "./AppRouter.css";
import { Home } from "../components/pages/Home/Home";
import { ScreenSucursales } from "../components/pages/ScreenSucursales/ScreenSucursales";
import { InicioDashboard } from "../components/pages/InicioDashboard/InicioDashboard";
import { ScreenUnidadMedida } from "../components/pages/ScreenUnidadMedida/ScreenUnidadMedida";
import { ScreenInsumos } from "../components/pages/ScreenInsumos/ScreenInsumos";
import { ArticuloManufacturadoScreen } from "../components/pages/ScreenProducto/ArticuloManufacturadoScreen";
import { useEffect, useState } from "react";
import { ScreenCategorias } from "../components/pages/ScreenCategorias/ScreenCategorias";
import { ScreenPromociones } from "../components/pages/ScreenPromocion/ScreenPromociones";
import { ScreenEmpleado } from "../components/pages/ScreenEmpleados/ScreenEmpleados";
import { Login } from "../components/pages/Login/Login";
import useAuthToken from "../hooks/useAuthToken";
import { useAuth0 } from "@auth0/auth0-react";
import RutaPrivada from "../components/PrivateRoutes/PrivateRoutes";

import { ScreenPedido } from "../components/pages/ScreenPedidos/ScreenPedidos";
import { ScreenDetallePedido } from "../components/pages/ScreenPedidos/ScreenDetallePedido";

import Charts2 from "../components/pages/Charts/Charts2";

export const AppRouter = () => {
  const location = useLocation();

  const { isAuthenticated, isLoading, user } = useAuth0();
  const getToken = useAuthToken();
  const [token, setToken] = useState<string | null>(null);

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
      {isAuthenticated ? (
        <>
          {location.pathname !== '/login' && <NavBar />}
          <div className="AppContainer">
            {location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/sucursales' && <SideBar />}
            <div className="Content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/inicio" element={<RutaPrivada component={InicioDashboard} roles={['EMPLEADO', 'ADMIN', 'COCINERO', 'CAJERO']} />} />
                <Route path="/insumos" element={<RutaPrivada component={ScreenInsumos} roles={['ADMIN', 'COCINERO']} />} />
                <Route path="/estadistica" element={<RutaPrivada component={Charts2} roles={['ADMIN']} />} />
        
                <Route path="/articulosManufacturados" element={<RutaPrivada component={ArticuloManufacturadoScreen} roles={['ADMIN', 'COCINERO']} />} />
                <Route path="/empleados" element={<RutaPrivada component={ScreenEmpleado} roles={['ADMIN']} />} />
                <Route path="/categorias" element={<RutaPrivada component={ScreenCategorias} roles={['EMPLEADO', 'ADMIN']} />} />
                <Route path="/promociones" element={<RutaPrivada component={ScreenPromociones} roles={['EMPLEADO', 'ADMIN']} />} />
                <Route path="/sucursales" element={<RutaPrivada component={ScreenSucursales} roles={['ADMIN']} />} />
                <Route path="/unidadMedida" element={<RutaPrivada component={ScreenUnidadMedida} roles={['EMPLEADO', 'ADMIN']} />} />
                <Route path="/pedidos" element={<RutaPrivada component={ScreenPedido} roles={['EMPLEADO', 'ADMIN','COCINERO', 'CAJERO']} />} />
                <Route path="/pedido/:id" element={<RutaPrivada component={ScreenDetallePedido} roles={['EMPLEADO', 'COCINERO', 'ADMIN', 'CAJERO']} />} />
                <Route path="/" element={<RutaPrivada component={Home} roles={['ADMIN']} />} />
                {/* <Route path="*" element={<Navigate to="/login" />} /> */}
              </Routes>
            </div>
          </div>
        </>
      ) : (
        <>
        <Navigate to="/login" />
        <Routes>
                <Route path="/login" element={<Login />} />
        </Routes>
        </>
      )}
    </>
  );
};

