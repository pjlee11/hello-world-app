import fs from 'fs';
import path from 'path';
import React from 'react';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { Helmet } from 'react-helmet';
import { ServerStyleSheet } from 'styled-components';
import {
  getAssetsArray,
  getStyleTag,
  loadInitialData,
  ServerApp,
} from '@bbc/spartacus/utilities';
import { expressServer } from '@bbc/spartacus/server';
import Document from '../app/components/Document';
import routes, { regexPath } from '../app/routes';
import { Logger } from '@bbc/spartacus/logger';

const logger = Logger(__filename);

const assets = getAssetsArray();

const dataFolderToRender =
  process.env.NODE_ENV === 'production' ? 'data/prod' : 'data/test';

const dataRegexPath = `${regexPath}.json`;

const renderArticle = async (url, data) => {
  const sheet = new ServerStyleSheet();

  const app = renderToString(
    sheet.collectStyles(
      <ServerApp location={url} routes={routes} data={data} context={{}} />,
    ),
  );

  const headHelmet = Helmet.renderStatic();

  const doc = renderToStaticMarkup(
    <Document
      assets={assets}
      app={app}
      data={data}
      styleTags={getStyleTag(sheet, data.isAmp)}
      helmet={headHelmet}
    />,
  );

  return doc;
};

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

      res
        .status(status)
        .send(`<!doctype html>${await renderArticle(url, data)}`);
    } catch ({ message, status }) {
      // Return an internal server error for any uncaught errors
      logger.error(`status: ${status || 500} - ${message}`);
      res.status(500).send(message);
    }
  });

export default expressServer;
