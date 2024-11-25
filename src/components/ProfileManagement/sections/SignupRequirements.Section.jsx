import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { QuestionSection } from '../../../pages/evarec/initial-approval/dialogs/approve-applicant-details/tabs/evaluation/sections/sections';
import { EvaluationQuestionsTypesEnum } from '../../../enums';

export const SignupRequirementsSection = ({
  state,
  onStateChanged,
  errors,
  isSubmitted,
  isLoading,
  company_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const getQuestionKeyByType = useMemo(
    () => (questionType) => {
      if (questionType === EvaluationQuestionsTypesEnum.Text.key)
        return 'answer_text';
      if (questionType === EvaluationQuestionsTypesEnum.Files.key)
        return 'media_uuid';
      return 'answer_uuid';
    },
    [],
  );
  return (
    <div className="section-item-wrapper">
      <div className="section-item-title">{t('signup-requirements')}</div>
      <div className="section-item-description">
        {t('signup-requirements-description')}
      </div>
      <div className="p-3">
        {state.sign_up_requirement
          && state.sign_up_requirement.map((item, index) => (
            <QuestionSection
              key={item.uuid}
              onStateChanged={onStateChanged}
              parentId="sign_up_requirement"
              parentIndex={index}
              id={getQuestionKeyByType(item.type)}
              errorPath={`sign_up_requirement[${index}].answers`}
              isOtherErrorPath={`sign_up_requirement[${index}].other_answer`}
              isSubmitted={isSubmitted}
              isLoading={isLoading}
              parentTranslationPath={parentTranslationPath}
              errors={errors}
              question={item}
              company_uuid={company_uuid}
            />
          ))}
      </div>
    </div>
  );
};

SignupRequirementsSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};
SignupRequirementsSection.defaultProps = {
  company_uuid: undefined,
};
