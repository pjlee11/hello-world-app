/*
 * With SPARTACUS_ acting as a library it should be installed into an application. The application should then define it's
 * own components and containers. It must supply a Document component as the wrapper for the HTML document.
 * This a hello world example of a Document component
 */

import React from 'react';
import ResourceHints from './ResourceHints';

/* eslint-disable react/prop-types */
const Document = ({ assets, app, data, styleTags, helmet }) => {
  // Bundle up the data so that SPARTACUS_ on the client has the same data as the server to stop a flicker in content
  const serialisedData = JSON.stringify(data);

  // helmet is used to populate the <head> of the document as React doesn't handle script and style tags nicely.
  const htmlAttrs = helmet.htmlAttributes.toComponent();
  const meta = helmet.meta.toComponent();
  const title = helmet.title.toComponent();
  const links = helmet.link.toComponent();

  // create a script tag for each of the static assets, such as JS vendor bundles
  const scripts = assets.map(asset => (
    <script
      crossOrigin="anonymous"
      key={asset}
      type="text/javascript"
      src={asset}
      defer
    />
  ));

  return (
    <html lang="en-GB" {...htmlAttrs}>
      <head>
        {/* Boilerplate HTML head contents */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta charSet="utf-8" />
        <meta name="robots" content="noindex,nofollow" />
        {meta}
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="manifest" href="/manifest.json" />
        {/* Some resource hints such as prefetch/preload bbc domain */}
        <ResourceHints />
        {title}
        {links}
        {styleTags}
      </head>
      <body>
        {/* eslint-disable react/no-danger */
        /* disabling the rule that bans the use of dangerouslySetInnerHTML until a more appropriate implementation can be implemented */}
        <div id="root" dangerouslySetInnerHTML={{ __html: app }} />
        {/* Pass through the server data to SPARTACUS_ on the client  */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.SPARTACUS_DATA=${serialisedData}`,
          }}
        />
        {/* Add the other scripts created from the static assets, such as JS vendor bundles */}
        {scripts}
      </body>
    </html>
  );
};

export default Document;
