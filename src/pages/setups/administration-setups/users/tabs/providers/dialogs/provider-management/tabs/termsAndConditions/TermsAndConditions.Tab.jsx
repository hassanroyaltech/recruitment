import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  SwitchComponent,
  TextEditorComponent,
} from '../../../../../../../../../../components';

export const TermsAndConditionsTab = ({
  state,
  errors,
  onStateChanged,
  isSubmitted,
  isLoading,
  parentTranslationPath,
  translationPath,
  // userType,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  return (
    <div className="provider-terms-and-conditions-tab-wrapper tab-content-wrapper">
      <SwitchComponent
        idRef="termsAndConditionsRef"
        label="terms-and-conditions"
        isChecked={state.enable_terms}
        isReversedLabel
        isFlexStart
        onChange={(event, isChecked) => {
          onStateChanged({ id: 'enable_terms', value: isChecked });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        wrapperClasses="px-2"
      />
      <div className="px-2 mb-5">
        <p>{t(`${translationPath}terms-and-conditions-desc`)}</p>
      </div>
      <TextEditorComponent
        editorValue={state.terms_conditions_content}
        isSubmitted={isSubmitted}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        height={155}
        menubar={false}
        onEditorDelayedChange={(content) =>
          onStateChanged({ id: 'terms_conditions_content', value: content })
        }
      />
    </div>
  );
};

TermsAndConditionsTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  userType: PropTypes.oneOf(['agency', 'university']).isRequired,
};
