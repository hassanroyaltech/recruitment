import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  CollapseComponent,
  DialogComponent,
  PopoverComponent,
} from '../../../../../../../../components';
import i18next from 'i18next';
import './ScoresSummary.Style.scss';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import {
  getIsAllowedPermissionV2,
  GlobalDateFormat,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import { ButtonBase, Grid } from '@mui/material';
import { AvatarList } from '../../../../../../../onboarding/activity/components/AvatarsList';
import { ScorecardReminderDialog } from './ScorcardReminder.Dialog';
import { ScorecardShareDialog } from './ShareScorecardSummary.Dialog';
import { AssignScorecardDialog } from './AssignScorecard.Dialog';
import { BestPerformerCard, DecisionCard } from '../sections/scorecard/cards';
import {
  DownloadJobScorecardSummary,
  GetJobFinalDecisions,
  GetJobScoresSummary,
  SubmitScoreFinalDecision,
} from '../../../../../../../../services';
import Skeleton from '@mui/material/Skeleton';
import ScorecardStarRating from '../../../../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/RatingInputs/ScorecardStarRating.compnent';
import { BlockAccordionScore } from '../../../../../../../../components/Views/CandidateModals/evarecCandidateModal/ScorecardTab/cards/block-accordion/BlockAccordion.Card';
import { useEventListener } from '../../../../../../../../hooks';
import {
  ScoreCalculationTypeEnum,
  ScorecardFinalDecisionStatusEnum,
} from '../../../../../../../../enums';
import ScorecardRatingInput from '../../../../../../../recruiter-preference/Scorecard/ScorecaredBuilder/components/FieldItem/Fields/ScorecardRatingInput/ScorcardRatingInput.component';
import { SharedInputControl } from '../../../../../../../setups/shared';
import { SearchIcon } from '../../../../../../../../assets/icons';
import { useSelector } from 'react-redux';
import { ScorecardPermissions } from '../../../../../../../../permissions';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'ScoresSummaryDialog.';
export const ScoresSummaryDialog = ({
  isOpen,
  isOpenChanged,
  scorecardData,
  activePipeline,
  activeJob,
  activeJobPipelineUUID,
  scorecardAssignHandler,
  jobRequisitionUUID,
  setBackDropLoader,
  isFromShare,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const [expandedCollapse, setExpandedCollapse] = useState(['decision']);
  const [textSearch, setTextSearch] = useState({ open: false, value: '' });
  const [popovers, setPopovers] = useState({
    sort_by: { ref: null, key: null, label: '' },
    group_by: { ref: null, key: null, label: '' },
  });
  const bodyRef = useRef(null);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(false);
  const [openDialogs, setOpenDialogs] = useState({
    share: false,
    reminder: false,
    assign: false,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 12,
  });
  const [fetchedData, setFetchedData] = useState({
    results: [],
    totalCount: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoadingFinalDecisions, setIsLoadingFinalDecisions] = useState(false);
  const [isSubmitCandidate, setIsSubmitCandidate] = useState('');
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [decisionsData, setDecisionsData] = useState();
  const onChangeAccordion = useCallback((id) => {
    setExpandedAccordions((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);
  const onChangeCollapse = useCallback((id) => {
    setExpandedCollapse((items) =>
      items.includes(id) ? items.filter((item) => item !== id) : [...items, id],
    );
  }, []);

  const onChangeDialogs = useCallback((key) => {
    setOpenDialogs((items) => ({ ...items, [key]: !items[key] }));
  }, []);

  const getItemName = useCallback(
    (item) => item.label || `${item.first_name || ''} ${item.last_name || ''}` || '',
    [],
  );
  const decisionMakers = useMemo(
    () =>
      (scorecardData?.decision_makers || []).map((item) => ({
        ...item,
        name: getItemName(item),
      })),
    [scorecardData?.decision_makers, getItemName],
  );
  const getJobScoresSummary = useCallback(async () => {
    if (!scorecardData?.uuid) return;
    setIsLoading(true);
    isLoadingRef.current = true;
    const response = await GetJobScoresSummary({
      ...filter,
      uuid: scorecardData?.uuid,
    });
    setIsLoading(false);
    isLoadingRef.current = false;
    if (setBackDropLoader) setBackDropLoader(false);
    if (response && response.status === 200)
      if (filter.page === 1) {
        setFetchedData({
          results: response.data.results || [],
          totalCount: response.data.paginate?.total || 0,
        });
        isMountedRef.current = true;
      } else
        setFetchedData((items) => ({
          results: items.results.concat(response.data.results || []),
          totalCount: response.data.paginate.total || 0,
        }));
    else {
      setFetchedData({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [filter, scorecardData?.uuid, setBackDropLoader, t]);

  useEffect(() => {
    getJobScoresSummary();
  }, [getJobScoresSummary]);

  const getJobFinalDecisions = useCallback(async () => {
    if (!scorecardData?.uuid) return;
    setIsLoadingFinalDecisions(true);
    const response = await GetJobFinalDecisions({
      uuid: scorecardData?.uuid,
      // decision_makers: scorecardData?.decision_makers || [],
    });
    setIsLoadingFinalDecisions(false);
    if (response && response.status === 200)
      setDecisionsData(response.data.results || []);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [scorecardData?.uuid, t]);
  useEffect(() => {
    getJobFinalDecisions();
  }, [getJobFinalDecisions]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 1
      && fetchedData.results.length < fetchedData.totalCount
      && !isLoadingRef.current
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [fetchedData?.results?.length, isLoading, fetchedData.totalCount]);
  useEventListener('scroll', onScrollHandler, bodyRef.current);
  // candidate_score_card_uuid

  const handleSubmitDecision = useCallback(
    async ({ uuid, status, index }) => {
      setIsSubmitCandidate(uuid);
      const response = await SubmitScoreFinalDecision({
        candidate_score_card_uuid: uuid,
      });
      setIsSubmitCandidate('');
      if (response && response.status === 200) {
        showSuccess(
          t(
            `${translationPath}${
              status === ScorecardFinalDecisionStatusEnum.Accept.key
                ? 'candidate-approved-successfully'
                : 'candidate-rejected-successfully'
            }`,
          ),
        );
        getJobFinalDecisions();
        setFetchedData((items) => {
          const localItems = { ...items };
          localItems.results[index].decision_status = status;
          return localItems;
        });
      } else
        showError(
          t(
            `${translationPath}${
              status === ScorecardFinalDecisionStatusEnum.Accept.key
                ? 'failed-to-approve-candidate'
                : 'failed-to-reject-candidate'
            }`,
          ),
          response,
        );
    },
    [t],
  );
  const getAcceptVal = useCallback((section) => {
    const val = (section?.blocks || []).find((item) => item?.type === 'decision')
      ?.accept?.value;
    return val;
  }, []);

  const getRejectVal = useCallback((section) => {
    const val = (section?.blocks || []).find((item) => item?.type === 'decision')
      ?.reject?.value;
    return val;
  }, []);
  const isWeightScoring = useMemo(
    () =>
      scorecardData?.card_setting?.score_calculation_method
      === ScoreCalculationTypeEnum.weight.key,
    [scorecardData?.card_setting?.score_calculation_method],
  );
  const filterChange = useCallback((name, value) => {
    setFilter((filters) => ({ ...filters, limit: 10, page: 1, [name]: value }));
    setFetchedData({ results: [], totalCount: 0 });
    setExpandedAccordions([0]);
  }, []);
  const handleCloseSearchText = useCallback(() => {
    setTextSearch((item) => ({ ...item, open: false }));
    if (textSearch.value !== filter.search) {
      setFetchedData({ results: [], totalCount: 0 });
      setFilter((filters) => ({
        ...filters,
        limit: 12,
        page: 1,
        search: textSearch.value,
      }));
      setExpandedAccordions([0]);
    }
  }, [textSearch, filter]);
  const handleOpenPopover = useCallback((e, type) => {
    setPopovers((item) => ({
      ...item,
      [type]: { ...item[type], ref: e?.target || null },
    }));
  }, []);
  const handleSortByAndGroupBy = useCallback(
    (type, key, label) => {
      setPopovers((item) => ({ ...item, [type]: { key, label, ref: null } }));
      if (filter[type] !== key) filterChange(type, key);
    },
    [filter, filterChange],
  );

  const onViewCandidateClick = useCallback(
    ({ applicant_number }) => {
      window.open(
        `${process.env.REACT_APP_HEADERS}/recruiter/job/manage/pipeline/${
          activeJob?.uuid
        }?${
          activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
        }applicant_number=${applicant_number}&source=score-card&branch_uuid=${
          selectedBranchReducer?.uuid
        }`,
        '_blank',
      );
    },
    [activeJob?.uuid, activeJobPipelineUUID, selectedBranchReducer?.uuid],
  );

  // Download Job Scorecard Summary
  const downloadJobScorecardSummary = React.useCallback(
    async (uuid) => {
      setIsDownloading(true);
      const response = await DownloadJobScorecardSummary({ uuid });
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
        showSuccess(t(`${translationPath}scores-summary-download-success`));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [scorecardData?.title, t],
  );
  const onSaveReminder = ({ value }) => {
    if (scorecardAssignHandler) scorecardAssignHandler({ value });
  };
  return (
    <DialogComponent
      maxWidth="lg"
      isWithFullScreen
      titleText="scorecards-overview"
      isFixedHeight
      dialogContent={
        <div className="scorecard-summary-wrapper">
          {/*section1-title*/}
          <div className="d-flex-v-center c-neutral-scale-3">
            <span>{activeJob?.title || ''}</span>
            <span className="fas fa-long-arrow-alt-right mx-2" />
            <span>{activePipeline?.title || ''}</span>
            <span className="fas fa-long-arrow-alt-right mx-2" />
            <span className="c-black-light">
              {scorecardData?.title?.[i18next.language]
                || scorecardData?.title?.en
                || ''}
            </span>
          </div>
          {/*section2- title with description and header buttons*/}
          <div className="d-flex-h-between flex-wrap my-2">
            <div className="d-inline-flex gap-3">
              <span className="fas fa-star bg-brown-scale-6  border-radius-10 d-inline-flex-center h-w-40px mt-1" />
              <div className="d-inline-flex-column">
                <span className="fz-22px font-weight-700">
                  {scorecardData?.title?.[i18next.language]
                    || scorecardData?.title?.en
                    || ''}
                </span>
                <span className="pt-1 fz-12px c-neutral-scale-3">
                  {`${t(`${translationPath}last-activity-on`)} ${moment(
                    scorecardData.last_activity_on,
                  )
                    .locale(i18next.language || 'en')
                    .format(GlobalDateFormat)} ${t(`${translationPath}by`)} `}
                  @{scorecardData?.last_activity_by || ''}
                </span>
              </div>
            </div>
            <div>
              <div className="d-inline-flex gap-2 flex-wrap">
                <ButtonBase
                  className="btns theme-transparent scorecard-summary-btn m-0"
                  onClick={() => {
                    downloadJobScorecardSummary(scorecardData?.uuid);
                  }}
                  disabled={
                    isDownloading
                    || !scorecardData?.uuid
                    || !getIsAllowedPermissionV2({
                      permissionId:
                        ScorecardPermissions.DownloadJobScoresSummary.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  {isDownloading ? (
                    <span className="fas fa-circle-notch fa-spin" />
                  ) : (
                    <span className="fas fa-arrow-down" />
                  )}
                  <span className="px-2">{t(`${translationPath}download`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent scorecard-summary-btn m-0"
                  disabled={
                    isFromShare
                    || !getIsAllowedPermissionV2({
                      permissionId: ScorecardPermissions.ShareScoresSummary.key,
                      permissions: permissionsReducer,
                    })
                  }
                  onClick={() => {
                    onChangeDialogs('share');
                  }}
                >
                  <span className="fas fa-arrow-up rotate-45-reverse" />
                  <span className="px-2">{t(`${translationPath}share`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-transparent scorecard-summary-btn m-0"
                  disabled={
                    isFromShare
                    || !getIsAllowedPermissionV2({
                      permissionId:
                        ScorecardPermissions.ScoreSummarySendReminder.key,
                      permissions: permissionsReducer,
                    })
                  }
                  onClick={() => {
                    onChangeDialogs('reminder');
                  }}
                >
                  <span className="far fa-clock" />
                  <span className="px-2">{t(`${translationPath}reminder`)}</span>
                </ButtonBase>
              </div>
            </div>
          </div>

          {/*section3- decision makers*/}
          <div className="separator-h mb-1" />
          <div className="d-flex-v-center-h-between c-gray-primary px-2">
            {t(`${translationPath}final-decision`)}
            <ButtonBase
              onClick={() => onChangeCollapse('decision')}
              className="btns-icon theme-transparent miw-0 mt-1"
            >
              <span className="fas fa-chevron-down c-gray-primary" />
            </ButtonBase>
          </div>
          <CollapseComponent
            isOpen={expandedCollapse.includes('decision')}
            wrapperClasses="w-100 mb-1"
            component={
              <div className="d-flex-v-center gap-2 mb-2 mt-0">
                <span>
                  <div className="d-inline-flex-v-center gap-1 p-1 score-assign-avatars">
                    <AvatarList
                      members={decisionMakers || []}
                      max={3}
                      dimension={27}
                    />
                    <span className="px-2">{decisionMakers.length}</span>
                  </div>
                </span>
                <ButtonBase
                  className="btns theme-transparent my-2"
                  onClick={() => onChangeDialogs('assign')}
                  disabled={
                    isFromShare
                    || !getIsAllowedPermissionV2({
                      permissionId: ScorecardPermissions.ScorecardViewAssignee.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <span className="fas fa-plus" />
                  <span className="px-2">{t(`${translationPath}add`)}</span>
                </ButtonBase>
              </div>
            }
          />
          <div className="separator-h mb-1" />
          <div className="my-1 d-flex-v-center-h-end ">
            {textSearch.open ? (
              <SharedInputControl
                idRef="searchRef"
                placeholder="search"
                themeClass="theme-transparent"
                wrapperClasses={'mb-0'}
                onKeyDown={(e) => {
                  e.key === 'Enter' && handleCloseSearchText();
                }}
                stateKey="search"
                endAdornment={
                  <span
                    className="end-adornment-wrapper"
                    onClick={() => {
                      handleCloseSearchText();
                    }}
                    onKeyDown={() => {
                      handleCloseSearchText();
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <SearchIcon />
                  </span>
                }
                onValueChanged={(newValue) => {
                  setTextSearch((items) => ({
                    ...items,
                    value: newValue?.value || '',
                  }));
                }}
                parentTranslationPath={parentTranslationPath}
                editValue={textSearch.value}
              />
            ) : (
              <ButtonBase
                className="btns-icon theme-transparent"
                onClick={() => setTextSearch((item) => ({ ...item, open: true }))}
              >
                <SearchIcon />
              </ButtonBase>
            )}
            <ButtonBase
              onClick={(e) => {
                handleOpenPopover(e, 'group_by');
              }}
              className="btns theme-transparent  px-2 miw-0 c-gray-primary"
            >
              <span className=" ">{t(`${translationPath}group-by`)}</span>
              {popovers?.group_by?.label ? (
                <span className="px-1  c-black-lighter ">
                  {t(`${translationPath}${popovers.group_by.label}`)}
                </span>
              ) : null}
            </ButtonBase>
            <ButtonBase
              onClick={(e) => {
                handleOpenPopover(e, 'sort_by');
              }}
              className="btns theme-transparent  px-2 miw-0 c-gray-primary"
            >
              <span className=" ">{t(`${translationPath}sort-by`)}</span>
              {popovers?.sort_by?.label ? (
                <span className="px-1  c-black-lighter ">
                  {t(`${translationPath}${popovers.sort_by.label}`)}
                </span>
              ) : null}
            </ButtonBase>
          </div>

          <div className="d-flex-h-between gap-4  pb-3 pt-1  summary-parent">
            <div className="flex-grow-1">
              <div className="w-100 scrollable-summary-items px-2" ref={bodyRef}>
                {isMountedRef.current === true
                  && fetchedData?.results?.length === 0 && (
                  <div className="d-flex-center font-weight-500">
                    {t(`${translationPath}candidate-scores-not-yet-available`)}
                  </div>
                )}
                {fetchedData?.results?.length > 0
                  && fetchedData?.results?.map((item, index) => (
                    <div key={item.job_candidate_uuid}>
                      <BlockAccordionScore
                        expanded={expandedAccordions.includes(
                          item.job_candidate_uuid,
                        )}
                        onChange={() => {
                          onChangeAccordion(item.job_candidate_uuid);
                        }}
                        title={
                          <div className="d-flex section-title">
                            <div className="d-inline-flex-v-center-h-between w-100 px-2 py-1 mx-2 fz-12px font-weight-500">
                              <span className={'d-inline-flex-v-center'}>
                                <AvatarList
                                  members={
                                    [{ name: item?.candidate_name || '' }] || []
                                  }
                                  max={1}
                                  dimension={28}
                                />
                                <span className="c-black px-1">
                                  {item?.candidate_name || ''}
                                </span>
                              </span>

                              <span className="c-neutral-scale-1 fz-14px font-weight-500 d-inline-flex-v-center gap-2 ">
                                {(item.total_score || item.total_score === 0) && (
                                  <span className="candidate-avg-score gap-1 d-inline-flex-v-center">
                                    <ScorecardStarRating
                                      value={1}
                                      maxNumber={1}
                                      isView={true}
                                      ishideLabels={true}
                                    />
                                    <span className="w-100">{item.total_score}</span>
                                  </span>
                                )}
                                <div className="d-inline-flex-center c-neutral-scale-1 font-weight-400  fz-12px gap-2">
                                  <div className="d-inline-flex-center  short-decision-view">
                                    <span className="fa fa-check" />
                                    <span className="fz-12px">
                                      {getAcceptVal(item) || 0}{' '}
                                    </span>
                                  </div>
                                  <div className="d-inline-flex-center  short-decision-view">
                                    <span className="fa fa-times" />
                                    <span className="">
                                      {' '}
                                      {getRejectVal(item) || 0}{' '}
                                    </span>
                                  </div>
                                </div>
                              </span>
                            </div>
                          </div>
                        }
                        body={
                          <>
                            {item?.blocks?.map((block, blockIdx) => (
                              <React.Fragment
                                key={`block${item.job_candidate_uuid}${blockIdx}`}
                              >
                                <div className="d-flex-h-between p-end-1 flex-wrap gap-2">
                                  <div className="px-1 d-block">
                                    <span className="c-black font-weight-500 fz-14px">
                                      {block?.title?.[i18next.language]
                                        || block?.title?.en
                                        || ''}
                                    </span>

                                    {block?.comment && (
                                      <span className="d-block c-black py-1 font-weight-400 fz-12px">
                                        {block?.comment}
                                      </span>
                                    )}

                                    <div className="d-block pt-1">
                                      <div className="d-inline-flex-v-center flex-wrap gap-2 ">
                                        {block?.type === 'rating' && (
                                          <>
                                            <ScorecardRatingInput
                                              sectionSetting={block.section_setting}
                                              globalSetting={
                                                scorecardData?.card_setting
                                              }
                                              isView={true}
                                              value={block.rating_given}
                                              ishideLabels={true}
                                            />
                                            <span className="c-neutral-scale-1 fz-16px font-weight-500">
                                              {isWeightScoring
                                                ? block?.rating_message
                                                : block.avg}
                                            </span>
                                          </>
                                        )}
                                        {block?.type === 'decision' && (
                                          <>
                                            <DecisionCard decisions={block} />
                                          </>
                                        )}
                                      </div>
                                    </div>
                                    {block?.message && (
                                      <span className="d-block pt-1 c-neutral-scale-3 font-weight-400 fz-12px">
                                        {block?.message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {blockIdx < item?.blocks?.length - 1 && (
                                  <div
                                    className="separator-neutral-scale-5 d-block m-3"
                                    style={{ opacity: '0.4' }}
                                  ></div>
                                )}
                              </React.Fragment>
                            ))}

                            {item?.can_make_decision && (
                              <>
                                <div
                                  className="separator-neutral-scale-5 d-block m-3"
                                  style={{ opacity: '0.4' }}
                                ></div>
                                <div className="p-end-1  gap-2">
                                  <div className="px-1 d-block">
                                    <span className="c-black font-weight-500 fz-14px">
                                      {t(`${translationPath}final-decision`)}
                                    </span>
                                    <div className="d-block pt-1">
                                      {(item?.decision_status
                                        === ScorecardFinalDecisionStatusEnum.Pending
                                          .key
                                        || item?.decision_status
                                          === ScorecardFinalDecisionStatusEnum.Reject
                                            .key) && (
                                        <>
                                          <ButtonBase
                                            className="btns theme-solid  p-2 m-0"
                                            disabled={isLoading || isSubmitCandidate}
                                            onClick={() => {
                                              handleSubmitDecision({
                                                uuid: item?.candidate_score_card_uuid,
                                                status:
                                                  ScorecardFinalDecisionStatusEnum
                                                    .Accept.key,
                                                index,
                                              });
                                            }}
                                          >
                                            {isSubmitCandidate
                                            === item?.candidate_score_card_uuid ? (
                                                <span className="fas fa-circle-notch fa-spin" />
                                              ) : (
                                                <span className="fa fa-check" />
                                              )}

                                            <span className="px-2">
                                              {t(
                                                `${translationPath}approve-this-candidate`,
                                              )}
                                            </span>
                                          </ButtonBase>
                                        </>
                                      )}
                                      {item?.decision_status
                                        === ScorecardFinalDecisionStatusEnum.Accept
                                          .key && (
                                        <>
                                          <ButtonBase
                                            className="btns theme-outline p-2 m-0"
                                            disabled={isLoading || isSubmitCandidate}
                                            onClick={() => {
                                              handleSubmitDecision({
                                                uuid: item?.candidate_score_card_uuid,
                                                status:
                                                  ScorecardFinalDecisionStatusEnum
                                                    .Reject.key,
                                                index,
                                              });
                                            }}
                                          >
                                            {isSubmitCandidate
                                            === item?.candidate_score_card_uuid ? (
                                                <span className="fas fa-circle-notch fa-spin" />
                                              ) : (
                                                <span className="fa fa-times" />
                                              )}
                                            <span className="px-2">
                                              {t(
                                                `${translationPath}reject-this-candidate`,
                                              )}
                                            </span>
                                          </ButtonBase>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        }
                      />
                      {index < fetchedData.results?.length - 1 && (
                        <div className="separator-h my-1" />
                      )}
                    </div>
                  ))}

                {isLoading
                  && Array.from(new Array(4)).map((item, index) => (
                    <Grid
                      item
                      md={12}
                      className={'mb-2 px-2 d-flex gap-2'}
                      key={`${item}${index}`}
                    >
                      <Skeleton
                        variant="circular"
                        sx={{ height: '30px', width: '30px' }}
                      />
                      <Skeleton
                        variant="rectangular"
                        sx={{ height: '30px', width: '100%' }}
                      />
                    </Grid>
                  ))}
              </div>
            </div>
            <div className="side-bar-scores">
              <div className="best-performer-and-decisions p-end-15px scrollable-summary-items">
                <BestPerformerCard
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  uuid={scorecardData?.uuid}
                  isWeightScoring={isWeightScoring}
                />
                <div className="separator-h my-2" />
                <div className="c-neutral-scale-1 font-weight-500">
                  {t(`${translationPath}final-decision`)}
                  {isLoadingFinalDecisions && (
                    <span className="fas fa-circle-notch fa-spin mx-2" />
                  )}
                </div>
                {decisionsData?.length > 0
                  && decisionsData?.map((item, index) => (
                    <React.Fragment key={`decision${index}`}>
                      {
                        <div className={'d-block'}>
                          <span className={'d-flex'}>
                            <AvatarList
                              members={[{ name: item.name || '' }] || []}
                              max={1}
                              dimension={28}
                            />
                            {item.accepted_candidates?.length === 0 ? (
                              <span className="c-neutral-scale-3 fz-13px  pt-1 px-1">
                                {`${t(
                                  `${translationPath}waiting-for-approval-from`,
                                )} `}{' '}
                                @{item.name}
                              </span>
                            ) : (
                              <span className="c-neutral-scale-3 fz-13px px-1 pt-1">
                                <span className="c-neutral-scale-1">
                                  {' '}
                                  @{item.name}
                                </span>
                                {` ${t(`${translationPath}approved`)} `}
                                {item?.accepted_candidates?.length === 1
                                  && item?.accepted_candidates?.[0]?.candidate_name}
                              </span>
                            )}
                          </span>
                          {(item?.accepted_candidates || []).map(
                            (candidate, cIdx) => (
                              <React.Fragment
                                key={`${candidate?.job_candidate_uuid}${candidate?.applicant_number}`}
                              >
                                <div className="d-block px-4">
                                  <span className={'d-block'}>
                                    <AvatarList
                                      members={
                                        [
                                          { name: candidate?.candidate_name || '' },
                                        ] || []
                                      }
                                      max={1}
                                      dimension={25}
                                    />{' '}
                                    <span className="c-neutral-scale-1 fz-13px px-1">
                                      {candidate?.candidate_name || ''}
                                    </span>
                                  </span>
                                  <span className={'d-block mt-1'}>
                                    <ButtonBase
                                      className="btns theme-transparent m-0 px-2"
                                      onClick={() => {
                                        onViewCandidateClick({
                                          applicant_number:
                                            candidate.applicant_number,
                                        });
                                      }}
                                    >
                                      <span className="fas fa-arrow-up c-neutral-scale-3 rotate-45-reverse" />
                                      <span className="px-3 c-neutral-scale-3 ">
                                        {t(`${translationPath}view-profile`)}
                                      </span>
                                    </ButtonBase>
                                  </span>
                                  <span className="c-neutral-scale-3 fz-12px mx-2 font-weight-400">
                                    {candidate?.approved_at || ''}
                                  </span>
                                </div>
                                {cIdx < item?.accepted_candidates?.length - 1 && (
                                  <div
                                    className="separator-neutral-scale-5 d-block m-1"
                                    style={{ opacity: '0.4' }}
                                  ></div>
                                )}
                              </React.Fragment>
                            ),
                          )}
                        </div>
                      }
                    </React.Fragment>
                  ))}
              </div>
            </div>
          </div>

          {openDialogs?.reminder && (
            <ScorecardReminderDialog
              isOpen={openDialogs?.reminder}
              isOpenChanged={() => onChangeDialogs('reminder')}
              scorecardData={scorecardData}
              dataKey={'committee_members'}
              onSaveReminder={onSaveReminder}
            />
          )}
          {openDialogs?.share && (
            <ScorecardShareDialog
              isOpen={openDialogs?.share}
              isOpenChanged={() => onChangeDialogs('share')}
              scorecardData={scorecardData}
              dataKey={'committee_members'}
              jobRequisitionUUID={jobRequisitionUUID}
            />
          )}
          {openDialogs?.assign && (
            <AssignScorecardDialog
              scorecardData={scorecardData}
              scorecard_uuid={activeJob?.score_card_uuid}
              isOpen={openDialogs?.assign}
              job_uuid={(activeJob && activeJob.uuid) || null}
              pipeline_uuid={(activePipeline && activePipeline.uuid) || null}
              isOpenChanged={() => onChangeDialogs('assign')}
              onSave={scorecardAssignHandler}
              activeJobPipelineUUID={activeJobPipelineUUID}
              jobRequisitionUUID={jobRequisitionUUID}
              isReminderDisabled={
                !getIsAllowedPermissionV2({
                  permissionId: ScorecardPermissions.ManageReminderSetting.key,
                  permissions: permissionsReducer,
                })
              }
            />
          )}
          <PopoverComponent
            idRef="widget-ref-sort-by"
            attachedWith={popovers.sort_by.ref}
            handleClose={() => {
              handleOpenPopover(null, 'sort_by');
            }}
            popoverClasses="columns-popover-wrapper"
            component={
              <div className="d-flex-column p-2 w-100">
                {[
                  {
                    key: 1,
                    label: 'rate',
                  },
                ].map((action, idx) => (
                  <ButtonBase
                    key={`${idx}-${action.key}-popover-action`}
                    className="btns theme-transparent justify-content-start m-1"
                    onClick={() => {
                      handleSortByAndGroupBy('sort_by', action.key, action.label);
                    }}
                  >
                    <span className="px-2">
                      {' '}
                      {t(`${translationPath}${action.label}`)}
                    </span>
                  </ButtonBase>
                ))}
              </div>
            }
          />
          <PopoverComponent
            idRef="widget-ref-group-by"
            attachedWith={popovers.group_by.ref}
            handleClose={() => {
              handleOpenPopover(null, 'group_by');
            }}
            popoverClasses="columns-popover-wrapper"
            component={
              <div className="d-flex-column p-2 w-100">
                {[
                  {
                    key: 1,
                    label: 'candidates',
                  },
                ].map((action, idx) => (
                  <ButtonBase
                    key={`${idx}-${action.key}-popover-action`}
                    className="btns theme-transparent justify-content-start m-1"
                    onClick={() => {
                      handleSortByAndGroupBy('group_by', action.key, action.label);
                    }}
                  >
                    <span className="px-2">
                      {' '}
                      {t(`${translationPath}${action.label}`)}
                    </span>
                  </ButtonBase>
                ))}
              </div>
            }
          />
        </div>
      }
      wrapperClasses="scorecard-summary-dialog-wrapper"
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ScoresSummaryDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  scorecardData: PropTypes.instanceOf(Object),
  activePipeline: PropTypes.instanceOf(Object),
  activeJob: PropTypes.instanceOf(Object),
  scorecardAssignHandler: PropTypes.func,
  jobRequisitionUUID: PropTypes.string,
  activeJobPipelineUUID: PropTypes.string,
  setBackDropLoader: PropTypes.func,
  isFromShare: PropTypes.bool,
};

ScoresSummaryDialog.defaultProps = {
  activeItem: undefined,
};
