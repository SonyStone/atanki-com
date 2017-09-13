module.exports = function() {
  return {
    /**
     * These options change how modules are resolved. webpack provides reasonable defaults,
     * but it is possible to change the resolving in detail
     * [Documantation]{@link https://webpack.js.org/configuration/resolve/}
     * [Documantation]{@link https://webpack.js.org/concepts/module-resolution/}
     */
    resolve: {
      extensions: [
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
      ],
    },
  };
};
