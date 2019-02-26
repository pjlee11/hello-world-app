/* eslint-disable react/jsx-filename-extension  */
import routes from './app/routes';
import setupClient from '@bbc/spartacus/client';

setupClient(routes, module);
