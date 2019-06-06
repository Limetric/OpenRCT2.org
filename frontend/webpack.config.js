const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    entry: path.resolve(__dirname, `index.js`),
    mode: process.env.NODE_ENV,
    devtool: 'source-map',
    output: {
        filename: `[name].${devMode ? 'dev' : '[contenthash]'}.bundle.min.js`,
        chunkFilename: `[name].${devMode ? 'dev' : '[chunkhash]'}.chunk.min.js`,
        path: path.resolve(__dirname, `../public/resources`)
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
                        loader: 'sass-loader'
                    }
                ]
            }
        ]
    },
    plugins: [
        new MomentLocalesPlugin(),
        new CleanWebpackPlugin({}),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        }),
        new WebpackNotifierPlugin({
            alwaysNotify: true
        }),
        new MiniCssExtractPlugin({
            filename: `[name].${devMode ? 'dev' : '[hash]'}.bundle.min.css`,
            chunkFilename: `[name].${devMode ? 'dev' : '[hash]'}.bundle.min.css`
        })
    ],
    optimization: {
        splitChunks: {
            //chunks: 'all'
        }
    },
    performance: {
        hints: false
    },
    stats: {
        assets: false,
        chunks: false,
        children: false,
        modules: false
    }
};