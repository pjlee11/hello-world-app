/* eslint-disable import/no-dynamic-require, global-require */
const fs = require('fs');
const dotenv = require('dotenv');

// set the application root path to be set as `context` in the webpack config
global.appDirectory = fs.realpathSync(process.cwd());

// Load in environment variables configured in `.env` file. Be aware the `.env` committed is changed by bake-scripts when on real servers.
const result = dotenv.config();

if (result.error) {
  throw result.error;
}

module.exports = require('@bbc/spartacus/webpack.config');
