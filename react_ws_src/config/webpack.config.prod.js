/** @format */

var path = require("path")
var webpack = require("webpack")
var ExtractTextPlugin = require("extract-text-webpack-plugin")

module.exports = {
	devtool: "source-map",
	entry: ["../src/app"],
	context: path.join(__dirname, "../static"),
	plugins: [
		new ExtractTextPlugin("style.css"),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.DefinePlugin({
			"process.env": {
				NODE_ENV: JSON.stringify("production")
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compressor: {
				warnings: false
			}
		})
	],
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract("style", "css!sass")
			}
		]
	}
}
