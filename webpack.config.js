const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js',
    },
    module: {
        loaders: [
            { test: /\.vue$/, loader: 'vue-loader' },
            { test: /\.css$/, loaders: ['style-loader', 'css-loader'] },
        ],
    },
    plugins: [
        new CopyWebpackPlugin([{ from: path.join(__dirname, 'public'), to: path.join(__dirname, 'build') }]),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
    ]
};