/**
 * @Author: 焦质晔
 * @Date: 2019-06-20 10:00:00
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-08-20 08:22:29
 */
'use strict';

const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const config = require('../config');
const subEnv = require('../config/sub.env');
const createThemeColorPlugin = require('./theme.plugin');
const ModuleFederationPlugin = require('webpack').container.ModuleFederationPlugin;

// 创建子模块引用
const createModuleRemotes = () => {
  const result = {};
  // 规则：子模块: 子模块@域名:端口号/remoteEntry.js
  // dms: `dms@${subEnv.dms}/remoteEntry.js`
  Object.keys(subEnv).forEach((key) => {
    if (key === 'host') return;
    result[key] = `${key}@${subEnv[key]}/remoteEntry.js`;
  });
  return result;
};

module.exports = {
  entry: {
    app: utils.resolve('src/index.ts'),
  },
  output: {
    path: config.build.assetsRoot,
    filename: 'js/[name].js',
    publicPath:
      process.env.NODE_ENV === 'production'
        ? config.build.assetsPublicPath
        : config.dev.assetsPublicPath,
  },
  resolve: {
    // 配置解析规则
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias: {
      '@': utils.resolve('src'),
      '@test': utils.resolve('src/modules/test'),
      '@framework': utils.resolve('src/modules/framework'),
    },
    fallback: {
      crypto: false,
      stream: false,
      buffer: false,
    },
  },
  experiments: {
    topLevelAwait: true,
  },
  module: {
    rules: [
      // js jsx
      {
        test: /\.js(x)?$/,
        use: utils.jsLoaders(),
        exclude: /node_modules/,
        include: [utils.resolve('src')],
      },
      // ts tsx
      {
        test: /\.ts(x)?$/,
        use: utils.tsLoaders(),
        exclude: /node_modules/,
        include: [utils.resolve('src')],
      },
      // do not base64-inline SVG
      {
        test: /\.(svg)(\?.*)?$/i,
        type: 'asset/resource',
        generator: {
          filename: utils.assetsPath('img/[contenthash:8][ext][query]'),
        },
      },
      // images
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 1024, // 小于 1M 表现形式为 baser64；大于 1M 文件会被生成到输出到目标目录
          },
        },
        generator: {
          filename: utils.assetsPath('img/[contenthash:8][ext][query]'),
        },
      },
      // fonts
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 1024,
          },
        },
        generator: {
          filename: utils.assetsPath('fonts/[contenthash:8][ext][query]'),
        },
      },
      // media
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 1024 * 1024,
          },
        },
        generator: {
          filename: utils.assetsPath('media/[contenthash:8][ext][query]'),
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      'process.env.ENV_CONFIG': JSON.stringify(process.env.ENV_CONFIG),
      'process.env.THEME_COLOR': JSON.stringify(config.primaryColor),
    }),
    createThemeColorPlugin(),
    new ModuleFederationPlugin({
      name: config.moduleName,
      remotes: createModuleRemotes(),
      shared: ['react', 'react-dom'],
    }),
  ],
};
