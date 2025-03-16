import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ga from '../utils/ga-wrapper';
import Main from '../views/Main';
import Ttt from '../views/ttt/Ttt';
import TxtPage from '../views/pages/Txt_page';
import PopUpPage from '../views/pages/PopUp_page';
import Contact from '../views/pages/Contact';
import ErrorPage from '../views/pages/ErrorPage';
import prep_env from '../models/prep_env';

// Error boundary component to catch rendering errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error Boundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
    
    // Display in error container if available
    if (window.displayError) {
      window.displayError(
        'React Component Error',
        `${error.toString()}\n\nComponent Stack: ${errorInfo.componentStack}`
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          margin: '20px', 
          border: '1px solid #e74c3c',
          borderRadius: '5px',
          backgroundColor: '#fef5f5'
        }}>
          <h2 style={{ color: '#e74c3c' }}>Something went wrong</h2>
          <p>We're sorry, an error occurred while rendering this component.</p>
          <p>Error: {this.state.error && this.state.error.toString()}</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Component Stack</summary>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <div style={{ marginTop: '20px' }}>
            <button onClick={() => window.location.reload()}>
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Initialize app object before any components render
if (!window.app) {
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
      // Default show_page implementation
    },
    // Add event methods
    on: (eventName, callback) => {
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
      if (!eventHandlers[eventName]) return;
      eventHandlers[eventName].forEach(callback => {
        try {
          callback(...args);
        } catch (e) {
          // Error in event handler
        }
      });
    }
  };
}

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAppReady, setIsAppReady] = useState(false);
  const [appError, setAppError] = useState(null);

  // Define startApp before it's used in useEffect
  const startApp = () => {
    try {
      // Initialize Google Analytics
      if (window.app.settings.ws_conf && window.app.settings.ws_conf.conf && window.app.settings.ws_conf.conf.ga_acc) {
        ga.initialize(window.app.settings.ws_conf.conf.ga_acc.an);
        ga.pageview(window.location.pathname);
      }
      
      setIsAppReady(true);
    } catch (error) {
      setAppError(error.message || 'Error initializing application');
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
          navigate(u);
          break;
      }
    };

    try {
      // Update the show_page method
      window.app.show_page = handleShowPage;

      // Initialize environment
      prep_env(startApp);

      window.addEventListener('show_page', handleShowPage);
    } catch (error) {
      setAppError(error.message || 'Error setting up application');
    }

    return () => {
      window.removeEventListener('show_page', handleShowPage);
    };
  }, [navigate]);

  // Show loading or error state
  if (appError) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Application Error</h1>
        <p>{appError}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }

  // Main app render
  return (
    <ErrorBoundary>
      <div className="app">
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
    </ErrorBoundary>
  );
};

export default App; 