let path = require('path');

module.exports = function() {
    return {
        /**
         * The context is an absolute string to the directory that contains the entry files.
         * The base directory, an absolute path, for resolving entry points and loaders from configuration.
         * [Documentation]{@link https://webpack.js.org/configuration/entry-context/#context}
         */
        context: path.resolve(__dirname, 'app'),
    };
};
