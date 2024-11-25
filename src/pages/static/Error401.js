import React from 'react';
import styled from 'styled-components';
import NoData from 'assets/images/shared/401-2.svg';

const EmptyWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 77px);
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  width: 100%;
`;
const Img = styled.img`
  margin-bottom: 0.5rem;
  max-width: 400px;
  pointer-events: none;
  user-select: none;
`;
const P = styled.p`
  color: rgba(0, 0, 0, 0.75);
`;
const Danger = styled.code`
  color: #ff4040;
  font-size: 2rem;
`;
const Error401 = ({ message }) => (
  <EmptyWrapper>
    <Img src={NoData} alt="No Data" />
    <Danger>401</Danger>
    <P>{message || "Sorry, you don't have permissions to access this page."}</P>
  </EmptyWrapper>
);

export default Error401;
