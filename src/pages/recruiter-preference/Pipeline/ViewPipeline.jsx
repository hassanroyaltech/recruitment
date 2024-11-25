import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
import { useToasts } from 'react-toast-notifications';
import { Button } from 'reactstrap';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import { StyledModal } from '../PreferenceStyles';
import Loader from '../components/Loader.jsx';
import StageTable from './StageTable.jsx';
import { showError } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const ViewPipeline = ({ currentUUID, ...props }) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [current, setCurrent] = useState();
  const [stages, setStages] = useState(null);

  const getStages = async (pipeline_uuid) =>
    await axios
      .request({
        method: 'view',
        url: RecuiterPreference.pipelines_GET,
        params: {
          uuid: pipeline_uuid,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setCurrent(res.data.results);
        setStages(res.data.results.stages);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });

  useEffect(() => {
    getStages(currentUUID);
  }, [t, user.company_id, user.token]);

  const setNewStage = async (stageUUID, newTitle) => {
    await axios
      .put(
        RecuiterPreference.stages_WRITE,
        { uuid: stageUUID, title: newTitle },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {})
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-stage-title`), error);
      });
  };
  // Stage Modal Start

  // Stage Modal End

  const [isFetching, setIsFetching] = useState(false);
  const handleDelete = async (idToRemove) => {
    setIsFetching(true);
    await axios
      .delete(RecuiterPreference.stages_WRITE, {
        params: {
          uuid: idToRemove,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        addToast(t(`${translationPath}stage-removed`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setStages(stages.filter((s) => s.uuid !== idToRemove));
        setIsFetching(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-deleting-stage`), error);

        setIsFetching(false);
      });
  };

  return (
    <>
      <StyledModal
        className="modal-dialog-centered"
        size="md"
        isOpen={props.isOpen}
        toggle={() => props.closeModal()}
      >
        <div className="modal-header border-0 mb-0">
          <h1>{current?.title || t(`${translationPath}view-pipeline`)}</h1>
          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => props.closeModal()}
          >
            <span aria-hidden>×</span>
          </button>
        </div>
        <div className="modal-body">
          {(!stages || isFetching) && <Loader />}
          {stages && !isFetching && (
            <StageTable
              currentPipeline={current}
              key={currentUUID}
              data={stages.sort((a, b) => a.order_view - b.order_view)}
              handleDelete={handleDelete}
              setNewStage={setNewStage}
              getStages={getStages}
            />
          )}
        </div>
        <div className="modal-footer justify-content-center border-0">
          <Button
            className="btn btn-primary btn-icon float-left"
            color="primary"
            data-dismiss="modal"
            type="button"
            onClick={() => props.closeModal()}
          >
            {t(`${translationPath}done`)}
          </Button>
        </div>
      </StyledModal>
    </>
  );
};

export default ViewPipeline;
