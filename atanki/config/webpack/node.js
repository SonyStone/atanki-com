module.exports = function() {
    return {
        /**
         * These options configure whether to polyfill or mock certain Node.js globals and modules.
         * This allows code originally written for the Node.js environment
         * to run in other environments like the browser.
         * [Documentation]{@link https://webpack.js.org/configuration/node/}
         */
        node: {
            fs: 'empty',
            global: true,
            crypto: 'empty',
            tls: 'empty',
            net: 'empty',
            process: true,
            module: false,
            clearImmediate: false,
            setImmediate: false,
        },
    };
};
