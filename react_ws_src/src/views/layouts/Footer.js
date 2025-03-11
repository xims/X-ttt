import React, { Component } from "react";
import { Link } from "react-router-dom";

// import X_logo from '../../../static/images/X_logo.png'

export default class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configLoaded: false,
    };
  }

  componentDidMount() {
    // Listen for config loaded event
    window.addEventListener("app_config_loaded", this.handleConfigLoaded);
  }

  componentWillUnmount() {
    // Clean up event listener
    window.removeEventListener("app_config_loaded", this.handleConfigLoaded);
  }

  // Method to force re-render when config is loaded
  handleConfigLoaded = () => {
    console.log("Footer: Configuration loaded event received");
    this.setState({ configLoaded: true });
  };

  render() {
    // Add safety check for ws_conf and footer
    if (
      !window.app ||
      !window.app.settings ||
      !window.app.settings.ws_conf ||
      !window.app.settings.ws_conf.footer
    ) {
      console.warn("Footer config not available yet");
      return (
        <footer>
          <div className="container">Loading...</div>
        </footer>
      );
    }

    return (
      <footer>
        <div className="container">
          <nav>
            <ul>
              {app.settings.ws_conf.footer.items?.i?.map(function (it, i) {
                return it.tp === "ln" ? (
                  <li key={i}>
                    <Link to={it.u || "/"}>{it.txt || ""}</Link>
                  </li>
                ) : (
                  <li key={i}>{it.txt || ""}</li>
                );
              }) || <li>© 2023</li>}
            </ul>
          </nav>

          <div className="foot_message">
            {" "}
            {app.settings.ws_conf.footer.foot_msg?.txt || ""}{" "}
          </div>

          <a
            className="foot-r-logo"
            href={app.settings.ws_conf.footer.foot_r_logo?.u || "#"}
            target={app.settings.ws_conf.footer.foot_r_logo?.t || "_blank"}
            rel="noopener noreferrer"
          >
            <img
              alt="footer logo"
              src={app.settings.ws_conf.footer.foot_r_logo?.i || ""}
            />
          </a>
        </div>
      </footer>
    );
  }
}
