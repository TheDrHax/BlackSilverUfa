const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
  {
    entry: [
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