import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n/index.js'; // must import before App
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
