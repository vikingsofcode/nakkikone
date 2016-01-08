// Default layout template
import React from 'react';
import Layout from './Layout';

export default class Profile extends React.Component {

  render() {
    return (
      <Layout
        title="Profile"
        />
    );
  }
}

Profile.displayName = 'Profile';
