/* eslint-disable global-require */
const AssetsPlugin = require("assets-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
const dotenv = require("dotenv");
const { getClientEnvVars } = require("./src/clientEnvVars");

const dotenvConfig = dotenv.config();

if (dotenvConfig.error) {
  throw dotenvConfig.error;
}

module.exports = ({ resolvePath, IS_CI, IS_PROD, START_DEV_SERVER }) => {
  const webpackDevServerPort = 1124; // arbitrarily picked. Has to be different to server port (7080)
  const clientConfig = {
    // target: "web", // compile for browser environment
    target: "node", // compile for server environment
    entry: START_DEV_SERVER
      ? [
          `webpack-dev-server/client?http://localhost:${webpackDevServerPort}`,
          "webpack/hot/only-dev-server",
          "./src/client"
        ]
      : ["./src/client"],
    devServer: {
      host: "localhost",
      port: webpackDevServerPort,
      historyApiFallback: true,
      hot: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      },
      disableHostCheck: true
    },
    output: {
      path: resolvePath("build/public"),
      filename: "static/js/[name].[hash:8].js",
      // need full URL for dev server & HMR: https://github.com/webpack/docs/wiki/webpack-dev-server#combining-with-an-existing-server
      publicPath: IS_PROD
        ? `${process.env.SIMORGH_PUBLIC_STATIC_ASSETS_PATH}/`
        : `http://localhost:${webpackDevServerPort}/`
    },
    externals: [
      /**
       * Prevents `node_modules` from being bundled into the server.js
       * And therefore stops `node_modules` being watched for file changes
       */
      nodeExternals({
        whitelist: ["simorgh-renderer"] // tell webpack to bundle the simorgh-renderer src code
      })
    ],
    optimization: {
      // specify min/max file sizes for each JS chunk for optimal performance
      splitChunks: {
        chunks: "initial",
        automaticNameDelimiter: "-",
        minSize: 184320, // 180kb
        maxSize: 245760, // 240kb
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendor"
          }
        }
      }
    },
    plugins: [
      // keep track of the generated chunks in build/assets.json
      // this determines what scripts get put in the footer of the page
      new AssetsPlugin({
        path: resolvePath("build"),
        filename: "assets.json"
      }),
      // copy static files otherwise untouched by Webpack, e.g. favicon
      new CopyWebpackPlugin([
        {
          from: "public"
        }
      ]),
      new webpack.DefinePlugin({
        "process.env": getClientEnvVars(dotenvConfig)
      })
    ]
  };

  if (START_DEV_SERVER) {
    clientConfig.plugins.push(new webpack.HotModuleReplacementPlugin());
  }

  if (IS_PROD) {
    const BrotliPlugin = require("brotli-webpack-plugin");
    const CompressionPlugin = require("compression-webpack-plugin");

    clientConfig.plugins.push(
      /**
       * Compresses Webpack assets with Brotli compression algorithm.
       * More advanced than gzip (compression-webpack-plugin).
       * https://github.com/mynameiswhm/brotli-webpack-plugin
       */
      new BrotliPlugin({
        asset: "[path].br[query]",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      /**
       * Compresses Webpack assets with gzip Content-Encoding.
       * Prefer Brotli (using brotli-webpack-plugin) but we fall back to gzip.
       * https://github.com/webpack-contrib/compression-webpack-plugin
       */
      new CompressionPlugin({
        algorithm: "gzip",
        filename: "[path].gz[query]",
        test: /\.js$/,
        threshold: 10240,
        minRatio: 0.8
      })
    );
  }
  if (!IS_CI && IS_PROD) {
    const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer"); // eslint-disable-line
    /**
     * Visualize size of webpack output files with an interactive zoomable treemap.
     * https://github.com/webpack-contrib/webpack-bundle-analyzer
     */
    clientConfig.plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        defaultSizes: "gzip",
        generateStatsFile: true,
        openAnalyzer: false,
        reportFilename: "../../reports/webpackBundleReport.html",
        statsFilename: "../../reports/webpackBundleReport.json"
      })
    );
  }
  return clientConfig;
};
