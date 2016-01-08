// Default layout template
import React, { PropTypes } from 'react';

export default class Layout extends React.Component {
  render() {
    return (
      <html>
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <title>Weiner Machine - {this.props.title}</title>
      </head>
      <body>
        <div className="navbar">
          <a href="/weiner" className="navbar-logo"></a>
          <nav className="navbar-nav">
            <a href="/weiner" >Home</a>
            <a href="/weiner/profile">Profile</a>
            <a href="#" >Logout</a>
          </nav>
        </div>
        <div id="app"></div>
        <script src="/public/bundle.js"></script>
      </body>
      </html>
    );
  }
}

Layout.displayName = 'Layout';
Layout.propTypes = {
  title: PropTypes.string
};
