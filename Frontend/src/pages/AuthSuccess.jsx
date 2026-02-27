import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // BrowserRouter: "/auth-success?token=..."
    let token = new URLSearchParams(window.location.search).get('token');

    // Backward compatibility for old hash URLs.
    const hash = window.location.hash || '';
    if (!token && hash.includes('?')) {
      const queryString = hash.split('?')[1];
      token = new URLSearchParams(queryString).get('token');
    }

    if (token) {
      localStorage.setItem('token', token);
      sessionStorage.setItem('token', token);

      window.dispatchEvent(new Event('userUpdated'));

      window.location.replace('/');
    } else {
      // No token found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  return <Loader />;
};

export default AuthSuccess;
