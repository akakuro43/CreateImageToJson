/**
 * webpack.config.js
 *
 * webpackを使いBabelのトランスパイルを行う。
 */

'use strict';
var path = require('path');
var webpack = require('webpack');
var env = process.env.NODE_ENV;
let config = {
    entry: {
        app :'./src/js/main.js'
    },
    output: {
        filename: 'main.js'
    },
    resolve: {
        alias: {
          vue: 'vue/dist/vue.js'
        },
        extensions:['', '.webpack.js', '.web.js', '.js']
    },
    module: {
        loaders: [
//            { test: /\.tsx?$/, loader: "ts-loader" }
              {
                  test: /\.js$/,
                  exclude: /node_modules/,
                  loader: 'babel-loader',
                  query: {
                      cacheDirectory: true,
                      "presets": ["env"]
                  }
              }

        ]
    },
    plugins: [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV' : JSON.stringify(env)
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.ProvidePlugin({
        //   $: 'jquery',
        //   jQuery: 'jquery'
        // })
    ]
};

if (env === 'production') {
    config.output.filename = '[name].min.js';
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false
        }
    }));
} else {
    config.devtool = 'source-map';
}

module.exports = config;
