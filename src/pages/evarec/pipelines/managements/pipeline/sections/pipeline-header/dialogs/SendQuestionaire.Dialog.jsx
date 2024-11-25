import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  getErrorByName,
  GlobalSavingDateFormat,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  GetAllPipelineQuestionnaires,
  SendEvaRecQuestionnaire,
} from '../../../../../../../../services';
import DatePickerComponent from '../../../../../../../../components/Datepicker/DatePicker.Component';
import moment from 'moment/moment';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'SendQuestionnaireDialog.';

export const SendQuestionnaireDialog = ({
  jobUUID,
  pipelineUUID,
  isOpen,
  isOpenChanged,
  selectedCandidates,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);

  const stateInitRef = useRef({
    candidate_uuid: [],
    deadline: '',
    questionnaire_uuid: '',
    QuestionnaireData: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    let response;
    if (jobUUID && selectedCandidates?.length)
      response = await SendEvaRecQuestionnaire({
        ...state,
        job_uuid: jobUUID,
        pipeline_uuid: pipelineUUID,
      });
    else response = await SendEvaRecQuestionnaire(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      window?.ChurnZero?.push([
        'trackEvent',
        'Send questionnaire',
        'Send questionnaire',
        1,
        {},
      ]);
      setIsSubmitted(false);
      showSuccess(t(`${translationPath}questionnaire-sent-successfully`));
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}questionnaire-send-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      questionnaire_uuid: yup.string().required(t('this-field-is-required')),
      candidate_uuid: yup.array().required(t('this-field-is-required')),
      deadline: yup.string().required(t('this-field-is-required')),
    });
  }, [jobUUID, t]);

  useEffect(() => {
    if (selectedCandidates)
      onStateChanged({
        id: 'candidate_uuid',
        value: selectedCandidates,
      });
  }, [selectedCandidates]);

  const GetPipelineQuestionnairesHandler = useCallback(
    async (uuid) => {
      setIsLoading(true);
      const response = await GetAllPipelineQuestionnaires({ pipeline_uuid: uuid });
      if (response && response.status === 200) {
        onStateChanged({ id: 'QuestionnaireData', value: response.data?.results });
        setIsLoading(false);
      } else {
        onStateChanged({ id: 'QuestionnaireData', value: [] });

        showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoading(false);
      }
    },
    [t],
  );

  useEffect(() => {
    if (pipelineUUID && isOpen) GetPipelineQuestionnairesHandler(pipelineUUID);
  }, [pipelineUUID, GetPipelineQuestionnairesHandler, isOpen]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="send-questionnaire"
      contentClasses="px-0"
      dialogContent={
        <div>
          <SharedAutocompleteControl
            isFullWidth
            searchKey="search"
            initValuesKey="uuid"
            isDisabled={isLoading}
            initValuesTitle="title"
            initValues={state.QuestionnaireData}
            stateKey="questionnaire_uuid"
            errorPath="questionnaire_uuid"
            onValueChanged={onStateChanged}
            title="questionnaire"
            editValue={state.questionnaire_uuid}
            placeholder="select-questionnaire"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            errors={errors}
            isSubmitted={isSubmitted}
          />
          <DatePickerComponent
            idRef="fromDateRef"
            minDate={moment().toDate()}
            isSubmitted={isSubmitted}
            inputPlaceholder="YYYY-MM-DD"
            value={state.deadline || ''}
            isDisabled={isLoading}
            helperText={(errors.deadline && errors.deadline.message) || undefined}
            error={(errors.deadline && errors.deadline.error) || false}
            label={t(`${translationPath}deadline`)}
            onChange={(date) => {
              if (date?.value !== 'Invalid date')
                onStateChanged({ id: 'deadline', value: date.value });
              else onStateChanged({ id: 'deadline', value: null });
            }}
            displayFormat={GlobalSavingDateFormat}
            datePickerWrapperClasses="px-0"
          />
        </div>
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(jobUUID && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

SendQuestionnaireDialog.propTypes = {
  jobUUID: PropTypes.string,
  pipelineUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ),
};
SendQuestionnaireDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
  pipelineUUID: undefined,
  selectedCandidates: undefined,
};
