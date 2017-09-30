module.exports = function() {
  return {
    /**
     * The point or points to enter the application. At this point the application starts executing.
     * If an array is passed all items will be executed.
     * [Documentation]{@link https://webpack.js.org/configuration/entry-context/#entry}
     */
    entry: {
      main: [
        './app/main.ts',
      ],
      styles: [
        './app/style.scss',
      ],
    },
  };
};
