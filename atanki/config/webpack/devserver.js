const {
  HotModuleReplacementPlugin,
} = require('webpack');

module.exports = function() {
  return {
    /**
     * ```
     * npm install webpack-dev-server --save-dev
     * ```
     * 
     * webpack-dev-server
     * [Git]{@link https://github.com/webpack/webpack-dev-server }
     * [Documentation]{@link https://webpack.js.org/configuration/dev-server/#devserver }
     * 
     */
    devServer: {
      /** [doc]{@link https://webpack.js.org/configuration/dev-server/#devserver-disablehostcheck} */
      // stats: 'errors-only',
      disableHostCheck: true,
      hot: true,
      historyApiFallback: true,
      port: 4300,
    },
    plugins: [
      new HotModuleReplacementPlugin({
        // Options...
      }),
    ],
  };
};
