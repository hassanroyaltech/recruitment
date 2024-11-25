/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import urls from 'api/urls';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { HttpServices } from 'helpers';

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
const translationPath = 'AddNewStageColumnComponent.';
const AddNewStageColumn = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const { addToast } = useToasts(); // Toasts

  const [showInputs, setShowInput] = useState(false);
  const [stageTitle, setStageTitle] = useState('');
  const [isWorking, setIsWorking] = useState(false);

  const addNewStage = async () => {
    setIsWorking(true);
    await HttpServices.post(urls.evassess.PIPELINE_ADD_STAGE, {
      prep_assessment_uuid: props.match.params.id,
      title: stageTitle,
    })
      .then((res) => {
        addToast(t(`${translationPath}stage-added-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.addNewStageToPipeline(res.data.results);
        setIsWorking(false);
        setStageTitle('');
        setShowInput(false);
      })
      .catch((err) => {
        setIsWorking(false);
        addToast(
          err.response.data
            ? err.response.data.message
            : t(`${translationPath}stage-add-failed`),
          {
            appearance: 'error',
            autoDismiss: true,
          },
        );
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
            className="btns-icon theme-solid"
            onClick={() => {
              if (!showInputs) setShowInput(true);
            }}
          >
            <i className="fas fa-plus" />
          </ButtonBase>
          <div className="text-gray mt-3">
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
