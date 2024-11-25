/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../components';
import { SetupsReducer, SetupsReset } from '../../../shared';
import { showError, showSuccess } from '../../../../../helpers';

import {
  GetJobRequisitionSettings,
  UpdateJobRequisitionSettings,
} from '../../../../../services';

import Require from '../../../../evabrand/Require';
import Loader from '../../../../../components/Elevatus/Loader';

export const JobRequisitionManagementDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState({ getData: true, saveData: false });
  const stateInitRef = useRef({});
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getJobRequisitionSettings = useCallback(async () => {
    setIsLoading((items) => ({
      ...items,
      getData: true,
    }));
    const response = await GetJobRequisitionSettings();
    if (response && response.status === 200) {
      const results = response?.data?.results || {};
      delete results['serial_no'];
      setState({
        id: 'edit',
        value: results,
      });
      setIsLoading((items) => ({
        ...items,
        getData: false,
      }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  useEffect(() => {
    getJobRequisitionSettings();
  }, [getJobRequisitionSettings]);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading((items) => ({
      ...items,
      saveData: true,
    }));
    const response = await UpdateJobRequisitionSettings(state);
    setIsLoading((items) => ({
      ...items,
      saveData: false,
    }));
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(t(`${translationPath}setting-updated-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}setting-update-failed`), response);
  };

  return (
    <>
      <DialogComponent
        titleText={'job-requisition-fields-config'}
        dialogContent={
          <div>
            {isLoading?.getData ? (
              <Loader width="200px" height="300px" speed={1} color="primary" />
            ) : (
              Object.keys(state).length > 0
              && Object.keys(state).map((item) => (
                <Require
                  response={state}
                  setNewResponse={(newValue) => {
                    onStateChanged({ id: 'edit', value: newValue });
                  }}
                  options={item}
                  label={state[item]}
                  key={item}
                />
              ))
            )}
          </div>
        }
        saveIsDisabled={isLoading.saveData || isLoading.getData}
        isOpen={isOpen}
        onSubmit={saveHandler}
        onCancelClicked={isOpenChanged}
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </>
  );
};

JobRequisitionManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

JobRequisitionManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: '',
};
