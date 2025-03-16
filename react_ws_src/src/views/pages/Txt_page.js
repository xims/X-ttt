import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link, useParams, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import parse from "html-react-parser";

// Create a wrapper component to use hooks with class components
function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    const params = useParams();
    const location = useLocation();

    return <Component {...props} params={params} location={location} />;
  }
  return ComponentWithRouterProp;
}

class Txt_page extends Component {
  constructor(props) {
    super(props);

    this.state = {
      txt_page: null,
      configLoaded: false,
      loading: true,
      error: null,
    };

    // Bind methods
    this.handleConfigLoaded = this.handleConfigLoaded.bind(this);
  }

  componentDidMount() {
    window.addEventListener("app_config_loaded", this.handleConfigLoaded);
    if (window.app && window.app.settings && window.app.settings.ws_conf) {
      this.setState({ configLoaded: true });
    }

    // Simulate loading time
    setTimeout(() => {
      this.setState({ loading: false });
    }, 500);
  }

  componentWillUnmount() {
    window.removeEventListener("app_config_loaded", this.handleConfigLoaded);
  }

  handleConfigLoaded() {
    this.setState({ configLoaded: true });
  }

  buildButtons(buttonData) {
    if (!buttonData) return [];

    // Ensure buttonData is an array
    const buttons = Array.isArray(buttonData) ? buttonData : [buttonData];

    return buttons.map((button, index) => {
      const text = button.txt || "";
      const url = button.u || "#";

      return (
        <Link key={index} to={url} className={`button ${button.cls || ""}`}>
          {button.ico && (
            <i className={`fa fa-${button.ico}`} aria-hidden="true"></i>
          )}
          <span>{text}</span>
        </Link>
      );
    });
  }

  getPageContent() {
    const { match, ws_conf } = this.props;
    let htmlContent = "";
    let pageTitle = "";

    if (ws_conf && ws_conf.pages) {
      if (match.params && match.params.page_name) {
        // We're on a specific page
        const pageName = match.params.page_name;
        const pageData = ws_conf.pages[pageName];

        if (pageData) {
          htmlContent = pageData.html || "";
          pageTitle = pageData.title || pageName;
        } else {
          return {
            htmlContent: "<p>Page not found</p>",
            pageTitle: "Not Found",
            isHome: false,
          };
        }

        return { htmlContent, pageTitle, isHome: false };
      } else {
        // We're on the home page
        if (ws_conf.home && ws_conf.home.html) {
          htmlContent = ws_conf.home.html;
          pageTitle = ws_conf.home.title || "Home";
          return { htmlContent, pageTitle, isHome: true };
        }
      }
    }

    // Default values if nothing is found
    return {
      htmlContent: "<p>Welcome to Tic Tac Toe</p>",
      pageTitle: "Home",
      isHome: true,
    };
  }

  renderHomePage(htmlContent) {
    return (
      <div className="home-page">
        <section className="hero-section">
          <div className="hero-content">
            <img
              src="/logo192.png"
              alt="X Tic Tac Toe"
              className="hero-logo pulse"
            />
            <h1>X Tic Tac Toe</h1>
            <p className="subtitle">
              A simple multiplayer Tic Tac Toe game built with React and Node.js
            </p>
            <div className="hero-buttons">
              <Link to="/ttt" className="button primary">
                <i className="fa fa-gamepad" aria-hidden="true"></i>
                <span>Play Now</span>
              </Link>
              <Link to="/info" className="button secondary">
                <i className="fa fa-info-circle" aria-hidden="true"></i>
                <span>Learn More</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="content-section">
          <div className="html-content">{parse(htmlContent)}</div>
        </section>

        <section className="features-section">
          <h2>Game Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <i className="fa fa-users" aria-hidden="true"></i>
              <h3>Multiplayer</h3>
              <p>Play against friends or random opponents online</p>
            </div>
            <div className="feature-card">
              <i className="fa fa-clock-o" aria-hidden="true"></i>
              <h3>Timed Matches</h3>
              <p>Set time limits for more exciting gameplay</p>
            </div>
            <div className="feature-card">
              <i className="fa fa-trophy" aria-hidden="true"></i>
              <h3>Win Streaks</h3>
              <p>Track your winning streaks and compete for high scores</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div className="cta-content">
            <h2>Ready to Play?</h2>
            <p>Jump into a game and start having fun!</p>
            <Link to="/ttt" className="button primary large">
              <i className="fa fa-gamepad" aria-hidden="true"></i>
              <span>Start Playing</span>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  renderContentPage(pageTitle, htmlContent) {
    return (
      <div className="content-page">
        <h1>{pageTitle}</h1>
        <div className="html-content">{parse(htmlContent)}</div>
      </div>
    );
  }

  render() {
    const { loading, error } = this.state;

    if (loading) {
      return (
        <div className="loading-container">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
          <p>Loading page content...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            <p>Error loading page: {error.message}</p>
          </div>
        </div>
      );
    }

    const { htmlContent, pageTitle, isHome } = this.getPageContent();

    return isHome
      ? this.renderHomePage(htmlContent)
      : this.renderContentPage(pageTitle, htmlContent);
  }
}

Txt_page.propTypes = {
  params: PropTypes.any,
  location: PropTypes.any,
};

const mapStateToProps = (state) => ({
  ws_conf: state.app.ws_conf,
});

// Export with router wrapper
export default connect(mapStateToProps)(withRouter(Txt_page));
