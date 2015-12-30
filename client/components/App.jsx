import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


export default class App extends React.Component {
  render() {
    return (
      <p>
        Lo there, do I see my father, <br />
        Lo there, do I see my mother, my sisters and brothers, <br />
        Lo there, do I see the line of my people, back to the beginning, <br />
        Lo, they do call to me, they bid me take my place among them, <br />
        In the halls of Valhalla where the brave may code forever.
    </p>
    )
  }
}

App.displayName = 'App';
App.propTypes = {
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weiners: state.weiner.weiners
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
