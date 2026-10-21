import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './style/global.css'; // <-- Importação do Tailwind e estilos globais aqui

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
