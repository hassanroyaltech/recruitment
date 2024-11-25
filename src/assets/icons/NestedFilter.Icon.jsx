import React from 'react';
export const NestedFilterIcon = ({
  height = '24',
  width = '24',
  with_circle = false,
}) => (
  <svg
    width="24"
    height="24"
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {with_circle && <circle cx="12" cy="12" r="10.5" stroke="#484964" />}
    <path
      d="M6 9.5H18"
      stroke="#484964"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.40039 12.5H15.6004"
      stroke="#484964"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.8008 15.5H13.2008"
      stroke="#484964"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
