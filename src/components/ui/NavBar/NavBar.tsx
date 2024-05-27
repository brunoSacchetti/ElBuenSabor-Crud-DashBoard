import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useEffect } from "react";
import { setEmpresaActual } from "../../../redux/slices/EmpresaReducer";
import { setSucursalActual } from "../../../redux/slices/SucursalReducer";

// Definición de las páginas y sus rutas
const pages = [
  { title: "Listado de Empresas", route: "/" },
  // { title: "Producto", route: "/producto" },
];

interface NavBarProps {
  selectedCompanyName?: string;
}

export const NavBar: React.FC<NavBarProps> = ({ selectedCompanyName }) => {
  const navigate = useNavigate();
  const location = useLocation();  // Hook para obtener la ruta actual

  const selectedCompany = useAppSelector((state) => state.empresa.empresaActual);
  //const selectedSucursal = useAppSelector((state) => state.sucursal.sucursalActual?.nombre);
  const selectedSucursal = useAppSelector((state) => state.sucursal.sucursalActual);

  const dispatch = useAppDispatch();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  /* useEffect(() => {
    // Load company and branch names from localStorage or API
    const empresa = JSON.parse(localStorage.getItem("empresa") || "null");
    const sucursal = JSON.parse(localStorage.getItem("sucursal") || "null");

    if (empresa) {
      dispatch(setEmpresaActual(empresa));
    }
    if (sucursal) {
      dispatch(setSucursalActual(sucursal));
    }
  }, [dispatch]); */

  return (
    <AppBar position="static" style={{ background: "#f09e2f" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Button
                key={page.title}
                onClick={() => handleNavigate(page.route)}
                sx={{ my: 2, color: "white", display: "block" }}
              >
                {page.title}
              </Button>
            ))}
          </Box>
          {location.pathname === "/inicio" && selectedCompany && selectedSucursal && (
            <Box component="span" sx={{ color: "white", mx: 2 }}>
              {selectedCompany.nombre} - {selectedSucursal.nombre}
            </Box>
          )}
          {selectedCompany && selectedSucursal && location.pathname !== "/" && location.pathname !== "/inicio" && (
            <Box component="span" sx={{ color: "white", mx: 2 }}>
              Empresa: {selectedCompany.nombre}
            </Box>
          )}
          {/* {selectedCompany && selectedSucursal && location.pathname !== "/" && (
            <Box component="span" sx={{ color: "white", mx: 2 }}>
              {location.pathname !== "/sucursales" && (
                <>
                  Empresa: {selectedCompany.nombre} - {selectedSucursal.nombre}
                </>
              )}
              {location.pathname === "/sucursales" && (
                <>
                  {selectedCompany.nombre} - {selectedSucursal.nombre}
                </>
              )}
            </Box>
          )} */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
