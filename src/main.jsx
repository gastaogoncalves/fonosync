import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// O A11yProvider já envolve a aplicação dentro do App.jsx.
// Mantê-lo aqui também criava dois contextos de acessibilidade em paralelo.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);