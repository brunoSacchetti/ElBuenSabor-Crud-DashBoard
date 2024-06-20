import CIcon from '@coreui/icons-react'
import { CBadge, CNavItem, CNavTitle, CSidebar, CSidebarHeader, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { Link } from 'react-router-dom'
import styles from './SideBar.module.css'
import { cilSpeedometer, cilRestaurant, cilGift, cilFeaturedPlaylist, cilDrink, cilMug, cilAddressBook, cilBasket } from '@coreui/icons';

export const SideBar = () => {
  
  const userDataString = sessionStorage.getItem('usuario');
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const rol = userData["https://my-app.example.com/roles"][0];

  return (
    <CSidebar className={styles.SideBarBig}>
      <CSidebarNav>
        <CNavTitle>Dashboard</CNavTitle>
    {rol === 'COCINERO' ? <></> : <CNavItem>
          <Link to="/inicio" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Inicio
          </Link>
        </CNavItem> }
        <CNavItem>
          <Link to="/estadistica" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilGift} /> Estadisticas
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/articulosManufacturados" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilRestaurant} /> Productos
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/promociones" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilGift} /> Promociones
            <CBadge color="primary ms-auto">NEW</CBadge>
          </Link>
        </CNavItem>
        {rol === 'COCINERO' ? <></> : <CNavItem>
          <Link to="/empleados" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilAddressBook} /> Empleados
          </Link>
        </CNavItem> } 
        
        <CNavItem>
          <Link to="/categorias" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilFeaturedPlaylist} /> Categorias
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/insumos" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilDrink} /> Insumos
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/unidadMedida" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilMug} /> Unidad de Medida
          </Link>
        </CNavItem>
        <CNavItem>
          <Link to="/pedidos" className="nav-link">
            <CIcon customClassName="nav-icon" icon={cilBasket} /> Pedidos
          </Link>
        </CNavItem>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
      <CSidebarHeader className="border-bottom" /> {/* Arreglar */}
    </CSidebar>
  );
};
