import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from 'components';

export const BuyCreditsDoneDialog = ({
  selectedChannels,
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
          {selectedChannels.map((item, index) => (
            <span className="mb-2" key={`selectedChannelsKey${index + 1}`}>
              <span className="c-green-primary">
                <span>x</span>
                <span>{item.credits}</span>
              </span>
              <span className="px-1">{item.title}</span>
            </span>
          ))}
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
BuyCreditsDoneDialog.propTypes = {
  selectedChannels: PropTypes.instanceOf(Array),
  selectedContracts: PropTypes.instanceOf(Array),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
BuyCreditsDoneDialog.defaultProps = {
  selectedChannels: [],
  selectedContracts: [],
  translationPath: 'BuyCreditsDoneDialog.',
};
