import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SharedInputControl, SharedUploaderControl } from 'pages/setups/shared';

export const ProviderMemberInvitationTab = ({
  state,
  errors,
  onStateChanged,
  isSubmitted,
  isLoading,
  parentTranslationPath,
  translationPath,
  userType,
  isEdit,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const onUploadChanged = (newValue, key) => {
    onStateChanged({
      id: key,
      value: (newValue.value.length && newValue.value[0]) || null,
    });
    onStateChanged({
      id: `${key}_uuid`,
      value: (newValue.value.length && newValue.value[0].uuid) || null,
    });
    onStateChanged({
      id: `${key}_url`,
      value: newValue.value[0].url || [],
    });
  };

  return (
    <div className="provider-member-invitation-tab-wrapper tab-content-wrapper">
      <div>
        <SharedInputControl
          isHalfWidth
          editValue={state.first_name}
          parentTranslationPath={parentTranslationPath}
          stateKey="first_name"
          errors={errors}
          errorPath="first_name"
          labelValue={t(`${translationPath}first-name`)}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
        />
        <SharedInputControl
          isHalfWidth
          editValue={state.second_name}
          parentTranslationPath={parentTranslationPath}
          stateKey="second_name"
          errors={errors}
          errorPath="second_name"
          labelValue={t(`${translationPath}second-name`)}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
        />
        <SharedInputControl
          isHalfWidth
          editValue={state.third_name}
          parentTranslationPath={parentTranslationPath}
          stateKey="third_name"
          errors={errors}
          errorPath="third_name"
          labelValue={t(`${translationPath}third-name`)}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
        />
        <SharedInputControl
          isHalfWidth
          editValue={state.last_name}
          parentTranslationPath={parentTranslationPath}
          stateKey="last_name"
          errors={errors}
          errorPath="last_name"
          labelValue={t(`${translationPath}last-name`)}
          isSubmitted={isSubmitted}
          onValueChanged={onStateChanged}
        />
        <SharedInputControl
          isHalfWidth
          errors={errors}
          labelValue="email"
          isSubmitted={isSubmitted}
          stateKey="email"
          errorPath="email"
          editValue={state.email}
          onValueChanged={onStateChanged}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
        <SharedUploaderControl
          editValue={(state.member_logo && [state.member_logo]) || []}
          onValueChanged={(newvalue) => onUploadChanged(newvalue, 'member_logo')}
          stateKey="member_logo"
          labelValue="member-logo"
          isSubmitted={isSubmitted}
          errors={errors}
          labelClasses="theme-primary"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
    </div>
  );
};

ProviderMemberInvitationTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  languages: PropTypes.instanceOf(Array).isRequired,
  removeLanguageHandler: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  userType: PropTypes.string.isRequired,
  isEdit: PropTypes.bool.isRequired,
};
