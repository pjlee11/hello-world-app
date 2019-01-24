import React, { Fragment } from 'react';
import { bool, string, object } from 'prop-types';
import HelloWorld from '../../components/HelloWorld';
import ReactRouterLink from '../../containers/ReactRouterLink';

/*
  [1] This handles async data fetching, and a 'loading state', which we should look to handle more intelligently.
*/
const HelloWorldContainer = ({ loading, error, data }) => {
  if (loading) return 'Loading...'; /* [1] */
  if (error) return 'Something went wrong :(';
  if (data) {
    // the object data
    const { data: pageData } = data;
    const { title, subHeading, link } = pageData;

    return (
      <Fragment>
        <HelloWorld>{title}</HelloWorld>
        <h2>{subHeading}</h2>
        <p>{JSON.stringify(pageData)}</p>
        <ReactRouterLink href={link} text={'SPA link'} />
      </Fragment>
    );
  }

  return null;
};

HelloWorldContainer.propTypes = {
  loading: bool,
  error: string,
  data: object,
};

HelloWorldContainer.defaultProps = {
  loading: false,
  error: null,
  data: null,
};

export default HelloWorldContainer;
