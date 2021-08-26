/** @format */

var path = require("path")

var webpackConfig = function (env) {
	var config = require(`./webpack.config.${env}`)
	return {
		devtool: config.devtool,
		entry: config.entry,
		context: config.context,
		output: {
			path: path.join(__dirname, "../dist"),
			filename: "bundle.js",
			publicPath: "/"
		},
		plugins: [...config.plugins],
		module: {
			loaders: [
				{
					test: /\.(ico|gif|png|html|jpg|swf|xml|svg)$/,
					loader: "file?name=[path][name].[ext]"
				},

				{
					test: /\.jsx?/,
					loaders: ["babel"],
					include: path.join(__dirname, "../src")
				},
				{
					test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
					loader: "imports?define=>false&this=>window"
				},
				...config.module.loaders
			]
		}
	}
}

module.exports = webpackConfig(
	process.env.NODE_ENV === "production" ? "prod" : "dev"
)
