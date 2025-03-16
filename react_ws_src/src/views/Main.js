import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import Header from "./layouts/Header";
import MainContent from "./layouts/MainContent";
import Footer from "./layouts/Footer";

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configLoaded: false,
    };
    this.handleConfigLoaded = this.handleConfigLoaded.bind(this);
  }

  componentDidMount() {
    console.log("Main component mounted");
    // Listen for config loaded event
    window.addEventListener("app_config_loaded", this.handleConfigLoaded);
    if (window.app && window.app.settings && window.app.settings.ws_conf) {
      this.setState({ configLoaded: true });
    }
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
    const { popup, mainContent } = this.props;
    return (
      <div className="main-layout">
        <Header />
        <main className="main-content">
          <section className="hero-section">
            <Container>
              <Row className="align-items-center g-5">
                <Col lg={6} md={12} className="order-lg-1 order-2">
                  <div className="hero-content">
                    <h1 className="hero-title display-3 fw-bold">
                      X Tic Tac Toe
                    </h1>
                    <p className="hero-subtitle fs-4 text-primary mb-3">
                      Multiplayer Strategy Game
                    </p>
                    <div className="hero-divider"></div>
                    <p className="hero-description lead mb-4">
                      Challenge your friends to a game of strategy and skill!
                      Play against others in this multiplayer Tic Tac Toe game
                      built with React.js and Node.js.
                    </p>
                    <div className="d-flex flex-wrap gap-3">
                      <Button
                        href="/ttt"
                        variant="primary"
                        size="lg"
                        className="d-flex align-items-center"
                      >
                        <span>Play Now</span>
                        <i className="ms-2 fa fa-arrow-right"></i>
                      </Button>
                      <Button
                        href="#how-to-play"
                        variant="outline-secondary"
                        size="lg"
                      >
                        How to Play
                      </Button>
                    </div>
                  </div>
                </Col>
                <Col lg={6} md={12} className="order-lg-2 order-1">
                  <div className="game-preview-container d-flex justify-content-center">
                    <div className="game-preview">
                      <div className="ttt-preview-board">
                        <div className="ttt-row">
                          <div className="ttt-cell x"></div>
                          <div className="ttt-cell"></div>
                          <div className="ttt-cell o"></div>
                        </div>
                        <div className="ttt-row">
                          <div className="ttt-cell"></div>
                          <div className="ttt-cell x"></div>
                          <div className="ttt-cell"></div>
                        </div>
                        <div className="ttt-row">
                          <div className="ttt-cell o"></div>
                          <div className="ttt-cell"></div>
                          <div className="ttt-cell"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          </section>

          <section className="features-section bg-light py-5" id="how-to-play">
            <Container>
              <h2 className="section-title text-center mb-5">How to Play</h2>
              <Row className="g-4">
                <Col lg={4} md={6} sm={12}>
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon-wrap mb-4">
                        <div className="feature-icon">1</div>
                      </div>
                      <Card.Title as="h3" className="mb-3">
                        Connect
                      </Card.Title>
                      <Card.Text>
                        Join the game and wait for an opponent or invite a
                        friend
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon-wrap mb-4">
                        <div className="feature-icon">2</div>
                      </div>
                      <Card.Title as="h3" className="mb-3">
                        Play
                      </Card.Title>
                      <Card.Text>
                        Take turns placing your mark (X or O) on the 3x3 grid
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={4} md={6} sm={12}>
                  <Card className="h-100 border-0 shadow-sm hover-card">
                    <Card.Body className="text-center p-4">
                      <div className="feature-icon-wrap mb-4">
                        <div className="feature-icon">3</div>
                      </div>
                      <Card.Title as="h3" className="mb-3">
                        Win
                      </Card.Title>
                      <Card.Text>
                        Get three of your marks in a row (horizontal, vertical,
                        or diagonal)
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          {mainContent}
        </main>
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
