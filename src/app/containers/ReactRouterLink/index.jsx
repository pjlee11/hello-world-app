import React from 'react';
import { Link } from 'react-router-dom';
import pathToRegexp from 'path-to-regexp';
import { regexPath } from '../../routes';
import { string } from 'prop-types';

const ReactRouteLinkContainer = ({ href, text }) => {
  const regexp = pathToRegexp(regexPath, [], {
    start: false,
    end: false,
  });

  const result = regexp.exec(href);

  // if URL matches a valid route, use a react-router link
  if (result) {
    // the path is the first item in the array
    const path = result[0];
    return <Link to={path}>{text}</Link>;
  }

  // else return a normal hyperlink
  return <Link href={href}>{text}</Link>;
};

ReactRouteLinkContainer.propTypes = {
  text: string.isRequired,
  href: string.isRequired,
};

export default ReactRouteLinkContainer;
