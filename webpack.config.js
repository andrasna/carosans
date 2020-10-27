const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  const inDev = env !== undefined
  const config = {}

  config.entry = {
    main: path.join(__dirname, 'src/js/example.js'),
  }

  config.output = {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js',
  }

  config.module = {
    rules: [
      {
        test: /\.css$/i,
        use: [
          ...(!inDev ? [
            MiniCssExtractPlugin.loader,
          ] : []),
          ...(inDev ? [
            'style-loader',
          ] : []),
          'css-loader',
          'postcss-loader',
        ],
      },
    ],
  }

  config.plugins = [
    ...(!inDev ? [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
    ] : [
      new HtmlWebpackPlugin({
        template: 'index.html',
      }),
    ]),
  ]

  return config
}
