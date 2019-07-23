const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = {
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
