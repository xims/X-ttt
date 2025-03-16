import React from "react";
import { Link, useLocation } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Navbar, Nav, Container } from "react-bootstrap";

// import jquery from 'jquery'

import MessageBar from "../layouts/MessageBar";

// Create a wrapper component that has access to location
const HeaderWithRouter = (props) => {
  const location = useLocation();
  return <Header {...props} currentPath={location.pathname} />;
};

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      navItems: [],
    };
  }

  componentDidMount() {
    this.updateNavItems();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.ws_conf !== this.props.ws_conf ||
      prevProps.currentPath !== this.props.currentPath
    ) {
      this.updateNavItems();
    }
  }

  updateNavItems() {
    const { ws_conf, currentPath } = this.props;
    const isHomePage = currentPath === "/";

    if (ws_conf && ws_conf.pages) {
      const navItems = [];

      // Add Home only if not on home page
      if (!isHomePage) {
        navItems.push({
          id: "home",
          title: "Home",
          url: "/",
          icon: "home",
        });
      }

      // Add Info
      navItems.push({
        id: "info",
        title: "Info",
        url: "/info",
        icon: "info-circle",
      });

      this.setState({ navItems });
    } else {
      // Default navigation items if config not loaded
      const navItems = [];

      // Add Home only if not on home page
      if (!isHomePage) {
        navItems.push({ id: "home", title: "Home", url: "/", icon: "home" });
      }

      this.setState({ navItems });
    }
  }

  toggleNavbar = () => {
    this.setState((prevState) => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    const { loading, ws_conf } = this.props;
    const { expanded, navItems } = this.state;

    if (loading) {
      return (
        <Navbar bg="white" expand="md" className="shadow-sm py-2">
          <Container>
            <Navbar.Brand>
              <div className="d-flex align-items-center">
                <div
                  className="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
                <span>Loading...</span>
              </div>
            </Navbar.Brand>
          </Container>
        </Navbar>
      );
    }

    return (
      <header>
        <Navbar
          bg="white"
          expand="md"
          className="shadow-sm py-2 position-sticky top-0"
          expanded={expanded}
          onToggle={this.toggleNavbar}
        >
          <Container>
            <Navbar.Brand
              as={Link}
              to="/"
              className="d-flex align-items-center"
            >
              <img
                src="/logo192.png"
                alt="Logo"
                className="app-logo me-2"
                width="40"
                height="40"
              />
              <span className="site-title fw-bold">X Tic Tac Toe</span>
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="main-navbar" className="border-0">
              <i className="fas fa-bars"></i>
            </Navbar.Toggle>

            <Navbar.Collapse id="main-navbar">
              <Nav className="ms-auto">
                {navItems.map((item) => (
                  <Nav.Item key={item.id}>
                    <Nav.Link
                      as={Link}
                      to={item.url}
                      className="px-3 py-2 d-flex align-items-center"
                      onClick={() => expanded && this.toggleNavbar()}
                    >
                      <i className={`fas fa-${item.icon} me-2`}></i>
                      <span>{item.title}</span>
                    </Nav.Link>
                  </Nav.Item>
                ))}
                <Nav.Item>
                  <Nav.Link
                    as={Link}
                    to="/ttt"
                    className="ms-md-3 mt-2 mt-md-0 btn btn-primary text-white px-3 py-2"
                    onClick={() => expanded && this.toggleNavbar()}
                  >
                    <i className="fas fa-play-circle me-2"></i>
                    <span>Play Now</span>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

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

const mapStateToProps = (state) => ({
  ws_conf: state.app.ws_conf,
  loading: state.app.loading,
});

// Connect the wrapped component
const ConnectedHeader = connect(mapStateToProps)(Header);

export default (props) => <HeaderWithRouter {...props} />;

// property validation
Header.propTypes = {
  children: PropTypes.any,
  ws_conf: PropTypes.object,
  loading: PropTypes.bool,
  currentPath: PropTypes.string,
};
