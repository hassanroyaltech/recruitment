import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../setups/shared';
import {
  DialogComponent,
  SliderComponent,
} from '../../../../../../../../components';
import {
  GetEvaRecPipelineWeights,
  AddEvaRecPipelineWeights,
} from '../../../../../../../../services';
import { weightItems } from '../../../../../../../../utils/constants/weightItems';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'WeightsManagementDialog.';

export const ManageWeightsDialog = ({ jobUUID, isOpen, isOpenChanged, onSave }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const stateInitRef = useRef({
    weights: {},
    defaultWeight: weightItems,
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

  const GetEvaRecPipelineWeightsHandler = useCallback(
    async (uuid) => {
      setIsLoading(true);
      const response = await GetEvaRecPipelineWeights({ uuid });
      if (response && response.status === 200) {
        onStateChanged({
          id: 'weights',
          value: response?.data?.results.job?.weights || {},
        });
        setIsLoading(false);
      } else {
        onStateChanged({ id: 'weights', value: [] });
        showError(t('Shared:failed-to-get-saved-data'), response); // test
        setIsLoading(false);
      }
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    let response;
    if (jobUUID)
      response = await AddEvaRecPipelineWeights({
        weights: state.weights,
        uuid: jobUUID,
      });
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      showSuccess(t(`${translationPath}weights-updated-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}weights-update-failed`), response);
  };

  // this to get saved data on edit init
  useEffect(() => {
    if (jobUUID && isOpen) GetEvaRecPipelineWeightsHandler(jobUUID);
  }, [jobUUID, GetEvaRecPipelineWeightsHandler, isOpen]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="manage-weights"
      contentClasses="px-0"
      dialogContent={
        <div className="shared-control-wrapper">
          <div className="mb-3">
            {t(`${translationPath}manage-weights-description`)}
          </div>
          <div>
            <div className="mt-2 d-flex flex-wrap">
              {state.defaultWeight.map((item, index) => (
                <div
                  className="w-50 w-p-100 px-5 mt-4 d-inline-flex-v-center"
                  key={`weightsKeys${index + 1}`}
                >
                  <SliderComponent
                    value={
                      state.weights?.[item.field]
                      || state.weights?.[item.field] === 0
                        ? state.weights?.[item.field]
                        : item.weight
                    }
                    step={1}
                    max={5}
                    labelValue={item.label}
                    valueLabelDisplay="auto"
                    marks={Array.from({ length: 6 }, (element, subIndex) => ({
                      label: subIndex,
                      value: subIndex,
                    }))}
                    onChange={(e, value) =>
                      onStateChanged({
                        id: 'weights',
                        value: { ...state.weights, [item.field]: value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
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

ManageWeightsDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  onSave: PropTypes.func,
};
ManageWeightsDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  jobUUID: undefined,
};
