import React, { Component } from "react";
import { connect } from "react-redux";

// higher order function
export default function (ComposedComponent) {
  class Authenticate extends Component {
    constructor(props) {
      super(props);

      if (!this.props.isAuthenticated) {
        // if the user is not authenticated
        props.history.push("/");
        console.log(this.props);
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  const mapStateToProps = (state) => {
    return {
      isAuthenticated: state.isAuthenticated,
    };
  };

  return connect(mapStateToProps)(Authenticate);
}
