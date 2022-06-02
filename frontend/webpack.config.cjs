/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const Package = require('../package.json');

// Determine environment
const isCI = !!process.env['CI'];
const environment = process.env['NODE_ENV'].toLowerCase();
const isProduction = environment === 'production';
console.log(`Environment: ${environment}`);
if (!['production', 'development'].includes(environment)) {
  throw new Error('Invalid environment');
}

// Determine git tags, etc.
const gitTag = process.env['GIT_REF']?.startsWith('refs/tags/') ? process.env['GIT_REF'].substring(10) : undefined;
const gitCommit = process.env['GIT_SHA'].substring(0, 7);

// Determine version
const bundleVersion = `${gitTag ?? `v${Package.version}-${gitCommit}`}`;

const urlPath = 'resources/';
const outputPath = path.resolve(__dirname, `../public/${urlPath}`);

module.exports = {
  entry: path.resolve(__dirname, 'entry.js'),
  mode: 'production',
  // eslint-disable-next-line no-nested-ternary
  devtool: isCI ? 'hidden-source-map' : (isProduction ? 'source-map' : 'cheap-module-source-map'),
  output: {
    filename: '[name].[contenthash].bundle.min.js',
    chunkFilename: '[name].[contenthash].chunk.min.js',
    path: outputPath,
    publicPath: 'auto',
    clean: false,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
        },
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          }, {
            loader: 'resolve-url-loader',
          }, {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        type: 'asset',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_ENVIRONMENT: JSON.stringify(environment),
      APP_VERSION: JSON.stringify(bundleVersion),
    }),
    new CssMinimizerPlugin({
      minimizerOptions: {
        preset: [
          'default',
          {
            discardComments: {
              removeAll: true,
            },
          },
        ],
      },
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].bundle.min.css',
      chunkFilename: '[name].[contenthash].chunk.min.css',
    }),
    new SentryWebpackPlugin({
      release: bundleVersion,
      include: outputPath,
      ignore: ['node_modules', 'webpack.config.cjs'],
      configFile: './frontend/sentry.properties',
      urlPrefix: `~/${urlPath}`,
      dryRun: !(isCI && gitTag),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
  },
  performance: {
    hints: false,
  },
  stats: {
    assets: false,
    assetsSort: '!size',
    chunks: false,
    children: false,
    modules: false,
  },
};
