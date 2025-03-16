import React from "react";
import Header from "./Header";
import Footer from "./Footer";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    // Add a small delay to allow content to load
    setTimeout(() => {
      this.setState({ loading: false });
    }, 300);
  }

  render() {
    const { loading, error } = this.state;

    if (error) {
      return (
        <div className="error-container">
          <div className="error-message">
            <i className="fa fa-exclamation-triangle" aria-hidden="true"></i>
            <p>An error occurred: {error.message}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="app-wrapper">
        <Header loading={loading} />

        <main className="main-content">
          {loading ? (
            <div className="loading-container">
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
              <p>Loading...</p>
            </div>
          ) : (
            <div className="container">{this.props.children}</div>
          )}
        </main>

        <Footer loading={loading} />
      </div>
    );
  }
}

export default Main;
