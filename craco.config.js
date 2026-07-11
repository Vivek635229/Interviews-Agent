module.exports = {
   babel: {
    plugins: [
      // Only enable react-refresh in development
      process.env.NODE_ENV === 'development' && 'react-refresh/babel',
    ].filter(Boolean), // This removes the 'false' value in production
  },
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
