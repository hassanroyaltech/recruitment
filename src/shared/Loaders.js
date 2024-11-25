import React from 'react';
import { default as ContentLoaderCore } from 'react-content-loader';
import styled from 'styled-components';

const ContentLoader = styled(ContentLoaderCore)`
  &:not(.not) {
    margin: 1rem auto;
    width: 100%;
  }
`;

export const BoardsLoader = (props) => (
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
    <rect x="18" y="60" rx="2" ry="2" width="452" height="71" />
  </ContentLoader>
);

export const DefaultLoader = (props) => (
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

export const ButtonLoader = () => (
  <ContentLoader
    className="not"
    speed={2}
    width={80}
    height={20}
    viewBox="0 0 80 20"
    backgroundColor="#e9e9e9"
    foregroundColor="#ffffff"
  >
    <rect x="0" y="0" rx="3" ry="3" width="67" height="11" />
  </ContentLoader>
);
export const BulletLoader = () => (
  <ContentLoader
    className="not"
    speed={2}
    width={80}
    height={160}
    viewBox="0 0 80 160"
    backgroundColor="#e9e9e9"
    foregroundColor="#ffffff"
  >
    <circle cx="10" cy="20" r="8" />
    <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="50" r="8" />
    <rect x="25" y="45" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="80" r="8" />
    <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
    <circle cx="10" cy="110" r="8" />
    <rect x="25" y="105" rx="5" ry="5" width="220" height="10" />
  </ContentLoader>
);

export const FormLoader = () => (
  <ContentLoader
    speed={2}
    width={400}
    height={160}
    viewBox="0 0 400 160"
    backgroundColor="#c1cbd6"
    foregroundColor="#fff"
  >
    <rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
    <rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
    <rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
    <rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
    <rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
    <circle cx="20" cy="20" r="20" />
  </ContentLoader>
);

export const ThreeDots = (props) => (
  <ContentLoader
    {...props}
    viewBox="0 0 400 160"
    height={160}
    width={400}
    speed={2}
    backgroundColor="transparent"
  >
    <circle cx="150" cy="86" r="8" />
    <circle cx="194" cy="86" r="8" />
    <circle cx="238" cy="86" r="8" />
  </ContentLoader>
);
