import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';

import Router from './router.jsx';
import  AuthProvider  from './context/AuthProvider.jsx';
import CreditsProvider from "./context/CreditsContext";


import './i18n.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CreditsProvider>
          <Router />
        </CreditsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
