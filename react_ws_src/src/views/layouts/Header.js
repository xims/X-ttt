import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

// import jquery from 'jquery'

import MessageBar from "../layouts/MessageBar";

export default class Header extends Component {
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
    console.log("Header: Configuration loaded event received");
    this.setState({ configLoaded: true });
  };

  render() {
    // Add safety check for ws_conf and header
    if (
      !window.app ||
      !window.app.settings ||
      !window.app.settings.ws_conf ||
      !window.app.settings.ws_conf.header
    ) {
      console.warn("Header config not available yet");
      return (
        <header id="main_header">
          <div>Loading...</div>
        </header>
      );
    }

    return (
      <header id="main_header">
        <div id="brand">
          <div className="container">
            <Link
              to={app.settings.ws_conf.header.head_l_logo?.u || "/"}
              className="logo-tl"
            >
              <img
                src={app.settings.ws_conf.header.head_l_logo?.i || ""}
                alt="Logo"
              />
            </Link>

            <Link
              to={app.settings.ws_conf.header.site_title?.u || "/"}
              className="main-site-name"
            >
              {app.settings.ws_conf.header.site_title?.txt || "X Tic Tac Toe"}
            </Link>

            <nav>
              <ul>
                {app.settings.ws_conf.main_menu?.pages?.p?.map(function (p, i) {
                  return (
                    <li key={i}>
                      <Link to={p.u || "/"}>
                        <i
                          className={"fa fa-2x " + (p.ico || "")}
                          aria-hidden="true"
                        ></i>
                        {p.name}
                      </Link>
                    </li>
                  );
                }) || (
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>

        <MessageBar />
      </header>
    );
  }
  // <li className='showMobile'>
  // 	<Link ref='lnkMenu' className='menu no-interfere' to='' onClick={this.showHomeClicked.bind(this)}>menu</Link>
  // </li>
  /*
	showPageClicked (e) {
		e.preventDefault()
		this.context.router.push(e.target.href)
		jquery(e.target).toggleClass('active')
		return false
	}

	showHomeClicked (e) {
		e.preventDefault()
		this.context.router.push('/')
		jquery(e.target).toggleClass('active')
		return false
	}
*/
}

// property validation
Header.propTypes = {
  children: PropTypes.any,
};
