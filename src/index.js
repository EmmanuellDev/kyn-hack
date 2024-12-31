import React from 'react';
import ReactDOM from 'react-dom/client'; // Correct import for React 18
import './index.css'; // Import your CSS file
import App from './App'; // Import the main App component
import { BrowserRouter } from 'react-router-dom'; // For routing

// Create the root element
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render the app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
