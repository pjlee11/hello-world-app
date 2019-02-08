import HelloWorld from '../containers/HelloWorld';
import getInitialData from './getInitialData';

const services = ['news', 'persian'];

const serviceRegex = services.join('|');

// this gets passed to universal-react-app which passes the regex on to react-router-config
export const regexPath = `/:service(${serviceRegex})/:id?`;

const routes = [
  {
    path: regexPath, // the path for react-router to match against with named params EG: :service
    exact: true,
    component: HelloWorld, // the component you want to render with the data from getInitialData
    getInitialData, // a method which defines the URL to get data from and the params to pass through to the component
  },
];

export default routes;
