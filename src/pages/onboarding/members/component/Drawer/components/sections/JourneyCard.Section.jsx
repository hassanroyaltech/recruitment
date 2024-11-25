import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { OnboardingTypesEnum } from '../../../../../../../enums';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import './JourneyCard.Style.scss';
import { TooltipsComponent } from '../../../../../../../components';

const JourneyCardSection = ({
  item,
  onJourneyCardClicked,
  isGlobalLoading,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="journey-card-section-wrapper">
      <ButtonBase
        className="journey-card-wrapper"
        disabled={isGlobalLoading}
        onClick={onJourneyCardClicked(item)}
      >
        <div className="journey-card-icon">
          <span className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`} />
        </div>
        <div className="journey-card-body">
          <div className="journey-card-row title-wrapper">
            <TooltipsComponent
              title={item.title}
              contentComponent={<span>{item.title}</span>}
            />
          </div>
          <div className="journey-card-row">
            <span className="tags-wrapper-v2">
              <div
                className={`tag-wrapper ${
                  (item.is_submitted && 'bg-green-lighter')
                  || 'bg-accent-secondary-light'
                }`}
              >
                {t(
                  `${translationPath}${
                    (item.is_submitted && 'completed') || 'started'
                  }`,
                )}
              </div>
            </span>
          </div>
          <div className="journey-card-row">
            {item.space && (
              <span className="tags-wrapper-v2">
                <div className="tag-wrapper">{item.space.title}</div>
              </span>
            )}
            {item.folder && (
              <span className="tags-wrapper-v2">
                <div className="tag-wrapper">{item.folder.title}</div>
              </span>
            )}
          </div>
        </div>
      </ButtonBase>
    </div>
  );
};

JourneyCardSection.propTypes = {
  item: PropTypes.instanceOf(Object).isRequired,
  onJourneyCardClicked: PropTypes.func,
  isGlobalLoading: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default memo(JourneyCardSection);
