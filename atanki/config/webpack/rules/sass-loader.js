// const root = require('../../helpers').root;

module.exports = function(paths) {
    paths = paths || process.cwd();
    return {
        module: {
            rules: [
                /**
                 * ```
                 * npm install sass-loader node-sass webpack --save-dev
                 * ```
                 * SASS Loader
                 * [Git]{@link https://github.com/webpack-contrib/sass-loader }
                 * [Documentation]{@link https://github.com/sass/node-sass }
                 * 
                 */
                {
                    test: /\.scss$|\.sass$/,
                    use: [{
                            loader: 'style-loader',
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                sourceMap: true,
                                importLoaders: 1,
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: false,
                                precision: 8,
                                // sourceComments: true,
                            },
                        },
                    ],
                },
            ],
        },
    };
};
