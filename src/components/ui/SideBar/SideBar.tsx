import CIcon from '@coreui/icons-react'
import { CBadge, CNavItem, CNavTitle, CSidebar, CSidebarHeader, CSidebarNav, CSidebarToggler } from '@coreui/react'
import styles from './SideBar.module.css'
import {cilSpeedometer,cilFactory,cilRestaurant,cilGift,cilUser,cilFeaturedPlaylist,cilDrink, cilMug, cilList, cilAddressBook} from '@coreui/icons';

export const SideBar = () => {
  return (
    <CSidebar className={styles.SideBarBig}>
      <CSidebarNav>
        <CNavTitle>Dashboard</CNavTitle>
        <CNavItem href="/inicio">
          <CIcon customClassName="nav-icon" icon={cilSpeedometer} /> Inicio
        </CNavItem>
        {/* <CNavItem href="/sucursales">
          <CIcon customClassName="nav-icon" icon={cilFactory} /> Sucursales
          
        </CNavItem> */}
        <CNavItem href="/pedidos">
          <CIcon customClassName="nav-icon" icon={cilList} /> Pedidos
        </CNavItem>
        <CNavItem href="/articulosManufacturados">
          <CIcon customClassName="nav-icon" icon={cilRestaurant} /> Productos
        </CNavItem>
        <CNavItem href="/promociones">
          <CIcon customClassName="nav-icon" icon={cilGift} /> Promociones
          <CBadge color="primary ms-auto">NEW</CBadge>
        </CNavItem>
        <CNavItem href="/empleados">
          <CIcon customClassName="nav-icon" icon={cilAddressBook} /> Empleados
        </CNavItem>
        {/* <CNavGroup
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
        </CNavGroup> */}
        <CNavItem href="/categorias">
          <CIcon customClassName="nav-icon" icon={cilFeaturedPlaylist} /> Categorias
        </CNavItem>
        <CNavItem href="/insumos">
          <CIcon customClassName="nav-icon" icon={cilDrink} /> Insumos
        </CNavItem>
        <CNavItem href="/unidadMedida">
          <CIcon customClassName="nav-icon" icon={cilMug} /> Unidad de Medida
        </CNavItem>
      </CSidebarNav>
      <CSidebarHeader className="border-top">
        <CSidebarToggler />
      </CSidebarHeader>
      <CSidebarHeader className="border-bottom"/> {/* Arreglar */}
    </CSidebar>
  );
};