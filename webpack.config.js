const { mode } = require('webpack-nano/argv');
const { merge } = require('webpack-merge');
const parts = require('./webpack.parts');

const cssLoaders = [parts.autoprefixer(), parts.tailwind()];

const commonConfig = merge([
  { entry: ['./src'] },
  parts.page({ title: 'Demo' }),
  parts.extractCSS({ loaders: cssLoaders }),
  parts.loadJavaScript(),
  /*   parts.generateSourceMaps({ type: 'source-map' }), */
]);

const productionConfig = merge([parts.eliminateUnusedCSS()]);

const developmentConfig = merge([
  { entry: ['webpack-plugin-serve/client'] },
  parts.devServer(),
]);

const getConfig = (mode) => {
  switch (mode) {
    case 'prod:legacy':
      process.env.BROWSERSLIST_ENV = 'legacy';
      return merge(commonConfig, productionConfig);
    case 'prod:modern':
      process.env.BROWSERSLIST_ENV = 'modern';
      return merge(commonConfig, productionConfig);
    case 'production':
      return merge(commonConfig, productionConfig, { mode: 'none' });
    case 'development':
      return merge(commonConfig, developmentConfig, { mode });
    default:
      throw new Error(`Trying to use an unknown mode, ${mode}`);
  }
};

module.exports = getConfig(mode);
