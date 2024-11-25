import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import {
  CreateCandidateScorecard,
  DownloadCandidateScorecard,
  // DownloadJobScorecardSummary,
  GetCandidateScorecard,
  ViewCandidateScorecardDetails,
} from '../../../../../services';

import { ButtonBase } from '@mui/material';
import './ScorecardTab.Style.scss';
import { TabsComponent } from '../../../../Tabs/Tabs.Component';
import { CandidateScoreTabs } from './CandidateScore.Tabs';
import {
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
} from '../../../../../helpers';
import i18next from 'i18next';
import Loader from '../../../../Elevatus/Loader';
import { AssignScorecardDialog } from '../../../../../pages/evarec/pipelines/managements/pipeline/sections/pipeline-header/dialogs';
import { EvaluateCandidateComponent } from './components/EvaluateCandidate.Component';
import { ScorecardReminderDialog } from '../../../../../pages/evarec/pipelines/managements/pipeline/sections/pipeline-header/dialogs/ScorcardReminder.Dialog';
import { ScorecardPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const ScorecardTab = ({
  // candidate_uuid,
  job_candidate_uuid,
  parentTranslationPath,
  job_uuid,
  handleTotalScoreChange,
  candidateDetail,
  activeJob,
  scorecardAssignHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const candidateScoreUUIDRef = useRef(null);
  const isMountedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [candidateScoreTabs] = useState(() => CandidateScoreTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [loadingArray, setLoadingArray] = useState([]);
  const [candidateGlobalData, setCandidateGlobalData] = useState();
  const [candidateDetails, setCandidateDetails] = useState();
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    assignScorecard: false,
    reminder: false,
  });
  const [isOpenDrawers, setIsOpenDrawers] = useState({
    evaluateDrawer: false,
  });
  const viewCandidateScorecardDetails = useCallback(
    async ({ uuid }) => {
      setLoadingArray((items) => {
        items.push('candidate-score');
        return [...items];
      });
      const response = await ViewCandidateScorecardDetails({
        uuid,
      });
      if (response && response.status === 200) {
        setLoadingArray((items) =>
          items.filter((item) => item !== 'candidate-score'),
        );
        const result = response?.data?.results || {};
        setCandidateDetails(result);
        handleTotalScoreChange({
          total_score: result?.total_score || 0,
          progress: result.progress,
          decisions: result.committee_decisions,
          committee_members: result?.committee_members,
        });
      } else {
        setLoadingArray((items) =>
          items.filter((item) => item !== 'candidate-score'),
        );
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    },
    [handleTotalScoreChange, t],
  );
  const getCandidateScorecard = useCallback(async () => {
    if (job_uuid && job_candidate_uuid) {
      setIsLoading(true);
      const response = await GetCandidateScorecard({
        job_candidate_uuid,
        job_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        const result = response?.data?.results?.[0] || {};
        setCandidateGlobalData(result);
        isMountedRef.current = true;
        if (result?.uuid) {
          candidateScoreUUIDRef.current = result?.uuid;
          viewCandidateScorecardDetails({
            uuid: result?.uuid,
          });
        }
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [job_candidate_uuid, job_uuid, t, viewCandidateScorecardDetails]);

  useEffect(() => {
    getCandidateScorecard();
  }, [getCandidateScorecard]);
  useEffect(() => {
    handleTotalScoreChange({});
  }, [handleTotalScoreChange]);

  const isDisabledButtons = useMemo(
    () => isLoading || !candidateGlobalData?.title || loadingArray?.length > 0,
    [candidateGlobalData?.title, isLoading, loadingArray?.length],
  );
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);
  const onIsOpenDrawersChanged = useCallback((key, newValue) => {
    setIsOpenDrawers((items) => ({ ...items, [key]: newValue }));
  }, []);

  const onSubmitAssign = useCallback(
    async ({ value, isReload }) => {
      setCandidateGlobalData((items) => ({
        ...items,
        ...value,
      }));
      setCandidateDetails((items) => ({
        ...items,
        ...value,
        // decision_makers: value.decision_makers,
        // committee_members: value.committee_members,
      }));
      scorecardAssignHandler({
        value: {
          has_reminder: value.has_reminder,
          period_type: value.period_type,
          period: value.period,
        },
      });
      if (isReload)
        viewCandidateScorecardDetails({ uuid: candidateScoreUUIDRef.current });
    },
    [scorecardAssignHandler, viewCandidateScorecardDetails],
  );

  const scorecardData = useMemo(
    () => ({
      title: candidateGlobalData?.title,
      decision_makers: candidateDetails?.decision_makers,
      card_setting: candidateDetails?.card_setting,
      committee_members: candidateDetails?.committee_members,
      has_reminder: activeJob?.job_score_card?.has_reminder,
      period: activeJob?.job_score_card?.period,
      period_type: activeJob?.job_score_card?.period_type,
    }),
    [
      activeJob?.job_score_card?.has_reminder,
      activeJob?.job_score_card?.period,
      activeJob?.job_score_card?.period_type,
      candidateDetails?.card_setting,
      candidateDetails?.committee_members,
      candidateDetails?.decision_makers,
      candidateGlobalData?.title,
    ],
  );
  const afterSubmitHandler = useCallback(() => {
    viewCandidateScorecardDetails({ uuid: candidateScoreUUIDRef.current });
  }, [viewCandidateScorecardDetails]);

  const downloadCandidateScorecard = React.useCallback(
    async (uuid) => {
      setIsDownloading(true);
      const response = await DownloadCandidateScorecard({ uuid });
      setIsDownloading(false);
      if (response && response.status === 200) {
        const link = document.createElement('a');
        // link.setAttribute('target', '_blank');
        link.download
          = scorecardData?.title?.[i18next.language] || scorecardData?.title?.en || '';
        link.href = response?.data;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccess(t(`candidate-scores-summary-download-success`));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [scorecardData?.title, t],
  );
  const onSaveReminder = useCallback(
    ({ value }) => {
      setCandidateDetails((items) => ({
        ...items,
        has_reminder: value.has_reminder,
        period_type: value.period_type,
        period: value.period,
      }));
      if (scorecardAssignHandler) scorecardAssignHandler({ value });
    },
    [scorecardAssignHandler],
  );
  const creatCandidateScorecard = useCallback(async () => {
    if (job_uuid && job_candidate_uuid) {
      setIsLoading(true);
      const response = await CreateCandidateScorecard({
        job_candidate_uuid,
        job_uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200) {
        getCandidateScorecard();
        showSuccess(t('scorecard-triggered-successfully'));
      } else showError(t('scorecard-trigger-failed'), response);
    }
  }, [getCandidateScorecard, job_candidate_uuid, job_uuid, t]);

  return (
    <>
      {isMountedRef.current && !candidateGlobalData?.uuid && (
        <div className="d-flex-column-center bg-white py-3 mt-2 font-weight-500">
          {t(`no-score-card-available`)}
          <ButtonBase
            disabled={isLoading}
            className="btns theme-solid my-2"
            onClick={() => creatCandidateScorecard()}
          >
            <span className="fa fa-plus" />
            <span className="px-2">{t(`trigger-scorecard`)}</span>
          </ButtonBase>
        </div>
      )}
      {isLoading ? (
        <Loader width="730px" height="49vh" speed={1} color="primary" />
      ) : (
        (candidateGlobalData?.uuid && (
          <>
            <div className="my-2 candidate-scorecard-tab bg-white p-3">
              <div className="d-flex-v-center-h-between flex-grow-1 gap-2 flex-wrap my-2  ">
                <div className="fz-20px fw-bold">
                  {' '}
                  {candidateGlobalData?.title?.[i18next.language]
                    || candidateGlobalData?.title?.en
                    || ''}{' '}
                </div>
                <div className="d-inline-flex-v-center-h-end flex-grow-1 gap-2 flex-wrap">
                  <ButtonBase
                    disabled={
                      !!(isDisabledButtons || !candidateGlobalData?.can_evaluate)
                    }
                    className="btns theme-transparent scorecard-tab-btn m-0"
                    onClick={() => {
                      onIsOpenDrawersChanged('evaluateDrawer', true);
                    }}
                  >
                    <span className="fas fa-arrow-up rotate-45-reverse" />
                    <span className="px-2">{t(`evaluate`)}</span>
                  </ButtonBase>
                  <ButtonBase
                    disabled={
                      isDisabledButtons
                      || isDownloading
                      || !candidateGlobalData?.uuid
                      || !getIsAllowedPermissionV2({
                        permissionId:
                          ScorecardPermissions.DownloadCandidateScoresSummary.key,
                        permissions: permissionsReducer,
                      })
                    }
                    className="btns theme-transparent scorecard-tab-btn m-0"
                    onClick={() => {
                      downloadCandidateScorecard(candidateGlobalData?.uuid);
                    }}
                  >
                    {isDownloading ? (
                      <span className="fas fa-circle-notch fa-spin" />
                    ) : (
                      <span className="fas fa-arrow-down" />
                    )}
                    <span className="px-2">{t(`download`)}</span>
                  </ButtonBase>

                  <ButtonBase
                    className="btns theme-transparent scorecard-tab-btn m-0"
                    disabled={
                      isDisabledButtons
                      || !getIsAllowedPermissionV2({
                        permissionId:
                          ScorecardPermissions.ScoreCandidateSendReminder.key,
                        permissions: permissionsReducer,
                      })
                    }
                    onClick={() => onIsOpenDialogsChanged('reminder', true)}
                  >
                    <span className="far fa-clock" />
                    <span className="px-2">{t(`reminder`)}</span>
                  </ButtonBase>
                </div>
              </div>

              <div className=" ">
                <TabsComponent
                  wrapperClasses="px-0"
                  data={candidateScoreTabs}
                  currentTab={activeTab}
                  labelInput="label"
                  idRef="ScoreTabsRef"
                  isWithLine
                  isPrimary
                  onTabChanged={(event, currentTab) => {
                    setActiveTab(currentTab);
                  }}
                  isDisabled={isLoading}
                  parentTranslationPath={parentTranslationPath}
                  dynamicComponentProps={{
                    isLoading,
                    candidateDetails,
                    candidateDetail,
                    onIsOpenDialogsChanged,
                    loadingArray,
                  }}
                />
              </div>
            </div>
          </>
        ))
        || null
      )}
      {isOpenDialogs.assignScorecard && (
        <AssignScorecardDialog
          scorecardData={{ ...scorecardData, ...candidateDetails }}
          scorecard_uuid={activeJob?.score_card_uuid}
          isOpen={isOpenDialogs.assignScorecard}
          jobRequisitionUUID={(activeJob && activeJob.job_requisition_uuid) || null}
          job_uuid={(activeJob && activeJob.uuid) || null}
          isOpenChanged={() => onIsOpenDialogsChanged('assignScorecard', false)}
          onSave={onSubmitAssign}
          candidateScorecardUUID={candidateGlobalData?.uuid}
          isReminderDisabled={
            !getIsAllowedPermissionV2({
              permissionId: ScorecardPermissions.ManageReminderSetting.key,
              permissions: permissionsReducer,
            })
          }
        />
      )}
      {isOpenDialogs.reminder && (
        <ScorecardReminderDialog
          isOpen={isOpenDialogs.reminder}
          isOpenChanged={() => onIsOpenDialogsChanged('reminder', false)}
          scorecardData={{ ...scorecardData, ...candidateDetails }}
          dataKey={'committee_members'}
          candidateScorecardUUID={candidateGlobalData?.uuid}
          onSaveReminder={onSaveReminder}
        />
      )}
      {candidateGlobalData?.uuid && candidateGlobalData?.can_evaluate && (
        <EvaluateCandidateComponent
          drawerOpen={isOpenDrawers?.evaluateDrawer}
          uuid={candidateGlobalData?.uuid}
          closeHandler={() => {
            onIsOpenDrawersChanged('evaluateDrawer', false);
          }}
          afterSubmitHandler={afterSubmitHandler}
        />
      )}
    </>
  );
};

ScorecardTab.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string,
  job_candidate_uuid: PropTypes.string,
  handleTotalScoreChange: PropTypes.func,
  scorecardAssignHandler: PropTypes.func,
  candidateDetail: PropTypes.instanceOf(Object),
  activeJob: PropTypes.instanceOf(Object),
};
ScorecardTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
};
