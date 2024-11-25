import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../components';
import { EvaBrandSectionsEnum } from '../../../../enums';
import { showError } from '../../../../helpers';
import './SectionsAdd.Style.scss';

// dialog to select type of the section then add it
export const SectionsAddDialog = ({
  sections,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [currentSelectedSection, setCurrentSelectedSection] = useState(null);
  const saveHandler = (event) => {
    event.preventDefault();
    if (!currentSelectedSection) {
      showError(t(`${translationPath}please-select-section-type-first`));
      return;
    }
    if (onSave) onSave(currentSelectedSection);
  };
  return (
    <DialogComponent
      titleText="add-new-section"
      saveText="add"
      maxWidth="sm"
      dialogContent={
        <div className="sections-add-dialog-wrapper">
          {Object.values(EvaBrandSectionsEnum).map((item, index) => (
            <ButtonBase
              className={`btns theme-transparent section-item-wrapper${
                (currentSelectedSection
                  && currentSelectedSection.key === item.key
                  && ' selected-section')
                || ''
              }`}
              disabled={
                item.isDisabled
                || (!item.isMultiple
                  && sections.some((element) => element.type === item.key))
              }
              key={`EvaBrandSectionsEnumKeys${index + 1}`}
              onClick={() => setCurrentSelectedSection(item)}
            >
              <span className={`section-icon ${item.icon}`} />
              <span>{t(`${translationPath}${item.name}`)}</span>
            </ButtonBase>
          ))}
        </div>
      }
      // isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

SectionsAddDialog.propTypes = {
  sections: PropTypes.instanceOf(Array).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
SectionsAddDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  translationPath: 'SectionsAddDialog.',
};
