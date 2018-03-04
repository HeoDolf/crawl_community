const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliWebpackPlugin = require('babili-webpack-plugin');

const webpack = require("webpack");
const { resolve } = require("path");
const helper = require('./config/helper.js');

const SRC_DIR = resolve(__dirname, 'src');
const OUTPUT_DIR = resolve(__dirname, 'dist');

const defaultIncludes = [SRC_DIR];

module.exports = {
    entry: [
        SRC_DIR+'/index.js',
        SRC_DIR+'/style.css'
    ],
    output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
        publicPath: "./"
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                use:[{ loader: 'babel-loader' }],
                exclude: /node_modules/,
                include: defaultIncludes
            },
            {
                test: /\.css$/,
                use: [
                    { loader:'style-loader' },
                    { loader:'css-loader' }
                ],
                include: defaultIncludes
            },
            {
                test: /\.(jpg|png|gif|svg|pdf|ico)$/,
                use: [
                    { loader:'file-loader' },
                ],
                include: defaultIncludes
            }
        ]
    },
    devtool: 'inline-source-map',
    plugins:[
        new HtmlWebpackPlugin({
            template: helper.root( 'public/index.html' ),
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new BabiliWebpackPlugin()
    ],
    stats: {
        colors: true,
        chunks: false,
        children: false,
        modules: false
    },
}
