import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// Esta es la importación más importante para los estilos globales.
// Si esta línea falta o tiene un error, NADA tendrá el estilo base.
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
