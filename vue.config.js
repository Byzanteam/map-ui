const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8085, // CHANGE YOUR PORT HERE!
    https: true,
    hotOnly: false,
  },
  configureWebpack: {
    plugins: [
      new LodashModuleReplacementPlugin({
        shorthands: true,
        collections: true,
        paths: true,
      }),
    ],
  },
};
