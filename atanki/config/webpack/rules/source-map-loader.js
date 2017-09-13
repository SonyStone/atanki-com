module.exports = function() {
    return {
        module: {
            rules: [
                /**
                 * ```
                 * npm i source-map-loader --save-dev
                 * ```
                 * Extracts source maps from existing source files
                 * [github]{@link https://github.com/webpack-contrib/source-map-loader}
                 * 
                 */
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader',
                    exclude: [
                        /(\\|\/)node_modules(\\|\/)/
                    ],
                },
            ],
        },
    };
};
