module.exports = {
  style: {
    postcss: {
      mode: 'extends',
      loaderOptions: (postcssLoaderOptions) => {
        postcssLoaderOptions.postcssOptions = {
          plugins: [
            require('tailwindcss'),
            require('autoprefixer'),
          ],
        };
        return postcssLoaderOptions;
      },
    },
    sass: {
      loaderOptions: {
        additionalData: `@import "src/styles/_variables.scss";`,
      },
    },
  },
};
