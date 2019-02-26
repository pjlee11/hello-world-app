import { setupServer } from '@bbc/spartacus/index';
import { nodeLogger } from '@bbc/spartacus/loggers';

const logger = nodeLogger(__filename);
const expressServer = require('./server').default;

const server = setupServer(expressServer);

let currentApp = expressServer;

if (module.hot) {
  module.hot.accept('./server', () => {
    logger.info('🔁  Hot Module Replacement reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server').default; // eslint-disable-line global-require
    server.on('request', newApp);
    currentApp = newApp;
  });
}
