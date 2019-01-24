import Document from './app/components/Document';
import routes, { regexPath } from './app/routes';

// setup global variables for simorgh-renderer to use at build time
global.documentComponent = Document;
global.regexPath = regexPath;
global.routes = routes;

// inject simorgh-renderer/index and instantly execute
require('simorgh-renderer/index');
