const { existsSync } = require('fs');
const { resolve } = require('path');
const webpack = require('webpack');
const systemjsInterop = require("systemjs-webpack-interop/webpack-config");

const { merge } = require('webpack-merge');
const createWebpackConfigMain = require('./webpack.config.main');
const webpackConfigBase = require('./webpack.config.base');

const createWebpackConfig = (...configs) => {
  const webpackConfig = merge(...configs);

  return systemjsInterop.modifyWebpackConfig(webpackConfig);
}

const getCustomWebpackConfig = () => {
  const customConfigPath = resolve('webpack.config.merge.js')
  const result = {};
  if (existsSync(customConfigPath)) {
    const webpackConfigCustom = require(customConfigPath);
    Object.assign(result, webpackConfigCustom);
  }
  return result;
}

function build(options) {
  return new Promise((resolve, reject) => {
    const webpackConfig = createWebpackConfig(
      webpackConfigBase,
      getCustomWebpackConfig(),
      createWebpackConfigMain(options)
    );
    
    const compiler = webpack(webpackConfig);
    compiler.run((error, stats) => {
      if (error) {
        // let errMessage = error.message;
        return reject({ errors: [error] });
      } else if (stats.hasErrors()) {
        return reject(stats.toJson({ all: false, warnings: false, errors: true }));
      }
      // console.log(stats.toString({
      //   chunks: false, // 使构建过程更静默无输出
      //   colors: true // 在控制台展示颜色
      // }));
      resolve();
      // compiler.close((closeError) => {
      //   if (closeError) {
      //     console.log(closeErr);
      //   }
      // });
    });
  })
}

module.exports = build;
