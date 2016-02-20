var path = require('path');
var webpack = require('webpack');
// var extractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  context: path.resolve('app/src/'),
  entry: {bundle: './main'},
  output: {
    path: path.resolve('build/js/'),
    publicPath:'/public/js/',
    filename: '[name].js',
  },
  devServer: {
    contentBase: 'public'
  },
  resolve: {
    extentions: ['', 'js']
  },
  module: {
    preLoaders: [
      {
        test: /\.js$/,
        exclude: /node_modules|bootstrap/,
        loader: 'jshint-loader'
      }
    ],
    loaders: [
      { test: /\.css$/, loader: 'style!css' },
      { test: /\.less$/, exclude: /node_modules|bootstrap/, loader: "style-loader!css-loader!less-loader"},
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
      { test: /\.(woff|woff2)$/, loader: "url?prefix=font/&limit=5000" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
      { test: /\.(png|jpg|jpeg|gif)$/, loader: 'url-loader?limit=8192' }
    ]
  },
};
