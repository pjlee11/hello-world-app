# Hello World App

## TL;DR

A Hello world app acting as an example case of using the SPArtacus

## Run this app

- `git clone git@github.com:pjlee11/hello-world-app.git`
- `cd hello-world-app`
- `npm install`
- `npm run build && npm run start` OR `npm run dev`
- Visit http://localhost:7080/news/helloWorld
- Drink coffee - you deserve it!

## Notes

- Hot Module Reloading on the server currently isn't working - there is an issue to fix it. This means we need to run `rs` to restart the server following code changes. Sometimes it will require kill the node server process `ctrl + c` and then re-running `npm run dev`.

## Commands

| Command         | Use                                                                        |
| --------------- | -------------------------------------------------------------------------- |
| `npm run dev`   | Run the dev sever without any treeshaking of the webpack bundling          |
| `npm run build` | Run the webpack config to babel and build the application with treeshaking |
| `npm run start` | Run the server as production. Requires `npm run build` to be run prior     |

## I want to build an application that uses SPArtacus

Your application should have the following structure:

```
.babelrc
.env
package.json
webpack.config.js
src/
  client.js
  index.js
  server/
    index.jsx {Your Express server config}
  app/
    components/
      ResourceHints/
        index.jsx {Your prefetch and preload URLs here}
      {Your components here}
    containers/
      {Your containers here}
    routes/
      index.jsx {Your routes here}
      getInitialData/
        index.jsx {Your regex routes param handling here}
```

### File breakdown

| Filename                        | Purpose                              | 
| ------------------------------- | ------------------------------------ |
| .babelrc                        | Babel config that SPArtacus' webpack uses |
| .env                            | A file that configures environment varaibles |
| webpack.config.js               | Webpack entry point which calls SPArtacus shared webpack-config.js |
| src/client.js                   | Entry point for the client webpack |
| src/index.js                    | Entry point for the server webpack |
| server/index.jsx                | Bespoke configuration of the Express server that is setup by SPArtacus |
| routes/index.jsx                | Creates and exports the application routes and the regexPath to match routes against which defines the params gathered from routing |
| routes/getInitialData/index.jsx | Method for data fetching on the client and the server. This method is passed along with the routes to SPArtacus |

