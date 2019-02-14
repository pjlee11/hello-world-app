import routes from './app/routes';
global.routes = routes;

require('@bbc/spartacus/client');

if (module.hot) {
  module.hot.accept();
}
