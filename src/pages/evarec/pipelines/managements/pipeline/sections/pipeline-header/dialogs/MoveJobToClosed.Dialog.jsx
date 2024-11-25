import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../../../components';
import { ButtonBase } from '@mui/material';
import Confetti from 'react-confetti';
import { showError, showSuccess } from '../../../../../../../../helpers';
import { JobHiringStatusesEnum } from '../../../../../../../../enums';
import { ATSUpdateJobVacancyStatus } from '../../../../../../../../services';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'MoveJobToClosedDialog.';

export const MoveJobToClosedDialog = ({
  job_uuid,
  isOpen,
  isOpenChanged,
  onSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await ATSUpdateJobVacancyStatus({
      job_uuid,
      vacancy_status: JobHiringStatusesEnum.CLOSED.key,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}job-closed-successfully`));
      if (onSave) onSave({ vacancy_status: JobHiringStatusesEnum.CLOSED.key });
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}job-close-failed`), response);
  };

  return (
    <DialogComponent
      isOpen={isOpen}
      maxWidth={'sm'}
      translationPath={translationPath}
      parentTranslationPath={parentTranslationPath}
      titleText={'move-to-closed'}
      dialogContent={
        <div className={'d-flex-column-center'}>
          <Confetti
            style={{
              position: 'fixed',
            }}
            className="z-i"
            numberOfPieces={200}
            recycle={false}
            gravity={0.1}
            tweenDuration={8000}
          />
          <span
            className="far fa-check-circle text-green"
            style={{
              fontSize: '50px',
            }}
          />
          <span className="fw-bold fz-18px">
            {t(`${translationPath}congratulations`)}
          </span>
          <span className="c-gray-primary text-center  fz-13px">
            {t(`${translationPath}move-job-to-closed-message`)}
          </span>
        </div>
      }
      onCloseClicked={isOpenChanged}
      dialogActions={
        <div className="my-1 mb-3 d-flex-center flex-wrap">
          <ButtonBase
            className="btns theme-outline mx-2"
            onClick={isOpenChanged}
            disabled={isLoading}
          >
            <span>{t(`${translationPath}no-stays-active`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-solid  mx-2"
            disabled={isLoading}
            onClick={saveHandler}
          >
            {isLoading && (
              <span className="fas fa-circle-notch fa-spin mr-2-reversed" />
            )}
            <span>{t(`${translationPath}yes-close`)}</span>
          </ButtonBase>
        </div>
      }
    />
  );
};

MoveJobToClosedDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  job_uuid: PropTypes.string,
  isOpenChanged: PropTypes.func,
  onSave: PropTypes.func,
};
MoveJobToClosedDialog.defaultProps = {
  job_uuid: undefined,
  isOpenChanged: undefined,
};
