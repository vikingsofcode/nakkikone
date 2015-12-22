'use strict';

var path = require('path');
var webpack = require('webpack');
var extend = require('lodash').extend;
var BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var production = process.env.NODE_ENV === 'production';

var entries = ['./client/Index.jsx'];

var plugins = [
  require('webpack-notifier')
];

if(!production) {
  plugins = [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BrowserSyncPlugin({
      proxy: 'localhost:6678',
      open: false,
      ui: false,
      notify: false
    })
  ].concat(plugins);
}

module.exports = {
  devtool: 'inline-source-map',
  entry: entries,
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  plugins: plugins,
  resolve: {
    modulesDirectories: ['./client', './node_modules'],
    extensions: ['', '.js', '.jsx', '.styl']
  },
  module: {
    loaders: [
      {
        test: /\.jsx$|\.js$/,
        loader: 'babel',
        include: path.join(__dirname, 'client'),
        query: {
              stage: 0,
                plugins: ['react-transform'],
                extra: {
                "react-transform": [{
                    "target": "react-transform-hmr",
                    "imports": ["react"],
                    "locals": ["module"]
                }, {
                    "target": "react-transform-catch-errors",
                    "imports": ["react", "redbox-react"]
                }]
            }
          }
      },
      {
        test: /\.styl$/,
        loaders: ['style', 'css', 'stylus']
      }
    ]
  }
};
