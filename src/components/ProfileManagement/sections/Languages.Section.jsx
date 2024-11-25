import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { GetAllSetupsLanguages } from '../../../services';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../pages/setups/shared';

export const LanguagesSection = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  isFullWidth,
  company_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const languageProficiencyOptions = [
    { value: 1, label: t('languageProficiencyOptionsLevel1') },
    { value: 2, label: t('languageProficiencyOptionsLevel2') },
    { value: 3, label: t('languageProficiencyOptionsLevel3') },
    { value: 4, label: t('languageProficiencyOptionsLevel4') },
    { value: 5, label: t('languageProficiencyOptionsLevel5') },
  ];
  const onLanguageDeleteHandler = useCallback(
    (currentIndex, items) => () => {
      const localLanguages = [...items];
      localLanguages.splice(currentIndex, 1);
      onStateChanged({
        id: 'language_proficiency',
        value: localLanguages,
      });
    },
    [onStateChanged],
  );

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('languages')}</div>
      <div className="section-item-action">
        <ButtonBase
          onClick={() => {
            const localLanguages = [...(state.language_proficiency || [])];
            localLanguages.push({
              uuid: '',
              value: '',
            });
            onStateChanged({ id: 'language_proficiency', value: localLanguages });
          }}
          className="btns theme-solid"
        >
          <span className="mdi mdi-plus" />
          <span>{t('add-language')}</span>
        </ButtonBase>
      </div>
      <div className="section-item-body-wrapper px-2">
        {state.language_proficiency
          && state.language_proficiency.map((item, index, items) => (
            <div
              className="language-item d-flex-h-center"
              key={`${index + 1}-language-item`}
            >
              <div className="d-flex flex-wrap">
                <SharedAPIAutocompleteControl
                  isHalfWidth={!isFullWidth}
                  isFullWidth={isFullWidth}
                  errors={errors}
                  stateKey="uuid"
                  title="language"
                  searchKey="search"
                  parentIndex={index}
                  editValue={item.uuid}
                  placeholder="language"
                  isDisabled={isLoading}
                  isSubmitted={isSubmitted}
                  parentId="language_proficiency"
                  onValueChanged={onStateChanged}
                  isRequired
                  errorPath={`language_proficiency[${index}].uuid`}
                  getDataAPI={GetAllSetupsLanguages}
                  extraProps={{
                    company_uuid,
                    ...(item.uuid && { with_than: [item.uuid] }),
                  }}
                  parentTranslationPath={parentTranslationPath}
                  getOptionLabel={(option) =>
                    option.name[i18next.language] || option.name.en
                  }
                />
                <SharedAutocompleteControl
                  isHalfWidth={!isFullWidth}
                  isFullWidth={isFullWidth}
                  errors={errors}
                  stateKey="value"
                  searchKey="search"
                  parentIndex={index}
                  initValuesKey="value"
                  editValue={item.value}
                  isDisabled={isLoading}
                  initValuesTitle="label"
                  title="proficiency-level"
                  isSubmitted={isSubmitted}
                  isRequired
                  errorPath={`language_proficiency[${index}].value`}
                  parentId="language_proficiency"
                  placeholder="proficiency-level"
                  onValueChanged={onStateChanged}
                  initValues={languageProficiencyOptions}
                  parentTranslationPath={parentTranslationPath}
                />
              </div>

              <ButtonBase
                className="btns-icon theme-danger mx-2 mt-1"
                onClick={onLanguageDeleteHandler(index, items)}
              >
                <span className="fas fa-minus" />
              </ButtonBase>
            </div>
          ))}
      </div>
    </div>
  );
};

LanguagesSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isFullWidth: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};

LanguagesSection.defaultProps = {
  company_uuid: undefined,
};
