import React from 'react';
import ContentLoader from 'react-content-loader';

const Loader = (props) => (
  <div className="w-100 d-flex-center">
    <ContentLoader
      className="d-flex-center"
      style={{ maxWidth: 710, minHeight: 305 }}
      speed={props.speed}
    >
      <rect x="583" y="33" rx="2" ry="2" width="123" height="33" />
      <rect x="66" y="49" rx="0" ry="0" width="165" height="11" />
      <rect x="66" y="97" rx="0" ry="0" width="202" height="41" />
      <rect x="284" y="97" rx="0" ry="0" width="202" height="41" />
      <rect x="506" y="96" rx="0" ry="0" width="202" height="41" />
      <rect x="66" y="155" rx="0" ry="0" width="642" height="4" />
      <rect x="66" y="175" rx="0" ry="0" width="642" height="4" />
      <rect x="65" y="195" rx="0" ry="0" width="642" height="4" />
      <rect x="66" y="215" rx="0" ry="0" width="642" height="4" />
      <rect x="66" y="236" rx="0" ry="0" width="642" height="4" />
      <rect x="65" y="256" rx="0" ry="0" width="642" height="4" />
      <rect x="315" y="274" rx="0" ry="0" width="31" height="28" />
      <rect x="356" y="274" rx="0" ry="0" width="31" height="28" />
      <rect x="396" y="274" rx="0" ry="0" width="31" height="28" />
    </ContentLoader>
  </div>
);
export default Loader;
