import React, { useCallback, useEffect, useRef, useReducer, useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import {
  PipelineDetailsSectionEnum,
  PipelineTaskQueryActionsEnum,
  TaskResponsibilityUserTypesEnum,
} from '../../../../../enums';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../setups/shared';
import { showError, showSuccess } from '../../../../../helpers';
import {
  CreatePipelineTaskQuery,
  DeletePipelineTaskQuery,
  GetAllPipelineTasksActions,
  GetPipelineTaskData,
  UpdatePipelineTaskFunc,
  UpdatePipelineTaskQuery,
} from '../../../../../services';
import { PipelineQueryItem } from '../components/pipeline-task-query/PipelineTaskQueryItem.Component';
import '../../../pipelines/managements/pipeline/sections/pipeline-drawer/PipelineDrawer.Style.scss';
import { LoaderComponent } from '../../../../../components';

export const ViewPipelineTask = ({
  parentTranslationPath,
  translationPath,
  onOpenedDetailsSectionChanged,
  setView,
  activePipeline,
  view,
  viewInit,
  setListingFilter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({});
  const [isLoading, setIsLoading] = useState(false);
  const [actionsList, setActionsList] = useState([]);
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  const activeEditQueryInit = useRef({
    index: null,
    data: null,
  });
  const [activeEditQuery, setActiveEditQuery] = useState(
    activeEditQueryInit.current,
  );
  const [hoveredQuery, setHoveredQuery] = useState(null);
  const [activeEditQueryNewData, setActiveEditQueryNewData] = useState(null);
  const [filter, setFilter] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const GetPipelineTaskDataHandler = useCallback(
    async (uuid) => {
      setIsLoading(true);
      const response = await GetPipelineTaskData({
        uuid,
      });
      setIsLoading(false);
      if (response && response.status === 200)
        if (response.data.results?.tasks?.length)
          onStateChanged({ id: 'edit', value: response.data.results });
        else {
          onStateChanged({
            id: 'edit',
            value: { ...response.data.results, tasks: [{}] },
          });
          setActiveEditQuery({ index: 0, data: {} });
        }
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  const GetAllPipelineTasksActionsHandler = useCallback(async () => {
    const response = await GetAllPipelineTasksActions();
    if (response && response.status === 200) setActionsList(response.data.results);
    else setActionsList([]);
  }, []);

  const CreatePipelineTaskQueryHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) return;
    // TODO: Handle sending other unique keys
    setIsLoading(true);
    const response = await CreatePipelineTaskQuery({
      ...activeEditQueryNewData,
      pipeline_template_uuid: view.data?.pipeline_task_uuid,
      source: activeEditQueryNewData.source.key,
      source_group: activeEditQueryNewData.source_group.key,
      source_operator: activeEditQueryNewData.source_operator.key,
      source_operator_value:
        activeEditQueryNewData.source_operator_value?.key
        && parseInt(activeEditQueryNewData.source_operator_value.key),
      source_value:
        activeEditQueryNewData.source_value.uuid
        || activeEditQueryNewData.source_value.id
        || activeEditQueryNewData.source_value.key
        || activeEditQueryNewData.source_value,
      ...(activeEditQueryNewData.source_attribute && {
        source_attribute: activeEditQueryNewData.source_attribute?.key,
        source_attribute_value: Object.keys(
          activeEditQueryNewData.source_attribute_value,
        ).reduce(
          (a, v) => ({
            ...a,
            [v]:
              activeEditQueryNewData.source_attribute_value[v]?.key
              || activeEditQueryNewData.source_attribute_value[v],
          }),
          {},
        ),
      }),
      filters: (activeEditQueryNewData.filters || []).map((it) => ({
        filter_group: it.filter_group.key,
        filter_key: it.filter_key.key,
        filter_operator: it.filter_operator.key,
        filter_value:
          typeof it.filter_value !== 'object' || it.filter_value === null
            ? it.filter_value
            : it.filter_value.key ?? it.filter_value.uuid,
        is_grouped: it.is_grouped,
        main_operator: it.main_operator.key,
      })),
      action: activeEditQueryNewData.action.key,
      action_data: {
        ...activeEditQueryNewData.action_data,
        ...(activeEditQueryNewData.action_data?.stage && {
          stage_uuid: activeEditQueryNewData.action_data.stage.uuid,
        }),
        ...(activeEditQueryNewData.action.key
          === PipelineTaskQueryActionsEnum.CREATE_TASK.key && {
          enable_notification:
            !!activeEditQueryNewData.action_data.enable_notification,
          type: activeEditQueryNewData.action_data.type.key,
          status_uuid: activeEditQueryNewData.action_data.status.uuid,
          ...(activeEditQueryNewData.action_data.responsibility_type
            !== TaskResponsibilityUserTypesEnum.Requester.key && {
            responsibility_uuid:
              activeEditQueryNewData.action_data?.responsibility?.map(
                (it) => it?.user_uuid || it?.uuid,
              ),
          }),
          ...(activeEditQueryNewData.action_data.duration && {
            duration: activeEditQueryNewData.action_data.duration,
          }),
          additional_data: {
            ...(Object.keys(activeEditQueryNewData.action_data.additional_data || {})
              ?.length && {
              ...Object.keys(
                activeEditQueryNewData.action_data.additional_data,
              ).reduce((a, c) => {
                const value = activeEditQueryNewData.action_data.additional_data[c];
                return {
                  ...a,
                  [value === 'string' ? c : `${c}_uuid`]:
                    typeof value === 'string'
                      ? value
                      : value.id || value.uuid || value.key,
                };
              }, {}),
            }),
          },
        }),
      },
      parent_uuid:
        activeEditQueryNewData.parent_uuid
        || state.tasks?.[activeEditQuery.index - 1]?.uuid
        || null,
      is_grouped: activeEditQueryNewData.is_grouped || false,
      reference_uuid: activeEditQueryNewData.source?.reference_uuid,
    });
    if (response && response.status === 202) {
      showSuccess(t(`${translationPath}query-item-added-successfully`));
      setFilter((items) => ({ ...items }));
      setActiveEditQuery(activeEditQueryInit.current);
      setIsSubmitted(false);
      if (setListingFilter) setListingFilter((i) => ({ ...i }));
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    }
  }, [
    activeEditQueryNewData,
    view,
    state.tasks,
    activeEditQuery.index,
    t,
    translationPath,
    errors,
    setListingFilter,
  ]);

  const UpdatePipelineTaskQueryHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) return;
    setIsLoading(true);
    console.log({
      activeEditQueryNewData,
    });
    const response = await UpdatePipelineTaskQuery({
      ...activeEditQueryNewData,
      pipeline_template_uuid: view.data?.pipeline_task_uuid,
      source: activeEditQueryNewData.source.key,
      source_group: activeEditQueryNewData.source_group.key,
      source_operator: activeEditQueryNewData.source_operator.key,
      source_operator_value:
        activeEditQueryNewData.source_operator_value?.key
        && parseInt(activeEditQueryNewData.source_operator_value.key),
      source_value:
        activeEditQueryNewData.source_value.uuid
        || activeEditQueryNewData.source_value.id
        || activeEditQueryNewData.source_value.key
        || activeEditQueryNewData.source_value,
      ...(activeEditQueryNewData.source_attribute && {
        source_attribute: activeEditQueryNewData.source_attribute?.key,
        source_attribute_value: Object.keys(
          activeEditQueryNewData.source_attribute_value,
        ).reduce(
          (a, v) => ({
            ...a,
            [v]:
              activeEditQueryNewData.source_attribute_value[v]?.key
              || activeEditQueryNewData.source_attribute_value[v],
          }),
          {},
        ),
      }),
      filters: (activeEditQueryNewData.filters || []).map((it) => ({
        filter_group: it.filter_group.key,
        filter_key: it.filter_key.key,
        filter_operator: it.filter_operator.key,
        filter_value:
          typeof it.filter_value !== 'object' || it.filter_value === null
            ? it.filter_value
            : it.filter_value.key ?? it.filter_value.uuid,
        is_grouped: it.is_grouped,
        main_operator: it.main_operator.key,
      })),
      action: activeEditQueryNewData.action.key,
      action_data: {
        ...activeEditQueryNewData.action_data,
        ...(activeEditQueryNewData.action_data?.stage && {
          stage_uuid: activeEditQueryNewData.action_data.stage.uuid,
        }),
        ...(activeEditQueryNewData.action.key
          === PipelineTaskQueryActionsEnum.CREATE_TASK.key && {
          enable_notification:
            !!activeEditQueryNewData.action_data.enable_notification,
          type: activeEditQueryNewData.action_data.type.key,
          status_uuid: activeEditQueryNewData.action_data.status.uuid,
          ...(activeEditQueryNewData.action_data.responsibility_type
            !== TaskResponsibilityUserTypesEnum.Requester.key && {
            responsibility_uuid:
              activeEditQueryNewData.action_data.responsibility?.map(
                (it) => it?.user_uuid || it?.uuid,
              ),
          }),
          ...(activeEditQueryNewData.action_data.duration && {
            duration: activeEditQueryNewData.action_data.duration,
          }),
        }),
        additional_data: {
          ...(Object.keys(activeEditQueryNewData.action_data.additional_data || {})
            ?.length && {
            ...Object.keys(
              activeEditQueryNewData.action_data.additional_data,
            ).reduce((a, c) => {
              const value = activeEditQueryNewData.action_data.additional_data[c];
              return {
                ...a,
                [value === 'string' ? c : `${c}_uuid`]:
                  typeof value === 'string'
                    ? value
                    : value.id || value.uuid || value.key,
              };
            }, {}),
          }),
        },
      },
      reference_uuid: activeEditQueryNewData.source?.reference_uuid,
    });
    if (response && response.status === 202) {
      showSuccess(t(`${translationPath}query-item-updated-successfully`));
      setFilter((items) => ({ ...items }));
      setActiveEditQuery(activeEditQueryInit.current);
      setIsSubmitted(false);
      if (setListingFilter) setListingFilter((i) => ({ ...i }));
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    }
  }, [errors, activeEditQueryNewData, view, t, translationPath, setListingFilter]);

  const UpdatePipelineTaskHandler = useCallback(
    async (body) => {
      setIsLoading(true);
      const response = await UpdatePipelineTaskFunc({ ...state, ...body });
      if (response && response.status === 202) {
        showSuccess(t(`${translationPath}query-item-updated-successfully`));
        setFilter((items) => ({ ...items }));
        setActiveEditQuery(activeEditQueryInit.current);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoading(false);
      }
    },
    [state, t, translationPath],
  );

  const DeletePipelineTaskQueryHandler = useCallback(
    async ({ uuid }) => {
      setIsLoading(true);
      const response = await DeletePipelineTaskQuery({ uuids: [uuid] });
      if (response && response.status === 202) {
        showSuccess(t(`${translationPath}query-item-deleted-successfully`));
        setFilter((items) => ({ ...items }));
        setActiveEditQuery(activeEditQueryInit.current);
        setHoveredQuery(null);
        if (setListingFilter) setListingFilter((i) => ({ ...i }));
      } else {
        showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoading(false);
      }
    },
    [t, translationPath, setListingFilter],
  );

  useEffect(() => {
    GetAllPipelineTasksActionsHandler();
  }, [GetAllPipelineTasksActionsHandler]);

  useEffect(() => {
    if (view.data.pipeline_task_uuid)
      GetPipelineTaskDataHandler(view.data.pipeline_task_uuid);
  }, [view.data.pipeline_task_uuid, GetPipelineTaskDataHandler, filter]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => {
              if (onOpenedDetailsSectionChanged)
                onOpenedDetailsSectionChanged(PipelineDetailsSectionEnum.Info.key);
              setView(viewInit.current);
            }}
          >
            <span className="fas fa-arrow-left" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {view.data.pipeline_task_uuid
              ? t(`${translationPath}triggered-task`)
              : t(`${translationPath}new-triggered-task`)}
          </label>
        </div>
        <div>
          {state.is_published === false
            && !(activeEditQuery.index === 0 || activeEditQuery.index) && (
            <ButtonBase
              className="btns theme-solid mx-2"
              onClick={() => UpdatePipelineTaskHandler({ is_published: true })}
              disabled={isLoading}
            >
              <span>{t(`${translationPath}publish`)}</span>
            </ButtonBase>
          )}
          {(activeEditQuery.index === 0 || activeEditQuery.index) && (
            <>
              <ButtonBase
                className="btns theme-transparent mx-2"
                onClick={() => {
                  const cloneItems = [...state.tasks];
                  if (!activeEditQuery.data?.uuid) {
                    cloneItems.pop();
                    onStateChanged({ id: 'tasks', value: cloneItems });
                  } else
                    onStateChanged({
                      id: 'tasks',
                      value: cloneItems.map((it) => {
                        if (activeEditQuery.data?.uuid === it.uuid)
                          return activeEditQuery.data;
                        else return it;
                      }),
                    });
                  setActiveEditQuery({ index: null, data: null });
                  setIsSubmitted(false);
                }}
                disabled={isLoading}
              >
                <span>{t(`${translationPath}cancel`)}</span>
              </ButtonBase>
              <ButtonBase
                className="btns theme-solid mx-2"
                onClick={() => {
                  if (!activeEditQuery.data?.uuid) CreatePipelineTaskQueryHandler();
                  else UpdatePipelineTaskQueryHandler();
                }}
                disabled={isLoading}
              >
                <span>
                  {t(
                    `${translationPath}${
                      activeEditQuery.data?.uuid ? 'save' : 'add'
                    }`,
                  )}
                </span>
              </ButtonBase>
            </>
          )}
          {/*<ButtonBase*/}
          {/*  className="btns theme-transparent miw-0"*/}
          {/*  onClick={() => {}}*/}
          {/*  disabled={isLoading}*/}
          {/*>*/}
          {/*  <span className="fas fa-ellipsis-h" />*/}
          {/*</ButtonBase>*/}
        </div>
      </div>
      {isLoading && (
        <div className="mx-3 px-2">
          <LoaderComponent
            isLoading={isLoading}
            isSkeletonto
            skeletonItems={[
              {
                variant: 'rectangular',
                style: { minHeight: 35, marginTop: 10, marginBottom: 10 },
              },
            ]}
            numberOfRepeat={10}
          />
        </div>
      )}
      <div
        className="details-body-wrapper mx-3 px-2"
        style={{
          ...(isLoading && { display: 'none' }),
        }}
      >
        <SharedInputControl
          isFullWidth
          stateKey="title"
          placeholder="untitled-dots"
          editValue={state.title}
          isDisabled={isLoading}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClass="theme-transparent"
          textFieldWrapperClasses="w-100 pt-3"
          fieldClasses="w-100"
          innerInputWrapperClasses="input-fz-20px"
          isReadOnly
        />
        {/* List queries */}
        {actionsList.length > 0
          && state.tasks?.map((pipelineTaskItem, idx, allTasks) => (
            <div
              key={`query-item-${idx}-${pipelineTaskItem.uuid}`}
              onMouseEnter={() => {
                if (!(activeEditQuery.index === 0 || activeEditQuery.index))
                  setHoveredQuery(idx);
              }}
              onMouseLeave={() => setHoveredQuery(null)}
              style={{
                transition: '0.4s',
                ...(hoveredQuery === idx
                  && activeEditQuery.index !== idx && {
                  border: '1px solid #4851C8',
                  paddingLeft: '1rem',
                  borderRadius: 8,
                  position: 'relative',
                }),
              }}
            >
              <div
                className="d-flex-v-center-h-between"
                style={{
                  display:
                    hoveredQuery === idx && activeEditQuery.index !== idx
                      ? 'block'
                      : 'none',
                  position: 'absolute',
                  top: '1.5rem',
                  right: '-1rem',
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <ButtonBase
                  className="w-100 btns-icon theme-transparent"
                  onClick={() => {
                    setActiveEditQuery({
                      index: idx,
                      data: { ...pipelineTaskItem },
                    });
                    setHoveredQuery(null);
                  }}
                >
                  <span className="fas fa-pen" />
                </ButtonBase>
                <ButtonBase
                  className="w-100 btns-icon theme-transparent"
                  onClick={() =>
                    DeletePipelineTaskQueryHandler({ uuid: pipelineTaskItem.uuid })
                  }
                >
                  <span className="fas fa-trash" />
                </ButtonBase>
              </div>
              <PipelineQueryItem
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                index={idx}
                queryData={pipelineTaskItem}
                actions_list={actionsList}
                viewMode={activeEditQuery.index !== idx}
                activePipeline={activePipeline}
                setActiveEditQueryNewData={setActiveEditQueryNewData}
                setErrors={setErrors}
                isSubmitted={isSubmitted}
                allTasks={allTasks}
              />
            </div>
          ))}
        {!(activeEditQuery.index === 0 || activeEditQuery.index) && (
          <ButtonBase
            className="btns theme-transparent"
            onClick={() => {
              const stateClone = { ...state, tasks: [...(state.tasks || []), {}] };
              onStateChanged({
                id: 'tasks',
                value: [
                  ...(state.tasks || []),
                  {
                    parent_uuid: state.tasks[state.tasks.length - 1]?.uuid,
                    is_grouped: false,
                  },
                ],
              });
              setActiveEditQuery({
                index: stateClone.tasks.length - 1,
                data: { parent_uuid: stateClone.tasks[stateClone.tasks.length - 1] },
              });
            }}
          >
            <span className="fas fa-plus" />
            <span className="mx-2">{t(`${translationPath}add-query`)}</span>
          </ButtonBase>
        )}
      </div>
    </>
  );
};

ViewPipelineTask.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  onOpenedDetailsSectionChanged: PropTypes.func,
  setView: PropTypes.func.isRequired,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  view: PropTypes.shape({
    key: PropTypes.number,
    data: PropTypes.shape({
      pipeline_task_uuid: PropTypes.string,
    }),
  }),
  viewInit: PropTypes.shape({
    current: PropTypes.shape({}),
  }),
  setListingFilter: PropTypes.func,
};
