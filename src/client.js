import routes from './app/routes';
global.routes = routes;
global.module = module;

require('@bbc/spartacus/client');
