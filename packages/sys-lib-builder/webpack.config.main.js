const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const ColoredProgressBar = require('colored-progress-bar-webpack-plugin');

module.exports = options => ({
  mode: "production",
  entry: options.entry,
  output: {
    ...options.output,
    libraryTarget: "system",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new SimpleProgressWebpackPlugin(),
    new ColoredProgressBar(),
  ],
  performance: {
    maxEntrypointSize: 2000000,
    maxAssetSize: 2000000,
  },
});
