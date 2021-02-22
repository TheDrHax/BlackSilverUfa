const path = require('path');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const HMR = process.env.HMR === '1';
const DEBUG = HMR || process.env.DEBUG === '1';

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
          test: /\.(css|s[ac]ss)$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                hmr: DEBUG,
                reloadAll: true,
              }
            },
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
                  HMR && 'react-refresh/babel',
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
    performance: {
      hints: false
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'bundle.css'
      }),
      new CopyPlugin([{
        from: 'node_modules/libass-wasm/dist/*worker*',
        flatten: true
      }]),
      HMR && new ReactRefreshWebpackPlugin()
    ].filter(Boolean)
  }
];