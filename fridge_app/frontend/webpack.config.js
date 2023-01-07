const path = require('path');

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, './static/frontend'),
		filename: '[name].js',
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	optimization: {
		minimize: true,
	},
	performance: {
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
};
