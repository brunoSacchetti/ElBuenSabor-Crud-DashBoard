import CIcon from '@coreui/icons-react'
import { CBadge, CNavGroup, CNavItem, CNavTitle, CSidebar, CSidebarHeader, CSidebarNav, CSidebarToggler } from '@coreui/react'
import styles from './SideBar.module.css'
import {cilSpeedometer,cilFactory,cilRestaurant,cilGift,cilUser,cilFeaturedPlaylist,cilDrink} from '@coreui/icons';

export const SideBar = () => {
  return (
    <CSidebar className={styles.SideBarBig}>
      <CSidebarNav>
        <CNavTitle>Dashboard</CNavTitle>
        <CNavItem href="/inicio">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Inicio
        </CNavItem>
        <CNavItem href="/empresas">
          <CIcon customClassName="nav-icon" icon={cilFactory} /> Empresa
          
        </CNavItem>
        <CNavItem href="/articulosManufacturados">
          <CIcon customClassName="nav-icon" icon={cilRestaurant} /> Productos
        </CNavItem>
        <CNavItem href="/promociones">
          <CIcon customClassName="nav-icon" icon={cilGift} /> Promociones
          <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavItem href="/usuarios">
          <CIcon customClassName="nav-icon" icon={cilUser} /> Usuarios
        </CNavItem>
        <CNavGroup
          toggler={
            <>
              <CIcon customClassName="nav-icon" icon={cilFeaturedPlaylist} /> Categorias
            </>
          }
        >
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>{' '}
            Subcategoria 1
          </CNavItem>
          <CNavItem href="#">
            <span className="nav-icon">
              <span className="nav-icon-bullet"></span>
            </span>{' '}
            Subcategoria 2
          </CNavItem>
        </CNavGroup>
        <CNavItem href="/">
          <CIcon customClassName="nav-icon" icon={cilDrink} /> Insumos
        </CNavItem>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
      <CSidebarHeader className="border-bottom"/> {/* Arreglar */}
    </CSidebar>
  );
};