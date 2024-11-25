/* eslint-disable brace-style */
/* eslint-disable no-prototype-builtins */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';
// API Service
import { evarecAPI } from '../../api/evarec';
import { evassessAPI } from '../../api/evassess';

// Filters
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { showError } from '../../helpers';

// ThreeDots component (a UI thing)
import { ThreeDots } from '../recruiter-preference/components/Loaders';

// Weight Items
import { weightItems } from '../../utils/constants/weightItems';
import { SliderComponent } from '../../components';

/**
 * A method to manage weights
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const translationPath = 'ManageWeightsComponent.';

const ManageWeights = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  // A state for default weights
  const [defaultWeights] = useState(weightItems);
  // A state for weights
  const [weights, setWeights] = useState(null);
  // A state for loading
  const [loading] = useState(false);
  // A state for show the second col of sliders or not
  const getWeights = useCallback(async () => {
    /**
     * Obtain the weights of the pipeline (assessment)
     * @returns {Promise<void>}
     */
    if (props?.evassess)
      await evassessAPI
        .getWeights({ prep_assessment_uuid: props.pipeline })
        .then((response) => {
          // Get the weights object
          const weightsObject = response.data.results;
          // Initialize an empty object to hold new weights so we could set the state with
          const newWeights = [];
          // If assessment has Only one Question
          if (weightsObject.hasOwnProperty('uuid'))
            newWeights.push({
              weight: weightsObject.score,
              label: weightsObject.title,
              field: weightsObject.uuid,
            });
          // For each item in weightsObject we obtain weight(score), label(questio text)
          // and the field(uuid), then we append this object for newWeights array.
          else
            weightsObject.forEach((item) => {
              newWeights.push({
                weight: item.score,
                label: item.title,
                field: item.uuid,
              });
            });

          // Change Weights state
          setWeights(newWeights);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    else
      await evarecAPI
        .getWeights({ uuid: props.pipeline })
        .then((response) => {
          // Get the weights object
          const weightsObject = response.data.results.job.weights;

          // Initialize an empty object to hold new weights so we could set the state with
          const newWeights = [];

          // For each item in the defaultWeights we obtain the field name
          // and with it, we append to the newWeights object the field, the label
          // and the resolved weight from the weightsObject obtained from the API.
          defaultWeights.forEach((key) => {
            const weightKey = key.field;
            newWeights.push({
              weight: weightsObject[`${weightKey}`],
              field: key.field,
              label: key.label,
            });
          });

          // We set the new weights
          setWeights(newWeights);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
  }, [t, defaultWeights, props?.evassess, props.pipeline]);

  useEffect(() => {
    getWeights();
  }, [getWeights]);

  /**
   * Handler for when the weight changes
   * @param field
   * @returns {function(*): void}
   */
  const onChangeWeight = (field) => (event, newValue) => {
    // Initialize an empty object to hold new weights so we could set the state with
    const newWeights = [];
    weights.forEach((key) => {
      if (key.field === field)
        newWeights.push({
          weight: newValue,
          field: key.field,
          label: key.label,
        });
      else
        newWeights.push({
          weight: key.weight,
          field: key.field,
          label: key.label,
        });
    });

    // We set the new weights
    setWeights(newWeights);
  };

  /**
   * Saves the weights by calling the API
   */
  const saveHandler = () => {
    // Create an empty dictionary
    const weightsToSave = {};

    window?.ChurnZero?.push([
      'trackEvent',
      'Manage weights',
      'EVA-REC Manage weights',
      1,
      {},
    ]);

    // Remap the keys and weights
    weights.forEach((key) => {
      const k = key.field;
      const v = key.weight;
      weightsToSave[k] = v;
    });
    if (props?.evassess)
      // Invoke Update Weights API
      evassessAPI
        .updateWeights({
          prep_assessment_uuid: props.pipeline,
          score: weightsToSave,
        })
        .then((response) => {
          if (props.onSave) props.onSave(); // added to close dialog & reload data without refresh
          // Return the weights values
          return response.data;
        })
        .catch(() => {});
    // Call the API
    else
      evarecAPI
        .updateWeights({
          uuid: props.pipeline,
          weights: weightsToSave,
        })
        .then((response) => {
          if (props.onSave) props.onSave();

          // Return the weights values
          return response.data;
        })
        .catch(() => {});

    // Close the modal
    // props.closeModal();;
  };

  /**
   * Return JSX
   */
  return (
    <Modal
      className="modal-dialog-centered"
      size="md"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
    >
      <div className="modal-header border-0">
        <h3 className="d-inline-flex h3 mb-0 mx-3">
          {t(`${translationPath}manage-weights`)}
        </h3>
        <ButtonBase
          className="btns-icon theme-transparent"
          data-dismiss="modal"
          onClick={() => props.closeModal()}
        >
          <i className="fas fa-times fa-lg" />
        </ButtonBase>
      </div>
      <ModalBody
        className="modal-body pt-0"
        style={{ maxHeight: '70vh', padding: '0px 62px', overflow: 'auto' }}
      >
        {!weights ? (
          <ThreeDots />
        ) : (
          <div>
            <div className="text-gray" style={{ fontSize: '18px' }}>
              {t(`${translationPath}manage-weights-description`)}
            </div>
            <div className="mt-2 d-flex flex-wrap">
              {weights.map((item, index) => (
                <div
                  className="w-50 w-p-100 px-5 mt-4 d-inline-flex-v-center"
                  key={`weightsKeys${index + 1}`}
                >
                  <SliderComponent
                    value={item.weight}
                    step={1}
                    max={5}
                    labelValue={item.label}
                    valueLabelDisplay="auto"
                    marks={Array.from({ length: 6 }, (element, subIndex) => ({
                      label: subIndex,
                      value: subIndex,
                    }))}
                    onChange={onChangeWeight(item.field)}
                  />
                </div>
              ))}
            </div>
            <div className="my-5 d-flex justify-content-center">
              <ButtonBase
                onClick={() => {
                  saveHandler();
                  props.closeModal();
                }}
                disabled={loading}
                className="btns theme-solid"
              >
                {loading && (
                  <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                )}
                {`${
                  loading
                    ? t(`${translationPath}saving`)
                    : t(`${translationPath}save`)
                }`}
              </ButtonBase>
            </div>
          </div>
        )}
      </ModalBody>
    </Modal>
  );
};

export default ManageWeights;
