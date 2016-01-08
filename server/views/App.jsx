// Default layout template
import React from 'react';
import Layout from './Layout';

export default class App extends React.Component {

  render() {
    return (
      <Layout
        title="App"
        />
    );
  }
}

App.displayName = 'App';
