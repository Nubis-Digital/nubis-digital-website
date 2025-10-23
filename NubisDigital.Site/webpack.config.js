const path = require('path');

module.exports = {
  entry: './wwwroot/js/parallax/index.js',
  output: {
    filename: 'scroll-parallax-3d.bundle.js',
    path: path.resolve(__dirname, 'wwwroot/js'),
    clean: false
  },
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    minimize: true
  },
  resolve: {
    extensions: ['.js']
  }
};
