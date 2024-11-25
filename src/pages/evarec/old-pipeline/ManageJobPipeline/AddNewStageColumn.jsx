/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import urls from 'api/urls';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { showError } from '../../../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';

const FormWrapper = styled.div`
  align-items: center;
  flex-direction: column;
  justify-content: center;
  & > *:not(:last-child) {
    margin-bottom: 1rem;
  }
  & label {
    color: rgba(255, 255, 255, 0.5);
  }
`;

/**
 * This adds a new stage to the pipeline
 *
 * NOTE: CURRENTLY CONNECTED TO EVA-SSESS (prep_assessment)
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const AddNewStageColumn = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const [showInputs, setShowInput] = useState(false);
  const [stageTitle, setStageTitle] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const addNewStage = async () => {
    setIsWorking(true);
    await axios
      .post(
        urls.evarec.ats.ADD_STAGE,
        {
          job_uuid: props.match.params.id,
          title: stageTitle,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        addToast(t(`${translationPath}stage-successfully-added`), {
          appearance: 'success',
          autoDismiss: true,
        });
        const { results } = res.data;
        if (results) props.addNewStageToPipeline(results);
        setIsWorking(false);
        setStageTitle('');
        setShowInput(false);
      })
      .catch((error) => {
        setIsWorking(false);
        showError(t(`${translationPath}error-in-adding-stage`), error);
      });
  };

  return (
    <div
      className="col-xs-6 col-sm-4 col-md-3 rounded overflow-auto pipeline-item miw-220px mx-1 d-flex flex-column align-items-center justify-content-center"
      style={{ height: 'calc(70vh + 51px)' }}
    >
      {!showInputs && (
        <>
          <ButtonBase
            className="btns-icon theme-solid m-0 mb-1"
            onClick={() => {
              if (!showInputs) setShowInput(true);
            }}
          >
            <i className="fas fa-plus" />
          </ButtonBase>
          <div className="text-gray mt-2">
            {t(`${translationPath}add-new-stage`)}
          </div>
        </>
      )}
      {showInputs && (
        <FormWrapper className="w-100 p-2">
          <Input
            className="form-control-alternative w-100"
            id="stageTitle"
            placeholder={t(`${translationPath}stage-title`)}
            type="text"
            name="stageTitle"
            value={stageTitle}
            onChange={(e) => {
              setStageTitle(e.currentTarget.value);
            }}
          />
          <div className="d-flex justify-content-center mt-4">
            <ButtonBase
              className="btns theme-solid bg-secondary mr-2-reversed"
              disabled={isWorking}
              onClick={() => setShowInput(false)}
            >
              {t(`${translationPath}cancel`)}
            </ButtonBase>
            <ButtonBase
              className="btns theme-solid"
              onClick={addNewStage}
              disabled={isWorking}
            >
              {isWorking && (
                <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
              )}
              {`${
                !isWorking
                  ? t(`${translationPath}add-stage`)
                  : t(`${translationPath}adding`)
              }`}
            </ButtonBase>
          </div>
        </FormWrapper>
      )}
    </div>
  );
};
export default AddNewStageColumn;
