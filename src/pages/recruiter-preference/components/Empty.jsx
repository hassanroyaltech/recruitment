import React from 'react';
import styled from 'styled-components';
import NoData from 'assets/images/shared/empty-1.png';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

const EmptyWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  width: 100%;
`;
const Img = styled.img`
  max-width: 200px;
  pointer-events: none;
  user-select: none;
`;
const P = styled.p`
  color: rgba(0, 0, 0, 0.25);
`;
const Empty = ({
  message,
  defaultMessage,
  parentTranslationPath,
  translationPath,
  extraContent,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <EmptyWrapper>
      <Img src={NoData} alt={message || t(`${translationPath}${defaultMessage}`)} />
      <P>{message || t(`${translationPath}${defaultMessage}`)}</P>
      {extraContent}
    </EmptyWrapper>
  );
};
Empty.propTypes = {
  message: PropTypes.string,
  defaultMessage: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  extraContent: PropTypes.node,
};
Empty.defaultProps = {
  message: undefined,
  defaultMessage: 'no-data-found',
  parentTranslationPath: 'Shared',
  translationPath: '',
  extraContent: undefined,
};
export default Empty;
