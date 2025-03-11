import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "./layouts/Header";
import MainContent from "./layouts/MainContent";
import Footer from "./layouts/Footer";

export default class Main extends Component {
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
    console.log("Main: Configuration loaded event received");
    this.setState({ configLoaded: true });
  };

  render() {
    const { popup, mainContent } = this.props;
    return (
      <div style={fullHeight}>
        <Header />
        <MainContent>{mainContent}</MainContent>
        <Footer />
        {popup}
      </div>
    );
  }
}

// property validation
Main.propTypes = {
  mainContent: PropTypes.object,
  bottom: PropTypes.object,
  popup: PropTypes.object,
};

// full height
const fullHeight = {
  height: "100%",
};
