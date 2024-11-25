/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import i18next from 'i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { CircularProgress } from '@mui/material';
import {
  getIsAllowedPermissionV2,
  GlobalDateFormat,
  showError,
  showSuccess,
} from '../../../../../helpers';
import {
  ApproveApplicantsTypesEnum,
  AssigneeTypesEnum,
  DynamicFormTypesEnum,
  MeetingFromFeaturesEnum,
  SystemActionsEnum,
} from '../../../../../enums';
import {
  DialogComponent,
  LoadableImageComponant,
  TabsComponent,
} from '../../../../../components';
import './ApproveApplicantDetails.Style.scss';
import ManIcon from '../../../../../assets/icons/business-man.png';
import { ApproveApplicantDetailsTabs } from '../../../shared';
import { evarecAPI } from '../../../../../api/evarec';
import {
  GetAllAppliedFor,
  GetAllApprovalSteps,
  GetAllSetupsUsers,
  getSetupsUsersById,
  SearchDBUpdateAssignedUser,
  UpdateApprovalStatus,
} from '../../../../../services';
import {
  ConfirmDeleteDialog,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../setups/shared';
import { ProfileSourceManagementDialog } from '../../../../../components/ProfileManagement/dialogs';
import { PreScreeningApprovalPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const ApproveApplicantsDetailsDialog = ({
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  setActiveItem,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [steps, setSteps] = useState([]);
  const selectedBranchReducer = useSelector(
    (reducerState) => reducerState?.selectedBranchReducer,
  );
  const appliedForBodyRef = useRef(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [isChangedStatus, setIsChangedStatus] = useState(false);
  const [isWithoutAppliedJobs, setIsWithoutAppliedJobs] = useState(false);
  const [isChangedAssigneeUser, setIsChangedAssigneeUser] = useState(false);
  const isInitLoading = useRef(true);
  const [newGlobalStatus, setNewGlobalStatus] = useState(null);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenSourceManagementDialog, setIsOpenSourceManagementDialog]
    = useState(false);
  const [assigneeTypes] = useState(
    Object.values(AssigneeTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [assignee, setAssignee] = useState({
    assigned_user_type: null,
    assigned_user_uuid: null,
  });

  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
  });
  const [appliedFor, setAppliedFor] = useState({
    results: [],
    totalCount: 0,
  });
  const [activeJobItem, setActiveJobItem] = useState(null);
  const [applicantProfile, setApplicantProfile] = useState({});
  const [activeTab, setActiveTab] = useState(activeItem?.activeTab || 0);
  const [approveApplicantDetailsTabsData] = useState(
    () => ApproveApplicantDetailsTabs,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get if the active step (can approve step)
   */
  const getActiveStep = useCallback(
    () => steps && steps.find((item) => item.can_approved),
    [steps],
  );

  /**
   * @param key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return current approve applicant type enum by key
   */
  const getApproveApplicantsTypeEnum = useMemo(
    () => (key) =>
      Object.values(ApproveApplicantsTypesEnum).find((item) => item.key === key),
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the active enums based on the allowed actions
   * (is last approval or not)
   */
  const getActiveApproveApplicantsType = useMemo(
    () => () =>
      (getActiveStep()
        && Object.entries(getActiveStep().actions).map((item) => ({
          key: item[0],
          value: item[1],
        })))
      || [],
    [getActiveStep],
  );

  const getCurrentActiveProfile = useMemo(
    () => () =>
      (selectedBranchReducer
        && activeItem.candidate_company.find(
          (item) => item.uuid === selectedBranchReducer.uuid,
        ))
      || (activeItem.candidate_company.length > 0 && activeItem.candidate_company[0]),
    [activeItem.candidate_company, selectedBranchReducer],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the applicant profile data
   */
  const getApplicantProfile = useCallback(
    (profile_uuid, company_uuid = undefined) => {
      evarecAPI
        .getCandidate(profile_uuid, company_uuid)
        .then((response) => {
          setApplicantProfile(response.data.results);
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    },
    [t],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to change the template management is open status change from child
   */
  const isOpenProfileSourceChanged = useCallback(() => {
    setIsOpenSourceManagementDialog(false);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return applied for (get all applied jobs)
   */
  const getAppliedFor = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllAppliedFor({
      pre_candidate_uuid: activeItem.uuid,
      ...filter,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      if (response.data.results?.data?.length > 0)
        setActiveJobItem(response.data.results.data[0]);
      else setIsWithoutAppliedJobs(true);
      setAppliedFor({
        results: response.data.results.data || [],
        totalCount: response.data.results?.data?.length,
      });
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [activeItem.uuid, filter, isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return all approval steps
   */
  const getAllApprovalSteps = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllApprovalSteps({
      pre_candidate_uuid: activeItem.uuid,
      category_code: activeItem.category_code,
    });
    setIsLoading(false);
    if (response && response.status === 200) setSteps(response.data.results.steps);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [activeItem.category_code, activeItem.uuid, isOpenChanged, t]);

  const onScrollHandler = useCallback(() => {
    if (
      (appliedForBodyRef.current.scrollHeight
        <= appliedForBodyRef.current.clientHeight
        || appliedForBodyRef.current.scrollTop
          + appliedForBodyRef.current.clientHeight
          >= appliedForBodyRef.current.firstChild.clientHeight - 5)
      && appliedFor.results?.length < appliedFor.totalCount
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [appliedFor.results?.length, appliedFor.totalCount, isLoading]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return tabs data after disable it or not
   */
  const getApprovalDetailsTabsData = useCallback(
    () =>
      approveApplicantDetailsTabsData.map((item, index) => {
        if (index === 0) item.disabled = !activeItem.category_code;
        else if (index === 1)
          item.disabled = !activeItem.category_code || steps?.length === 0;
        else if (index === 3)
          item.disabled
            = (!activeJobItem && !isWithoutAppliedJobs)
            || (isWithoutAppliedJobs && !activeItem.category_code);
        else if (index === 5) item.disabled = !activeItem.category_code;
        // else if (index === 6) item.disabled = !activeItem.category_code;
        // else item.disabled = !activeJobItem && isWithoutAppliedJobs;
        return item;
      }),
    [
      isWithoutAppliedJobs,
      activeItem.category_code,
      activeJobItem,
      approveApplicantDetailsTabsData,
      steps,
    ],
  );

  const changeActiveDetailsJobHandler = useCallback(
    (jobItem) => () => {
      setActiveJobItem(jobItem);
    },
    [],
  );

  const onEditProfileClicked = useCallback(() => {
    setIsEditProfile((item) => !item);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the user profile details if
   */
  const onProfileSaved = useCallback(
    (newProfileUUID) => {
      setIsEditProfile((item) => !item);
      getApplicantProfile(newProfileUUID, getCurrentActiveProfile()?.company_uuid);
    },
    [getCurrentActiveProfile, getApplicantProfile],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to save the new status
   */
  const saveStatusHandler = async () => {
    setIsLoading(true);
    const response = await UpdateApprovalStatus({
      pre_candidate_approval_step_uuid: getActiveStep() && getActiveStep().uuid,
      action: activeStatus,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      if (activeStatus === ApproveApplicantsTypesEnum.Approved.key)
        window?.ChurnZero?.push([
          'trackEvent',
          `Initial Approval`,
          `Initial Approval`,
          1,
          {},
        ]);
      setIsChangedStatus((item) => !item);
      if (response.data.results.status !== activeItem.status) {
        setNewGlobalStatus(response.data.results.status);
        if (setActiveItem)
          setActiveItem((items) => ({ ...items, status: activeStatus }));
      }
      showSuccess(t(`${translationPath}status-updated-successfully`));
    } else showError(t(`${translationPath}status-update-failed`), response);
  };

  const updateAssigneeHandler = useCallback(async () => {
    if (!applicantProfile || !applicantProfile.basic_information) return;
    setIsLoading(true);
    const response = await SearchDBUpdateAssignedUser({
      // candidate_uuid: activeItem.uuid,
      candidate_email: applicantProfile.basic_information.email,
      ...assignee,
    });
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(t('Shared:updated-successfully'));
      setIsChangedAssigneeUser(true);
    } else showError(t('Shared:failed-to-update'), response);
  }, [applicantProfile, assignee, t]);

  useEffect(() => {
    getAppliedFor();
  }, [getAppliedFor, filter]);

  useEffect(() => {
    setActiveStatus(activeItem.status);
  }, [activeItem.status]);

  useEffect(() => {
    if (
      activeItem.uuid
      && assignee.assigned_user_type
      && assignee.assigned_user_uuid
      && !isInitLoading.current
    ) {
      if (activeItem?.assigned_user_uuid !== assignee?.assigned_user_uuid)
        updateAssigneeHandler();
    } else if (isInitLoading.current) isInitLoading.current = false;
  }, [
    activeItem.assigned_user_uuid,
    activeItem.uuid,
    assignee.assigned_user_type,
    assignee.assigned_user_uuid,
    updateAssigneeHandler,
  ]);

  // this is to handle get applicantProfile on init
  useEffect(() => {
    if (
      activeItem.candidate_company
      && activeItem.candidate_company.length > 0
      && getCurrentActiveProfile()
    )
      getApplicantProfile(
        getCurrentActiveProfile().profile_candidate_uuid,
        getCurrentActiveProfile().company_uuid,
      );
    // this part will not enter but just to make sure to let the user see some data in the profile if the user profile not exists at all
    else
      setApplicantProfile({
        identity: {
          email: activeItem.email,
          reference_number: activeItem.reference_number,
        },
        basic_information: {
          email: activeItem.email,
          first_name: activeItem.name,
          last_name: '',
          gender: 'Not Specific',
        },
        created_at: activeItem.candidate_registration_date,
      });
  }, [
    activeItem.candidate_company,
    activeItem.candidate_registration_date,
    activeItem.email,
    activeItem.name,
    activeItem.reference_number,
    getApplicantProfile,
    getCurrentActiveProfile,
  ]);

  useEffect(() => {
    if (!activeItem.category_code) setActiveTab(2);
  }, [activeItem.category_code]);

  useEffect(() => {
    if (activeItem.category_code) getAllApprovalSteps();
  }, [activeItem.category_code, getAllApprovalSteps, isChangedStatus]);

  useEffect(() => {
    setAssignee({
      assigned_user_type: activeItem.assigned_user_type,
      assigned_user_uuid: activeItem.assigned_user_uuid,
    });
  }, [activeItem]);

  useEffect(() => {
    setIsEditProfile((item) => (item ? false : item));
  }, [activeTab]);

  const getStatusesArrayWithCheckCurrent = useMemo(
    () => () => {
      if (activeStatus && getActiveApproveApplicantsType().length === 0)
        return [
          {
            key: activeStatus,
            value: t(getApproveApplicantsTypeEnum(Number(activeStatus)).value),
          },
        ];
      else if (activeItem?.status)
        return getActiveApproveApplicantsType()
          .map(({ key }) => ({
            key: Number(key),
            value: t(getApproveApplicantsTypeEnum(Number(key)).value),
          }))
          .concat([
            {
              key: activeItem.status,
              value: t(
                getApproveApplicantsTypeEnum(Number(activeItem.status)).value,
              ),
            },
          ]);
      else return [];
    },
    [
      activeStatus,
      getActiveApproveApplicantsType,
      t,
      getApproveApplicantsTypeEnum,
      activeItem?.status,
    ],
  );

  return (
    <>
      <DialogComponent
        maxWidth="xl"
        isFixedHeight
        zIndex={1000}
        dialogTitle={
          <div className="approve-applicant-details-title-dialog-wrapper">
            <div className="title-contents-wrapper">
              <div className="title-details-wrapper">
                <div className="title-icon-wrapper">
                  <LoadableImageComponant
                    src={activeItem.image}
                    classes="card-image-wrapper"
                    alt={`${t(translationPath)}applicant-image`}
                    defaultImage={ManIcon}
                  />
                </div>
                <div className="title-contents-items-wrapper">
                  <div className="title-contents-item-wrapper">
                    <span className="header-text">
                      {(activeItem && activeItem.name) || 'N/A'}
                    </span>
                  </div>

                  {getApproveApplicantsTypeEnum(
                    newGlobalStatus || activeItem.status,
                  ) && (
                    <div className="title-contents-item-wrapper">
                      <span
                        className={
                          getApproveApplicantsTypeEnum(
                            newGlobalStatus || activeItem.status,
                          ).color
                        }
                      >
                        <span className="fas fa-circle" />
                        <span className="px-1">
                          {t(
                            `${
                              getApproveApplicantsTypeEnum(
                                newGlobalStatus || activeItem.status,
                              ).value
                            }`,
                          )}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="title-contents-item-wrapper">
                    <span>
                      <span>{t(`${translationPath}email`)}</span>
                      <span>:</span>
                      <span className="px-1">{activeItem.email || 'N/A'}</span>
                    </span>
                  </div>
                  {(applicantProfile?.reference_number
                    || applicantProfile?.identity?.reference_number) && (
                    <div className="title-contents-item-wrapper">
                      <span>
                        <span>
                          {t(`${translationPath}candidate-reference-number`)}
                        </span>
                        <span>:</span>
                        <span className="px-1">
                          {applicantProfile.reference_number
                            || applicantProfile.identity?.reference_number}
                        </span>
                      </span>
                    </div>
                  )}
                  {applicantProfile?.applicant_number && (
                    <div className="title-contents-item-wrapper">
                      <span>
                        <span>
                          {t(`${translationPath}application-reference-number`)}
                        </span>
                        <span>:</span>
                        <span className="px-1">
                          {applicantProfile.applicant_number}
                        </span>
                      </span>
                    </div>
                  )}
                  <div className="title-contents-item-wrapper">
                    <span>{t(`${translationPath}applied-via`)}</span>
                    <span>
                      <span className="portal-source-tag-wrapper">
                        <span className="px-1">
                          {applicantProfile?.basic_information?.source || 'N/A'}
                        </span>
                        <ButtonBase
                          className="btns-icon theme-transparent mx-1"
                          disabled={isLoading}
                          onClick={() => {
                            setIsOpenSourceManagementDialog(true);
                          }}
                        >
                          <span className={SystemActionsEnum.edit.icon} />
                        </ButtonBase>
                      </span>
                    </span>
                  </div>
                  {/* <div className="title-contents-item-wrapper"> */}
                  {/*  <span> */}
                  {/*    <span>{t(`${translationPath}applied-via-portal`)}</span> */}
                  {/*    <span className="px-1"> */}
                  {/*      {(activeItem */}
                  {/*        && activeItem.applied_at */}
                  {/*        && moment(activeItem.applied_at) */}
                  {/*          .locale(i18next.language) */}
                  {/*          .format(GlobalDateFormat)) */}
                  {/*        || 'N/A'} */}
                  {/*    </span> */}
                  {/*  </span> */}
                  {/* </div> */}
                </div>
              </div>
              <div className="d-inline-flex flex-wrap mt-3">
                <SharedAutocompleteControl
                  isHalfWidth
                  searchKey="search"
                  initValuesKey="key"
                  isDisabled={
                    isLoading
                    || !getIsAllowedPermissionV2({
                      permissionId: PreScreeningApprovalPermissions.AssignUser.key,
                      permissions,
                    })
                  }
                  initValues={assigneeTypes}
                  stateKey="assigned_user_type"
                  onValueChanged={({ value }) => {
                    setAssignee({
                      assigned_user_uuid: null,
                      assigned_user_type: value,
                    });
                  }}
                  title="assignee-type"
                  editValue={assignee.assigned_user_type}
                  placeholder="select-assignee-type"
                  parentTranslationPath={parentTranslationPath}
                />
                {assignee.assigned_user_type && (
                  <>
                    {assignee.assigned_user_type
                      === AssigneeTypesEnum.Employee.key && (
                      <SharedAPIAutocompleteControl
                        title="assignee"
                        isHalfWidth
                        placeholder={t('select-assignee')}
                        stateKey="assigned_user_uuid"
                        onValueChanged={({ value }) => {
                          setAssignee((items) => ({
                            ...items,
                            assigned_user_uuid: value,
                          }));
                        }}
                        isDisabled={
                          isLoading
                          || !getIsAllowedPermissionV2({
                            permissionId:
                              PreScreeningApprovalPermissions.AssignUser.key,
                            permissions,
                          })
                        }
                        idRef="assigned_user_uuid"
                        getOptionLabel={(option) =>
                          `${
                            option.first_name
                            && (option.first_name[i18next.language]
                              || option.first_name.en)
                          }${
                            option.last_name
                            && ` ${
                              option.last_name[i18next.language]
                              || option.last_name.en
                            }`
                          }${
                            (!option.has_access
                              && assignee.assigned_user_uuid !== option.uuid
                              && ` ${t('Shared:dont-have-permissions')}`)
                            || ''
                          }`
                        }
                        type={DynamicFormTypesEnum.select.key}
                        getDataAPI={GetAllSetupsUsers}
                        getItemByIdAPI={getSetupsUsersById}
                        parentTranslationPath={parentTranslationPath}
                        searchKey="search"
                        extraProps={{
                          committeeType: 'all',
                          ...(assignee.assigned_user_uuid && {
                            with_than: [assignee.assigned_user_uuid],
                          }),
                        }}
                        editValue={assignee.assigned_user_uuid}
                        getDisabledOptions={(option) => !option.has_access}
                      />
                    )}
                    {assignee.assigned_user_type === AssigneeTypesEnum.User.key && (
                      <SharedAPIAutocompleteControl
                        isHalfWidth
                        title="assignee"
                        stateKey="assigned_user_uuid"
                        placeholder="select-assignee"
                        isDisabled={
                          isLoading
                          || !getIsAllowedPermissionV2({
                            permissionId:
                              PreScreeningApprovalPermissions.AssignUser.key,
                            permissions,
                          })
                        }
                        onValueChanged={({ value }) => {
                          setAssignee((items) => ({
                            ...items,
                            assigned_user_uuid: value,
                          }));
                        }}
                        searchKey="search"
                        getDataAPI={GetAllSetupsUsers}
                        // getItemByIdAPI={getSetupsUsersById}
                        parentTranslationPath={parentTranslationPath}
                        getOptionLabel={(option) =>
                          `${
                            option.first_name
                            && (option.first_name[i18next.language]
                              || option.first_name.en)
                          }${
                            option.last_name
                            && ` ${
                              option.last_name[i18next.language]
                              || option.last_name.en
                            }`
                          }`
                        }
                        editValue={assignee.assigned_user_uuid}
                        extraProps={{
                          ...(assignee.assigned_user_uuid && {
                            with_than: [assignee.assigned_user_uuid],
                          }),
                        }}
                      />
                    )}
                  </>
                )}
              </div>
              <div className="title-autocomplete mt-3">
                <SharedAutocompleteControl
                  editValue={activeStatus}
                  title="status"
                  placeholder="select-status"
                  stateKey="status"
                  isDisabled={
                    !activeItem.category_code || !getActiveStep() || isLoading
                  }
                  onValueChanged={(newValue) => {
                    setActiveStatus(newValue.value);
                  }}
                  disableClearable
                  disabledOptions={(option) => option.key === activeItem?.status}
                  initValues={getStatusesArrayWithCheckCurrent()}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />

                <div className="d-inline-flex mb-3">
                  <ButtonBase
                    className="btns theme-solid"
                    disabled={
                      !activeItem.category_code
                      || !activeStatus
                      || !getActiveStep()
                      || isLoading
                      || activeStatus === activeItem?.status
                    }
                    onClick={() => setIsOpenConfirmDialog(true)}
                  >
                    <span>{t(`${translationPath}apply`)}</span>
                  </ButtonBase>
                </div>
              </div>
            </div>
          </div>
        }
        dialogContent={
          <div className="approve-applicant-details-content-dialog-wrapper">
            {activeTab > 0 && (
              <ButtonBase
                className="btns theme-solid navigation-btn"
                onClick={() =>
                  setActiveTab((item) => {
                    if (activeItem.category_code && item === 2 && !steps.length)
                      return 0;
                    if (
                      item === 5
                      && ((!activeJobItem && !isWithoutAppliedJobs)
                        || (isWithoutAppliedJobs && !activeItem.category_code))
                    )
                      return item - 2;
                    return item - 1;
                  })
                }
                disabled={
                  activeTab === 2 && !activeItem.category_code && !steps.length
                }
              >
                <span className="fas fa-chevron-left" />
              </ButtonBase>
            )}
            {approveApplicantDetailsTabsData.length - 1 > activeTab && (
              <ButtonBase
                className="btns theme-solid navigation-btn increment"
                onClick={() =>
                  setActiveTab((item) => {
                    if (item === 0 && !steps.length) return 2;
                    if (
                      item === 3
                      && ((!activeJobItem && !isWithoutAppliedJobs)
                        || (isWithoutAppliedJobs && !activeItem.category_code))
                    )
                      return item + 2;
                    return item + 1;
                  })
                }
                disabled={
                  (activeTab > 0 && !activeJobItem && !isWithoutAppliedJobs)
                  || (activeTab === 4 && !activeItem.category_code)
                  || (activeTab === 5 && !activeItem.category_code)
                  || (activeTab === 3
                    && ((!activeJobItem && !isWithoutAppliedJobs)
                      || (isWithoutAppliedJobs && !activeItem.category_code)))
                }
              >
                <span className="fas fa-chevron-right" />
              </ButtonBase>
            )}
            <TabsComponent
              data={getApprovalDetailsTabsData()}
              currentTab={activeTab}
              labelInput="label"
              idRef="ApproveApplicantDetailsTabsRef"
              isPrimary
              orientation="vertical"
              iconInput="icon"
              tabsContentRefInput="bodyRef"
              themeClasses="theme-solid"
              onTabChanged={(event, currentTab) => {
                setActiveTab(currentTab);
              }}
              // isDisabled={isLoading}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              dynamicComponentProps={{
                profile: applicantProfile,
                // jobUuid: activeItem.job_uuid,
                profile_uuid:
                  (activeJobItem && activeJobItem.profile_uuid)
                  || (isWithoutAppliedJobs
                    && activeItem.candidate_company
                    && activeItem.candidate_company.length > 0
                    && activeItem.candidate_company[0].profile_candidate_uuid),
                ...(!isWithoutAppliedJobs && { type: 'ats' }),
                ...(activeJobItem
                  && activeJobItem.job_uuid && {
                  job_uuid: activeJobItem.job_uuid,
                }),
                ...(activeJobItem
                  && activeJobItem.uuid && {
                  job_candidate_uuid: activeJobItem.uuid,
                }),
                ...(isWithoutAppliedJobs
                  && activeTab === 4 && {
                  type: 'initial_approvals',
                  job_uuid: activeItem.candidate_approval_uuid || activeItem.uuid,
                  job_candidate_uuid: activeItem.candidate_company?.[0].user_uuid,
                }),
                from_feature: MeetingFromFeaturesEnum.InitialApprovals.key,
                steps,
                activeStep: getActiveStep(),
                // uuid: activeItem.job_uuid,
                // pipeline_uuid: activeItem.pipeline_uuid,
                // selectedCandidate: activeItem.candidate_uuid,
                pre_candidate_uuid: activeItem.uuid,
                pre_candidate_approval_uuid: activeItem.candidate_approval_uuid,
                category_code: activeItem.category_code,
                candidate_uuid: activeJobItem && activeJobItem.candidate_uuid,
                approval_uuid: activeItem.candidate_approval_uuid,
                isEditProfile,
                onEditProfileClicked,
                onProfileSaved,
                // activeJob:
                // candidate: activeItem.job_candidate_uuid,
                // job_candidate_uuid: activeItem.job_candidate_uuid,
                // state,
                // filter,
                // filterBy,
                // onFilterByChanged,
                // onFilterChanged,
                // onStateChanged,
                // isLoading,
                // onIsLoadingChanged,
                parentTranslationPath,
                candidate: applicantProfile,
                source: 'initial-approval',
                candidate_user_uuid: applicantProfile?.identity?.uuid,
                applied_jobs_list: appliedFor.results,
              }}
            />
            <div className="applied-for-wrapper">
              <div className="applied-for-content-wrapper">
                <div className="applied-for-header">
                  <span className="header-text">
                    {t(`${translationPath}applied-for`)}
                  </span>
                </div>
                <div
                  className="applied-for-body"
                  onScroll={onScrollHandler}
                  ref={appliedForBodyRef}
                >
                  {appliedFor
                    && appliedFor.results.map((item, index) => (
                      <ButtonBase
                        className={`applied-for-item-wrapper ${
                          (activeJobItem
                            && activeJobItem.job_uuid === item.job_uuid
                            && ' is-active')
                          || ''
                        }`}
                        key={`appliedJobKey${index + 1}`}
                        onClick={() => {
                          changeActiveDetailsJobHandler(item);
                          window.open(
                            `/recruiter/job/manage/pipeline/${item.job_uuid}?company_uuid=${item.company_uuid}`,
                            '_self',
                          );
                        }}
                      >
                        <div className="applied-for-section">
                          <div className="header-text">
                            <span>{item.title}</span>
                          </div>
                          {item.applicant_number && (
                            <div className="px-1 t-align-initial">{`${t(
                              'application-reference-number',
                            )}: ${item.applicant_number}`}</div>
                          )}
                          <div>
                            <span>
                              {moment()
                                .locale(i18next.language)
                                .format(GlobalDateFormat)}
                            </span>
                          </div>
                        </div>
                        <div className="applied-for-section">
                          <div
                            className={`ai-matching-progress ${
                              (item.score >= 67 && 'high')
                              || (item.score < 67 && item.score >= 34 && 'medium')
                              || (item.score < 34 && 'low')
                            }`}
                          >
                            <CircularProgress
                              variant="determinate"
                              size={75}
                              value={item.score}
                            />
                          </div>
                          <div
                            className={`ai-matching-progress-value ${
                              (item.score >= 67 && 'high')
                              || (item.score < 67 && item.score >= 34 && 'medium')
                              || (item.score < 34 && 'low')
                            }`}
                          >
                            {`${Math.round(item.score)}%`}
                          </div>
                        </div>
                      </ButtonBase>
                    ))}
                </div>
              </div>
            </div>
            {isOpenConfirmDialog && (
              <ConfirmDeleteDialog
                isConfirmOnly
                onSave={saveStatusHandler}
                saveType="button"
                isOpenChanged={() => {
                  setIsOpenConfirmDialog(false);
                }}
                descriptionMessage="status-change-confirm-description"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isOpen={isOpenConfirmDialog}
              />
            )}
          </div>
        }
        wrapperClasses="approve-applicant-details-dialog-wrapper"
        isOpen={isOpen}
        onCloseClicked={() =>
          isOpenChanged(newGlobalStatus || isChangedAssigneeUser)
        }
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      <ProfileSourceManagementDialog
        isOpen={isOpenSourceManagementDialog}
        candidate_uuid={
          applicantProfile
          && applicantProfile.identity
          && applicantProfile.identity.uuid
        }
        company_uuid={
          applicantProfile
          && applicantProfile.identity
          && applicantProfile.identity.company_uuid
        }
        source_type={
          applicantProfile
          && applicantProfile.basic_information
          && applicantProfile.basic_information.source_type
        }
        source_uuid={
          applicantProfile
          && applicantProfile.basic_information
          && applicantProfile.basic_information.source_uuid
        }
        onSave={() => {
          onProfileSaved();
        }}
        isOpenChanged={isOpenProfileSourceChanged}
        job_uuid={activeJobItem?.job_uuid}
      />
    </>
  );
};

ApproveApplicantsDetailsDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string, // this is pre_candidate_uuid
    activeTab: PropTypes.number,
    reference_number: PropTypes.number,
    candidate_registration_date: PropTypes.string,
    // pipeline_uuid: PropTypes.string,
    candidate_approval_uuid: PropTypes.string,
    candidate_company: PropTypes.instanceOf(Array),
    category_code: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    assigned_user_type: PropTypes.number,
    assigned_user_uuid: PropTypes.string,
    image: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
    status: PropTypes.oneOf(
      Object.values(ApproveApplicantsTypesEnum).map((item) => item.key),
    ),
    applied_at: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  setActiveItem: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

ApproveApplicantsDetailsDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'ApproveApplicantsDetailsDialog.',
  activeItem: undefined,
};
