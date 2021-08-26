/** @format */
var webpack = require("webpack")

module.exports = {
	devtool: "cheap-module-eval-source-map",
	entry: [
		"eventsource-polyfill", // necessary for hot reloading with IE
		"webpack-hot-middleware/client",
		"./src/app"
	],
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	],
	module: {
		loaders: [
			{
				test: /\.scss$/,
				loaders: ["style", "css", "sass"]
			}
		]
	}
}
