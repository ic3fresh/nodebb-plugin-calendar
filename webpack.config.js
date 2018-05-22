const webpack = require('webpack');
const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const del = require('del');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const dtsDir = path.resolve(path.dirname(require.resolve('eonasdan-bootstrap-datetimepicker')));
del.sync(`${dtsDir}/../../node_modules/**`);

module.exports = {
  devtool: isProd ? 'source-map' : 'inline-source-map',
  context: __dirname,
  entry: {
    client: ['core-js/shim', './src/client/index.js'],
    calendar: ['core-js/shim', './src/calendar/index.js'],
  },
  output: {
    path: path.join(__dirname, './build/bundles'),
    filename: '[name].js',
  },
  externals: {
    jquery: 'jQuery',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: [
          {
            loader: 'babel-loader',
            query: {
              presets: [
                ['es2015', { modules: false }],
              ],
              plugins: [
                ['transform-runtime', {
                  polyfill: false,
                  regenerator: false,
                }],
              ],
            },
          },
        ],
      },
      {
        test: /\.js$/,
        include: /node_modules/,
        loader: './removeAMD',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      'node_modules',
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'commons',
      minChunks: 2,
    }),
    new webpack.IgnorePlugin(/^\.\/(locale|lang)$/, /(moment|fullcalendar)$/),
    ...(isProd ? [new UglifyJSPlugin({ sourceMap: true })] : []),
  ],
};
