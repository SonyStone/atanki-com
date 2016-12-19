const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
	entry: './app/main',
	output: {
		filename: 'bundle.js',
		path: './dist'
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	devtool: 'source-map',
	module: {
		loaders: [
			{
				test: /\.ts$/,
				loader: 'awesome-typescript-loader'
			}
		]
	},
	plugins: [
		new CheckerPlugin()
	]
}
