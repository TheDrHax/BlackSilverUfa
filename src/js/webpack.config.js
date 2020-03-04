const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: [
      './src/js/index.js',
      './src/css/styles.scss',
    ],
    stats: 'errors-only',
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
          exclude: /node_modules/,
          use: [
            'cache-loader',
            'babel-loader',
          ]
        }
      ],
    },
    output: {
      filename: 'bundle.js',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'bundle.css'
      }),
    ]
  },
  {
    entry: [
      './src/js/player.js',
      './src/css/player.scss',
    ],
    stats: 'errors-only',
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
          exclude: /node_modules/,
          use: [
            'cache-loader',
            'babel-loader',
          ]
        }
      ],
    },
    output: {
      filename: 'player.js',
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'player.css'
      }),
      new CopyPlugin([{
        from: 'node_modules/libass-wasm/dist/*worker*',
        flatten: true
      }]),
    ]
  }
];