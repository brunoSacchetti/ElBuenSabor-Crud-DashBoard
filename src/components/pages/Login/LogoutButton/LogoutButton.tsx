import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { Button } from 'react-bootstrap';

export const LogoutButton = () => {
  const { logout } = useAuth0();

  const handleLogout = () => {
    try {
      sessionStorage.clear()
      logout({ logoutParams: { returnTo: window.location.origin + "/login" } });
    } catch (error) {
      
      console.error('Error during logout:', error);
      alert('Hubo un error al cerrar sesión. Inténtalo de nuevo.');
    }
  };

  return (
    <Button onClick={handleLogout} style={{backgroundColor:"red", border:"none"}} >
      Cerrar Sesión
    </Button>
  );
};
