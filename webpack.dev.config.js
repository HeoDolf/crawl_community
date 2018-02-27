const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require("webpack");
const { spawn } = require('child_process');
const { resolve } = require("path");
const helper = require('./config/helper.js');

const SRC_DIR = resolve(__dirname, 'src');
const OUTPUT_DIR = resolve(__dirname, 'dist');
const defaultIncludes = [SRC_DIR];

module.exports = {
    entry:[ 
        SRC_DIR + '/index.js',
        SRC_DIR + '/style.css',
    ],
    output: {
        path: OUTPUT_DIR,
        filename: 'bundle.js',
        publicPath: "/"
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
    plugins:[
        new HtmlWebpackPlugin({
            template: helper.root( 'public/index.html' ),
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: 'cheap-source-map',
    devServer: {
        contentBase: OUTPUT_DIR,
        stats: {
            colors: true,
            chunks: false,
            children: false
        },
        
        historyApiFallback: true,
        inline: true,
        proxy: {
            '**': {
                target: 'http://localhost:3000/',
                secure: false
            }
        }
    }
}