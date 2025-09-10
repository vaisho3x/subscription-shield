import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css'; // Ensure your main CSS file is imported

// This finds the 'root' div in your public/index.html file
const root = ReactDOM.createRoot(document.getElementById('root'));

// This tells React to render your main App component inside that div
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
