const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = (env) => {
  const devMode = env !== undefined
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
          ...(!devMode ? [
            MiniCssExtractPlugin.loader,
          ] : []),
          ...(devMode ? [
            'style-loader',
          ] : []),
          'css-loader',
          ...(!devMode ? [
          /*
          Only stable CSS features are used at the moment.
          Only cssnano is used for minification.
          Therefore there is no need to run PostCSS in dev mode.
          */
            'postcss-loader',
          ] : []),
        ],
      },
    ],
  }

  config.plugins = [
    ...(!devMode ? [
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
