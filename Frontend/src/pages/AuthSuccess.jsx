import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Manually parse hash for query params: #/auth-success?token=...
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : null;

    if (queryString) {
      const params = new URLSearchParams(queryString);
      const token = params.get('token');

      if (token) {
        // 1. Save Token
        localStorage.setItem('token', token);
        // 2. Update App State
        window.dispatchEvent(new Event('userUpdated'));
        // 3. Redirect Home
        navigate('/');
      } else {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <Loader />;
};

export default AuthSuccess;