import { useAuth0 } from '@auth0/auth0-react';
import React from 'react'
import { Button } from 'react-bootstrap';

export const LogoutButton = () => {
  
/* const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  }
 */
  const {logout} = useAuth0(); 

  return (
    <>
        <Button 
            onClick={() => logout({logoutParams: {returnTo: "/login"}})}
        >
        Cerrar Sesion
        </Button>
    </>
  )
}
