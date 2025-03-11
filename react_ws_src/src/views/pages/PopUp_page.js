import React, { Component } from "react";
import { useParams } from "react-router-dom";
import PopUp from "../layouts/PopUp";
import PropTypes from "prop-types";

// Create a wrapper component that uses hooks and passes params as props
function PopUpPageWrapper(props) {
  const params = useParams();
  return <PopUp_page params={params} {...props} />;
}

// Main component implementation
class PopUp_page extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { pu_page } = this.props.params;
    const page_x = app.settings.ws_conf.pgs[pu_page];

    if (!pu_page || !page_x) return null;

    // console.log(page_x)

    return (
      <PopUp pageTitle={page_x.pg_name}>
        <div dangerouslySetInnerHTML={{ __html: page_x.__cdata }} />
      </PopUp>
    );
  }
}

PopUp_page.propTypes = {
  params: PropTypes.any,
};

// Export the wrapper as the default
export default PopUpPageWrapper;
