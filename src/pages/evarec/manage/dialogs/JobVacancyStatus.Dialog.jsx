import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
} from '../../../setups/shared';
import * as Yup from 'yup';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import { DialogComponent } from '../../../../components';
import { JobHiringStatusesEnum } from '../../../../enums';
import { ATSUpdateJobVacancyStatus } from '../../../../services';

export const JobVacancyStatusDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  jobData,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const stateInitRef = useRef({
    job_uuid: jobData.uuid,
    vacancy_status: jobData.vacancy_status,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [vacancyStatuses] = useState(
    Object.values(JobHiringStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const schema = useRef(
    Yup.object().shape({
      vacancy_status: Yup.string()
        .nullable()
        .required(t('Shared:this-field-is-required')),
    }),
  );

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, state);
    setErrors(result);
  }, [state]);

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    const response = await ATSUpdateJobVacancyStatus(state);
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}vacancy-status-updated-successfully`));
      if (onSave) onSave(state.vacancy_status, state.job_uuid);
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}vacancy-status-update-failed`), response);
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <DialogComponent
      titleText="update-vacancy-status"
      maxWidth="xs"
      wrapperClasses={'pb-0'}
      dialogContent={
        <div className="pt-2">
          <SharedAutocompleteControl
            searchKey="search"
            isDisabled={isLoading}
            initValues={vacancyStatuses}
            stateKey="vacancy_status"
            errorPath="vacancy_status"
            onValueChanged={onStateChanged}
            title="job-hiring-status"
            editValue={state.vacancy_status}
            placeholder="job-hiring-status"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            sharedClassesWrapper={'mb-0'}
            errors={errors}
            isSubmitted={isSubmitted}
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      onSaveClicked={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

JobVacancyStatusDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
  jobData: PropTypes.instanceOf(Object),
};
JobVacancyStatusDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  translationPath: 'PipelineAddDialog.',
};
