import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { JobRequisitionManagementDialog } from './dialogs/JobRequisitionManagement.Dialog';
const translationPath = 'JobRequisition.';
const parentTranslationPath = 'SetupsPage';
const JobRequisitionSetting = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}job-requisition`));
  const [isOpenSettingDialog, setIsOpenSettingDialog] = useState(false);

  return (
    <div className="settings-candidates-page-wrapper px-4 pt-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}job-requisition-settings`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}job-requisition-description`)}
        </span>
      </div>
      <div className="separator-h mb-3" />
      <div className="page-body-wrapper px-2">
        <div className="setups-card-wrapper">
          <div className="setups-content-wrapper">
            <div className="setups-card-body-wrapper ">
              <div className="body-item-wrapper d-flex-v-center-h-between">
                <span className="header-text">
                  {t(`${translationPath}job-requisition-settings`)}
                </span>
                <ButtonBase
                  className="btns theme-solid  mx-2 my-3"
                  onClick={() => {
                    setIsOpenSettingDialog(true);
                  }}
                >
                  <span className="fas fa-cog" />
                  <span className="px-1">{t(`${translationPath}setting`)}</span>
                </ButtonBase>
              </div>
              <div className={'d-flex'}>
                <span className="description-text fz-14px px-2">
                  {t(`${translationPath}job-requisition-inner-description`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenSettingDialog && (
        <JobRequisitionManagementDialog
          isOpen={isOpenSettingDialog}
          isOpenChanged={() => setIsOpenSettingDialog(false)}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </div>
  );
};

export default JobRequisitionSetting;
