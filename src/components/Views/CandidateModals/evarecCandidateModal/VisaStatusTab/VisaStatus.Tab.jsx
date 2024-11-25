import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Typography } from '@mui/material';
import {
  VisaRequestMoreInfoManagementDialog,
  VisaRequestsManagementDialog,
} from '../../../../../pages/visa/dialogs';
import {
  SystemActionsEnum,
  VisaDefaultStagesEnum,
  VisaRequestsCallLocationsEnum,
  VisaRequestsStatusesEnum,
} from '../../../../../enums';
import {
  GetAllVisaMedias,
  GetAllVisaStagesDropdown,
  GetVisaRequestDetailsForCandidate,
  RejectVisaAllocation,
  VisaCandidateMoveTo,
} from '../../../../../services';
import {
  getIsAllowedPermissionV2,
  showError,
  showSuccess,
  StringToColor,
} from '../../../../../helpers';
import i18next from 'i18next';
import moment from 'moment';
import './VisaStatus.Style.scss';
import Avatar from '@mui/material/Avatar';
import { useSelector } from 'react-redux';
import { SharedAutocompleteControl } from '../../../../../pages/setups/shared';
import TablesComponent from '../../../../Tables/Tables.Component';
import { VisaUsedConfirmDialog } from '../../../../../pages/visa/visa-pipeline/dialogs';
import { VisaStatusTabs } from './tabs-data/VisaStatus.Tabs';
import { TabsComponent } from '../../../../Tabs/Tabs.Component';
import { EvaRecManageVisaPermissions } from '../../../../../permissions/eva-rec/EvaRecManageVisa.Permissions';
import { ManageVisasPermissions } from '../../../../../permissions';

export const VisaStatusTab = ({
  candidateDetail,
  job_uuid,
  // activeJobPipelineUUID,
  stage_uuid,
  pipeline_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector(
    (reducerState) => reducerState?.userReducer?.results?.user,
  );
  const [activeItem, setActiveItem] = useState(null);
  const [visaStatusTabsData] = useState(() => VisaStatusTabs);
  const [visaRequests, setVisaRequests] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [forceToReloadCandidateVisas, setForceToReloadCandidateVisas]
    = useState(false);
  const [visaStatusesList] = useState(() =>
    Object.values(VisaRequestsStatusesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const confirmMoveTimesRef = useRef(null);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    moreInfoManagement: false,
    visaRequestManagement: false,
    visaUsedConfirm: false,
  });
  const [callLocation, setCallLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [stagesList, setStagesList] = useState([]);
  const [selectedStage, setSelectedStage] = useState(null);
  const [attachmentsDetails, setAttachmentsDetails] = useState([]);
  const [candidateVisaDetails, setCandidateVisaDetails] = useState(null);

  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
  });
  const [tableColumns] = useState([
    {
      id: 1,
      isSortable: false,
      // label: '#',
      isCounter: true,
      isSticky: true,
    },
    {
      id: 2,
      isSortable: false,
      component: (row) => <span>{row.name}</span>,
      isSticky: false,
    },
    {
      id: 3,
      isSortable: false,
      component: (row) => <span>{row.type}</span>,
      isSticky: false,
    },
    {
      id: 4,
      isSortable: false,
      component: (row) => <span>{row.file_size}</span>,
      isSticky: false,
    },
    {
      id: 5,
      isSortable: false,
      component: (row) => <span>{row.comment}</span>,
      isSticky: false,
    },
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get all stages for dropdown move to
   */
  const getAllVisaStages = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllVisaStagesDropdown();
    setIsLoading(false);
    if (response && response.status === 200) setStagesList(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  const getFullNameForRequestedFrom = useMemo(
    () => (nameObject) =>
      `${
        (nameObject.first_name
          && (nameObject.first_name[i18next.language] || nameObject.first_name.en))
        || ''
      }${
        (nameObject.last_name
          && ` ${nameObject.last_name[i18next.language] || nameObject.last_name.en}`)
        || ''
      }`,
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get visa status details by key
   */
  const getVisaStatusByKey = useMemo(
    () => (key) => visaStatusesList.find((item) => item.key === key) || {},
    [visaStatusesList],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the request is active or not
   */
  const getIsActiveRequest = useMemo(
    () => (requestDetails) =>
      requestDetails.status === VisaRequestsStatusesEnum.Pending.key
      || requestDetails.status === VisaRequestsStatusesEnum.RequestInfo.key
      || (requestDetails.status === VisaRequestsStatusesEnum.Approved.key
        && ![
          VisaDefaultStagesEnum.Used.key,
          VisaDefaultStagesEnum.Declined.key,
        ].includes(requestDetails.stage.value)),
    [],
  );

  const onUndoCandidateMoveHandler = (border_number) => () => {
    clearTimeout(confirmMoveTimesRef.current);
    if (border_number) {
      setIsLoading(false);
      onIsOpenDialogsChanged('visaUsedConfirm', false)();
    }
    setSelectedStage(null);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the current candidate visa details if there is an active one
   */
  const getCandidateVisaDetails = useCallback(async () => {
    if (!candidateDetail || !candidateDetail.identity) return;
    setIsLoading(true);
    const response = await GetVisaRequestDetailsForCandidate({
      job_uuid,
      candidate_uuid: candidateDetail.identity.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      if (response.data.results.length === 0) return;
      const findCurrentActiveRequest = response.data.results.find((item) =>
        getIsActiveRequest(item),
      );
      const logsVisas = response.data.results.filter(
        (item) => !getIsActiveRequest(item),
      );
      setCandidateVisaDetails(findCurrentActiveRequest);
      setVisaRequests(logsVisas);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [candidateDetail, getIsActiveRequest, job_uuid, t]);

  const candidatesMoveHandler = ({
    candidate_visa_uuid = (candidateVisaDetails && candidateVisaDetails.uuid)
      || undefined,
    stage_uuid = (selectedStage && selectedStage.uuid) || undefined,
    border_number = null,
  }) => {
    // Start timeout
    confirmMoveTimesRef.current = setTimeout(async () => {
      const confirmResponse = await VisaCandidateMoveTo({
        candidate_visa_uuid,
        stage_uuid,
        border_number,
      });
      if (border_number) setIsLoading(false);

      // removed because there is loading for the candidates from start will happen
      // onIsDisabledAllDraggingChanged(false);
      if (confirmResponse && confirmResponse.status === 200) {
        setSelectedStage(null);
        setForceToReloadCandidateVisas((item) => !item);
        showSuccess(
          t(
            `VisaPipelinePage.${
              (border_number && 'confirm-and-stage-changed-successfully')
              || 'candidates-stage-changed-successfully'
            }`,
          ),
          confirmResponse,
        );
        if (border_number) onIsOpenDialogsChanged('visaUsedConfirm', false)();
      } else
        showError(
          t(
            `VisaPipelinePage.${
              (border_number && 'confirm-and-stage-change-failed')
              || 'candidates-stage-change-failed'
            }`,
          ),
          confirmResponse,
        );
    }, 5001);

    // ToastPipeline
    showSuccess(t('VisaPipelinePage.candidate-moved-successfully'), {
      actionHandler: onUndoCandidateMoveHandler(border_number),
      position: 'bottom-center',
      pauseOnHover: false,
      style: { minWidth: 400 },
    });
  };

  const onMoveToChanged = ({ value }) => {
    setSelectedStage(value);
    if (!value) return;
    if (value.value === VisaDefaultStagesEnum.Used.key) {
      onIsOpenDialogsChanged('visaUsedConfirm', true)();
      return;
    }
    setIsLoading(true);
    candidatesMoveHandler({ stage_uuid: value.uuid });
  };

  /**
   * @param action
   * @param row
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the table actions
   */
  const onActionClicked = (action, row) => {
    if (action.key === SystemActionsEnum.download.key) {
      const link = document.createElement('a');
      link.setAttribute('target', '_blank');
      link.download = row.fileName || row.name;
      link.href = row.url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change active page and send it to parent
   */
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change page size and send it to parent
   */
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  /**
   * @param key
   * @param newValue - bool
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the change of is open dialog from child
   */
  const onIsOpenDialogsChanged = useCallback(
    (key, newValue, item = null) =>
      () => {
        setActiveItem((items) => (items !== item ? item : items));
        setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
      },
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the request cancel
   */
  const rejectOrWithdrawHandler = async () => {
    setIsLoading(true);
    const response = await RejectVisaAllocation({
      request_uuid: candidateVisaDetails.uuid,
    });
    if (response && response.status === 200) {
      setIsLoading(false);
      window?.ChurnZero?.push([
        'trackEvent',
        'EVA-VISA - Allocation Action',
        'EVA-VISA - Allocation Action',
        1,
        {},
      ]);
      showSuccess(
        t(
          `${translationPath}request-${
            (userReducer
              && candidateVisaDetails.requested_from.uuid === userReducer.uuid
              && 'withdraw')
            || 'rejected'
          }-successfully`,
        ),
      );
      setForceToReloadCandidateVisas((item) => !item);
    } else
      showError(
        t(
          `${translationPath}request-${
            (userReducer
              && candidateVisaDetails.requested_from.uuid === userReducer.uuid
              && 'withdraw')
            || 'reject'
          }-failed`,
        ),
        response,
      );
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the uploaded attachments details
   */
  const getAttachmentsDetails = useCallback(
    async (attachments) => {
      const mediaResponse = await GetAllVisaMedias({
        media_uuid: attachments.map((item) => item.uuid),
      });
      if (mediaResponse && mediaResponse.status === 200)
        setAttachmentsDetails(mediaResponse.data.results);
      else showError(t('Shared:failed-to-get-saved-data'), mediaResponse);
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the call location from the child
   */
  const onCallLocationChanged = useCallback((newValue) => {
    setCallLocation(newValue);
  }, []);

  useEffect(() => {
    if (
      candidateVisaDetails
      && candidateVisaDetails.attachments
      && candidateVisaDetails.attachments.length > 0
    )
      getAttachmentsDetails(candidateVisaDetails.attachments);
  }, [candidateVisaDetails, getAttachmentsDetails]);

  useEffect(() => {
    getCandidateVisaDetails();
  }, [forceToReloadCandidateVisas, getCandidateVisaDetails]);

  useEffect(() => {
    getAllVisaStages();
  }, [getAllVisaStages]);

  useEffect(
    () => () => {
      if (confirmMoveTimesRef.current) clearTimeout(confirmMoveTimesRef.current);
    },
    [],
  );

  return (
    <div className="visa-status-tab tab-wrapper">
      <div className="visa-status-header">
        <div>
          <span className="header-text">{t(`${translationPath}visa-details`)}</span>
        </div>
        <div className="description-text mb-3">
          <span>{t(`${translationPath}visa-details-description`)}</span>
        </div>
        {!candidateVisaDetails && (
          <ButtonBase
            className="btns theme-solid mx-0"
            disabled={isLoading}
            onClick={() => {
              setCallLocation(
                VisaRequestsCallLocationsEnum.EvaRecVisaStatusNewRequest.key,
              );
              onIsOpenDialogsChanged('visaRequestManagement', true)();
            }}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}request-a-visa`)}</span>
          </ButtonBase>
        )}
        {candidateVisaDetails && (
          <div className="details-section-wrapper">
            <div className="details-body">
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}requested`)}
                </span>
                <span className="px-2">
                  {moment(candidateVisaDetails.created_at)
                    .locale(i18next.language)
                    .fromNow()}
                </span>
              </div>
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}requested-by`)}
                </span>
                <div className="d-inline-flex-v-center px-2">
                  <Avatar
                    style={{
                      backgroundColor: StringToColor(
                        getFullNameForRequestedFrom(
                          candidateVisaDetails.requested_from,
                        ),
                      ),
                    }}
                  >
                    {getFullNameForRequestedFrom(
                      candidateVisaDetails.requested_from,
                    )
                      && getFullNameForRequestedFrom(
                        candidateVisaDetails.requested_from,
                      )
                        .split(' ')
                        .map((word) => word[0])}
                  </Avatar>
                  <Typography className="px-2">
                    {getFullNameForRequestedFrom(
                      candidateVisaDetails.requested_from,
                    )}
                  </Typography>
                </div>
              </div>
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}status`)}
                </span>
                <span className="px-2">
                  {getVisaStatusByKey(candidateVisaDetails.status).value || 'N/A'}
                </span>
              </div>
              {/* more_info */}
              <div className="details-body-item">
                <span className="details-body-item-title">
                  {t(`${translationPath}visa-stage`)}
                </span>
                <div className="stage-tag-wrapper">
                  <span className="fas fa-circle" />
                  <span className="px-1">{candidateVisaDetails.stage.title}</span>
                </div>
              </div>
              {candidateVisaDetails.status
                === VisaRequestsStatusesEnum.RequestInfo.key && (
                <>
                  <div className="details-body-item">
                    <span className="details-body-item-title">
                      {t(`${translationPath}request-more-info-by`)}
                    </span>
                    <div className="d-inline-flex-v-center px-2">
                      <Avatar
                        style={{
                          backgroundColor: StringToColor(
                            getFullNameForRequestedFrom(
                              candidateVisaDetails.more_info_by,
                            ),
                          ),
                        }}
                      >
                        {getFullNameForRequestedFrom(
                          candidateVisaDetails.more_info_by,
                        )
                          && getFullNameForRequestedFrom(
                            candidateVisaDetails.more_info_by,
                          )
                            .split(' ')
                            .map((word) => word[0])}
                      </Avatar>
                      <Typography className="px-2">
                        {getFullNameForRequestedFrom(
                          candidateVisaDetails.more_info_by,
                        )}
                      </Typography>
                    </div>
                  </div>
                  <div className="details-body-item">
                    <span className="details-body-item-title">
                      {t(`${translationPath}more-information`)}
                    </span>
                    <span className="px-2">
                      {candidateVisaDetails.more_info || 'N/A'}
                    </span>
                  </div>
                </>
              )}
            </div>
            <div className="details-footer">
              {getIsAllowedPermissionV2({
                permissions,
                permissionId: EvaRecManageVisaPermissions.ViewVisaAllocation.key,
              }) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={() => {
                    setCallLocation(
                      VisaRequestsCallLocationsEnum.EvaRecVisaStatusViewDetails.key,
                    );
                    onIsOpenDialogsChanged(
                      'visaRequestManagement',
                      true,
                      candidateVisaDetails,
                    )();
                  }}
                >
                  <span>{t(`${translationPath}view-details`)}</span>
                  <span className="fas fa-external-link-alt mx-2" />
                </ButtonBase>
              )}
              {[
                VisaRequestsStatusesEnum.Pending.key,
                VisaRequestsStatusesEnum.RequestInfo.key,
              ].includes(candidateVisaDetails.status)
                && getIsAllowedPermissionV2({
                  permissions,
                  permissionId:
                    EvaRecManageVisaPermissions.RequestVisaAllocation.key,
                }) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={() => {
                    setCallLocation(
                      VisaRequestsCallLocationsEnum.EvaRecVisaStatusEdit.key,
                    );
                    onIsOpenDialogsChanged(
                      'visaRequestManagement',
                      true,
                      candidateVisaDetails,
                    )();
                  }}
                >
                  <span>{t(`${translationPath}edit`)}</span>
                  <span className={`${SystemActionsEnum.edit.icon} mx-2`} />
                </ButtonBase>
              )}
              {userReducer
                && candidateVisaDetails.requested_from.uuid !== userReducer.uuid
                && getIsAllowedPermissionV2({
                  permissions,
                  permissionId: ManageVisasPermissions.RequestMoreInformation.key,
                })
                && [VisaRequestsStatusesEnum.Pending.key].includes(
                  candidateVisaDetails.status,
                ) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={() => {
                    setCallLocation(
                      VisaRequestsCallLocationsEnum.EvaRecVisaStatusRequestMoreInfo
                        .key,
                    );
                    onIsOpenDialogsChanged('moreInfoManagement', true)();
                  }}
                >
                  <span>{t(`${translationPath}more-information`)}</span>
                  <span className="fas fa-info mx-2" />
                </ButtonBase>
              )}
              {[
                VisaRequestsStatusesEnum.Pending.key,
                VisaRequestsStatusesEnum.RequestInfo.key,
              ].includes(candidateVisaDetails.status)
                && getIsAllowedPermissionV2({
                  permissions,
                  permissionId: EvaRecManageVisaPermissions.CancelVisaAllocation.key,
                }) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={rejectOrWithdrawHandler}
                >
                  <span>
                    {t(
                      `${translationPath}${
                        (userReducer
                            && candidateVisaDetails.requested_from.uuid
                              === userReducer.uuid
                            && 'withdraw-request')
                          || 'reject'
                      }`,
                    )}
                  </span>
                </ButtonBase>
              )}
              {candidateVisaDetails.status
                === VisaRequestsStatusesEnum.Approved.key
                && getIsAllowedPermissionV2({
                  permissions,
                  permissionId: EvaRecManageVisaPermissions.ManageStatus.key,
                })
                && ![
                  VisaDefaultStagesEnum.Used.key,
                  VisaDefaultStagesEnum.Declined.key,
                ].includes(candidateVisaDetails.stage.value) && (
                <SharedAutocompleteControl
                  editValue={(selectedStage && selectedStage.uuid) || undefined}
                  placeholder="move-to"
                  title="move-to"
                  stateKey="move_to"
                  initValuesKey="uuid"
                  initValuesTitle="title"
                  isEntireObject
                  isPopoverTheme
                  isDisabled={
                    isLoading
                      || (candidateVisaDetails
                        && (candidateVisaDetails.stage.value
                          === VisaDefaultStagesEnum.Used.key
                          || candidateVisaDetails.stage.value
                            === VisaDefaultStagesEnum.Declined.key))
                  }
                  onValueChanged={onMoveToChanged}
                  initValues={stagesList}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              )}
              {[VisaRequestsStatusesEnum.Pending.key].includes(
                candidateVisaDetails.status,
              )
                && getIsAllowedPermissionV2({
                  permissions,
                  permissionId:
                    EvaRecManageVisaPermissions.ConfirmVisaAllocation.key,
                }) && (
                <ButtonBase
                  className="btns theme-outline miw-0 mb-2"
                  onClick={() => {
                    setCallLocation(
                      VisaRequestsCallLocationsEnum.EvaRecVisaStatusAllocate.key,
                    );
                    onIsOpenDialogsChanged(
                      'visaRequestManagement',
                      true,
                      candidateVisaDetails,
                    )();
                  }}
                >
                  <span>{t(`${translationPath}allocate`)}</span>
                </ButtonBase>
              )}
            </div>
          </div>
        )}
        {candidateVisaDetails && (
          <div className="mb-4">
            <div className="header-text mt-4">
              <span>{t(`${translationPath}attached`)}</span>
            </div>
            <div className="description-text mb-2">
              <span>{t(`${translationPath}attachments-description`)}</span>
            </div>
            <div className="mb-3">
              <span>{t(`${translationPath}attached-files`)}</span>
              <span className="px-1 c-gray-primary">
                <span>&bull;</span>
                <span className="px-1">{attachmentsDetails.length}</span>
              </span>
            </div>
            {attachmentsDetails.length === 0 && (
              <div className="description-text mb-3">
                <span>{t(`${translationPath}no-attached-files`)}</span>
              </div>
            )}
            <TablesComponent
              data={attachmentsDetails}
              isLoading={isLoading}
              headerData={tableColumns}
              pageIndex={filter.page - 1}
              pageSize={filter.limit}
              onPageIndexChanged={onPageIndexChanged}
              onPageSizeChanged={onPageSizeChanged}
              totalItems={attachmentsDetails.length}
              isDynamicDate
              uniqueKeyInput="uuid"
              wrapperClasses="px-0"
              getIsDisabledRow={(row) => row.can_delete === false}
              isWithTableActions
              isPopoverActions
              isWithoutTableHeader
              onActionClicked={onActionClicked}
              tableActions={[SystemActionsEnum.download]}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isWithoutBoxWrapper
              themeClasses="theme-transparent"
              tableActionsOptions={{
                getTooltipTitle: ({ row, actionEnum }) =>
                  (actionEnum.key === SystemActionsEnum.delete.key
                    && row.can_delete === false
                    && t('Shared:can-delete-description'))
                  || '',
                getDisabledAction: (item, rowIndex, actionEnum) =>
                  actionEnum.key === SystemActionsEnum.delete.key
                  && item.can_delete === false,
              }}
            />
          </div>
        )}
      </div>
      {isOpenDialogs.visaRequestManagement && (
        <VisaRequestsManagementDialog
          request_uuid={(activeItem && activeItem.request_uuid) || undefined}
          status={(activeItem && activeItem.status) || undefined}
          candidate_uuid={candidateDetail.identity.uuid}
          job_uuid={job_uuid}
          isOpen={isOpenDialogs.visaRequestManagement}
          first_name={candidateDetail.basic_information.first_name}
          last_name={candidateDetail.basic_information.last_name}
          position_name={candidateDetail.position}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            setForceToReloadCandidateVisas((item) => !item);
          }}
          isOpenChanged={onIsOpenDialogsChanged('visaRequestManagement', false)}
          callLocation={callLocation}
        />
      )}

      {isOpenDialogs.moreInfoManagement && (
        <VisaRequestMoreInfoManagementDialog
          request_uuid={
            (candidateVisaDetails && candidateVisaDetails.request_uuid) || undefined
          }
          isOpen={isOpenDialogs.moreInfoManagement}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            setForceToReloadCandidateVisas((item) => !item);
          }}
          isOpenChanged={onIsOpenDialogsChanged('moreInfoManagement', false)}
          callLocation={callLocation}
        />
      )}
      {isOpenDialogs.visaUsedConfirm && (
        <VisaUsedConfirmDialog
          candidateItem={candidateVisaDetails}
          stageTitle={selectedStage.title}
          isOpen={isOpenDialogs.visaUsedConfirm}
          onSave={({ border_number }) => {
            candidatesMoveHandler({ border_number });
          }}
          isLoading={isLoading}
          onIsLoadingChanged={(newValue) => {
            setIsLoading(newValue);
          }}
          isOpenChanged={() => {
            onUndoCandidateMoveHandler()();
            onIsOpenDialogsChanged('visaUsedConfirm', false)();
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath="VisaPipelinePage."
        />
      )}
      <div className="pt-3">
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef="visaStatusTabsRef"
          data={visaStatusTabsData}
          currentTab={activeTab}
          translationPath={translationPath}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
          }}
          parentTranslationPath={parentTranslationPath}
          dynamicComponentProps={{
            visaRequests,
            onCallLocationChanged,
            onIsOpenDialogsChanged,
            getFullNameForRequestedFrom,
            getVisaStatusByKey,
            candidate_uuid:
              (candidateDetail
                && candidateDetail.identity
                && candidateDetail.identity.uuid)
              || undefined,
            stage_uuid,
            pipeline_uuid,
            job_uuid,
            // onDetailsChanged,
            // onChangeTheActiveJobData,
            parentTranslationPath,
            translationPath,
          }}
        />
      </div>
    </div>
  );
};

VisaStatusTab.propTypes = {
  candidateDetail: PropTypes.shape({
    identity: PropTypes.shape({
      uuid: PropTypes.string,
    }),
    basic_information: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
    }),
    position: PropTypes.string,
  }).isRequired,
  // activeJobPipelineUUID: PropTypes.string.isRequired,
  stage_uuid: PropTypes.string.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
VisaStatusTab.defaultProps = {
  translationPath: 'VisaStatusTab.',
};
