import React, { useMemo, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import i18next from 'i18next';
import Avatar from '@mui/material/Avatar';
import moment from 'moment';
import { ButtonBase } from '@mui/material';
import {
  TaskResponsibilityUserTypesEnum,
  TaskReminderTypesEnum,
  TaskReminderFrequencyEnum,
  TaskCompleteStatusEnum,
  NavigationSourcesEnum,
  TaskManagementTypesEnum,
  FormsStatusesEnum,
  DynamicFormTypesEnum,
} from '../../../../../../enums';
import { LoaderComponent } from '../../../../../Loader/Loader.Component';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../pages/setups/shared';
import {
  GetAllSetupsTaskStatuses,
  UpdateTask,
  UpdateTaskStatus,
} from '../../../../../../services';
import DatePickerComponent from '../../../../../Datepicker/DatePicker.Component';
import {
  getIsAllowedPermissionV2,
  GlobalDateFormat,
  GlobalSecondaryDateFormat,
  showError,
  showSuccess,
} from '../../../../../../helpers';
import PopoverComponent from '../../../../../Popover/Popover.Component';
import { numbersExpression } from '../../../../../../utils';
import { TaskTriggerTypeComponent } from '../components/TaskTriggerType.Component';
import { EvaRecTaskManagementPermissions } from '../../../../../../permissions';
import { useSelector } from 'react-redux';

export const TaskDrawerDetailsTab = ({
  activeItem,
  isLoading,
  setIsLoading,
  parentTranslationPath,
  isFullScreen,
  createTaskModeOn,
  setLocalTaskData,
  errors,
  isSubmitted,
  editModeOn,
  isDrawerLoading,
  isPipelineTask,
  triggerTaskTypes,
  setFilter,
  setReload,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [taskResponsibilityUserTypes] = useState(() =>
    Object.values(TaskResponsibilityUserTypesEnum)
      .filter((it) =>
        isPipelineTask
          ? TaskResponsibilityUserTypesEnum.Candidate.key !== it.key
          : TaskResponsibilityUserTypesEnum.Candidate.key !== it.key
            && TaskResponsibilityUserTypesEnum.Requester.key !== it.key
            && TaskResponsibilityUserTypesEnum.JobCreator.key !== it.key,
      )
      .map((item) => ({
        ...item,
        value: t(item.value),
      })),
  );
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const isEditStatusOnInit = useRef({
    view: false,
    oldValue: null,
  });
  const [isEditStatusOn, setIsEditStatusOn] = useState(isEditStatusOnInit.current);
  const [isViewEdit, setIsViewEdit] = useState(false);
  const [editFields, setEditFields] = useState({});

  const GetReminderType = useMemo(
    () => (type) =>
      t(
        Object.values(TaskReminderTypesEnum).find(
          (item) => item.key.sort().toString() === type.sort().toString(),
        )?.value || '',
      ),
    [t],
  );
  const GetReminderFrequency = useMemo(
    () => (frequency) =>
      t(
        Object.values(TaskReminderFrequencyEnum).find(
          (item) => item.key === frequency,
        )?.value || '',
      ),
    [t],
  );

  const UpdateTaskStatusHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await UpdateTaskStatus({
      list: [
        {
          uuid: activeItem.uuid,
          status_uuid: activeItem.status.uuid,
        },
      ],
    });
    setIsLoading(false);
    if (response?.status === 202) {
      showSuccess(t('task-status-updated-successfully'));
      setReload((items) => ({ ...items }));
      setFilter((items) => ({
        ...items,
      }));
      setIsEditStatusOn(isEditStatusOnInit.current);
    } else showError(t('failed-to-update-task-status'), response);
  }, [activeItem, setReload, setFilter, t, setIsLoading]);

  const updateFieldHandler = useCallback(
    async (body) => {
      setIsLoading(true);
      const response = await UpdateTask({
        uuid: activeItem.uuid,
        ...body,
      });
      setIsLoading(false);
      if (response?.status === 202) {
        showSuccess(t('task-updated-successfully'));
        setReload((items) => ({ ...items }));
        setFilter((items) => ({
          ...items,
        }));
        setEditFields({});
      } else showError(t('failed-to-update-task'), response);
    },
    [activeItem, setReload, setFilter, t, setIsLoading],
  );

  const checkEditableStatus = useCallback(
    (feildName) =>
      (activeItem.table_fields || []).find((item) => item?.field === feildName)
        ?.is_editable || false,
    [activeItem.table_fields],
  );

  const GetIsEditableHandler = useCallback(
    (status) =>
      Object.values(FormsStatusesEnum).find((item) => item.key === status) || {},
    [],
  );

  const GetAssigneeOption = useCallback(
    (option) => {
      switch (activeItem.responsibility_type) {
      case TaskResponsibilityUserTypesEnum.Candidate.key:
        return `${option.first_name || ''} ${option.last_name || ''}`;
      case TaskResponsibilityUserTypesEnum.Committee.key:
        return option.name && (option.name[i18next.language] || option.name.en);
      default:
        return `${
          option.first_name
            && (option.first_name[i18next.language] || option.first_name.en)
        }${
          option.last_name
            && ` ${option.last_name[i18next.language] || option.last_name.en}`
        }`;
      }
    },
    [activeItem.responsibility_type],
  );

  return (
    <div className="job-post-details-tab-wrapper tab-content-wrapper p-3">
      {isDrawerLoading && (
        <LoaderComponent
          isLoading={isDrawerLoading}
          isSkeleton
          wrapperClasses="table-loader-wrapper"
          skeletonItems={[
            { varient: 'rectangular', className: 'table-loader-row md' },
          ]}
          numberOfRepeat={15}
        />
      )}
      {activeItem && (
        <>
          <Table
            sx={{
              td: { border: 0 },
              visibility: isDrawerLoading ? 'hidden' : '',
            }}
          >
            <TableBody>
              {[
                {
                  key: 1,
                  name: 'eva-rec-candidate-actions',
                  component: () => (
                    <TaskTriggerTypeComponent
                      parentTranslationPath={parentTranslationPath}
                      createTaskModeOn={createTaskModeOn}
                      editModeOn={editModeOn}
                      isFullScreen={isFullScreen}
                      activeItem={activeItem}
                      setLocalTaskData={setLocalTaskData}
                      errors={errors}
                      isSubmitted={isSubmitted}
                      triggerTaskTypes={triggerTaskTypes}
                    />
                  ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden: false,
                },
                {
                  key: 12,
                  name: 'trigger-link',
                  component: () => (
                    <a
                      target="_blank"
                      href={
                        activeItem.redirect_url
                        && `${activeItem.redirect_url}&slug=${activeItem.slug}&source=${
                          (activeItem.type.key
                            === TaskManagementTypesEnum.FORM.key
                            && NavigationSourcesEnum.CandidateFormsToFormBuilder.key)
                          || (activeItem.type.key
                            === TaskManagementTypesEnum.OFFER.key
                            && NavigationSourcesEnum.FromOfferToFormBuilder.key)
                        }${
                          /**
                           * Cases handled in redirection:
                           * If form is non-shareable (is_shareable === false) then we send is_view false to make the form editable if the status doesn't explicitly say that the form should be disabled or enabled
                           * If form is non-shareable (is_shareable === false) then we send is_view false if isEditableForm is true and vice versa
                           * If form is shareable then send is_view true to make form disabled if status is send or completed.
                           **/
                          activeItem.additional_data?.is_shareable === false
                            ? `&is_view=${
                              typeof GetIsEditableHandler(
                                activeItem.additional_data.status,
                              )?.isEditableForm === 'boolean'
                                ? !GetIsEditableHandler(
                                  activeItem.additional_data.status,
                                )?.isEditableForm
                                : 'false'
                            }`
                            : `${
                              activeItem.additional_data.status
                                  === FormsStatusesEnum.Sent.key
                                || activeItem.additional_data.status
                                  === FormsStatusesEnum.Completed.key
                                ? '&is_view=true'
                                : ''
                            }`
                        }`
                      }
                      rel="noreferrer"
                      style={{
                        textDecoration: 'underline',
                        color: 'blue',
                      }}
                    >
                      {t('click-here')}
                    </a>
                  ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    activeItem.mark_as_completed
                      === TaskCompleteStatusEnum.COMPLETED.key
                    || !activeItem.redirect_url
                    || createTaskModeOn
                    || editModeOn,
                },
                {
                  key: 2,
                  name: 'status',
                  component: () =>
                    createTaskModeOn || editModeOn || isEditStatusOn.view ? (
                      <div className="d-flex-v-center-h-between">
                        <SharedAPIAutocompleteControl
                          isEntireObject
                          disableClearable
                          isFullWidth={!isFullScreen}
                          isQuarterWidth={isFullScreen}
                          searchKey="search"
                          stateKey="status"
                          placeholder="select-status"
                          getDataAPI={GetAllSetupsTaskStatuses}
                          editValue={activeItem.status?.uuid || ''}
                          getOptionLabel={(option) =>
                            (option.name
                              && (option.name[i18next.language]
                                || option.name.en
                                || ''))
                            || ''
                          }
                          onValueChanged={(e) => {
                            setLocalTaskData((items) => ({
                              ...items,
                              status: e.value || {},
                            }));
                          }}
                          controlWrapperClasses="mb-0 my-2"
                          parentTranslationPath={parentTranslationPath}
                          extraProps={{
                            ...(activeItem.status?.uuid && {
                              with_than: [activeItem.status.uuid],
                            }),
                            status: true,
                          }}
                          inputClasses="small-size"
                          errors={errors}
                          isSubmitted={isSubmitted}
                          errorPath="status.uuid"
                        />
                        {!createTaskModeOn && !editModeOn && (
                          <div className="d-inline-flex-center">
                            <ButtonBase
                              className="btns btns-icon theme-transparent mx-2"
                              onClick={() =>
                                setIsEditStatusOn(isEditStatusOnInit.current)
                              }
                            >
                              <span className="fas fa-times" />
                            </ButtonBase>
                            <ButtonBase
                              className="btns btns-icon theme-transparent  mx-2"
                              onClick={() => UpdateTaskStatusHandler()}
                              disabled={!activeItem?.status?.uuid}
                            >
                              <span className="fas fa-check" />
                            </ButtonBase>
                          </div>
                        )}
                      </div>
                    ) : (
                      activeItem.status && (
                        <div className="d-flex-v-center-h-between">
                          <div
                            className="bg-gray-lighter px-2"
                            style={{ borderRadius: '33px', width: 'fit-content' }}
                          >
                            <span
                              className="fas fa-circle fa-xs c-gray-secondary mx-2"
                              style={{ fontSize: '8px' }}
                            />{' '}
                            <span className="mr-1">
                              {activeItem.status?.name
                                && (activeItem.status.name[i18next.language]
                                  || activeItem.status.name.en
                                  || '')}
                            </span>
                          </div>
                          <div
                            style={{
                              ...(isViewEdit !== 'status' && { display: 'none' }),
                            }}
                          >
                            <ButtonBase
                              className="btns btns-icon theme-transparent mx-2"
                              onClick={() =>
                                setIsEditStatusOn({
                                  view: true,
                                  oldValue: activeItem.status,
                                })
                              }
                              disabled={
                                !getIsAllowedPermissionV2({
                                  permissionId:
                                    EvaRecTaskManagementPermissions.UpdateTaskStatus
                                      .key,
                                  permissions: permissionsReducer,
                                })
                                || activeItem.mark_as_completed
                                  === TaskCompleteStatusEnum.COMPLETED.key
                              }
                            >
                              <span className="fas fa-edit" />
                            </ButtonBase>
                          </div>
                        </div>
                      )
                    ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden: false,
                },
                {
                  key: 3,
                  name: 'created-by',
                  component: () =>
                    activeItem.creator ? (
                      <div className="d-flex-v-center">
                        <Avatar
                          sx={{
                            width: '24px!important',
                            height: '24px!important',
                          }}
                        />
                        <span className="mx-2">
                          {`${
                            activeItem.creator.first_name?.[i18next.language]
                            || activeItem.creator.first_name?.en
                            || ''
                          } ${
                            activeItem.creator.last_name?.[i18next.language]
                            || activeItem.creator.last_name?.en
                            || ''
                          }`}
                        </span>
                      </div>
                    ) : null,
                  label: true,
                  verticalAlign: 'center',
                  isHidden: createTaskModeOn,
                },
                {
                  key: 4,
                  name: 'candidate-name',
                  component: () =>
                    activeItem.relation ? (
                      <div className="d-flex-v-center">
                        <Avatar
                          sx={{
                            width: '24px!important',
                            height: '24px!important',
                          }}
                        />
                        <span className="mx-2">
                          {`${activeItem.relation.user?.first_name || ''} ${
                            activeItem.relation.user?.last_name || ''
                          }`}
                        </span>
                      </div>
                    ) : null,
                  label: true,
                  verticalAlign: 'center',
                  isHidden: !activeItem.relation?.user_uuid,
                },
                {
                  key: 'applicant_number',
                  name: 'applicant-number',
                  component: () =>
                    activeItem?.extra_data?.applicant_number ? (
                      <div className="d-flex-v-center">
                        {activeItem.extra_data.applicant_number}
                      </div>
                    ) : null,
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    createTaskModeOn
                    || editModeOn
                    || !activeItem.extra_data?.applicant_number,
                },
                {
                  key: 'reference_number',
                  name: 'reference-number',
                  component: () =>
                    activeItem?.extra_data?.reference_number ? (
                      <div className="d-flex-v-center">
                        {activeItem.extra_data.reference_number}
                      </div>
                    ) : null,
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    createTaskModeOn
                    || editModeOn
                    || !activeItem.extra_data?.reference_number,
                },
                {
                  key: 'position_title',
                  name: 'position-title',
                  component: () =>
                    activeItem?.extra_data?.position_title ? (
                      <div className="d-flex-v-center">
                        {activeItem.extra_data.position_title}
                      </div>
                    ) : null,
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    createTaskModeOn
                    || editModeOn
                    || !activeItem.extra_data?.position_title,
                },
                {
                  key: 5,
                  name: 'description',
                  component: () => (
                    <div
                      className="w-100 p-2"
                      style={{
                        border: '1px solid rgba(36, 37, 51, 0.06)',
                        borderRadius: '4px',
                      }}
                    >
                      {createTaskModeOn || editModeOn ? (
                        <SharedInputControl
                          isFullWidth
                          stateKey="description"
                          placeholder="write-description"
                          errors={errors}
                          isSubmitted={isSubmitted}
                          errorPath="description"
                          editValue={activeItem.description}
                          isDisabled={isLoading}
                          onValueChanged={(e) =>
                            setLocalTaskData((items) => ({
                              ...items,
                              description: e.value,
                            }))
                          }
                          parentTranslationPath={parentTranslationPath}
                          themeClass="theme-transparent"
                          textFieldWrapperClasses="w-100 px-3 pt-3"
                          fieldClasses="w-100"
                          rows={3}
                          multiline
                        />
                      ) : (
                        <span style={{ whiteSpace: 'pre-wrap' }}>
                          {activeItem.description}
                        </span>
                      )}
                    </div>
                  ),
                  label: false,
                  isHidden: !createTaskModeOn && !activeItem.description,
                },
                {
                  key: 6,
                  name: 'assignee-type',
                  component: () =>
                    createTaskModeOn
                    || editModeOn
                    || editFields?.['assignee-type'] ? (
                        <SharedAutocompleteControl
                          disableClearable
                          isFullWidth={!isFullScreen}
                          isQuarterWidth={isFullScreen}
                          errors={errors}
                          stateKey="responsibility_type"
                          searchKey="search"
                          initValuesKey="key"
                          editValue={activeItem.responsibility_type}
                          isDisabled={isLoading}
                          initValuesTitle="value"
                          isSubmitted={isSubmitted}
                          errorPath="responsibility_type"
                          placeholder="select-assignee-type"
                          onValueChanged={(e) => {
                            setLocalTaskData((items) => ({
                              ...items,
                              responsibility_type: e.value,
                              responsibility: null,
                              responsibility_uuid: null,
                            }));
                          }}
                          initValues={taskResponsibilityUserTypes}
                          parentTranslationPath={parentTranslationPath}
                          sharedClassesWrapper="mb-0 my-2"
                          inputClasses="small-size"
                        />
                      ) : (
                        <div className="d-flex-v-center-h-between">
                          <div className="d-inline-flex-v-center">
                            {activeItem.responsibility_type
                            && t(
                              Object.values(TaskResponsibilityUserTypesEnum).find(
                                (item) =>
                                  item.key === activeItem.responsibility_type,
                              ).value || '',
                            )}
                          </div>
                          <div
                            style={{
                              ...(isViewEdit !== 'assignee-type' && {
                                display: 'none',
                              }),
                            }}
                          >
                            <ButtonBase
                              className="btns btns-icon theme-transparent mx-2"
                              onClick={() =>
                                setEditFields({
                                  assigned: activeItem.responsibility,
                                  'assignee-type': activeItem.responsibility_type,
                                })
                              }
                              disabled={
                                !getIsAllowedPermissionV2({
                                  permissionId:
                                  EvaRecTaskManagementPermissions.UpdateTask.key,
                                  permissions: permissionsReducer,
                                })
                              || isLoading
                              || !checkEditableStatus('responsibility_type')
                              }
                            >
                              <span className="fas fa-edit" />
                            </ButtonBase>
                          </div>
                        </div>
                      ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden: false,
                },
                {
                  key: 7,
                  name: 'assigned',
                  component: () =>
                    createTaskModeOn
                    || editModeOn
                    || editFields?.assigned
                    || editFields?.['assignee-type'] ? (
                        <div className="d-flex-v-center-h-between">
                          {taskResponsibilityUserTypes.find(
                            (it) => it.key === activeItem.responsibility_type,
                          )?.api && (
                            <SharedAPIAutocompleteControl
                              isEntireObject
                              isFullWidth={!isFullScreen}
                              isQuarterWidth={isFullScreen}
                              searchKey="search"
                              stateKey="responsibility"
                              placeholder="select-assignee"
                              getDataAPI={
                                taskResponsibilityUserTypes.find(
                                  (it) => it.key === activeItem.responsibility_type,
                                )?.api
                              }
                              editValue={
                                activeItem.responsibility?.map((it) => it.uuid) || []
                              }
                              getOptionLabel={GetAssigneeOption}
                              onValueChanged={(e) => {
                                setLocalTaskData((items) => ({
                                  ...items,
                                  responsibility: e.value,
                                  responsibility_type: activeItem.responsibility_type,
                                }));
                              }}
                              controlWrapperClasses="mb-0 my-2"
                              parentTranslationPath={parentTranslationPath}
                              extraProps={{
                                isDropdown: true,
                                all_employee: 1,
                                ...(activeItem.responsibility?.length > 0 && {
                                  with_than:
                                  activeItem.responsibility?.map((it) => it.uuid)
                                  || [],
                                }),
                                ...(activeItem.responsibility_type
                                === TaskResponsibilityUserTypesEnum.Committee.key && {
                                  committee_type: 'all',
                                }),
                              }}
                              inputClasses="small-size"
                              inputStartAdornment={
                                <div className="m-2">
                                  <Avatar
                                    sx={{
                                      width: '24px!important',
                                      height: '24px!important',
                                    }}
                                  />
                                </div>
                              }
                              errors={errors}
                              isSubmitted={isSubmitted}
                              errorPath="responsibility"
                              type={DynamicFormTypesEnum.array.key}
                              max={
                                taskResponsibilityUserTypes.find(
                                  (it) => it.key === activeItem.responsibility_type,
                                )?.is_multiple
                                  ? undefined
                                  : 1
                              }
                            />
                          )}
                          {!createTaskModeOn && !editModeOn && (
                            <div className="d-inline-flex-center">
                              <ButtonBase
                                className="btns btns-icon theme-transparent mx-2"
                                onClick={() => {
                                  setEditFields({});
                                  setLocalTaskData((items) => ({
                                    ...items,
                                    responsibility: editFields.assigned,
                                    responsibility_type:
                                    editFields?.['assignee-type']
                                    || activeItem.responsibility_type,
                                  }));
                                }}
                                disabled={isLoading}
                              >
                                <span className="fas fa-times" />
                              </ButtonBase>
                              <ButtonBase
                                className="btns btns-icon theme-transparent  mx-2"
                                onClick={() =>
                                  updateFieldHandler({
                                    responsibility_uuid:
                                    activeItem.responsibility?.map(
                                      (it) => it?.user_uuid || it?.uuid,
                                    ),
                                    responsibility_type:
                                    activeItem.responsibility_type,
                                  })
                                }
                                disabled={
                                  !(activeItem?.responsibility?.length > 0)
                                || isLoading
                                }
                              >
                                <span className="fas fa-check" />
                              </ButtonBase>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="d-flex-v-center-h-between">
                          <div className="d-inline-flex-v-center">
                            {(activeItem.responsibility
                            && (activeItem.responsibility_type
                            === TaskResponsibilityUserTypesEnum.Candidate.key
                              ? activeItem.responsibility.user
                                ?.map((it) => GetAssigneeOption(it))
                                ?.join(', ') || ''
                              : activeItem.responsibility?.map((it) =>
                                GetAssigneeOption(it),
                              )
                            )?.join(', '))
                            || ''}
                          </div>
                          <div
                            style={{
                              ...(isViewEdit !== 'assigned' && {
                                display: 'none',
                              }),
                            }}
                          >
                            <ButtonBase
                              className="btns btns-icon theme-transparent mx-2"
                              onClick={() =>
                                setEditFields({
                                  assigned: activeItem.responsibility,
                                })
                              }
                              disabled={
                                !getIsAllowedPermissionV2({
                                  permissionId:
                                  EvaRecTaskManagementPermissions.UpdateTask.key,
                                  permissions: permissionsReducer,
                                })
                              || isLoading
                              || !checkEditableStatus('responsibility_uuid')
                              }
                            >
                              <span className="fas fa-edit" />
                            </ButtonBase>
                          </div>
                        </div>
                      ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    activeItem.responsibility_type
                      === TaskResponsibilityUserTypesEnum.Requester.key
                    || activeItem.responsibility_type
                      === TaskResponsibilityUserTypesEnum.JobCreator.key,
                },
                {
                  key: 8,
                  name: 'duration',
                  component: () => (
                    <div className="my-2">
                      {createTaskModeOn || editModeOn ? (
                        <div>
                          <SharedInputControl
                            isFullWidth
                            stateKey="duration"
                            placeholder="write-duration"
                            errors={errors}
                            isSubmitted={isSubmitted}
                            errorPath="duration"
                            editValue={activeItem.duration}
                            isDisabled={isLoading}
                            onValueChanged={(e) =>
                              setLocalTaskData((items) => ({
                                ...items,
                                duration: e.value,
                              }))
                            }
                            parentTranslationPath={parentTranslationPath}
                            fieldClasses="w-100"
                            type="number"
                            pattern={numbersExpression}
                          />
                        </div>
                      ) : (
                        activeItem.duration
                      )}
                    </div>
                  ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden: !isPipelineTask || (!createTaskModeOn && !editModeOn),
                },
                {
                  key: 9,
                  name: 'start-date',
                  component: () => (
                    <div className="my-2">
                      {createTaskModeOn || editModeOn ? (
                        <DatePickerComponent
                          isFullWidth={!isFullScreen}
                          isQuarterWidth={isFullScreen}
                          inputPlaceholder={`${t('Shared:eg')} ${moment()
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}`}
                          value={activeItem.start_date || ''}
                          errors={errors}
                          isSubmitted={isSubmitted}
                          displayFormat={GlobalDateFormat}
                          disableMaskedInput
                          errorPath="start_date"
                          stateKey="start_date"
                          maxDate={
                            activeItem.due_date && new Date(activeItem.due_date)
                          }
                          onDelayedChange={(e) => {
                            setLocalTaskData((items) => ({
                              ...items,
                              start_date: e.value,
                            }));
                          }}
                          parentTranslationPath={parentTranslationPath}
                        />
                      ) : (
                        activeItem.start_date
                        && moment(activeItem.start_date)
                          .locale(i18next.language)
                          .format(GlobalSecondaryDateFormat)
                      )}
                    </div>
                  ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    (!createTaskModeOn && !editModeOn && !activeItem.start_date)
                    || ((editModeOn || createTaskModeOn) && isPipelineTask),
                },
                {
                  key: 10,
                  name: 'due-date',
                  component: () => (
                    <div className="my-2">
                      {createTaskModeOn || editModeOn ? (
                        <DatePickerComponent
                          isFullWidth={!isFullScreen}
                          isQuarterWidth={isFullScreen}
                          inputPlaceholder={`${t('Shared:eg')} ${moment()
                            .locale(i18next.language)
                            .format(GlobalDateFormat)}`}
                          value={activeItem.due_date || ''}
                          errors={errors}
                          isSubmitted={isSubmitted}
                          displayFormat={GlobalDateFormat}
                          disableMaskedInput
                          errorPath="due_date"
                          stateKey="due_date"
                          minDate={
                            activeItem.start_date
                              ? new Date(activeItem.start_date)
                              : moment().toDate()
                          }
                          onDelayedChange={(e) => {
                            setLocalTaskData((items) => ({
                              ...items,
                              due_date: e.value,
                            }));
                          }}
                          parentTranslationPath={parentTranslationPath}
                        />
                      ) : (
                        activeItem.due_date
                        && moment(activeItem.due_date)
                          .locale(i18next.language)
                          .format(GlobalSecondaryDateFormat)
                      )}
                    </div>
                  ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    (!createTaskModeOn && !editModeOn && !activeItem.due_date)
                    || ((editModeOn || createTaskModeOn) && isPipelineTask),
                },
                {
                  key: 11,
                  name: 'reminder',
                  component: () =>
                    activeItem.has_reminder ? (
                      <ButtonBase
                        className={`w-100 d-flex-v-center-h-between btns ${
                          createTaskModeOn || editModeOn
                            ? 'theme-outline'
                            : 'theme-transparent'
                        } mx-0 my-2`}
                        style={{
                          justifyContent: 'start',
                          pointerEvents: 'none',
                        }}
                      >
                        <div>
                          <ButtonBase
                            className="small-icon btns-icon theme-transparent bg-gray-lighter-mid p-1"
                            style={{ pointerEvents: 'auto' }}
                          >
                            <span className="fas fa-bell" />
                          </ButtonBase>
                          <span className="mx-2">{t('via')}</span>
                          <ButtonBase
                            id="reminder-type"
                            className="mx-1 btns theme-transparent small-button"
                            style={{
                              ...((createTaskModeOn || editModeOn) && {
                                pointerEvents: 'auto',
                              }),
                            }}
                            onClick={(e) => setPopoverAttachedWith(e.target)}
                          >
                            {GetReminderType(activeItem.reminder_configuration.type)}
                          </ButtonBase>
                          <ButtonBase
                            id="reminder-frequency"
                            className="mx-1 btns theme-transparent small-button"
                            style={{
                              ...((createTaskModeOn || editModeOn) && {
                                pointerEvents: 'auto',
                              }),
                            }}
                            onClick={(e) => setPopoverAttachedWith(e.target)}
                          >
                            {GetReminderFrequency(
                              activeItem.reminder_configuration.frequency,
                            )}
                          </ButtonBase>
                          <ButtonBase
                            id="reminder-repeat"
                            className="mx-1 btns theme-transparent small-button"
                            style={{
                              ...((createTaskModeOn || editModeOn) && {
                                pointerEvents: 'auto',
                              }),
                            }}
                            onClick={(e) => setPopoverAttachedWith(e.target)}
                          >
                            {activeItem.reminder_configuration.is_recursive
                              ? t('repeated')
                              : t('one-time')}
                          </ButtonBase>
                        </div>
                        {(createTaskModeOn || editModeOn) && (
                          <ButtonBase
                            className="btns btns-icon theme-transparent"
                            style={{ pointerEvents: 'auto' }}
                            onClick={() => {
                              setLocalTaskData((items) => ({
                                ...items,
                                has_reminder: false,
                                reminder_configuration: null,
                              }));
                            }}
                          >
                            <span className="fas fa-times" />
                          </ButtonBase>
                        )}
                      </ButtonBase>
                    ) : (
                      <ButtonBase
                        onClick={() => {
                          setLocalTaskData((items) => ({
                            ...items,
                            has_reminder: true,
                            reminder_configuration: {
                              type: TaskReminderTypesEnum.NOTIFICATION_AND_EMAIL.key,
                              frequency: TaskReminderFrequencyEnum.DAILY.key,
                              is_recursive: false,
                            },
                          }));
                        }}
                      >
                        <ButtonBase className="btns btns-icon theme-transparent mx-0">
                          <span className="fas fa-plus" />
                        </ButtonBase>
                        <span className="mx-2">{t('add-reminder')}</span>
                      </ButtonBase>
                    ),
                  label: true,
                  verticalAlign: 'center',
                  isHidden:
                    !createTaskModeOn && !editModeOn && !activeItem.has_reminder,
                },
              ]
                .filter((fil) => !fil.isHidden)
                .map((row) => (
                  <TableRow key={row.key} sx={{ marginY: '1rem' }}>
                    {row.label && (
                      <TableCell
                        align="left"
                        sx={{
                          verticalAlign: 'top',
                          padding: '0px',
                        }}
                      >
                        <p>{t(row.name)}</p>
                      </TableCell>
                    )}
                    <TableCell
                      colSpan={row.label ? 1 : 2}
                      align="left"
                      sx={{
                        verticalAlign: row.verticalAlign || 'top',
                        paddingY: '0.6rem',
                        ...(!row.label && {
                          paddingX: '0px',
                        }),
                      }}
                      onMouseEnter={() => {
                        if (
                          ['status', 'assigned', 'assignee-type'].includes(
                            row.name,
                          )
                          && !editModeOn
                          && !createTaskModeOn
                          && !isEditStatusOn.view
                          && Object.keys(editFields).length === 0
                        )
                          setIsViewEdit(row.name);
                      }}
                      onMouseLeave={() => setIsViewEdit('')}
                    >
                      {row.component(row)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="my-2">
            <div>
              <ButtonBase
                className="btns btns-icon theme-transparent mx-0"
                onClick={() => {
                  if (createTaskModeOn || editModeOn)
                    setLocalTaskData((items) => ({
                      ...items,
                      enable_notification: !items.enable_notification,
                    }));
                }}
              >
                <span
                  className={`fas fa-toggle-${
                    activeItem.enable_notification ? 'on c-black' : 'off'
                  }`}
                />
              </ButtonBase>
              <span className="mx-2">{t('follow-notifications')}</span>
            </div>
          </div>
        </>
      )}
      {popoverAttachedWith && (
        <PopoverComponent
          idRef="reminderOptionsPopover"
          attachedWith={popoverAttachedWith}
          handleClose={() => setPopoverAttachedWith(null)}
          component={
            <div className="d-inline-flex-column">
              {popoverAttachedWith?.id === 'reminder-type'
                && Object.values(TaskReminderTypesEnum).map((item, idx) => (
                  <ButtonBase
                    className="btns theme-transparent"
                    key={`reminder-type-item-${item.key}-${idx}`}
                    onClick={() => {
                      setLocalTaskData((items) => ({
                        ...items,
                        reminder_configuration: {
                          ...items.reminder_configuration,
                          type: item.key,
                        },
                      }));
                      setPopoverAttachedWith(null);
                    }}
                  >
                    {t(item.value)}
                  </ButtonBase>
                ))}
              {popoverAttachedWith?.id === 'reminder-frequency'
                && Object.values(TaskReminderFrequencyEnum).map((item, idx) => (
                  <ButtonBase
                    className="btns theme-transparent"
                    key={`reminder-frequency-item-${item.key}-${idx}`}
                    onClick={() => {
                      setLocalTaskData((items) => ({
                        ...items,
                        reminder_configuration: {
                          ...items.reminder_configuration,
                          frequency: item.key,
                        },
                      }));
                      setPopoverAttachedWith(null);
                    }}
                  >
                    {t(item.value)}
                  </ButtonBase>
                ))}
              {popoverAttachedWith?.id === 'reminder-repeat'
                && [
                  { label: 'one-time', value: false },
                  { label: 'repeated', value: true },
                ].map((item, idx) => (
                  <ButtonBase
                    className="btns theme-transparent"
                    key={`reminder-repeat-item-${item.key}-${idx}`}
                    onClick={() => {
                      setLocalTaskData((items) => ({
                        ...items,
                        reminder_configuration: {
                          ...items.reminder_configuration,
                          is_recursive: item.value,
                        },
                      }));
                      setPopoverAttachedWith(null);
                    }}
                  >
                    {t(item.label)}
                  </ButtonBase>
                ))}
            </div>
          }
        />
      )}
    </div>
  );
};

TaskDrawerDetailsTab.propTypes = {
  isLoading: PropTypes.bool,
  setIsLoading: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
    slug: PropTypes.string,
    type: PropTypes.shape({
      key: PropTypes.number,
      value: PropTypes.string,
    }),
    redirect_url: PropTypes.string,
    status: PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.shape({
        en: PropTypes.string,
      }),
    }),
    creator: PropTypes.shape({
      uuid: PropTypes.string,
      first_name: PropTypes.shape({
        en: PropTypes.string,
      }),
      last_name: PropTypes.shape({
        en: PropTypes.string,
      }),
    }),
    creator_uuid: PropTypes.string,
    responsibility: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        uuid: PropTypes.string,
        user_uuid: PropTypes.string,
        first_name: PropTypes.shape({
          en: PropTypes.string,
        }),
        last_name: PropTypes.shape({
          en: PropTypes.string,
        }),
        user: PropTypes.shape({
          first_name: PropTypes.string,
          last_name: PropTypes.string,
        }),
      }),
    ]),
    relation: PropTypes.shape({
      user: PropTypes.shape({
        first_name: PropTypes.string,
        last_name: PropTypes.string,
      }),
      user_uuid: PropTypes.string,
    }),
    table_fields: PropTypes.instanceOf(Array),
    description: PropTypes.string,
    start_date: PropTypes.string,
    due_date: PropTypes.string,
    enable_notification: PropTypes.bool,
    has_reminder: PropTypes.bool,
    responsibility_type: PropTypes.number,
    reminder_configuration: PropTypes.shape({
      frequency: PropTypes.number,
      type: PropTypes.array,
      is_recursive: PropTypes.bool,
    }),
    duration_type: PropTypes.number,
    duration: PropTypes.number,
    mark_as_completed: PropTypes.oneOf(
      Object.values(TaskCompleteStatusEnum).map((it) => it.key),
    ),
    extra_data: PropTypes.shape({
      applicant_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      reference_number: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      position_title: PropTypes.string,
    }),
    additional_data: PropTypes.shape({
      is_shareable: PropTypes.bool,
      status: PropTypes.number,
    }),
  }).isRequired,
  UpdateTaskHandler: PropTypes.func,
  isFullScreen: PropTypes.bool,
  createTaskModeOn: PropTypes.bool,
  setLocalTaskData: PropTypes.func,
  errors: PropTypes.shape({
    reminder_configuration: PropTypes.shape({}),
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  editModeOn: PropTypes.bool.isRequired,
  isDrawerLoading: PropTypes.bool.isRequired,
  isPipelineTask: PropTypes.bool,
  triggerTaskTypes: PropTypes.shape({
    list: PropTypes.array,
    object: PropTypes.shape({}),
  }),
  setFilter: PropTypes.func,
  setReload: PropTypes.func,
};
