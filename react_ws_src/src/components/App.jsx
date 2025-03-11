import React, { useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ga from 'react-ga';
import Main from '../views/Main';
import Ttt from '../views/ttt/Ttt';
import TxtPage from '../views/pages/Txt_page';
import PopUpPage from '../views/pages/PopUp_page';
import Contact from '../views/pages/Contact';
import ErrorPage from '../views/pages/ErrorPage';
import prep_env from '../models/prep_env';

console.log('App component started'); 

// Initialize app object before any components render
if (!window.app) {
  // Define event handling methods similar to Ampersand/Backbone
  const eventHandlers = {};
  
  window.app = {
    settings: {
      is_mobile: false,
      mobile_type: null,
      can_app: false,
      ws_conf: null,
      curr_user: null,
      user_ready: false,
      user_types: [],
      basket_type: null,
      basket_total: 0,
    },
    events: {
      show_message: 'show_message',
      show_page: 'show_page',
    },
    show_page: (u) => {
      console.log('Default show_page handler', u);
    },
    // Add event methods
    on: (eventName, callback) => {
      console.log(`Registering handler for ${eventName}`);
      if (!eventHandlers[eventName]) {
        eventHandlers[eventName] = [];
      }
      eventHandlers[eventName].push(callback);
    },
    off: (eventName, callback) => {
      if (!eventHandlers[eventName]) return;
      if (!callback) {
        delete eventHandlers[eventName];
      } else {
        eventHandlers[eventName] = eventHandlers[eventName].filter(cb => cb !== callback);
      }
    },
    trigger: (eventName, ...args) => {
      console.log(`Triggering event ${eventName}`, args);
      if (!eventHandlers[eventName]) return;
      eventHandlers[eventName].forEach(callback => {
        try {
          callback(...args);
        } catch (e) {
          console.error(`Error in event handler for ${eventName}:`, e);
        }
      });
    }
  };
  console.log('window.app initialized outside component');
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Define startApp before it's used in useEffect
  const startApp = () => {
    console.log('Starting app initialization');
    // Initialize Google Analytics
    if (window.app.settings.ws_conf && window.app.settings.ws_conf.conf && window.app.settings.ws_conf.conf.ga_acc) {
      ga.initialize(window.app.settings.ws_conf.conf.ga_acc.an, { debug: true });
      ga.pageview(window.location.pathname);
    } else {
      console.warn('GA config not available');
    }
  };

  // Track page views for Google Analytics
  useEffect(() => {
    if (window.app.settings.ws_conf && window.app.settings.ws_conf.conf && window.app.settings.ws_conf.conf.ga_acc) {
      ga.pageview(location.pathname);
    }
  }, [location]);

  useEffect(() => {
    // Event listener for page navigation
    const handleShowPage = (u) => {
      switch (u) {
        case 'home':
          navigate('/');
          break;
        default:
          console.log('show_page event with:', u);
          navigate(u);
          break;
      }
    };

    // Update the show_page method
    window.app.show_page = handleShowPage;
    console.log('Updated window.app.show_page');

    // Initialize environment
    prep_env(startApp);

    window.addEventListener('show_page', handleShowPage);

    return () => {
      window.removeEventListener('show_page', handleShowPage);
    };
  }, [navigate]);

  return (
    <div className="app">
      <h1>X Tic Tac Toe</h1>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/pg/:page" element={<TxtPage />} />
        <Route path="/ttt" element={<Ttt />} />
        <Route path="/pupg/:pu_page" element={<PopUpPage />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/error/404" element={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </div>
  );
};

export default App; 