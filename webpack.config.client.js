/*
 * TO DO: load the webpack config in from `SPARTACUS_-render/webpack/*`
 */

/* eslint-disable global-require */
const AssetsPlugin = require('assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const dotenv = require('dotenv');
const { getClientEnvVars } = require('@bbc/spartacus/utility');

const dotenvConfig = dotenv.config();

if (dotenvConfig.error) {
  throw dotenvConfig.error;
}

module.exports = ({ resolvePath, IS_CI, IS_PROD, START_DEV_SERVER }) => {
  const webpackDevServerPort = 1124; // arbitrarily picked. Has to be different to server port (7080)
  const clientConfig = {
    target: 'web', // compile for browser environment
    entry: START_DEV_SERVER
      ? [
          `webpack-dev-server/client?http://localhost:${webpackDevServerPort}`,
          'webpack/hot/only-dev-server',
          './src/client.js',
        ]
      : ['./src/client.js'],
    devServer: {
      host: 'localhost',
      port: webpackDevServerPort,
      historyApiFallback: true,
      hot: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      disableHostCheck: true,
    },
    output: {
      path: resolvePath('build/public'),
      filename: 'static/js/[name].[hash:8].js',
      // need full URL for dev server & HMR: https://github.com/webpack/docs/wiki/webpack-dev-server#combining-with-an-existing-server
      publicPath: IS_PROD
        ? `${process.env.SPARTACUS_PUBLIC_STATIC_ASSETS_PATH}/`
        : `http://localhost:${webpackDevServerPort}/`,
    },
    optimization: {
      // specify min/max file sizes for each JS chunk for optimal performance
      splitChunks: {
        chunks: 'initial',
        automaticNameDelimiter: '-',
        minSize: 184320, // 180kb
        maxSize: 245760, // 240kb
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendor',
          },
        },
      },
    },
    plugins: [
      // keep track of the generated chunks in build/assets.json
      // this determines what scripts get put in the footer of the page
      new AssetsPlugin({
        path: resolvePath('build'),
        filename: 'assets.json',
      }),
      // copy static files otherwise untouched by Webpack, e.g. favicon
      new CopyWebpackPlugin([
        {
          from: 'public',
        },
      ]),
      new webpack.DefinePlugin({
        'process.env': getClientEnvVars(dotenvConfig),
      }),
    ],
  };

  if (START_DEV_SERVER) {
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (IS_PROD) {
    const BrotliPlugin = require('brotli-webpack-plugin');
    const CompressionPlugin = require('compression-webpack-plugin');
    // const OfflinePlugin = require("offline-plugin");

    clientConfig.plugins.push(
      // new OfflinePlugin({
      //   AppCache: false, // because it's deprecated: https://github.com/NekR/offline-plugin/blob/master/docs/options.md#appcache-object--null--false
      //   appShell: "/news/articles/",
      //   autoUpdate: 1000 * 60 * 60 * 6, // 6 hours
      //   caches: "all", // all webpack output assets and `externals` will be cached on install
      //   externals: [
      //     // files not generated by Webpack (have to list manually)
      //     "https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Rg.woff2",
      //     "https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Rg.woff",
      //     "https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Md.woff2",
      //     "https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Md.woff"
      //     /* Unused fonts
      //       - When adding fonts, be sure to add them to the globalStyles object here:
      //       https://github.com/BBC-News/SPARTACUS_/blob/latest/src/app/lib/globalStyles.js#L5
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Lt.woff2',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSans_W_Lt.woff',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Lt.woff2',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Lt.woff',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Rg.woff2',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Rg.woff',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Bd.woff2',
      //       'https://gel.files.bbci.co.uk/r2.302/BBCReithSerif_W_Bd.woff',
      //     End of unused fonts */
      //   ],
      //   ServiceWorker: {
      //     events: true,
      //     minify: true
      //   },
      //   updateStrategy: "changed"
      // }),
      /**
       * Compresses Webpack assets with Brotli compression algorithm.
       * More advanced than gzip (compression-webpack-plugin).
       * https://github.com/mynameiswhm/brotli-webpack-plugin
       */
      new BrotliPlugin({
        asset: '[path].br[query]',
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      /**
       * Compresses Webpack assets with gzip Content-Encoding.
       * Prefer Brotli (using brotli-webpack-plugin) but we fall back to gzip.
       * https://github.com/webpack-contrib/compression-webpack-plugin
       */
      new CompressionPlugin({
        algorithm: 'gzip',
        filename: '[path].gz[query]',
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    );
  }
  if (!IS_CI && IS_PROD) {
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer'); // eslint-disable-line
    /**
     * Visualize size of webpack output files with an interactive zoomable treemap.
     * https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    clientConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        defaultSizes: 'gzip',
        generateStatsFile: true,
        openAnalyzer: false,
        reportFilename: '../../reports/webpackBundleReport.html',
        statsFilename: '../../reports/webpackBundleReport.json',
      }),
    );
  }
  return clientConfig;
};
