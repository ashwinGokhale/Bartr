const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require("autoprefixer");
const path = require('path');

const browserConfig = {
  entry: "./src/browser/index.js",
  stats: {
    warnings:false
  },
  output: {
    path: path.resolve(__dirname),
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
            query: { presets: ["react-app"] }
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
    })
  ]
};

const serverConfig = {
  entry: "./src/server/index.js",
  // resolve: {
  //   extensions: [".js", ".jsx"],
  //   alias: {
  //     'firebase-database': path.resolve(__dirname, 'functions/firebase-database'),
  //   },
  // },
  // resolveLoader: {
  //   modules: [path.resolve(__dirname, "node_modules")],
  // },
  stats: {
    warnings:false
  },
  node: {
    __filename: true,
    __dirname: true
  },
  target: "node",
  output: {
    path: path.resolve(__dirname, 'functions'),
    filename: "index.js",
    libraryTarget: "commonjs2",
    publicPath: path.resolve(__dirname, 'public')
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
        query: { presets: ["react-app"] }
      }
    ]
  }
};

module.exports = [browserConfig, serverConfig];
