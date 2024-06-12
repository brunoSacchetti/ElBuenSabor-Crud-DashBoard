import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { useEffect, useState } from "react";
import { setEmpresaActual } from "../../../redux/slices/EmpresaReducer";
import { setSucursalActual } from "../../../redux/slices/SucursalReducer";
import { LogoutButton } from "../../pages/Login/LogoutButton/LogoutButton";
import { Unstable_Popup as Popup } from '@mui/base/Unstable_Popup';
import { Popover, Typography } from "@mui/material";

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
  const user = JSON.parse(sessionStorage.getItem('usuario') || "null");

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



  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event:any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


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
          </Box>
          <Box sx={{ flexGrow: 1 }} />

          <div style={{display:"flex",gap:"0.2rem", cursor:"pointer"}} onClick={handleClick}>
          
            <img src={user.picture} alt={user.nickname} style={{width:"1.8rem",borderRadius:"5rem"}} />
         
        <div style={{color:"black",marginRight:"1.5rem"}}>{user.nickname}</div>
        </div>
<Popover
  id={id}
  open={open}
  anchorEl={anchorEl}
  onClose={handleClose}
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'left',
  }}
  transformOrigin={{
    vertical: 'top',
    horizontal: 'center',
  }}
>
  <Typography sx={{ p: 2 }}><LogoutButton/></Typography>
</Popover>

        </Toolbar>
      </Container>
    </AppBar>
  );
};
