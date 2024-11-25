import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import scrollImage from '../../../assets/scrollImage.png';
import stepsImage from '../../../assets/stepsImage.png';
import { ScorecardAppereanceEnum } from '../../../../../../../enums';
import { ButtonBase } from '@mui/material';

export const AppereanceTab = ({
  parentTranslationPath,
  templateData,
  handleChangeSubmitStyle,
  headerHeight,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div
      className="scorecard-tab-wrapper"
      style={{
        height: `calc(100vh - ${headerHeight + 35}px)`,
        overflow: 'auto',
      }}
    >
      <div className="general-tab-wrapper">
        <div className="d-flex mb-2">
          <span className="fz-22px font-weight-700 c-ui-dark-primary-100">
            {t('submit-style')}
          </span>
        </div>
        <div className="d-flex-h-between scorecard-appearance-section">
          <div className="scorecard-labels-desc">
            <span className="d-block font-weight-500 mb-2 fz-14px c-neutral-scale-3">
              {t('all-q-at-once')}
            </span>
            <span className="d-block font-weight-400 fz-14px c-neutral-scale-3">
              {t('all-q-at-once-description')}
            </span>
            <div className="d-inline-flex-v-center">
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  handleChangeSubmitStyle(
                    templateData?.card_setting?.appearance?.submit_style
                      === ScorecardAppereanceEnum.steps.key
                      ? ScorecardAppereanceEnum.scroll.key
                      : ScorecardAppereanceEnum.steps.key,
                  );
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    templateData?.card_setting?.appearance?.submit_style
                    === ScorecardAppereanceEnum.scroll.key
                      ? 'on c-black'
                      : 'off'
                  }`}
                />
              </ButtonBase>
              <span className="c-ui-dark-primary-100 px-1 font-weight-500">
                {templateData?.card_setting?.appearance?.submit_style
                === ScorecardAppereanceEnum.scroll.key
                  ? t('on')
                  : t('off')}
              </span>
            </div>
          </div>
          <img alt="Scroll all questions" src={scrollImage} />
        </div>
        <div className="d-block my-3  separator-scorecard"></div>
        <div className="d-flex-h-between scorecard-appearance-section">
          <div className="scorecard-labels-desc">
            <span className="d-block font-weight-500 mb-2 fz-14px c-neutral-scale-3">
              {t('type-form')}
            </span>
            <span className="d-block font-weight-400 fz-14px c-neutral-scale-3">
              {t('type-form-description')}
            </span>
            <div className="d-inline-flex-v-center">
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  handleChangeSubmitStyle(
                    templateData?.card_setting?.appearance?.submit_style
                      === ScorecardAppereanceEnum.steps.key
                      ? ScorecardAppereanceEnum.scroll.key
                      : ScorecardAppereanceEnum.steps.key,
                  );
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    templateData?.card_setting?.appearance?.submit_style
                    === ScorecardAppereanceEnum.steps.key
                      ? 'on c-black'
                      : 'off'
                  }`}
                />
              </ButtonBase>
              <span className="c-ui-dark-primary-100 px-1 font-weight-500">
                {templateData?.card_setting?.appearance?.submit_style
                === ScorecardAppereanceEnum.steps.key
                  ? t('on')
                  : t('off')}
              </span>
            </div>
          </div>
          <img alt="Scroll all questions" src={stepsImage} />
        </div>
      </div>
    </div>
  );
};

AppereanceTab.propTypes = {
  templateData: PropTypes.instanceOf(Object),
  handleChangeSubmitStyle: PropTypes.func.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
