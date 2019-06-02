const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const webpack = require('webpack');

const WebpackNotifierPlugin = require('webpack-notifier');

const bundleName = 'app';

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = [];

const distPath = path.resolve(__dirname, `../public/resources`);

module.exports.push({
    entry: path.resolve(__dirname, `index.js`),
    mode: process.env.NODE_ENV,
    devtool: 'source-map',
    output: {
        //filename: '[name].[contenthash].bundle.min.js',
        filename: '[name].bundle.min.js',
        path: distPath
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sa|sc|c)ss$/,
                //exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2, // 0 => no loaders (default); 1 => postcss-loader; 2 => postcss-loader, sass-loader
                        }
                    },
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            //data: `$brand: ${bundleName};`,
                            includePaths: [path.resolve(`./frontend/brands/${bundleName}/`)]
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new MomentLocalesPlugin(),
        /*new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),*/
        new CleanWebpackPlugin({}),
        new webpack.DefinePlugin({
            BRAND: JSON.stringify(bundleName),
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new WebpackNotifierPlugin({
            alwaysNotify: true
        }),
        new MiniCssExtractPlugin({
            filename: '[name].bundle.min.css'
        })
    ],
    optimization: {
        splitChunks: {
            //chunks: 'all'
        }
    },
    performance: {
        hints: false
    }
});