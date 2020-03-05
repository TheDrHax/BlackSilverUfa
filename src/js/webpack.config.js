const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = [
  {
    entry: [
      '@babel/polyfill',
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
            {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env'],
              }
            },
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
      new CopyPlugin([{
        from: 'node_modules/libass-wasm/dist/*worker*',
        flatten: true
      }]),
    ]
  }
];