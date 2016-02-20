var webpackStripLoader = require('strip-loader')
var devConfig = require('./webpack.config.js');

var stripLoader = {
	test: [/\.js$/],
	loader: webpackStripLoader('console.log')
}

devConfig.module.loaders.push(stripLoader);

modules.exports = devConfig