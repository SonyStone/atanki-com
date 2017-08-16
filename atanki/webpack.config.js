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
    module: {
        rules: [{
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader',
            ],
        }],
    },
	plugins: [
		new CheckerPlugin()
	]
}
