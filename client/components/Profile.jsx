import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import io from 'socket.io-client';
let socket = io('http://localhost:6678');

export default class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
          <p>Profile page</p>
      </div>

    )
  }
}

Profile.displayName = 'Profile';
Profile.propTypes = {
  users: PropTypes.array,
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weiners: state.weiner.weiners,
    users: state.user.users
  };
}

function mapDispatchToProps(dispatch) {
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);
