/*
 * This is an example component it should have data injected into it from a parent
 */

import React from 'react';
import { string } from 'prop-types';
import styled from 'styled-components';

const Title = styled.h1`
  font-family: ReithSansNewsRegular;
  font-size: 32px;
  line-height: 36px;
  color: #000000;
`;

const HelloWorld = ({ children }) => <Title>{children}</Title>;

HelloWorld.propTypes = {
  children: string,
};

HelloWorld.defaultProps = {
  children: 'Hello world',
};

export default HelloWorld;
