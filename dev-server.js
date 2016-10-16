var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var webpackConfig = require('./webpack.config.js');
var compiler = webpack(webpackConfig);
var path = require('path');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var config = require('./config.js')(argv)

fs.writeFileSync('./static/config.js', 
				 'var config = ' + JSON.stringify(config) + ';');

var devServer = new WebpackDevServer(
	compiler,
	{
		contentBase: path.join(__dirname, 'static'),
		publicPath: '/'
	}
).listen(config.port, 'localhost');

console.log("Go to /webpack-dev-server/")
