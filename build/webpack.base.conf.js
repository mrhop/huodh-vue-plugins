var path = require('path')
var utils = require('./utils')
var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')
var nodeExternals = require('webpack-node-externals')
var lodash = require('lodash');
var umdBuild = false
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}
for (index in process.argv) {
  if (process.argv[index] === 'umd') {
    umdBuild = true
    break
  }
}
module.exports = {
  entry: {
    'huodh-vue-plugins': './src/index.js',
  },
  output: {
    path: config.build.assetsRoot,
    filename: umdBuild ? '[name].browser.js' : '[name].common.js',
    library: 'huodhVuePlugins',
    libraryTarget: umdBuild ? 'umd' : 'commonjs2'
  },
  externals: [nodeExternals()],
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  module: {
    rules: [
      {
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        enforce: "pre",
        include: [resolve('src'), resolve('test')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]')
        }
      }
    ]
  }
}
