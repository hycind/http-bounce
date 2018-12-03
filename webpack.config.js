const fs = require('fs');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 
var nodeModules = {};
fs.readdirSync('node_modules')
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

// 
module.exports = {
    entry: './src/index.ts',
    mode: 'production',
    target: 'node',
    node: {
        __dirname: false,
        __filename: false,
    },

    externals: nodeModules,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.json']
    },
    output: {
        filename: 'server.bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [new CopyWebpackPlugin([{ from: './package.json' }], { debug: 'warning' })]
};
