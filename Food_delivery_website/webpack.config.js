// webpack.config.js
const path = require('path');

module.exports = {
  entry: './src/index.js', // Entry file
  output: {
    filename: 'bundle.js', // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development', // Mode can be 'development' or 'production'
  devServer: {
    static: path.join(__dirname, 'dist'), // Directory to serve
    compress: true, // Enable gzip compression
    port: 9000, // Port for dev server
    open: true, // Open browser after server starts
  },
};
