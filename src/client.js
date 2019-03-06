/* eslint-disable react/jsx-filename-extension  */
import routes from './app/routes';
import setupClient from '@bbc/spartacus/client';

const data = window.SPARTACUS_DATA || {};

setupClient({ data, routes, module });
