/* eslint-disable react/display-name */
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  EvaluationFilesTypesEnum,
  EvaluationQuestionsTypesEnum,
  UploaderPageEnum,
} from '../../../../../../../../../enums';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../setups/shared';
import {
  CheckboxesComponent,
  RadiosComponent,
  UploaderComponent,
} from '../../../../../../../../../components';

export const QuestionSection = ({
  question,
  parentId,
  parentIndex,
  subParentId,
  subParentIndex,
  id,
  isOtherStateKey,
  isOtherErrorPath,
  errorPath,
  isSubmitted,
  isLoading,
  isDisabled,
  onStateChanged,
  errors,
  company_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation('Shared');
  /**
   * @param item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to select the question answer of type checkbox
   */
  const onSelectedCheckboxChanged = useCallback(
    (item) => {
      const localAnswer = [...(question[id] || [])];
      const itemIndex = localAnswer.indexOf(item.uuid);
      if (itemIndex === -1) localAnswer.push(item.uuid);
      else localAnswer.splice(itemIndex, 1);
      onStateChanged({
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        id,
        value: (localAnswer.length > 0 && localAnswer) || undefined,
      });
    },
    [
      question,
      id,
      onStateChanged,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
    ],
  );

  /**
   * @param event
   * @param value
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to select the question answer of type radio
   */
  const onSelectedRadioChanged = useCallback(
    (event, value) => {
      onStateChanged({
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        id,
        value,
      });
    },
    [onStateChanged, parentId, parentIndex, subParentId, subParentIndex, id],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the enum of the file question
   */
  const getEvaluationFilesTypesEnum = useCallback(
    () =>
      Object.values(EvaluationFilesTypesEnum).find(
        (item) =>
          (question.file_answer && item.key === question.file_answer.file_type)
          || (question.file_validation
            && item.key === question.file_validation.file_type),
      ) || {},
    [question.file_answer, question.file_validation],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the enum of the file question
   */
  const getIsVisibleIsOther = useCallback(() => {
    const localOptions = question.options || question.answers || [];
    if (
      question.type === EvaluationQuestionsTypesEnum.Checkbox.key
      || question.type === EvaluationQuestionsTypesEnum.MultipleChoice.key
    ) {
      const selectedOption = localOptions.findIndex(
        (option) =>
          option.is_other
          && question[id]
          && ((question.type === EvaluationQuestionsTypesEnum.MultipleChoice.key
            && option.uuid === question[id])
            || (question.type === EvaluationQuestionsTypesEnum.Checkbox.key
              && question[id].includes(option.uuid))),
      );
      return selectedOption !== -1;
    }
    return false;
  }, [id, question]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the question by type
   */
  const getQuestion = useMemo(
    () => () => {
      if (question.type === EvaluationQuestionsTypesEnum.Text.key)
        return (
          <SharedInputControl
            isFullWidth
            placeholder={
              (question.title
                && (question.title[i18next.language]
                  || question.title.en
                  || question.title))
              || undefined
            }
            editValue={question[id] || ''}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isSubmitted={isSubmitted}
            isDisabled={isLoading || isDisabled}
            stateKey={id}
            parentId={parentId}
            parentIndex={parentIndex}
            subParentId={subParentId}
            subParentIndex={subParentIndex}
            errors={errors}
            errorPath={errorPath}
            rows={4}
            multiline
            onValueChanged={onStateChanged}
          />
        );
      if (question.type === EvaluationQuestionsTypesEnum.Dropdown.key)
        return (
          <SharedAutocompleteControl
            isFullWidth
            placeholder={
              (question.title
                && (question.title[i18next.language]
                  || question.title.en
                  || question.title))
              || undefined
            }
            errors={errors}
            stateKey={id}
            parentId={parentId}
            parentIndex={parentIndex}
            subParentId={subParentId}
            subParentIndex={subParentIndex}
            editValue={question[id] || ''}
            isDisabled={isLoading || isDisabled}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            initValues={question.options || question.answers}
            initValuesKey="uuid"
            initValuesTitle="title"
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            errorPath={errorPath}
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language]
                  || option.title.en
                  || option.title))
              || 'N/A'
            }
          />
        );
      if (question.type === EvaluationQuestionsTypesEnum.Checkbox.key)
        return (
          <CheckboxesComponent
            idRef={`checkboxesRef${parentIndex || 0}-${subParentIndex || 0}`}
            checked={(option) => question[id] && question[id].includes(option.uuid)}
            getLabel={(option) =>
              (option.title
                && (option.title[i18next.language]
                  || option.title.en
                  || option.title))
              || undefined
            }
            data={question.options || question.answers || []}
            isDisabled={isLoading || isDisabled}
            isSubmitted={isSubmitted}
            error={(errors[errorPath] && errors[errorPath].error) || undefined}
            helperText={
              (errors[errorPath] && errors[errorPath].message) || undefined
            }
            onSelectedCheckboxChanged={onSelectedCheckboxChanged}
          />
        );
      if (question.type === EvaluationQuestionsTypesEnum.MultipleChoice.key)
        return (
          <RadiosComponent
            idRef={`radiosRef${parentIndex || 0}-${subParentIndex || 0}`}
            valueInput="uuid"
            themeClass="theme-column"
            value={question[id] || ''}
            // checked={(option) => question.answer && question.answer.includes(option.uuid)}
            getLabel={(option) =>
              (option.title
                && (option.title[i18next.language]
                  || option.title.en
                  || option.title))
              || undefined
            }
            data={question.options || question.answers || []}
            isDisabled={isLoading || isDisabled}
            isSubmitted={isSubmitted}
            error={(errors[errorPath] && errors[errorPath].error) || undefined}
            helperText={
              (errors[errorPath] && errors[errorPath].message) || undefined
            }
            onSelectedRadioChanged={onSelectedRadioChanged}
          />
        );
      if (question.type === EvaluationQuestionsTypesEnum.Files.key)
        return (
          <UploaderComponent
            for_account
            isDynamicCheck
            uploaderPage={UploaderPageEnum.DynamicForm}
            type={getEvaluationFilesTypesEnum().mediaType}
            idRef={`uploaderRef${parentIndex || 0}-${subParentIndex || 0}`}
            dropHereText={`${t('drop-here-max')} ${1} ${t('file-bracket')}`}
            helperText={
              (errors[errorPath] && errors[errorPath].message) || undefined
            }
            isDisabled={isDisabled}
            isSubmitted={isSubmitted}
            uploadedFiles={
              (question.localFile && [question.localFile])
              || (question[id]
                && question.answer_url && [
                {
                  ...(question.localFile || {}),
                  type:
                      question.localFile?.url?.split('.')?.pop().split('?')[0]
                      || question.localFile?.path?.split('.')?.pop().split('?')[0]
                      || question.answer_url?.split('.')?.pop().split('?')[0]
                      || getEvaluationFilesTypesEnum().type,
                  uuid: question[id],
                  url: question.answer_url,
                },
              ])
              || []
            }
            // labelClasses="theme-primary"
            accept={getEvaluationFilesTypesEnum().accept}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            company_uuid={company_uuid}
            uploadedFileChanged={(newFiles) => {
              onStateChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                id,
                value: (newFiles && newFiles.length > 0 && newFiles[0].uuid) || null,
              });
              onStateChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                id: 'answer_url',
                value: (newFiles && newFiles.length > 0 && newFiles[0].url) || null,
              });
              onStateChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                id: 'localFile',
                value: (newFiles && newFiles.length > 0 && newFiles[0]) || null,
              });
            }}
          />
        );
      return <span>Unknown Question Type</span>;
    },
    [
      question,
      id,
      parentTranslationPath,
      translationPath,
      isSubmitted,
      isLoading,
      isDisabled,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      errors,
      errorPath,
      onStateChanged,
      onSelectedCheckboxChanged,
      onSelectedRadioChanged,
      getEvaluationFilesTypesEnum,
      t,
      company_uuid,
    ],
  );
  return (
    <div className="question-section-wrapper section-wrapper mb-2">
      {question.title && (
        <div className="d-flex header-text">
          <span>
            <span>
              {(subParentIndex || subParentIndex === 0
                ? subParentIndex
                : parentIndex) + 1}
            </span>
            <span className="px-1">-</span>
          </span>
          <span>
            <span>
              {question.title[i18next.language]
                || question.title.en
                || question.title}
            </span>
            <span>:</span>
          </span>
        </div>
      )}
      {question.description && (
        <div className="d-flex description-text mb-1">
          <span>
            {question.description[i18next.language]
              || question.description.en
              || question.description}
          </span>
        </div>
      )}
      <div className="d-flex flex-wrap">{getQuestion()}</div>
      {getIsVisibleIsOther() && (
        <SharedInputControl
          parentTranslationPath={parentTranslationPath}
          stateKey={isOtherStateKey}
          parentId={parentId}
          parentIndex={parentIndex}
          subParentId={subParentId}
          subParentIndex={subParentIndex}
          errors={errors}
          errorPath={isOtherErrorPath}
          multiline
          rows={4}
          isFullWidth
          labelValue="others"
          placeholder="others"
          isSubmitted={isSubmitted}
          isDisabled={isDisabled || isLoading}
          translationPath={translationPath}
          editValue={question[isOtherStateKey]}
          onValueChanged={onStateChanged}
        />
      )}
    </div>
  );
};

QuestionSection.propTypes = {
  question: PropTypes.instanceOf(Object).isRequired,
  parentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentId: PropTypes.string,
  subParentIndex: PropTypes.number,
  id: PropTypes.string,
  isOtherStateKey: PropTypes.string,
  isOtherErrorPath: PropTypes.string,
  errorPath: PropTypes.string,
  onStateChanged: PropTypes.func.isRequired,
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  company_uuid: PropTypes.string,
};
QuestionSection.defaultProps = {
  parentId: undefined,
  parentIndex: undefined,
  subParentId: undefined,
  subParentIndex: undefined,
  id: undefined,
  isOtherStateKey: 'other_answer',
  errorPath: undefined,
  isOtherErrorPath: undefined,
  company_uuid: undefined,
  translationPath: '',
  isDisabled: false,
};
