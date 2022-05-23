/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ChildProcess = require('child_process');
// eslint-disable-next-line import/extensions
const PackageJson = require('../package');

// Determine environment
const isCI = !!process.env['CI'];
const environment = process.env['NODE_ENV'].toLowerCase();
console.log(`Environment: ${environment}`);
if (!['production', 'development'].includes(environment)) {
  throw new Error('Invalid environment');
}
const isProduction = environment === 'production';

const tag = process.env['TRAVIS_TAG'];

const commitHash = ChildProcess.execSync('git rev-parse --short HEAD').toString();
const bundlePath = 'resources';
const bundleVersion = `${!tag ? `v${PackageJson.version}` : tag}-${commitHash}`;
const outputPath = path.resolve(__dirname, `../public/${bundlePath}/`);

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
    clean: true,
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
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    autoprefixer(),
                  ],
                ],
              },
            },
          },
          {
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
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

if (isCI) {
  module.exports.plugins.push(new SentryWebpackPlugin({
    release: bundleVersion,
    include: outputPath,
    ignore: ['node_modules', 'webpack.config.cjs'],
    configFile: './frontend/sentry.properties',
    urlPrefix: `~/${bundlePath}`,
    dryRun: !tag,
  }));
}
