import React from 'react';
import { default as ContentLoaderCore } from 'react-content-loader';
import styled from 'styled-components';

const ContentLoader = styled(ContentLoaderCore)`
  margin: 1rem auto;
  width: 100%;
`;
const Loader = (props) => (
  <ContentLoader
    {...props}
    speed={2}
    width={600}
    height={475}
    viewBox="0 0 600 475"
    backgroundColor="#e9e9e9"
    foregroundColor="#fff"
  >
    <circle cx="31" cy="31" r="15" />
    <rect x="58" y="18" rx="2" ry="2" width="200" height="10" />
    <rect x="58" y="34" rx="2" ry="2" width="140" height="10" />
    <rect x="18" y="60" rx="2" ry="2" width="100%" height="71" />
  </ContentLoader>
);

export default Loader;
