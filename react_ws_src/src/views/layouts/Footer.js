import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Container, Row, Col, Nav } from "react-bootstrap";

// import X_logo from '../../../static/images/X_logo.png'

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentYear: new Date().getFullYear(),
    };
  }

  render() {
    const { ws_conf } = this.props;
    const { currentYear } = this.state;

    // Simple rendering when config is not loaded or during loading
    if (!ws_conf) {
      return (
        <footer className="bg-light py-5 mt-auto">
          <Container>
            <Row className="justify-content-between align-items-center mb-4">
              <Col md={6} className="mb-4 mb-md-0">
                <h5 className="mb-3 text-primary">X Tic Tac Toe</h5>
                <p className="text-muted mb-4">
                  A simple Tic Tac Toe game demo built with React.js and
                  Node.js. Challenge your friends to a multiplayer game!
                </p>
                <p className="small text-muted">
                  Copyright © {currentYear} X Tic Tac Toe
                </p>
              </Col>
              <Col md={5} lg={4}>
                <h6 className="mb-3">Quick Links</h6>
                <Nav className="flex-column">
                  <Nav.Link as={Link} to="/" className="px-0 py-1">
                    <i className="fas fa-home me-2"></i> Home
                  </Nav.Link>
                  <Nav.Link as={Link} to="/ttt" className="px-0 py-1">
                    <i className="fas fa-gamepad me-2"></i> Play Game
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/pupg/terms-and-conditions"
                    className="px-0 py-1"
                  >
                    <i className="fas fa-file-contract me-2"></i> Terms
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/pupg/privacy-policy"
                    className="px-0 py-1"
                  >
                    <i className="fas fa-shield-alt me-2"></i> Privacy
                  </Nav.Link>
                  <Nav.Link as={Link} to="/contact-us" className="px-0 py-1">
                    <i className="fas fa-envelope me-2"></i> Contact
                  </Nav.Link>
                </Nav>
              </Col>
            </Row>

            <hr className="my-4" />

            <Row className="align-items-center">
              <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
                <small className="text-muted">
                  &copy; {currentYear} X Tic Tac Toe. All rights reserved.
                </small>
              </Col>
              <Col md={6} className="text-center text-md-end">
                <a
                  href="https://github.com/xims/X-ttt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-outline-secondary me-2"
                  aria-label="GitHub"
                >
                  <i className="fab fa-github"></i> GitHub
                </a>
                <a href="#" className="btn btn-sm btn-primary">
                  <i className="fas fa-play me-1"></i> Play Now
                </a>
              </Col>
            </Row>
          </Container>
        </footer>
      );
    }

    // Get footer items from config
    const footerItems =
      ws_conf.footer && ws_conf.footer.items && ws_conf.footer.items.i;
    const footerMsg =
      ws_conf.footer && ws_conf.footer.foot_msg && ws_conf.footer.foot_msg.txt;
    const footerLogo = ws_conf.footer && ws_conf.footer.foot_r_logo;

    return (
      <footer className="bg-light py-5 mt-auto">
        <Container>
          <Row className="justify-content-between align-items-center mb-4">
            <Col md={6} className="mb-4 mb-md-0">
              <h5 className="mb-3 text-primary">X Tic Tac Toe</h5>
              {footerMsg && <p className="text-muted mb-4">{footerMsg}</p>}
              <p className="small text-muted">
                Copyright © {currentYear} kisla interactive
              </p>
            </Col>
            <Col md={5} lg={4}>
              <h6 className="mb-3">Quick Links</h6>
              <Nav className="flex-column">
                {footerItems && Array.isArray(footerItems) ? (
                  footerItems.map((item, index) => (
                    <Nav.Link
                      key={`footer-item-${index}`}
                      as={item.tp === "ln" ? Link : "span"}
                      to={item.tp === "ln" ? item.u : undefined}
                      className="px-0 py-1"
                    >
                      {item.txt}
                    </Nav.Link>
                  ))
                ) : footerItems ? (
                  <Nav.Link
                    as={footerItems.tp === "ln" ? Link : "span"}
                    to={footerItems.tp === "ln" ? footerItems.u : undefined}
                    className="px-0 py-1"
                  >
                    {footerItems.txt}
                  </Nav.Link>
                ) : (
                  <>
                    <Nav.Link as={Link} to="/" className="px-0 py-1">
                      <i className="fas fa-home me-2"></i> Home
                    </Nav.Link>
                    <Nav.Link as={Link} to="/ttt" className="px-0 py-1">
                      <i className="fas fa-gamepad me-2"></i> Play Game
                    </Nav.Link>
                  </>
                )}
              </Nav>
            </Col>
          </Row>

          <hr className="my-4" />

          <Row className="align-items-center">
            <Col md={6} className="text-center text-md-start mb-3 mb-md-0">
              <small className="text-muted">
                &copy; {currentYear} kisla interactive. All rights reserved.
              </small>
            </Col>
            <Col md={6} className="text-center text-md-end">
              <a
                href="https://github.com/xims/X-ttt"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-secondary me-2"
                aria-label="GitHub"
              >
                <i className="fab fa-github"></i> GitHub
              </a>

              {footerLogo && footerLogo.i && (
                <a
                  href={footerLogo.u || "#"}
                  target={footerLogo.t || "_blank"}
                  rel="noopener noreferrer"
                  className="ms-2"
                >
                  <img src={footerLogo.i} alt="Footer logo" height="30" />
                </a>
              )}
            </Col>
          </Row>
        </Container>
      </footer>
    );
  }
}

const mapStateToProps = (state) => ({
  ws_conf: state.app && state.app.ws_conf,
});

export default connect(mapStateToProps)(Footer);
