var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
	devtool: 'source-map',
	entry: [
		'./src/app'
	],
	context: path.join(__dirname),
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: './'
	},
	plugins: [
		new ExtractTextPlugin('style.css'),
		new webpack.optimize.OccurrenceOrderPlugin(),
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			}
		})
	],
	module: {
		loaders: [
			{
				test: /\.(ico|gif|png|html|jpg|swf|xml|svg)$/,
				loader: 'file-loader?name=[path][name].[ext]'
			},
			{
				test: /\.scss$/,
				loader: ExtractTextPlugin.extract(
					'style-loader',
					'css-loader!sass-loader'
				)
			},
			{
				test: /\.jsx?/,
				loaders: ['babel-loader'],
				include: path.join(__dirname, 'src')
			},
			{
				test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
				loader: 'imports-loader?define=>false&this=>window'
			},
		]
	},
}
