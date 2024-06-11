import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CallbackPage: React.FC = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/inicio');  
    } else {
      navigate('/login');  
    }
  }, [isAuthenticated, navigate]);

  return <div></div>;
};

export default CallbackPage;