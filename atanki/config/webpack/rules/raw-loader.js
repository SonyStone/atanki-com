module.exports = function() {
    return {
        module: {
            rules: [
                /**
                 * ```
                 * npm i raw-loader --save-dev
                 * ```
                 * 
                 * A loader for webpack that lets you import files as a string.
                 * [github]{@link https://github.com/webpack-contrib/raw-loader}
                 * [npm]{@link https://www.npmjs.com/package/raw-loader}
                 * [Documentation]{@link https://webpack.js.org/loaders/raw-loader/}
                 * 
                 */
                {
                    test: /\.html$/,
                    loader: 'raw-loader',
                },
            ],
        },
    };
};
