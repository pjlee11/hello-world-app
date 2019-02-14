import Document from './app/components/Document';
import routes, { regexPath } from './app/routes';
import { ServerStyleSheet } from 'styled-components';

// setup global variables for SPArtacus to use at build time
global.documentComponent = Document; // a <html> document React component
global.dataPathRegex = regexPath; // the regex path
global.routes = routes;

/*
 * 'styled-components' needs to be a singleton so it is set as a dependency of the top level application and the
 * parts of it that 'SPArtacus' requires are injected as globals EG: ServerStyleSheet()
 */
global.ServerStyleSheet = ServerStyleSheet;

// inject SPArtacus/index and instantly execute
require('@bbc/spartacus/index');

if (module.hot) {
  module.hot.accept();

  console.log(module.hot.status() === 'apply');

  if (module.hot.status() === 'apply') {
    const { hotReloadServer } = require('@bbc/spartacus/index');
    hotReloadServer();
  }
}
