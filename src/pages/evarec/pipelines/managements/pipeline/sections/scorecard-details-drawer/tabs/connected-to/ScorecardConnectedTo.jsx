import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const ScorecardConnectedTo = ({
  scorecardData,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="">
      {(scorecardData?.connected_to || [])?.map((item) => (
        <React.Fragment key={item}>
          <div className={'mb-1 px-3 py-2 font-weight-600'}>
            {' '}
            <span className={'px-1 far fa-dot-circle'}></span> {item}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
};

ScorecardConnectedTo.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
