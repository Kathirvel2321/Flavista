import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from '../components/Loader';

const AuthSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Extract Token from URL
    // HashRouter puts query params in location.search
    let token = new URLSearchParams(location.search).get('token');

    // Fallback: Manual hash parsing if location.search is empty
    if (!token) {
        const hash = window.location.hash;
        const parts = hash.split('?');
        if (parts.length > 1) {
            token = new URLSearchParams(parts[1]).get('token');
        }
    }

    if (token) {
  localStorage.setItem('token', token);
  sessionStorage.setItem('token', token);

  window.dispatchEvent(new Event('userUpdated'));

  navigate('/', { replace: true });
} else {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate, location]);

  return <Loader />;
};

export default AuthSuccess;