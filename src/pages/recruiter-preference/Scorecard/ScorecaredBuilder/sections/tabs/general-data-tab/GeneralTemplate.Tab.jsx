import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import AddTranslationButton from '../../../components/AddTranslationsButton/AddTranslationButton.Component';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import { DynamicFormTypesEnum } from '../../../../../../../enums';
import { ScorecardTranslationDialog } from '../../../components/TranslationDialog/ScorecardTranslationDialog';

export const GeneralTemplateTab = ({
  isLoading,
  parentTranslationPath,
  templateData,
  setTemplateData,
  headerHeight,
  handleTemplateGeneral,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenTranslation, setIsOpenTranslation] = useState(false);

  const handleTranslate = (translations) => {
    setIsOpenTranslation(false);
    setTemplateData((items) => ({ ...items, ...translations }));
  };
  return (
    <div
      className="scorecard-tab-wrapper"
      style={{
        height: `calc(100vh - ${headerHeight + 35}px)`,
        overflow: 'auto',
      }}
    >
      <div className="general-tab-wrapper">
        <div className="d-flex-v-center-h-end mt-2 mb-1">
          <AddTranslationButton
            onClick={() => {
              setIsOpenTranslation(true);
            }}
          />
        </div>
        <div>
          <span className="d-inline-flex fz-22px font-weight-700 min-width-140px">
            {t('title')}
          </span>
          <SharedInputControl
            isHalfWidth
            // title="application-reference-number"
            stateKey="title"
            themeClass="theme-transparent"
            searchKey="search"
            innerInputWrapperClasses="border-0"
            placeholder="untitled-scorecard"
            wrapperClasses="mb-0"
            fieldClasses="score-input-fz-22px  input-font-weight-700"
            onValueChanged={(newValue) =>
              handleTemplateGeneral({
                val: newValue.value,
                lang: 'en',
                name: 'title',
              })
            }
            parentTranslationPath={parentTranslationPath}
            editValue={templateData?.title?.en || ''}
          />
        </div>
        <div>
          <span className="d-inline-flex min-width-140px">{t('description')}</span>
          <SharedInputControl
            isHalfWidth
            stateKey="description"
            searchKey="search"
            placeholder="add-optional-description"
            themeClass="theme-transparent"
            wrapperClasses="mt-0 mb-2"
            innerInputWrapperClasses="border-0"
            onValueChanged={(newValue) =>
              handleTemplateGeneral({
                val: newValue.value,
                lang: 'en',
                name: 'description',
              })
            }
            parentTranslationPath={parentTranslationPath}
            editValue={templateData?.description?.en || ''}
          />
        </div>
        <div className="score-labels-parent d-flex-v-center w-100">
          <span className="d-inline-flex min-width-140px">
            {t('template-labels')}
          </span>
          <SharedAutocompleteControl
            placeholder="type-and-press-enter-to-confirm"
            themeClass="theme-transparent"
            innerInputWrapperClasses="border-0"
            sharedClassesWrapper="mb-0 w-100 score-lables-input"
            isFreeSolo
            stateKey="template_labels"
            onValueChanged={(newValue) =>
              handleTemplateGeneral({ val: newValue.value, name: 'template_labels' })
            }
            editValue={templateData?.template_labels || []}
            type={DynamicFormTypesEnum.array.key}
            parentTranslationPath={parentTranslationPath}
          />
        </div>
      </div>
      {isOpenTranslation && (
        <ScorecardTranslationDialog
          activeItem={{
            title: templateData.title,
            description: templateData.description,
          }}
          isOpen={isOpenTranslation || false}
          onSave={handleTranslate}
          handleCloseDialog={() => {
            setIsOpenTranslation(false);
          }}
          titleText="general-data-title"
          parentTranslationPath={parentTranslationPath}
          requiredKey="title"
          additionalKey="description"
        />
      )}
    </div>
  );
};

GeneralTemplateTab.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  templateData: PropTypes.instanceOf(Object),
  setTemplateData: PropTypes.func,
  headerHeight: PropTypes.number,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
