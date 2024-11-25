import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

export const RecentActivityTab = ({ parentTranslationPath, translationPath }) => {
  const { t } = useTranslation(parentTranslationPath);

  return <div className="  tab-wrapper"></div>;
};

RecentActivityTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

RecentActivityTab.defaultProps = {};
