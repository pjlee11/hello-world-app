import Document from './app/components/Document';
import routes, { regexPath } from './app/routes';
import { ServerStyleSheet } from 'styled-components';

// setup global variables for simorgh-renderer to use at build time
global.documentComponent = Document; // a <html> document React component
global.dataPathRegex = regexPath; // the regex path
global.routes = routes;

/*
 * 'styled-components' needs to be a singleton so it is set as a dependency of the top level application and the
 * parts of it that 'simorgh-renderer' requires are injected as globals EG: ServerStyleSheet()
 */
global.ServerStyleSheet = ServerStyleSheet;

// inject simorgh-renderer/index and instantly execute
require('simorgh-renderer/index');
