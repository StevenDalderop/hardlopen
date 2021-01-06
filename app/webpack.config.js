var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var WriteFilePlugin =require('write-file-webpack-plugin');
module.exports = {
  entry:  {
	  index: path.join(__dirname, 'src/containers/index'),
	  login: path.join(__dirname, 'src/containers/login'), 
	  wedstrijden: path.join(__dirname, 'src/containers/wedstrijden'),
	  schema: path.join(__dirname, 'src/containers/schema'),
	  record: path.join(__dirname, 'src/containers/record')
  },
  output: {
    path: path.join(__dirname, 'static/app'),
	publicPath: "/static/",
    filename: '[name].js'
  },
  plugins: [
    new WriteFilePlugin(),
    new BundleTracker({
      path: __dirname,
      filename: 'webpack-stats.json'
    }),
  ],
  devServer: {
	writeToDisk: true,
  },
  module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
        },
		{
			test: /\.css$/,
			use: ['style-loader', 'css-loader']
		}
      ],
    },
}