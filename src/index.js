import Document from './app/components/Document';
import routes, { regexPath } from './app/routes';
import { ServerStyleSheet } from 'styled-components';

// setup global variables for simorgh-renderer to use at build time
global.documentComponent = Document;
global.regexPath = regexPath;
global.routes = routes;
global.sheet = new ServerStyleSheet();

// inject simorgh-renderer/index and instantly execute
require('simorgh-renderer/index');
