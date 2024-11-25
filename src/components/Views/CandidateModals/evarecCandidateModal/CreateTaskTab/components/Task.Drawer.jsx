import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import { Backdrop, ButtonBase, CircularProgress } from '@mui/material';
import '../TasksTab.Style.scss';
import { useTranslation } from 'react-i18next';
import moment from 'moment-hijri';
import * as yup from 'yup';
import Avatar from '@mui/material/Avatar';
import i18next from 'i18next';
import { TaskDrawerTabsData } from '../tabs/TaskDrawer.TabsData';
import {
  getErrorByName,
  showError,
  showSuccess,
  GlobalDateAndTimeFormat,
  getIsAllowedPermissionV2,
} from '../../../../../../helpers';
import {
  TaskDrawerActionsEnum,
  TaskResponsibilityUserTypesEnum,
  TaskCompleteStatusEnum,
} from '../../../../../../enums';
import { SharedInputControl } from '../../../../../../pages/setups/shared';
import { TabsComponent } from '../../../../../Tabs/Tabs.Component';
import PopoverComponent from '../../../../../Popover/Popover.Component';
import { DialogComponent } from '../../../../../Dialog/Dialog.Component';
import {
  GetTaskById,
  UpdateTask,
  CreateTask,
  DeleteTask,
  GetAllTriggerTaskTypes,
  MarkTaskAsCompleted,
} from '../../../../../../services';
import { TooltipsComponent } from '../../../../../Tooltips/Tooltips.Component';
import { SystemLanguagesConfig } from '../../../../../../configs';
import { useSelector } from 'react-redux';
import { EvaRecTaskManagementPermissions } from '../../../../../../permissions';

export const TaskDrawer = ({
  drawerOpen,
  setDrawerOpen,
  parentTranslationPath,
  activeTask,
  setActiveTask,
  setFilter,
  createTaskModeOn,
  setCreateTaskModeOn,
  candidate_uuid,
  getDataOnlyHandler,
  editData,
  isPipelineTask,
  job_uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [activeTab, setActiveTab] = useState(0);
  const [taskDrawerTabsData] = useState(() => TaskDrawerTabsData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const initTaskData = useRef({
    type: {},
    status: {},
    creator: null,
    creator_uuid: null,
    responsibility: null,
    responsibility_uuid: null,
    responsibility_type: 2,
    description: null,
    start_date: null,
    due_date: null,
    enable_notification: false,
    has_reminder: false,
    reminder_configuration: null,
  });
  const [localTaskData, setLocalTaskData] = useState(initTaskData.current);
  const [reload, setReload] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editModeOn, setEditModeOn] = useState(false);
  const [
    isDrawerLoading,
    // setIsDrawerLoading,
  ] = useState(false);
  const [tooltip, setTooltip] = useState(null);
  const [triggerTaskTypes, setTriggerTaskTypes] = useState({
    list: [],
    object: {},
  });

  const closeHandler = useCallback(() => {
    setDrawerOpen(false);
    setActiveTask(null);
    setLocalTaskData(initTaskData.current);
    setActiveTab(0);
    if (setCreateTaskModeOn) setCreateTaskModeOn(false);
  }, [setActiveTask, setDrawerOpen, setCreateTaskModeOn]);

  const actionsOptions = {
    getPopoverActionItemVisibility: () =>
      // task, action
      true,
    getDisabledAction: (task, action) => {
      if (action.key === TaskDrawerActionsEnum.VIEW_MODE.EDIT_NAME.key)
        return (
          !getIsAllowedPermissionV2({
            permissionId: EvaRecTaskManagementPermissions.UpdateTask.key,
            permissions: permissionsReducer,
          })
          || !task.is_editable
          || task.mark_as_completed === TaskCompleteStatusEnum.COMPLETED.key
          || task?.additional_data?.job?.uuid !== job_uuid
        );
      else if (action.key === TaskDrawerActionsEnum.VIEW_MODE.DELETE.key)
        return !getIsAllowedPermissionV2({
          permissionId: EvaRecTaskManagementPermissions.DeleteTask.key,
          permissions: permissionsReducer,
        });
      else return false;
    },
  };

  const GetUserUUIDHAndler = useCallback(({ data, type }) => {
    if (type === TaskResponsibilityUserTypesEnum.Candidate.key)
      return data?.user?.uuid || data?.uuid;
    else if (type === TaskResponsibilityUserTypesEnum.Employee.key)
      return data.user_uuid || data?.uuid;
    else if (type === TaskResponsibilityUserTypesEnum.User.key) return data?.uuid;
  }, []);

  const UpdateTaskHandler = useCallback(
    async (body, source) => {
      setIsSubmitted(true);
      if (Object.keys(errors).length) return;
      if (getDataOnlyHandler) {
        getDataOnlyHandler(localTaskData);
        return;
      }
      let newBody = {
        ...localTaskData,
        ...body,
      };
      newBody = {
        ...newBody,
        type: newBody.type?.key,
        status_uuid: newBody.status?.uuid,
        responsibility_uuid: newBody.responsibility?.map(
          (it) => it?.user_uuid || it?.uuid,
        ),
        ...(newBody.start_date && {
          start_date: moment(newBody.start_date)
            .locale(SystemLanguagesConfig.en.key)
            .format(GlobalDateAndTimeFormat),
        }),
        ...(newBody.due_date && {
          due_date: moment(newBody.due_date)
            .locale(SystemLanguagesConfig.en.key)
            .format(GlobalDateAndTimeFormat),
        }),
        additional_data: {
          ...(Object.keys(newBody.additional_data || {}).length && {
            ...Object.keys(newBody.additional_data).reduce((a, c) => {
              const value = newBody.additional_data[c];
              return {
                ...a,
                [value === 'string' ? c : `${c}_uuid`]:
                  typeof value === 'string'
                    ? value
                    : value.id || value.uuid || value.key,
              };
            }, {}),
          }),
          job_uuid,
        },
      };
      delete body.status;
      delete body.responsibility;

      setIsLoading(true);
      const response = await UpdateTask({
        ...newBody,
      });
      setIsLoading(false);
      if (response?.status === 202) {
        showSuccess(t('task-updated-successfully'));
        setReload((items) => ({ ...items }));
        if (setFilter)
          setFilter((items) => ({
            ...items,
          }));
        if (source === TaskDrawerActionsEnum.EDIT_MODE.SAVE.key)
          setEditModeOn(false);
      } else showError(t('failed-to-update-task'), response);
    },
    [getDataOnlyHandler, setFilter, setReload, localTaskData, t, errors, job_uuid],
  );

  const CreateTaskHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) return;
    if (getDataOnlyHandler) {
      getDataOnlyHandler(localTaskData);
      return;
    }
    let body = {
      ...localTaskData,
      type: localTaskData.type.key,
      status_uuid: localTaskData.status.uuid,
      responsibility_uuid: localTaskData.responsibility.map(
        (it) => it?.user_uuid || it?.uuid,
      ),
      relation_uuid: candidate_uuid,
      ...(localTaskData.start_date && {
        start_date: moment(localTaskData.start_date)
          .locale(SystemLanguagesConfig.en.key)
          .format(GlobalDateAndTimeFormat),
      }),
      ...(localTaskData.due_date && {
        due_date: moment(localTaskData.due_date)
          .locale(SystemLanguagesConfig.en.key)
          .format(GlobalDateAndTimeFormat),
      }),
      additional_data: {
        ...(Object.keys(localTaskData.additional_data || {}).length && {
          ...Object.keys(localTaskData.additional_data).reduce((a, c) => {
            const value = localTaskData.additional_data[c];
            return {
              ...a,
              [value === 'string' ? c : `${c}_uuid`]:
                typeof value === 'string'
                  ? value
                  : value.id || value.uuid || value.key,
            };
          }, {}),
        }),
        job_uuid,
      },
    };
    delete body.status;
    delete body.responsibility;
    delete body.creator;
    delete body.creator_uuid;

    setIsLoading(true);
    const response = await CreateTask({
      ...body,
    });
    setIsLoading(false);
    if (response?.status === 202) {
      showSuccess(t('task-created-successfully'));
      if (setFilter)
        setFilter((items) => ({
          ...items,
          page: 1,
        }));
      closeHandler();
    } else showError(t('failed-to-create-task'), response);
  }, [
    getDataOnlyHandler,
    errors,
    localTaskData,
    candidate_uuid,
    t,
    setFilter,
    closeHandler,
    job_uuid,
  ]);

  const DeleteTaskHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await DeleteTask({
      uuids: [localTaskData.uuid],
    });
    setIsLoading(false);
    if (response?.status === 202) {
      showSuccess(t('task-deleted-successfully'));
      setDrawerOpen(false);
      if (setFilter)
        setFilter((items) => ({
          ...items,
          limit: 10,
          page: 1,
        }));
    } else showError(t('failed-to-delete-task'), response);
  }, [localTaskData, setDrawerOpen, setFilter, t]);

  const GetTaskByIdHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetTaskById({
      uuid: activeTask?.uuid,
    });
    setIsLoading(false);
    if (response?.status === 200) {
      const results = response.data.results;
      setLocalTaskData({
        ...results,
        type: results.type || {},
        status: results.status || {},
        responsibility: results.responsibility?.map((it) => ({
          ...it,
          user_uuid: GetUserUUIDHAndler({
            data: it,
            type: results.responsibility_type,
          }),
        })),
        relation: {
          ...results?.relation,
          user_uuid: GetUserUUIDHAndler({
            data: results.relation,
            type: TaskResponsibilityUserTypesEnum.Candidate.key,
          }),
        },
      });
    } else {
      showError(t('failed-to-get-task-data'), response);
      closeHandler();
    }
  }, [activeTask, t, closeHandler, GetUserUUIDHAndler]);

  const onActionClicked = useCallback(
    ({ item, closePopper }) => {
      if (item.key === TaskDrawerActionsEnum.VIEW_MODE.DELETE.key)
        setShowDeleteDialog(true);
      else if (item.key === TaskDrawerActionsEnum.CREATE_MODE.DISCARD.key)
        closeHandler();
      else if (item.key === TaskDrawerActionsEnum.VIEW_MODE.EDIT_NAME.key)
        setEditModeOn(true);
      else if (item.key === TaskDrawerActionsEnum.EDIT_MODE.DISCARD_EDIT.key)
        setEditModeOn(false);
      else if (item.key === TaskDrawerActionsEnum.EDIT_MODE.SAVE.key)
        UpdateTaskHandler(
          {
            title: localTaskData.title,
            description: localTaskData.description,
          },
          TaskDrawerActionsEnum.EDIT_MODE.SAVE.key,
        );

      closePopper();
    },
    [UpdateTaskHandler, closeHandler, localTaskData],
  );

  const GetTriggerTaskTypesHandler = useMemo(
    () => async () => {
      const response = await GetAllTriggerTaskTypes({
        have_candidate_relation: true,
      });

      if (response?.status === 200)
        setTriggerTaskTypes({
          list: response.data.results,
          object: response.data.results.reduce((a, c) => ({ ...a, [c.key]: c }), {}),
        });
      else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setTriggerTaskTypes({
          list: [],
          object: {},
        });
      }
    },
    [t],
  );

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.lazy((parent) =>
          yup.object().shape({
            title: yup.string().nullable().required(t('this-field-is-required')),
            status: yup
              .object()
              .nullable()
              .shape({
                uuid: yup.string().required(t('this-field-is-required')),
              })
              .required(t('this-field-is-required')),
            type: yup
              .object()
              .nullable()
              .shape({
                key: yup.number().required(t('this-field-is-required')),
              })
              .required(t('this-field-is-required')),
            responsibility: yup.lazy(() => {
              if (
                parent.responsibility_type
                  !== TaskResponsibilityUserTypesEnum.Requester.key
                && parent.responsibility_type
                  !== TaskResponsibilityUserTypesEnum.JobCreator.key
              )
                return yup.array().nullable().required(t('this-field-is-required'));
              else return yup.array().nullable().notRequired();
            }),
            responsibility_type: yup
              .number()
              .nullable()
              .required(t('this-field-is-required')),
            enable_notification: yup
              .boolean()
              .nullable()
              .required(t('this-field-is-required')),
            has_reminder: yup
              .boolean()
              .nullable()
              .required(t('this-field-is-required')),
            reminder_configuration: yup.lazy(() => {
              if (parent.has_reminder)
                return yup
                  .object()
                  .shape({
                    type: yup.array().min(1, t('this-field-is-required')),
                    frequency: yup.number().required(t('this-field-is-required')),
                    is_recursive: yup
                      .boolean()
                      .required(t('this-field-is-required')),
                  })
                  .required(t('this-field-is-required'));
              else return yup.object().nullable().notRequired();
            }),
            additional_data: yup.lazy(() => {
              if (parent.type?.key) {
                const typeData = triggerTaskTypes.object[parent.type?.key];
                if (typeData.options?.mapping_key)
                  return yup.object().shape({
                    [typeData.options.mapping_key]: yup
                      .object()
                      .shape({
                        [typeData.options.primary_key]: yup
                          .string()
                          .required(t('this-field-is-required')),
                      })
                      .nullable(),
                    ...(typeData.options.required_params?.length && {
                      ...typeData.options.required_params.reduce(
                        (a, c) => ({
                          ...a,
                          [c.mapping_key]: yup
                            .object()
                            .shape({
                              [c.primary_key]: yup
                                .string()
                                .required(t('this-field-is-required')),
                            })
                            .nullable(),
                        }),
                        {},
                      ),
                    }),
                    ...(typeData.extra_options?.length && {
                      ...typeData.extra_options.reduce(
                        (a, c) => ({
                          ...a,
                          [c.mapping_key]: yup
                            .object()
                            .shape({
                              [c.primary_key]: yup
                                .string()
                                .required(t('this-field-is-required')),
                            })
                            .nullable(),
                        }),
                        {},
                      ),
                    }),
                  });
                else return yup.object().nullable().notRequired();
              } else return yup.object().nullable().notRequired();
            }),
          }),
        ),
      },
      localTaskData,
    );
    setErrors(result);
  }, [triggerTaskTypes, localTaskData, t]);

  const DrawerActionsList = useMemo(() => {
    if (createTaskModeOn) return Object.values(TaskDrawerActionsEnum.CREATE_MODE);
    if (editModeOn) return Object.values(TaskDrawerActionsEnum.EDIT_MODE);
    else return Object.values(TaskDrawerActionsEnum.VIEW_MODE);
  }, [createTaskModeOn, editModeOn]);

  const MarkTaskAsCompletedHandler = useCallback(async () => {
    const response = await MarkTaskAsCompleted({ uuid: localTaskData.uuid });
    if (response?.status === 200) {
      if (setFilter) {
        setFilter((items) => ({
          ...items,
        }));
        setReload((items) => ({ ...items }));
      }
    } else showError(t('Shared:failed-to-get-saved-data', response));
  }, [t, localTaskData, setFilter, setReload]);

  useEffect(() => {
    getErrors();
  }, [getErrors, localTaskData]);

  useEffect(() => {
    if (activeTask?.uuid && !createTaskModeOn) GetTaskByIdHandler();
  }, [GetTaskByIdHandler, activeTask, reload, createTaskModeOn]);

  useEffect(() => {
    if (getDataOnlyHandler && Object.keys(editData || {}).length)
      setLocalTaskData({
        ...editData,
        type: editData.type || {},
        enable_notification: editData.enable_notification || false,
        has_reminder: editData.has_reminder || false,
        responsibility: editData?.responsibility?.map((it) => ({
          ...it,
          user_uuid: GetUserUUIDHAndler({
            data: it,
            type: editData.responsibility_type,
          }),
        })),
      });
  }, [GetUserUUIDHAndler, editData, getDataOnlyHandler]);

  useEffect(() => {
    GetTriggerTaskTypesHandler();
  }, [GetTriggerTaskTypesHandler]);

  return (
    <Drawer
      elevation={2}
      anchor="right"
      open={drawerOpen}
      onClose={closeHandler}
      hideBackdrop
      className="highest-z-index"
    >
      <Backdrop
        className="spinner-wrapper"
        style={{ zIndex: 9999 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" size={50} />
      </Backdrop>
      <div
        className="my-2 side-drawer-width"
        style={{
          ...(isFullScreen && { maxWidth: '100vw', width: '100vw' }),
        }}
      >
        <div className="drawer-header d-flex-v-center-h-between my-2">
          <div className="d-flex-v-center">
            <ButtonBase
              className="btns btns-icon theme-transparent mx-3"
              onClick={closeHandler}
            >
              <span className="fas fa-angle-double-right" />
            </ButtonBase>
            {createTaskModeOn ? (
              <div>{t('new-task')}</div>
            ) : (
              <div className="d-flex-v-center">
                <span>{t('details')}</span>
                {/*{localTaskData?.additional_data?.job?.uuid !== job_uuid && (*/}
                {/*  <TooltipsComponent*/}
                {/*    parentTranslationPath={parentTranslationPath}*/}
                {/*    title={`${t('this-task-belongs-to-job')}: ${localTaskData?.additional_data?.job?.name}`}*/}
                {/*    contentComponent={*/}
                {/*      <div className="c-accent-secondary mx-3">*/}
                {/*        <span className="fas fa-external-link-alt"/>*/}
                {/*        <span className="mx-2">{t('external-task')}</span>*/}
                {/*      </div>}*/}
                {/*  />*/}
                {/*)}*/}
              </div>
            )}
          </div>
          <div className="d-flex-v-center-h-end">
            {localTaskData?.mark_as_completed
              === TaskCompleteStatusEnum.UPDATED.key && (
              <ButtonBase
                className="btns theme-transparent theme-outline mx-3"
                onClick={() => MarkTaskAsCompletedHandler()}
              >
                {t('mark-as-complete')}
              </ButtonBase>
            )}
            {localTaskData?.mark_as_completed
              === TaskCompleteStatusEnum.COMPLETED.key && (
              <div className="d-flex-center">
                <span className="fas fa-check-square" />
                <span className="mx-2">{t('completed')}</span>
              </div>
            )}
            <ButtonBase
              className="btns btns-icon theme-transparent mx-3"
              onClick={() => setIsFullScreen((prev) => !prev)}
            >
              <span
                className={`fas fa-${isFullScreen ? 'compress alt' : 'expand-alt'}`}
              />
            </ButtonBase>
            {createTaskModeOn && (
              <TooltipsComponent
                parentTranslationPath={parentTranslationPath}
                isOpen={tooltip === 'check'}
                titleComponent={t('create-task')}
                placement="bottom"
                contentComponent={
                  <ButtonBase
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: EvaRecTaskManagementPermissions.CreateTask.key,
                        permissions: permissionsReducer,
                      })
                    }
                    className="btns btns-icon theme-transparent mx-3"
                    onClick={() => CreateTaskHandler()}
                    onMouseOver={() => setTooltip('check')}
                    onMouseOut={() => setTooltip(null)}
                  >
                    <span className="far fa-check-square" />
                  </ButtonBase>
                }
              />
            )}
            <ButtonBase
              className="btns btns-icon theme-transparent mx-3"
              onClick={(e) => setPopoverAttachedWith(e.target)}
            >
              <span className="fas fa-ellipsis-h" />
            </ButtonBase>
          </div>
        </div>
        <div className="mt-2">
          <div className="d-flex-column">
            <div className="d-flex-v-center m-2 px-3 pt-3">
              {createTaskModeOn || editModeOn ? (
                <SharedInputControl
                  isFullWidth
                  stateKey="title"
                  placeholder="untitled-dots"
                  errorPath="title"
                  isSubmitted={isSubmitted}
                  errors={errors}
                  editValue={localTaskData.title}
                  isDisabled={isLoading}
                  onValueChanged={(e) =>
                    setLocalTaskData((items) => ({
                      ...items,
                      title: e.value,
                    }))
                  }
                  parentTranslationPath={parentTranslationPath}
                  themeClass="theme-transparent"
                  textFieldWrapperClasses="w-100 px-3 pt-3"
                  fieldClasses="w-100 first-input-fz-22px"
                />
              ) : (
                <div className="fw-bold fz-22px mx-2">{localTaskData.title}</div>
              )}
            </div>
            <div className="task-tab-outer-wrapper mx-3">
              <TabsComponent
                isPrimary
                isWithLine
                labelInput="label"
                idRef="taskTabsRef"
                tabsContentClasses="pt-3"
                data={taskDrawerTabsData}
                currentTab={activeTab}
                onTabChanged={(event, currentTab) => {
                  setActiveTab(currentTab);
                }}
                parentTranslationPath={parentTranslationPath}
                dynamicComponentProps={{
                  activeItem: localTaskData,
                  isLoading,
                  setIsLoading,
                  parentTranslationPath,
                  UpdateTaskHandler,
                  isFullScreen,
                  createTaskModeOn,
                  setLocalTaskData,
                  errors,
                  isSubmitted,
                  editModeOn,
                  setEditModeOn,
                  isDrawerLoading,
                  isPipelineTask,
                  triggerTaskTypes,
                  setFilter,
                  setReload,
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <PopoverComponent
        idRef="drawerActionsPopoverRef"
        attachedWith={popoverAttachedWith}
        handleClose={() => setPopoverAttachedWith(null)}
        popoverClasses="table-actions-popover-wrapper"
        component={
          <div className="table-actions-wrapper">
            {DrawerActionsList.map(
              (item, actionIndex, items) =>
                ((actionsOptions.getPopoverActionItemVisibility
                  && actionsOptions.getPopoverActionItemVisibility(
                    localTaskData,
                    item,
                  ))
                  || !actionsOptions.getPopoverActionItemVisibility) && (
                  <div
                    className="actions-popover-item"
                    key={`${item.key}-job-requisition-drawer-action-${actionIndex}`}
                  >
                    <ButtonBase
                      disabled={
                        actionsOptions
                        && actionsOptions.getDisabledAction
                        && actionsOptions.getDisabledAction(localTaskData, item)
                      }
                      onClick={() =>
                        onActionClicked({
                          item,
                          closePopper: () => setPopoverAttachedWith(null),
                        })
                      }
                      className="mx-0 actions-popover-btn"
                    >
                      <span className={item.icon} />
                      <span className="px-2">{t(item.value) || ''}</span>
                    </ButtonBase>
                    {actionIndex < items.length - 1 && (
                      <div className="separator-h" />
                    )}
                  </div>
                ),
            )}
          </div>
        }
      />
      {showDeleteDialog && (
        <DialogComponent
          isConfirm
          titleText="delete-task-question"
          dialogContent={
            <div className="px-2">
              <Backdrop
                className="spinner-wrapper"
                style={{ zIndex: 9999 }}
                open={isLoading}
              >
                <CircularProgress color="inherit" size={50} />
              </Backdrop>
              <div>
                <div>{t(`delete-desc`)}</div>
                <div>{t(`delete-sub-desc`)}</div>
              </div>
              <div className="my-3">
                <div>{t(`task`)}</div>
                <div className="my-1">
                  <span className="bg-gray-light py-1 px-2">
                    {localTaskData.title}
                  </span>
                </div>
              </div>
              {localTaskData.creator && (
                <div>
                  <div>{t(`created-by`)}</div>
                  <div className="d-flex-v-center">
                    <Avatar
                      sx={{ width: '24px!important', height: '24px!important' }}
                    />
                    <div className="mx-2">
                      {`${
                        localTaskData.creator.first_name?.[i18next.language]
                        || localTaskData.creator.first_name?.en
                        || ''
                      } ${
                        localTaskData.creator.last_name?.[i18next.language]
                        || localTaskData.creator.last_name?.en
                        || ''
                      }`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          isOpen={showDeleteDialog}
          saveType="button"
          onSaveClicked={() => DeleteTaskHandler()}
          isSaving={isLoading}
          onCloseClicked={() => setShowDeleteDialog(false)}
          onCancelClicked={() => setShowDeleteDialog(false)}
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </Drawer>
  );
};

TaskDrawer.propTypes = {
  drawerOpen: PropTypes.bool.isRequired,
  setDrawerOpen: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string,
  activeTask: PropTypes.shape({
    uuid: PropTypes.string,
    title: PropTypes.string,
    status: PropTypes.shape({}),
    mark_as_completed: PropTypes.oneOf(
      Object.values(TaskCompleteStatusEnum).map((it) => it.key),
    ),
  }),
  setActiveTask: PropTypes.func.isRequired,
  setFilter: PropTypes.func,
  createTaskModeOn: PropTypes.bool.isRequired,
  setCreateTaskModeOn: PropTypes.func,
  candidate_uuid: PropTypes.string,
  getDataOnlyHandler: PropTypes.func,
  editData: PropTypes.shape({
    enable_notification: PropTypes.bool,
    has_reminder: PropTypes.bool,
    responsibility: PropTypes.arrayOf(PropTypes.shape({})),
    responsibility_type: PropTypes.number,
    type: PropTypes.shape({}),
  }),
  isPipelineTask: PropTypes.bool,
  job_uuid: PropTypes.string,
};
TaskDrawer.defaultProps = {
  parentTranslationPath: undefined,
  translationPath: undefined,
};
