import {resolve as resolvePath, dirname} from 'node:path';
import webpack from 'webpack';
import {env} from 'node:process';
import {fileURLToPath} from 'node:url';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import WebpackAssetsManifest from 'webpack-assets-manifest';
import Package from '../package.json' assert { type: 'json' };

const __dirname = dirname(fileURLToPath(import.meta.url));

// Determine environment
const isCI = !!env['CI'];
const environment = env['NODE_ENV'].toLowerCase();
const isProduction = environment === 'production';
console.log(`Environment: ${environment}`);
if (!['production', 'development'].includes(environment)) {
  throw new Error('Invalid environment');
}

// Determine git tags, etc.
const gitTag = env['GIT_REF']?.startsWith('refs/tags/') ? env['GIT_REF'].substring(10) : undefined;
const gitCommit = env['GIT_SHA'].substring(0, 7);

// Determine version
const bundleVersion = `${gitTag ?? `v${Package.version}-${gitCommit}`}`;

const urlPath = 'resources/';
const outputPath = resolvePath(__dirname, `../public/${urlPath}`);

export default {
  entry: resolvePath(__dirname, 'entry.js'),
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
    new WebpackAssetsManifest({
      writeToDisk: true,
      entrypoints: true,
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
