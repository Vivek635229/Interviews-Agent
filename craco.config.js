module.exports = {
  babel: {
    plugins:
      process.env.NODE_ENV === 'production'
        ? [] // Remove react-refresh in production (Vercel builds)
        : undefined,
    loaderOptions: (babelLoaderOptions) => {
      if (process.env.NODE_ENV === 'production') {
        // Filter out react-refresh/babel plugin in production
        if (babelLoaderOptions.plugins) {
          babelLoaderOptions.plugins = babelLoaderOptions.plugins.filter(
            (plugin) => {
              const pluginName = Array.isArray(plugin) ? plugin[0] : plugin;
              return (
                typeof pluginName !== 'string' ||
                !pluginName.includes('react-refresh')
              );
            }
          );
        }
      }
      return babelLoaderOptions;
    },
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