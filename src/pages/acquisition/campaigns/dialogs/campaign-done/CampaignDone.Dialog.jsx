import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from 'components';

export const CampaignDoneDialog = ({
  activeItem,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <DialogComponent
      maxWidth="xs"
      dialogContent={
        <div className="d-flex-column px-2 pt-2">
          <span className="header-text-x2 c-green-primary mb-3">
            {t(`${translationPath}successfully-paid`)}
          </span>
          <span className="mb-3">
            {t(`${translationPath}successfully-paid-description`)}
          </span>
          <div className="header-text">
            <span>{t(`${translationPath}campaign-name`)}</span>
            <span>:</span>
          </div>
          <span className="mb-3">{(activeItem && activeItem.title) || 'N/A'}</span>
          {/*<div className="header-text">*/}
          {/*  <span>{t(`${translationPath}campaign-start-date`)}</span>*/}
          {/*  <span>:</span>*/}
          {/*</div>*/}
          {/*<span className="mb-3">*/}
          {/*  {(activeItem*/}
          {/*    && activeItem.start_date*/}
          {/*    && moment(activeItem.start_date)*/}
          {/*      .locale(i18next.language)*/}
          {/*      .format(GlobalSecondaryDateFormat))*/}
          {/*    || 'N/A'}*/}
          {/*</span>*/}
          <span className="c-gray-secondary mb-3">
            {t(`${translationPath}campaign-notification-description`)}
          </span>
        </div>
      }
      saveWrapperClasses="w-100"
      saveClasses="btns theme-solid bg-primary w-100"
      saveText="done"
      isOpen={isOpen}
      onSaveClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};
CampaignDoneDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
CampaignDoneDialog.defaultProps = {
  activeItem: undefined,
  translationPath: 'CampaignDoneDialog.',
};
