const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
  }
];