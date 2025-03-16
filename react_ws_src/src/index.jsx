import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/App';
import store from './store';

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Import Font Awesome
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import styles
import './sass/main.scss';

// Create root element
const container = document.getElementById('root');

if (!container) {
  // Create a visible error on the page
  document.body.innerHTML = '<div style="color: red; padding: 20px; font-family: sans-serif;">' +
    '<h1>Error: Root element not found</h1>' +
    '<p>The application could not find the "root" element to mount on.</p>' +
    '<p>Check the HTML file and ensure there is a <div id="root"></div> element.</p>' +
    '</div>';
} else {
  try {
    const root = createRoot(container);
    
    // Render the app with Redux Provider
    root.render(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );
  } catch (error) {
    // Display error on page
    container.innerHTML = `<div style="color: red; padding: 20px; font-family: sans-serif;">
      <h1>Error Rendering Application</h1>
      <p>${error.message}</p>
      <pre>${error.stack}</pre>
    </div>`;
  }
} 