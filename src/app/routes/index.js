import HelloWorld from "../containers/HelloWorld";
import getInitialData from "./getInitialData";
import services from "../lib/config/services";

const serviceRegex = Object.keys(services)
  .filter(serviceName => serviceName !== "default")
  .join("|");

// this gets passed to universal-react-app which passes the regex on to react-router-config
export const regexPath = `/:service(${serviceRegex})/:id?`;

export const routes = [
  {
    path: regexPath, // the path for react-router to match against with named params EG: :service
    exact: true,
    component: HelloWorld, // the component you want to render with the data from getInitialData
    getInitialData // a method which defines the URL to get data from and the params to pass through to the component
  }
];
