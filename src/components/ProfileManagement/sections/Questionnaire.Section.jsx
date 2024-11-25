import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { QuestionSection } from '../../../pages/evarec/initial-approval/dialogs/approve-applicant-details/tabs/evaluation/sections/sections';
import { EvaluationQuestionsTypesEnum } from '../../../enums';

export const QuestionnaireSection = ({
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
      <div className="section-item-title">{t('questionnaire')}</div>
      <div className="section-item-description">
        {t('questionnaire-description')}
      </div>
      <div className="p-3">
        {state.job_requirement
          && state.job_requirement.map((item, index) => (
            <QuestionSection
              key={item.uuid}
              onStateChanged={onStateChanged}
              parentId="job_requirement"
              parentIndex={index}
              id={getQuestionKeyByType(item.type)}
              errorPath={`job_requirement[${index}].answers`}
              isOtherErrorPath={`job_requirement[${index}].other_answer`}
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

QuestionnaireSection.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object).isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  company_uuid: PropTypes.string,
};
QuestionnaireSection.defaultProps = {
  company_uuid: undefined,
};
