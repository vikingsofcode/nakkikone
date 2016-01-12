// Default layout template
import React from 'react';
import Layout from './Layout';

export default class Login extends React.Component {

  render() {
    return (
      <Layout
        title="Login"
        />
    );
  }
}

Login.displayName = 'Login';
