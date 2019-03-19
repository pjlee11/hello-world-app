import setupClient from '@bbc/spartacus/client';
import routes from './app/routes';

const data = window.SPARTACUS_DATA || {};

setupClient({ data, routes, module });
