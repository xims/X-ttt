import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import getBodyHeight from "../../helpers/getBodyHeight";
import { Motion, spring } from "react-motion";
import PropTypes from "prop-types";

// Create a wrapper component that uses hooks and passes navigate as prop
function PopUpWrapper(props) {
  const navigate = useNavigate();
  return <PopUp navigate={navigate} {...props} />;
}

// Main component implementation
class PopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bodyHeight: 0,
      closing: false,
      mounted: false,
    };
  }

  componentDidMount() {
    this.setState({
      bodyHeight: getBodyHeight() + 200,
      mounted: true,
    });
  }

  render() {
    const me = this;
    const { mounted, closing, bodyHeight } = this.state;
    const bottom = closing ? -bodyHeight : 0;
    const springValue = [120, 15];

    if (!mounted) return null;

    return (
      <Motion
        defaultStyle={{ bottom: -bodyHeight }}
        style={{ bottom: spring(bottom, springValue) }}
      >
        {(value) => (
          <section id="simple_popup" style={{ bottom: value.bottom }}>
            <div className="container">
              <a
                className="close fa fa-close"
                onClick={this.closeMe.bind(me)}
              ></a>
              <h3>{this.props.pageTitle} </h3>
            </div>
            <div className="content">
              <div className="container">{this.props.children}</div>
            </div>
          </section>
        )}
      </Motion>
    );
  }

  closeMe() {
    this.setState({ closing: true });
    // Use navigate prop instead of context.router
    setTimeout(() => {
      this.props.navigate("/");
    }, 300); // Add a slight delay to allow animation to complete
  }
}

PopUp.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.any,
  navigate: PropTypes.func.isRequired,
};

// Remove context types
// PopUp.contextTypes = {
//   router: PropTypes.object.isRequired,
// };

// Export the wrapper as the default
export default PopUpWrapper;
