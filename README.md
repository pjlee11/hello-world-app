# Hello World App

## TL;DR

A Hello world app acting as an example case of using the SPArtacus

## Run this app

- `git clone git@github.com:pjlee11/hello-world-app.git`
- `cd hello-world-app`
- `npm install`
- `npm run dev`
- Visit http://localhost:7080/news/helloWorld
- Drink coffee - you deserve it!

## Notes
- Hot Module Reloading currently isn't working - there is an issue to fix it. This means we need to run `rs` to restart the server following code changes. Sometimes it will require kill the node server process `ctrl + c` and then re-running `npm run dev`. 
- The `data/` directory and `global.dataPathRegex` is only required if you want to use static fixture data which is served using a Express server matching against the `${global.dataPathRegex}.json`.

## Commands

| Command | Use |
| ------- | --- |
| `npm run dev` | Run the dev sever without any treeshaking of the webpack bundling |
| `npm run build` | Run the webpack config to babel and build the application with treeshaking |
| `npm run start` | Run the server as production. Requires `npm run build` to be run prior |

## I want to build an application that uses SPArtacus

Your application should have the following structure:

```
src/
  client.js
  index.js
  app/
  components/
    Document/
      index.jsx
      ResourceHints/
        index.jsx
    {Your components here}
  containers/
    {Your top level containers here}
  routes/
    index.jsx
    getInitialData/
      index.jsx
.babelrc
.env
package.json
webpack.config.client.js
webpack.config.js
webpack.config.server.js
```

### File breakdown

| Filename                        | Purpose                                                                                                                                                                                                             |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| src/client.js                   | Entry point for webpack.config.client.js by default should setup up global values and contain `require(SPArtacus/client.js)`                                                                                                                   |
| src/index.js                    | Entry point for webpack.config.server.js sets up global varaibles needed for SPArtacus to create your application, also requires `SPArtacus/index.js` which creates the local server and application express server |
| webpack.config.server.js        | Webpack config bespoke to the server                                                                                                                                                                                |
| webpack.config.js               | Webpack entry point which optionally includes the bespoke client/server config                                                                                                                                      |
| webpack.config.client.js        | Webpack config bespoke to the client                                                                                                                                                                                |
| .env                            | A file that configures environment varaibles                                                                                                                                                                        |
| .babelrc                        | Babel config that webpack uses                                                                                                                                                                                      |
| routes/index.jsx                | Creates and exports the application routes and the regexPath to match routes against                                                                                                                                |
| routes/getInitialData/index.jsx | Method for data fetching on both the server and the client. This method is passed along with the routes to the SPArtacus                                                                                            |
| \_                              | \_                                                                                                                                                                                                                  |

to be continued...
