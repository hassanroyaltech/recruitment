import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { DynamicFormTypesEnum } from '../../../enums';
import { SharedAutocompleteControl } from '../../../pages/setups/shared';

export const SkillsSection = ({
  state,
  onStateChanged,
  parentTranslationPath,
  isSubmitted,
  isLoading,
  errors,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('skills')}</div>
      <div className="section-item-description">{t('skills-description')}</div>
      <div className="section-item-body-wrapper px-2">
        <SharedAutocompleteControl
          editValue={state.skills}
          placeholder="press-enter-to-add"
          title="skills"
          isFreeSolo
          stateKey="skills"
          errorPath="skills"
          onValueChanged={onStateChanged}
          isSubmitted={isSubmitted}
          isDisabled={isLoading}
          errors={errors}
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          isFullWidth
        />
      </div>
    </div>
  );
};

SkillsSection.propTypes = {
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
};
