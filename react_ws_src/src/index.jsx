import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './components/App';

// Import styles
import './sass/main.scss';

console.log('Starting React initialization...');

// Create root element
const container = document.getElementById('root');
console.log('Root container:', container);

const root = createRoot(container);
console.log('Root created');

// Render the app
console.log('About to render App component');
root.render(
  <Router>
    <App />
  </Router>
);

console.log('App rendered'); 