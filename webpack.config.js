const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const nodeExternals = require('webpack-node-externals');

const browserConfig = {
  entry: "./src/browser/index.js",
  stats: {
    warnings:false
  },
  output: {
    path: path.resolve(process.cwd()),
    filename: "./public/bundle.js"
  },
  devtool: "cheap-module-source-map",
  module: {
    strictExportPresence: true,
    rules: [
      {
        oneOf: [
          {
            test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: "file-loader",
            options: {
              name: "../public/media/[name].[ext]",
              publicPath: url => url.replace(/public/, "")
            }
          },
          {
            test: /js$/,
            exclude: /(node_modules)/,
            loader: "babel-loader",
            query: { presets: [ ['es2015', { modules: false }], 'react', 'stage-0' ] }
          },
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              use: [
                {
                  loader: 'css-loader', options: {
                    minimize: true,
                    sourceMap: true
                  }
                }
              ]
            })
          },
          {
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            loader: require.resolve('file-loader'),
            options: {
              name: '../public/media/[name].[ext]',
            },
          },
        ],
      },
    ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: "public/css/[name].css"
    }),
    // new UglifyJsPlugin()
  ]
};

const serverConfig = {
  entry: "./src/server/index.js",
  stats: {
    warnings:false
  },
  // node: {
  //   __filename: true,
  //   __dirname: true
  // },
  target: "node",
  output: {
    path: path.resolve(process.cwd(), 'functions'),
    filename: "index.js",
    libraryTarget: "commonjs2",
    publicPath: path.resolve(process.cwd(), 'public')
  },
  devtool: "cheap-module-source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: [/\.svg$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: "file-loader",
        options: {
          name: "../public/media/[name].[ext]",
          publicPath: url => url.replace(/public/, ''),
          emit: false
        }
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: "css-loader/locals"
          }
        ]
      },
      {
        test: /js$/,
        exclude: /(node_modules)/,
        loader: "babel-loader",
        query: { presets: [ ['es2015', { modules: false }], 'react', 'stage-0' ] }
      }
    ]
  },
  externals: {
    "firebase-admin": 'firebase-admin',
    "firebase-functions": 'firebase-functions',
    "firebase": 'firebase'
  },
  // externals: [nodeExternals()],
  plugins: [
    // new UglifyJsPlugin()
  ]
};

module.exports = [browserConfig, serverConfig];
