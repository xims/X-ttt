import React, { Component } from "react";
import PropTypes from "prop-types";

export default class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configLoaded: false,
    };

    this.handleConfigLoaded = this.handleConfigLoaded.bind(this);
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
  handleConfigLoaded() {
    this.setState({ configLoaded: true });
  }

  render() {
    return (
      <section id="main_content">
        <div className="main_container">
          {this.props.children ||
            (window.app?.settings?.ws_conf?.pgs?.home?.txt ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: window.app.settings.ws_conf.pgs.home.txt.toString(),
                }}
              />
            ) : (
              <div>Loading content...</div>
            ))}
        </div>
      </section>
    );
  }
}

MainContent.propTypes = {
  children: PropTypes.any,
};
