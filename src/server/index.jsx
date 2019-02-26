import fs from 'fs';
import path from 'path';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import ResourceHints from '../app/components/ResourceHints';
import { loadInitialData } from '@bbc/spartacus/utilities';
import renderDocument from '@bbc/spartacus/document';
import expressServer from '@bbc/spartacus/server';
import routes, { regexPath } from '../app/routes';
import Logger from '@bbc/spartacus/logger';

const logger = Logger(__filename);

const dataFolderToRender =
  process.env.NODE_ENV === 'production' ? 'data/prod' : 'data/test';

const dataRegexPath = `${regexPath}.json`;

expressServer
  .get(dataRegexPath, async ({ params }, res) => {
    const { service, id } = params;

    const dataFilePath = path.join(dataFolderToRender, service, `${id}.json`);

    fs.readFile(dataFilePath, (error, data) => {
      if (error) {
        res.sendStatus(404);
        logger.error(`error reading fixture json, ${error}`);
        return null;
      }

      const fixtureJSON = JSON.parse(data);

      res.setHeader('Content-Type', 'application/json');
      res.json(fixtureJSON);
      return null;
    });
  })
  .get('/*', async ({ url }, res) => {
    try {
      const data = await loadInitialData(url, routes);
      const { status } = data;

      res.status(status).send(
        // Render a HTML document using style-components and react-helmet
        await renderDocument(
          url,
          data,
          routes,
          ResourceHints,
          ServerStyleSheet, // needed for styled-components to remain a singleton
          Helmet,
        ),
      );
    } catch ({ message, status }) {
      // Return an internal server error for any uncaught errors
      logger.error(`status: ${status || 500} - ${message}`);
      res.status(500).send(message);
    }
  });

export default expressServer;
