module.exports = function() {
    return {
        module: {
            rules: [
                /**
                 * ```
                 * npm i file-loader --save-dev
                 * ```
                 * 
                 * Instructs webpack to emit the required object as file and to return its public URL
                 * [github]{@link https://github.com/webpack-contrib/file-loader}
                 * [npm]{@link https://www.npmjs.com/package/file-loader}
                 * [Documentation]{@link https://webpack.js.org/concepts/loaders/}
                 * 
                 */
                {
                    test: /\.(eot|svg|cur|png|jpg|gif)$/,
                    loader: 'file-loader',
                    options: {
                        // name: '[name].[hash:20].[ext]',
                    },
                },
            ],
        },
    };
};
