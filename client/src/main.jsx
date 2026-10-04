import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { CVProvider } from './context/CVContext';
import { ToastProvider } from './context/ToastContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <CVProvider>
          <App />
        </CVProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
