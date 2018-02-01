// Sample Webpack Configuration
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      'firebase-database': path.resolve(__dirname, '../functions/lib/firebase-database')
    },
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "./node_modules")],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  }
};
