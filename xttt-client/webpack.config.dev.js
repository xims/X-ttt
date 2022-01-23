var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'eventsource-polyfill', // necessary for hot reloading with IE
        'webpack-hot-middleware/client',
        './src/app',
    ],
    output: {
        path: path.join(__dirname, 'build/public'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/static/images'),
                to: 'images/',
            },
        ]),
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
                test: /\.(xml)$/,
                loader: 'file?name=[name].[ext]',
            },
            {
                test: /\.(ico|gif|png|html|jpg|swf|svg)$/,
                loader: 'file?name=[path][name].[ext]',
            },
            {
                test: /\.jsx?/,
                loaders: ['babel'],
                include: path.join(__dirname, 'src'),
            },
            {
                test: /\.scss$/,
                loaders: ['style', 'css', 'sass'],
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css'],
            },
            {
                test: /(flickity|fizzy-ui-utils|get-size|unipointer|imagesloaded)/,
                loader: 'imports?define=>false&this=>window',
            },
        ],
    },
}