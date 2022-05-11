const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const SentryWebpackPlugin = require('@sentry/webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ChildProcess = require('child_process');
const PackageJson = require('../package');

const environment = process.env['NODE_ENV'];
const devMode = environment !== 'production';
const tag = process.env['TRAVIS_TAG'];

const commitHash = ChildProcess.execSync('git rev-parse --short HEAD').toString();
const bundlePath = 'resources';
const bundleVersion = `${!tag ? `v${PackageJson.version}` : tag}-${commitHash}`;
const outputPath = path.resolve(__dirname, `../public/${bundlePath}/`);

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),
  mode: environment,
  devtool: environment === 'production' ? 'hidden-source-map' : 'source-map',
  output: {
    filename: `[name].${devMode ? 'dev' : '[contenthash]'}.bundle.min.js`,
    chunkFilename: '[name].[chunkhash].chunk.min.js',
    path: outputPath,
    publicPath: `/${bundlePath}/`,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // exclude: /node_modules/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
            },
          },
          'postcss-loader',
          {
            loader: 'sass-loader',
          },
        ],
      },
    ],
  },
  plugins: [
    new MomentLocalesPlugin(),
    new CleanWebpackPlugin({}),
    new webpack.DefinePlugin({
      APP_ENVIRONMENT: JSON.stringify(environment),
      APP_VERSION: JSON.stringify(bundleVersion),
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
    new WebpackNotifierPlugin({
      alwaysNotify: true,
    }),
    new MiniCssExtractPlugin({
      filename: `[name].${devMode ? 'dev' : '[hash]'}.bundle.min.css`,
      chunkFilename: '[name].[hash].bundle.min.css',
    }),
  ],
  optimization: {
    splitChunks: {
      // chunks: 'all'
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        sourceMap: true,
      }),
    ],
  },
  performance: {
    hints: false,
  },
  stats: {
    assets: false,
    chunks: false,
    children: false,
    modules: false,
  },
};

if (environment === 'production') {
  module.exports.plugins.push(new SentryWebpackPlugin({
    release: bundleVersion,
    include: outputPath,
    ignore: ['node_modules', 'webpack.config.js'],
    configFile: './frontend/sentry.properties',
    urlPrefix: `~/${bundlePath}`,
    dryRun: !tag,
  }));
}
