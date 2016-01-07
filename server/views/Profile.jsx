// Default layout template
import React from 'react';

export default class Profile extends React.Component {

  render() {
    return (
      <html>
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <title>Weiner Machine - App - Profile</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="/public/bundle.js"></script>
      </body>
      </html>
    );
  }
}
