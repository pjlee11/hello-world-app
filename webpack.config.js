/*
 * TO DO: load the webpack config in from `SPARTACUS_-render/webpack/*`
 */

/* eslint-disable import/no-dynamic-require, global-require */
const fs = require('fs');
const dotenv = require('dotenv');

global.appDirectory = fs.realpathSync(process.cwd());

// Load in environment variables configured in `.env` file. Be aware the `.env` committed is changed by bake-scripts when on real servers.
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

const setupWebpack = require('@bbc/spartacus/webpack.config');

module.exports = setupWebpack();
