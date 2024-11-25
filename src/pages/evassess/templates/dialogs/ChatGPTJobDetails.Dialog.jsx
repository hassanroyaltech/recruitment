import { DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import React, { useCallback, useEffect, useState, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { CheckboxesComponent } from 'components';
import { useTranslation } from 'react-i18next';
import { GetAllSetupsJobTypes } from '../../../../services';
import { DynamicFormTypesEnum } from '../../../../enums';
import i18next from 'i18next';
import { SystemLanguagesConfig } from '../../../../configs';
import { Col, Row } from 'reactstrap';
const translationPath = 'ChatGPTModal.';
const parentTranslationPath = 'EvaSSESSTemplates';
const QuestionsNumbers = [
  { id: 'one', title: '1' },
  { id: 'two', title: '2' },
  { id: 'three', title: '3' },
  { id: 'four', title: '4' },
  { id: 'five', title: '5' },
];
export const ChatGPTJobDetailsDialog = ({
  isOpen,
  isLoading,
  isMultiple,
  onSave,
  state,
  onClose,
  isJobTitleRequired,
  questionTypes,
  isWithlanguage,
  isForJobTemplate,
  isWithJobType,
  isWithQuestionsNumber,
  jobTitleLabel,
  isYearsHalf,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef(state);
  const [languages] = useState(
    Object.values(SystemLanguagesConfig).map((item) => ({
      code: item.key,
      title: t(`Shared:LanguageChangeComponent.${item.value}`),
    })),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [localState, setLocalState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setLocalState(newValue);
  };

  const onSubmitHandler = useCallback(
    (e) => {
      e.preventDefault();
      setIsSubmitted(true);
      if (isJobTitleRequired && localState.job_title) onSave(localState);
    },
    [localState],
  );

  return (
    <DialogComponent
      titleText="chat-gpt-modal-title"
      maxWidth="sm"
      dialogContent={
        <div>
          <SharedInputControl
            editValue={localState?.job_title}
            parentTranslationPath={parentTranslationPath}
            stateKey="job_title"
            title={`${t(`${translationPath}${jobTitleLabel || 'job-title'}`)}`}
            type="text"
            isDisabled={isLoading}
            onValueChanged={onStateChanged}
            errorPath="job_title"
            errors={
              !localState.job_title
                ? {
                  job_title: {
                    error: true,
                    message: t('Shared:this-field-is-required'),
                    messages: [],
                  },
                }
                : {}
            }
            isSubmitted={isSubmitted}
          />
          <SharedInputControl
            wrapperClasses={'px-3'}
            isDisabled={isLoading}
            editValue={localState?.year_of_experience}
            parentTranslationPath={parentTranslationPath}
            stateKey="year_of_experience"
            title={`${t(`${translationPath}year-of-experience`)}`}
            onValueChanged={onStateChanged}
            type="number"
            min={0}
            isFullWidth={!isWithJobType || isWithQuestionsNumber}
            isHalfWidth={isWithJobType || isWithQuestionsNumber || isYearsHalf}
          />
          {isMultiple && isWithQuestionsNumber && (
            <SharedAutocompleteControl
              stateKey="number_of_questions"
              title="number-of-questions"
              disableClearable
              isDisabled={!isMultiple}
              editValue={localState?.number_of_questions || 1}
              placeholder="number-of-questions"
              onValueChanged={onStateChanged}
              initValues={QuestionsNumbers}
              isHalfWidth
              initValuesKey="id"
              initValuesTitle="title"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              sharedClassesWrapper="px-3"
            />
          )}
          {isWithJobType && (
            <SharedAPIAutocompleteControl
              isEntireObject
              wrapperClasses="px-3"
              controlWrapperClasses="px-0"
              isHalfWidth
              title={t(`${translationPath}job-type`)}
              placeholder={t(`${translationPath}job-type`)}
              stateKey="job_type"
              editValue={localState?.job_type?.uuid}
              onValueChanged={onStateChanged}
              idRef="JobTypeGPTModal"
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              type={DynamicFormTypesEnum.select.key}
              extraProps={{
                with_than:
                  (localState?.type_uuid?.uuid && [localState?.type_uuid?.uuid])
                  || null,
              }}
              getDataAPI={GetAllSetupsJobTypes}
              searchKey="search"
              isDisabled={isLoading}
            />
          )}
          {isWithlanguage && (
            <SharedAutocompleteControl
              stateKey="language"
              title="language"
              disableClearable
              editValue={localState?.language}
              placeholder="select-language"
              onValueChanged={onStateChanged}
              initValues={languages}
              isHalfWidth
              initValuesKey="code"
              initValuesTitle="title"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              sharedClassesWrapper="px-3"
            />
          )}
          {questionTypes && (
            <SharedAutocompleteControl
              stateKey="type"
              title="type"
              // disableClearable
              editValue={localState?.type}
              placeholder="select-type"
              onValueChanged={onStateChanged}
              initValues={questionTypes}
              isHalfWidth
              initValuesKey="type"
              initValuesTitle="label"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              sharedClassesWrapper="px-3"
            />
          )}
          {Object.keys(localState || {}).includes('is_with_model_answer') && (
            <CheckboxesComponent
              idRef="RightToWorkRef"
              wrapperClasses="px-3"
              onSelectedCheckboxChanged={(e, value) =>
                setLocalState({
                  id: 'is_with_model_answer',
                  value,
                })
              }
              label={
                <span className="font-14">
                  {t(
                    `${translationPath}${
                      !isMultiple || localState?.number_of_questions === 'one'
                        ? 'with-model-answer-single'
                        : 'with-model-answer'
                    }`,
                  )}
                </span>
              }
              isDisabled={isLoading}
              singleChecked={localState?.is_with_model_answer || false}
            />
          )}
          {Object.keys(localState || {}).includes('is_with_keywords') && (
            <CheckboxesComponent
              wrapperClasses="px-3"
              idRef="is_with_keywords"
              onSelectedCheckboxChanged={(e, value) =>
                setLocalState({
                  id: 'is_with_keywords',
                  value,
                })
              }
              isDisabled={isLoading}
              label={
                <span className="font-14">
                  {t(
                    `${translationPath}${
                      !isMultiple || localState?.number_of_questions === 'one'
                        ? 'with-keywords-single'
                        : 'with-keywords'
                    }`,
                  )}
                </span>
              }
              singleChecked={localState?.is_with_keywords || false}
            />
          )}
          {isForJobTemplate && (
            <Row>
              <Col sm={12}>
                <span>
                  {t(`${translationPath}select-what-you-want-to-generate`)}
                </span>
              </Col>
              <Col sm={12} md={6} className="px-0">
                <CheckboxesComponent
                  wrapperClasses="px-3"
                  idRef="is_with_description"
                  onSelectedCheckboxChanged={(e, value) =>
                    setLocalState({
                      id: 'is_with_description',
                      value,
                    })
                  }
                  isDisabled={isLoading}
                  label={
                    <span className="font-14">
                      {t(`${translationPath}with-description`)}
                    </span>
                  }
                  singleChecked={localState?.is_with_description || false}
                />
              </Col>
              <Col sm={12} md={6} className="px-0">
                <CheckboxesComponent
                  wrapperClasses="px-3"
                  idRef="is_with_skills"
                  onSelectedCheckboxChanged={(e, value) =>
                    setLocalState({
                      id: 'is_with_skills',
                      value,
                    })
                  }
                  isDisabled={isLoading}
                  label={
                    <span className="font-14">
                      {t(`${translationPath}with-skills`)}
                    </span>
                  }
                  singleChecked={localState?.is_with_skills || false}
                />
              </Col>
              <Col sm={12} md={6} className="px-0">
                <CheckboxesComponent
                  wrapperClasses="px-3"
                  idRef="is_with_requirements"
                  onSelectedCheckboxChanged={(e, value) =>
                    setLocalState({
                      id: 'is_with_requirements',
                      value,
                    })
                  }
                  isDisabled={isLoading}
                  label={
                    <span className="font-14">
                      {t(`${translationPath}with-requirements`)}
                    </span>
                  }
                  singleChecked={localState?.is_with_requirements || false}
                />
              </Col>
            </Row>
          )}
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      isSaving={isLoading}
      onSubmit={onSubmitHandler}
      onCloseClicked={onClose}
      onCancelClicked={onClose}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      saveIsDisabled={isLoading}
    />
  );
};

ChatGPTJobDetailsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isJobTitleRequired: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  state: PropTypes.instanceOf(Object),
  languages: PropTypes.instanceOf(Array),
  questionTypes: PropTypes.instanceOf(Array),
};
