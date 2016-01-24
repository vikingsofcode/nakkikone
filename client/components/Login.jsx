import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import './login.styl';

export default class Login extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="login">
          <div className="login-logo"></div>
          <a href="/login" className="btn btn-login">GitHub Login</a>
      </div>

    )
  }
}

Login.displayName = 'Login';
Login.propTypes = {
  users: PropTypes.array,
  weiners: PropTypes.array
};

function mapStateToProps(state) {
  return {
    weiners: state.weiner.weiners,
    users: state.user.users
  };
}

export default connect(
  mapStateToProps
)(Login);
