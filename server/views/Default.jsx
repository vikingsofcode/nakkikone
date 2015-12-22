// Default layout template
import React from 'react';

export default class Default extends React.Component {

  render() {

    return (
      <html>
      <head>
        <meta charSet="utf-8"></meta>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"></meta>
        <title>Youtify</title>
      </head>
      <body>
        <div id="app"></div>
        <script src="public/bundle.js"></script>
      </body>
      </html>
    );
  }
};
