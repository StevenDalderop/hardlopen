var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry:  {
	  start: path.join(__dirname, 'src/index'),
	  login: path.join(__dirname, 'src/containers/login'), 
  },
  output: {
    path: path.join(__dirname, 'static/app'),
	  publicPath: "/static/",
    filename: '[name].js'
  },
  module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        }
      ],
    },
}