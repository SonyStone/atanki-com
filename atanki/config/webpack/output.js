const root = require('../helpers').root;

module.exports = function() {
  return {
    /**
     * The top-level output key contains 
     * set of options instructing webpack on how and where it should output 
     * your bundles, assets and anything else you bundle or load with webpack.
     * [Documentation]{@link https://webpack.js.org/configuration/output/}
     */
    output: {
      filename: 'bundle.[name].js',
      path: root('dist'),
    },
  };
};
