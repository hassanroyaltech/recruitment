import React from 'react';
import ContentLoader from 'react-content-loader';
import { Container } from 'reactstrap';

const BarLoader = (props) => (
  <Container fluid>
    <ContentLoader
      className="w-100"
      speed={5}
      width={1200}
      height={90}
      viewBox="0 0 1200 120"
      backgroundColor="#f3f3f3"
      foregroundColor="#090979"
    >
      <rect x="8" y="117" rx="0" ry="0" width="1200" height="30" />
    </ContentLoader>
  </Container>
);
export default BarLoader;
