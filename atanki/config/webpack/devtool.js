module.exports = function() {
    return {
        /**
         * This option controls if and how source maps are generated.
         * Use the SourceMapDevToolPlugin for a more fine grained configuration.
         * See the source-map-loader to deal with existing source maps.
         * [Documentation]{@link https://webpack.js.org/configuration/devtool/ }
         * 
         */
        devtool: 'source-map',
    };
};
