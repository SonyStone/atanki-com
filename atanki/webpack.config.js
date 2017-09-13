/**
 * ```
 * npm install webpack-merge --save-dev
 * ```
 * webpack-merge - Merge designed for Webpack
 * [git]{@link https://github.com/survivejs/webpack-merge}
 * [npm]{@link https://www.npmjs.com/package/webpack-merge}
 */
const merge = require('webpack-merge');

const watch = require('./config/webpack/watch');
const entry = require('./config/webpack/entry');
const resolve = require('./config/webpack/resolve');
const devtool = require('./config/webpack/devtool');
const output = require('./config/webpack/output');
const awesomeTypescriptLoader = require('./config/webpack/rules/awesome-typescript-loader');
const sourceMapLoader = require('./config/webpack/rules/source-map-loader');
const fileLoader = require('./config/webpack/rules/file-loader');

module.exports = function(env) {
    if (env === 'prod') {
        return merge([

        ]);
    };
    if (env === 'dev') {
        return merge([
            watch(),
            entry(),
            output(),
            resolve(),
            devtool(),
            awesomeTypescriptLoader(),
            sourceMapLoader(),
            fileLoader(),
        ]);
    };
};
