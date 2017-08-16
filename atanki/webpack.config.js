let path = require('path');
const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
	watch: true,
	entry: './app/main',
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ['awesome-typescript-loader'],
			},
			{ 
				test: /\.js$/,
				use: ["source-map-loader"],
				enforce: "pre",
			},
			{
				test: /\.(png|svg|jpg|gif)$/,
				use: ['file-loader'],
			}
		]
	},
	plugins: [
		new CheckerPlugin()
	]
}
