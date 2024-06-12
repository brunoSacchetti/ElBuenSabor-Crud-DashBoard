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
import { LogoutButton } from "../../pages/Login/LogoutButton/LogoutButton";

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
  const selectedSucursal = useAppSelector((state) => state.sucursal.sucursalActual);
  const user = JSON.parse(localStorage.getItem('usuario') || "null");

  const dispatch = useAppDispatch();

  const handleNavigate = (route: string) => {
    navigate(route);
  };

  useEffect(() => {
    // Load company and branch names from localStorage or API
    const empresa = JSON.parse(localStorage.getItem("empresa") || "null");
    const sucursal = JSON.parse(localStorage.getItem("sucursal") || "null");
    

    if (empresa) {
      dispatch(setEmpresaActual(empresa));
    }
    if (sucursal) {
      dispatch(setSucursalActual(sucursal));
    }
  }, [dispatch]);

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
          <Box sx={{ flexGrow: 1, textAlign: "center" }}>
            {location.pathname !== "/" && location.pathname !== "/sucursales" && selectedCompany && selectedSucursal && (
              <Box component="span" sx={{ color: "white", mx: 2, fontSize: "20px"}}>
                {selectedCompany.nombre} - {selectedSucursal.nombre}
              </Box>
            )}
            {/* {selectedCompany && location.pathname !== "/" && (
              <Box component="span" sx={{ color: "white", mx: 2 }}>
                Empresa: {selectedCompany.nombre}
              </Box>
            )} */}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <h3><span style={{ fontSize: "3vh" }} className="material-symbols-outlined">
          account_circle
        </span>{user.nickname}</h3>
        <LogoutButton/>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
