import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'

const bootstrapAuthFromUrl = () => {
  const url = new URL(window.location.href);
  const queryToken = url.searchParams.get('token');
  const queryError = url.searchParams.get('error');

  // Backward compatibility for old hash-based callback URLs.
  let hashToken = null;
  let hashError = null;
  if (!queryToken && window.location.hash.includes('?')) {
    const hashQuery = window.location.hash.split('?')[1];
    const hashParams = new URLSearchParams(hashQuery);
    hashToken = hashParams.get('token');
    hashError = hashParams.get('error');
  }

  const token = queryToken || hashToken;
  const error = queryError || hashError;
  if (!token && !error) return;

  if (token) {
    localStorage.setItem('token', token);
    sessionStorage.setItem('token', token);
  }

  // Clean callback params from URL without full reload.
  window.history.replaceState({}, '', '/');
};

bootstrapAuthFromUrl();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
      <App />
    </CartProvider>
  </StrictMode>,
)
