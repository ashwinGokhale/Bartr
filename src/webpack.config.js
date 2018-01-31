// Sample Webpack Configuration
const path = require('path');
const webpack = require('webpack');

module.exports = {
  // devtool: "source-map",

  resolve: {
    extensions: [".js", ".jsx"],
    alias: {
      'firebase-database': path.resolve(__dirname, '../functions/src/firebase-database'),
    },
  },
  resolveLoader: {
    modules: [path.resolve(__dirname, "./node_modules")],
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [ "react", ["es2015", {modules: false}], "stage-0"]
      }
    }]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,   // enable source maps to map errors (stack traces) to modules
      output: {
        comments: false, // remove all comments
      },
    }),
  ]
};
