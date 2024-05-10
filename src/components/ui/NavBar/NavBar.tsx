import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";

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

  const handleNavigate = (route: string) => {
    navigate(route);
  };

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
          {/* Renderizar el nombre de la empresa solo si no estamos en la ruta "/" */}
          {selectedCompanyName && location.pathname !== "/" && (
            <Box component="span" sx={{ color: "white", mx: 2 }}>
              Empresa: {selectedCompanyName}
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};