const path = require('path')

module.exports = {
  mode: 'production',
  entry: path.join(__dirname, 'src/js/index.js'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'carousel.min.js',
    library: 'Carousel',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
    libraryExport: 'default',
  },
}
