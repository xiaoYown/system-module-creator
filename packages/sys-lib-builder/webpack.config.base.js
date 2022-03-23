module.exports = {
  module: {
    rules: [
      {
        test: /\.(js|mjs|ts)$/,
        loader: require.resolve("babel-loader"),
        options: {
          cacheDirectory: true,
          cacheCompression: false,
          compact: false,
        },
      },
    ],
  },
};
