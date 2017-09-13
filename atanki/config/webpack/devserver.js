const {
  HotModuleReplacementPlugin
} = require('webpack');


/**
 * ```
 * npm install webpack-dev-server --save-dev
 * ```
 * 
 * webpack-dev-server
 * [Git]{@link https://github.com/webpack/webpack-dev-server }
 * [Documentation]{@link https://webpack.js.org/configuration/dev-server/#devserver }
 * 
 *
 */

module.exports = function () {
  return {
    devServer: {
      // stats: 'errors-only',
      /** [doc]{@link https://webpack.js.org/configuration/dev-server/#devserver-disablehostcheck} */
      disableHostCheck: true,
      hot: true,
      historyApiFallback: true,
      port: 4500
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        // Options...
      })
    ],
  }
}
