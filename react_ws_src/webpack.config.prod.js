var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
    devtool: 'source-map',
    entry: ['../src/app'],
    context: path.join(__dirname, 'static'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: './',
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production'),
            },
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false,
            },
        }),
        new HtmlWebpackPlugin({
            title: 'XXT',
            filename: 'index.html',
            templateContent: `<html>
			<head>
			<meta name="Description" content="X-ttt built with React and Webpack, React-router, Babel, Ampersand on Node.js/Express/Socket.io" />
			<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
			<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css" />
				<script type="text/javascript">
					conf_file = './ws_conf.xml'
					base_dir = '/'
				</script>
			</head>
			<body>
			<div id="root"></div>
			</body>
		</html>`,
        }),
    ],
    module: {
        loaders: [
            {
                test: /\.(ico|gif|png|html|jpg|swf|xml|svg)$/,
                loader: 'file?name=[path][name].[ext]',
            },
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style', 'css!sass'),
            },
            {
                test: /\.jsx?/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
                loader: 'imports?define=>false&this=>window',
            },
        ],
    },
}
