import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { ButtonBase } from '@mui/material';
import './ScorecardDetails.Drawer.Style.scss';
import { useTranslation } from 'react-i18next';

import { TabsComponent } from '../../../../../../../components';

import { ScorecardDetailsDrawerTabs } from './ScorecardDetailsDrawer.Tabs';
import i18next from 'i18next';
import {
  getIsAllowedPermissionV2,
  GlobalHistory,
} from '../../../../../../../helpers';
import { NavigationSourcesEnum } from '../../../../../../../enums';
import { ScorecardPermissions } from '../../../../../../../permissions';
import { useSelector } from 'react-redux';

export const ScorecardDetailsDrawer = ({
  drawerOpen,
  closeHandler,
  parentTranslationPath,
  translationPath,
  scorecardData,
  scorecardDrawersHandler,
  activeJobUUID,
}) => {
  const history = GlobalHistory;
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [sectionSettingTabsData] = useState(() => ScorecardDetailsDrawerTabs);
  const [activeTab, setActiveTab] = useState(0);
  const scoreCardTitle = useMemo(
    () => scorecardData?.title?.[i18next.language] || scorecardData?.title?.en || '',
    [scorecardData?.title],
  );
  const handleRedirectToScorecard = useCallback(() => {
    history.push(
      `/scorecard-builder?job_uuid=${activeJobUUID}&source=${NavigationSourcesEnum.PipelineToScorecard.key}&uuid=${scorecardData?.score_card_uuid}`,
    );
  }, [history, scorecardData?.score_card_uuid, activeJobUUID]);
  return (
    <Drawer
      elevation={2}
      anchor="right"
      open={drawerOpen || false}
      onClose={closeHandler}
      hideBackdrop
      className="highest-z-index"
    >
      <div className="my-2 pipeline-score-side-drawer-width ">
        <div className="drawer-header d-flex-v-center-h-between my-2">
          <div className="d-flex-v-center">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-2"
              onClick={closeHandler}
            >
              <span className="fas fa-angle-double-right" />
            </ButtonBase>
          </div>
          <div className="d-flex-v-center-h-end">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-2"
              // onClick={(e) => setPopoverAttachedWith(e.target)}
            >
              <span className="fas fa-ellipsis-h" />
            </ButtonBase>
          </div>
        </div>
        <div className="mt-2">
          <div className="d-flex-column ">
            <div className="d-flex-column gap-2 px-3">
              <span className="fas fa-star fz-18px d-inline-flex-center score-icon-with-bg" />
              <div className="d-flex-v-center font-weight-600 fz-16px  pt-1">
                {scoreCardTitle}
              </div>
              <div className="d-flex-v-center gap-2 mb-2">
                <ButtonBase
                  className="btns theme-transparent scorecard-btn m-0"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: ScorecardPermissions.ScoreManageTemplate.key,
                      permissions: permissionsReducer,
                    })
                  }
                  onClick={() => {
                    handleRedirectToScorecard();
                  }}
                >
                  <span className="px-2">
                    {t(`${translationPath}manage-template`)}
                  </span>
                  <span className="fas fa-arrow-up rotate-45-reverse" />
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent scorecard-btn m-0"
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: ScorecardPermissions.ScorePreviewTemplate.key,
                      permissions: permissionsReducer,
                    })
                  }
                  onClick={() => {
                    scorecardDrawersHandler('isOpenPreview', true);
                  }}
                >
                  <span className="px-2"> {t(`${translationPath}preview`)} </span>
                  <span className="fas fa-arrow-up rotate-45-reverse" />
                </ButtonBase>
              </div>
            </div>
            <div className=" ">
              <TabsComponent
                isPrimary
                isWithLine
                labelInput="label"
                idRef="scorecardDetailsRef"
                wrapperClasses="px-0"
                tabsContentClasses="pt-1 px-0"
                data={sectionSettingTabsData}
                currentTab={activeTab}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                dynamicComponentProps={{
                  scorecardData,
                  parentTranslationPath,
                  translationPath,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
ScorecardDetailsDrawer.propTypes = {
  drawerOpen: PropTypes.bool,
  closeHandler: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  scorecardData: PropTypes.instanceOf(Object),
  scorecardDrawersHandler: PropTypes.func,
  activeJobUUID: PropTypes.string,
};
