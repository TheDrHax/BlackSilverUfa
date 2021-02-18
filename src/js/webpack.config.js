const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const DEBUG = process.env.DEBUG === '1';

module.exports = [
  {
    entry: [
      '@babel/polyfill',
      './src/js/index.js',
      './src/css/styles.scss',
    ],
    stats: 'minimal',
    mode: DEBUG ? 'development' : 'production',
    target: 'web',
    output: {
      filename: 'bundle.js',
      path: path.join(process.env.PWD, '_site', 'dist'),
      publicPath: 'http://localhost:8000/dist/'
    },
    devServer: {
      contentBase: path.join(process.env.PWD, '_site'),
      compress: true,
      port: 8000,
      hot: true
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            MiniCssExtractPlugin.loader,
            'cache-loader',
            'css-loader',
            'sass-loader',
          ],
        },
        {
          test: /\.js$/,
          include: /src/,
          use: [
            'cache-loader',
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  DEBUG && 'react-refresh/babel',
                  '@babel/plugin-proposal-class-properties'
                ].filter(Boolean),
                presets: ['@babel/preset-env', '@babel/preset-react'],
              }
            },
          ]
        }
      ],
    },
    node: {
      fs: 'empty'
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'bundle.css'
      }),
      new CopyPlugin([{
        from: 'node_modules/libass-wasm/dist/*worker*',
        flatten: true
      }]),
      DEBUG && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
  }
];