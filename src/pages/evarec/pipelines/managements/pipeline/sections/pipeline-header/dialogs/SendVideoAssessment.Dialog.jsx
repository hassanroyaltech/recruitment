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
  SendEvaRecVideoAssessment,
  GetEvaRecVideoAssessment,
} from '../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../enums';
import DatePickerComponent from '../../../../../../../../components/Datepicker/DatePicker.Component';
import moment from 'moment';
import useVitally from '../../../../../../../../hooks/useVitally.Hook';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'SendVideoAssessmentDialog.';

export const SendVideoAssessmentDialog = ({
  jobUUID,
  isOpen,
  isOpenChanged,
  selectedCandidates,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const { VitallyTrack } = useVitally();
  const stateInitRef = useRef({
    user_invited: [],
    deadline: '',
    prep_assessment_uuid: [],
    videoAssessmentData: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
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
      response = await SendEvaRecVideoAssessment({
        ...state,
        job_uuid: jobUUID,
      });
    else response = await SendEvaRecVideoAssessment(state);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      setIsSubmitted(false);
      VitallyTrack('EVA-SSESS - Invite candidate to the assessment');
      showSuccess(t(`${translationPath}video-assessment-sent-successfully`));
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}video-assessment-send-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      prep_assessment_uuid: yup
        .array()
        .nullable()
        .min(
          1,
          `${t(`${translationPath}please-select-at-least`)} ${1} ${t(
            `${translationPath}video-assessment`,
          )}`,
        ),
      deadline: yup.string().required(t('this-field-is-required')),
    });
  }, [jobUUID, t]);

  useEffect(() => {
    if (selectedCandidates)
      onStateChanged({
        id: 'user_invited',
        value: selectedCandidates,
      });
  }, [selectedCandidates]);

  const GetPipelineVideoAssessmentHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetEvaRecVideoAssessment();
    if (response && response.status === 200) {
      onStateChanged({ id: 'videoAssessmentData', value: response.data?.results });
      setIsLoading(false);
    } else {
      onStateChanged({ id: 'videoAssessmentData', value: [] });

      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen) GetPipelineVideoAssessmentHandler();
  }, [GetPipelineVideoAssessmentHandler, isOpen]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="send-video-assessment"
      contentClasses="px-0"
      dialogContent={
        <div>
          <SharedAutocompleteControl
            isFullWidth
            searchKey="search"
            initValuesKey="uuid"
            isDisabled={isLoading}
            initValuesTitle="title"
            initValues={state.videoAssessmentData}
            stateKey="prep_assessment_uuid"
            errorPath="prep_assessment_uuid"
            onValueChanged={onStateChanged}
            title="video-assessment"
            editValue={state.prep_assessment_uuid}
            placeholder="select-video-assessment"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            errors={errors}
            isSubmitted={isSubmitted}
            type={DynamicFormTypesEnum.array.key}
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
              if (date !== 'Invalid date')
                onStateChanged({ id: 'deadline', value: date?.value });
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

SendVideoAssessmentDialog.propTypes = {
  jobUUID: PropTypes.string,
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
SendVideoAssessmentDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
  selectedCandidates: undefined,
};
