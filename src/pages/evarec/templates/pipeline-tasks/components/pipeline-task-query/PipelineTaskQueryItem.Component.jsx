import React, {
  useCallback,
  useState,
  useEffect,
  useRef,
  useReducer,
  useMemo,
} from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import {
  PipelineTaskMainConditionOperatorsEnum,
  PipelineTaskQueryActionsEnum,
  TaskResponsibilityUserTypesEnum,
} from '../../../../../../enums';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { SetupsReducer, SetupsReset } from '../../../../../setups/shared';
import {
  GetAllPipelineTasksFilters,
  GetAllPipelineTasksSources,
} from '../../../../../../services';
import { NestedFilterIcon, TaskIcon } from '../../../../../../assets/icons';
import i18next from 'i18next';
import { getErrorByName, showError } from '../../../../../../helpers';
import * as yup from 'yup';
import '../../../../pipelines/managements/pipeline/sections/pipeline-drawer/PipelineDrawer.Style.scss';
import { TaskDrawer } from '../../../../../../components/Views/CandidateModals/evarecCandidateModal/CreateTaskTab/components/Task.Drawer';
import { QueryFilterPopover, QueryItemPopover } from './popovers-and-dialogs';

export const PipelineQueryItem = ({
  parentTranslationPath,
  translationPath,
  activePipeline,
  index,
  queryData,
  actions_list,
  viewMode,
  isTransparent,
  setActiveEditQueryNewData,
  cardMode,
  setErrors,
  isSubmitted,
  allTasks,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filtersList, setFiltersList] = useState({});
  const [activeItem, setActiveItem] = useState(null);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const [filterPopoverAttachedWith, setFilterPopoverAttachedWith] = useState(null);
  const [localErrors, setLocalErrors] = useState(() => ({}));
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [sourcesList, setSourcesList] = useState([]);

  const stateInitRef = useRef({
    source: null,
    filters: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const closePopoversHandler = useCallback(() => {
    setActiveItem(null);
    setPopoverAttachedWith(null);
  }, []);

  const getDynamicServicePropertiesHandler = useCallback(
    ({ apiFilter, apiSearch, apiExtraProps }) => ({
      ...(apiExtraProps || {}),
      params: {
        ...((apiExtraProps && apiExtraProps.params) || {}),
        ...(apiFilter || {}),
        query: apiSearch || null,
      },
    }),
    [],
  );

  const GetDynamicAPIOptionLabel = useMemo(
    () => (option) =>
      typeof option === 'string'
        ? option
        : option.value
          || (option.title
            && (typeof option.title === 'object'
              ? option.title[i18next.language] || option.title.en
              : option.title))
          || (option.name
            && (typeof option.name === 'object'
              ? option.name[i18next.language] || option.name.en
              : option.name))
          || `${
            option.first_name
            && (option.first_name[i18next.language] || option.first_name.en)
          }${
            option.last_name
            && ` ${option.last_name[i18next.language] || option.last_name.en}`
          }`,
    [],
  );

  const GetAllPipelineTasksFiltersHandler = useCallback(
    async ({ source, source_operator_group }) => {
      const response = await GetAllPipelineTasksFilters({
        source,
        source_operator_group,
      });
      if (response && response.status === 200) setFiltersList(response.data.results);
      else setFiltersList({});
    },
    [],
  );

  const ComputedSourceAttribute = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source?.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group?.key)
        ?.attributes?.find((it) => it.key === state.source_attribute?.key),
    [sourcesList, state.source, state.source_attribute, state.source_group],
  );

  const ComputedSourceOperatorGroup = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source?.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group?.key),
    [sourcesList, state.source, state.source_group],
  );

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.lazy((parent) =>
          yup.object().shape({
            source: yup.object().shape({
              key: yup
                .string()
                .nullable()
                .required(t(`${translationPath}this-field-is-required`)),
            }),
            source_operator: yup.object().shape({
              key: yup
                .string()
                .nullable()
                .required(t(`${translationPath}this-field-is-required`)),
            }),
            source_operator_value: yup.lazy(() => {
              if (
                parent.source_group?.operator_values
                && Object.keys(parent.source_group?.operator_values || {}).length
              )
                return yup.object().shape({
                  key: yup
                    .string()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                });
              else return yup.object().nullable();
            }),
            source_value: yup.lazy(() => {
              const options = ComputedSourceOperatorGroup?.options;
              if (options?.type === 'string')
                return yup
                  .string()
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
              else if (options?.type === 'dropdown')
                return yup.object().shape({
                  [options.primary_key]: yup
                    .string()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                });
              else return yup.mixed().nullable().notRequired();
            }),
            source_attribute: yup.lazy(() => {
              if (
                parent.source_operator?.is_negative
                && ComputedSourceOperatorGroup?.attributes?.length
              )
                return yup.object().shape({
                  key: yup
                    .string()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                });
              else return yup.object().nullable();
            }),
            // only integer
            source_attribute_value: yup.lazy(() => {
              if (parent.source_attribute)
                return yup
                  .object()
                  .shape({
                    ...ComputedSourceAttribute?.validations?.reduce(
                      (a, v) => ({
                        ...a,
                        [v.key]:
                          v.type === 'number'
                            ? yup
                              .number()
                              .nullable()
                              .required(
                                t(`${translationPath}this-field-is-required`),
                              )
                            : yup
                              .object()
                              .shape({
                                key: yup
                                  .number()
                                  .nullable()
                                  .required(
                                    t(`${translationPath}this-field-is-required`),
                                  ),
                              })
                              .nullable()
                              .required(
                                t(`${translationPath}this-field-is-required`),
                              ),
                      }),
                      {},
                    ),
                  })
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`));
              else return yup.object().nullable();
            }),
            action: yup.object().shape({
              key: yup
                .string()
                .nullable()
                .required(t(`${translationPath}this-field-is-required`)),
            }),
            action_data: yup.object().when('action', (actionVal, field) => {
              if (
                parseInt(actionVal.key)
                === PipelineTaskQueryActionsEnum.CREATE_TASK.key
              )
                return yup.object().shape({
                  title: yup
                    .string()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                  type: yup
                    .object()
                    .shape({
                      key: yup
                        .number()
                        .nullable()
                        .required(t(`${translationPath}this-field-is-required`)),
                    })
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                  enable_notification: yup
                    .bool()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                  responsibility_type: yup
                    .number()
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                  responsibility: yup.lazy(() => {
                    if (
                      parent.action_data.responsibility_type
                        !== TaskResponsibilityUserTypesEnum.Requester.key
                      && parent.action_data.responsibility_type
                        !== TaskResponsibilityUserTypesEnum.JobCreator.key
                    )
                      return yup
                        .array()
                        .nullable()
                        .required(t('this-field-is-required'));
                    else return yup.object().array().notRequired();
                  }),
                  status: yup
                    .object()
                    .shape({
                      uuid: yup
                        .string()
                        .nullable()
                        .required(t(`${translationPath}this-field-is-required`)),
                    })
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                });
              else if (
                parseInt(actionVal.key)
                === PipelineTaskQueryActionsEnum.MOVE_CANDIDATE.key
              )
                return yup.object().shape({
                  stage: yup
                    .object()
                    .shape({
                      uuid: yup
                        .string()
                        .nullable()
                        .required(t(`${translationPath}this-field-is-required`)),
                    })
                    .nullable()
                    .required(t(`${translationPath}this-field-is-required`)),
                });
              else return field;
            }),
            filters: yup.array().of(
              yup.object().shape({
                main_operator: yup
                  .object()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`)),
                  })
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`)),
                filter_key: yup
                  .object()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`)),
                  })
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`)),
                filter_group: yup
                  .object()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`)),
                  })
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`)),
                filter_operator: yup
                  .object()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`)),
                  })
                  .nullable()
                  .required(t(`${translationPath}this-field-is-required`)),
                filter_value: yup.lazy((value) => {
                  if (typeof value === 'string')
                    return yup
                      .string()
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`));
                  else if (typeof value === 'object')
                    return yup
                      .object()
                      .shape({})
                      .nullable()
                      .required(t(`${translationPath}this-field-is-required`));
                }),
              }),
            ),
          }),
        ),
      },
      state,
    );
    setLocalErrors(result);
    if (setErrors) setErrors(result);
  }, [
    state,
    setErrors,
    t,
    translationPath,
    ComputedSourceAttribute?.validations,
    ComputedSourceOperatorGroup,
  ]);

  const GetAllPipelineTasksSourcesHandler = useCallback(
    async ({ parent_uuid }) => {
      const response = await GetAllPipelineTasksSources({
        parent_uuid,
        pipeline_uuid: activePipeline.origin_pipeline_uuid || activePipeline?.uuid,
        is_grouped: state.is_grouped,
      });
      if (response && response.status === 200) setSourcesList(response.data.results);
      else {
        showError(t('Shared:failed-to-get-saved-data', response));
        setSourcesList([]);
      }
    },
    [activePipeline, t, state],
  );

  const GetUserUUIDHAndler = useCallback(({ data, type }) => {
    if (type === TaskResponsibilityUserTypesEnum.Candidate.key)
      return data?.user?.uuid || data?.uuid;
    else if (type === TaskResponsibilityUserTypesEnum.Employee.key)
      return data.user_uuid || data?.uuid;
    else if (type === TaskResponsibilityUserTypesEnum.User.key) return data?.uuid;
  }, []);

  const GetMainConditionOperator = useMemo(
    () => (item) =>
      Object.values(PipelineTaskMainConditionOperatorsEnum).find(
        (it) => it.value === item,
      ),
    [],
  );

  useEffect(() => {
    if (!viewMode)
      GetAllPipelineTasksSourcesHandler({ parent_uuid: queryData.parent_uuid });
  }, [queryData?.parent_uuid, GetAllPipelineTasksSourcesHandler, viewMode]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (!viewMode) setActiveEditQueryNewData(state);
  }, [setActiveEditQueryNewData, state, viewMode]);

  useEffect(() => {
    if (!viewMode && state.source?.key && state.source_group?.key)
      GetAllPipelineTasksFiltersHandler({
        source: state.source.key,
        source_operator_group: state.source_group.key,
      });
  }, [
    GetAllPipelineTasksFiltersHandler,
    state.source,
    state.source_group,
    viewMode,
  ]);

  useEffect(() => {
    if (queryData) onStateChanged({ id: 'edit', value: queryData });
    else onStateChanged({ id: 'edit', value: stateInitRef.current });
  }, [queryData]);

  return (
    <>
      {index > 0 && state.is_grouped === false && <div className="separator-h" />}
      <div
        className={`d-flex-column ${cardMode ? '' : 'my-3'}`}
        style={{
          ...(isTransparent && { opacity: '0.3' }),
          ...(viewMode && { pointerEvents: 'none' }),
        }}
      >
        <div className="d-flex mt-2">
          {!cardMode && (
            <div>
              <div className="query-item-label">{index + 1}</div>
            </div>
          )}
          <div className="d-flex-h-between">
            <div className="d-flex-column">
              <div className="query-source-item d-inline mx-2">
                <ButtonBase
                  className={`query-placeholder ${
                    cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                  }`}
                  onClick={(e) => {
                    if (!viewMode) {
                      setActiveItem('is_grouped');
                      setPopoverAttachedWith(e.target);
                    }
                  }}
                >
                  {t(
                    `${translationPath}${
                      GetMainConditionOperator(state.is_grouped || false).label
                    }`,
                  )}
                </ButtonBase>
                <span className="mx-1">
                  <ButtonBase
                    className={`query-placeholder ${
                      cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                    } ${!state.source ? 'active' : ''} ${
                      isSubmitted
                      && !viewMode
                      && !cardMode
                      && localErrors?.['source.key']
                        ? 'query-item-error-class'
                        : ''
                    }`}
                    onClick={(e) => {
                      if (!viewMode) {
                        setActiveItem('source');
                        setPopoverAttachedWith(e.target);
                      }
                    }}
                    disabled={
                      state.source_group?.key
                      && state.source?.key
                      && sourcesList
                        ?.find((it) => it.source_key === state.source.key)
                        ?.source_operator_groups?.find(
                          (it) => it.key === state.source_group.key,
                        )?.auto_filled_source_value
                    }
                  >
                    {state.source
                      ? state.source.value
                      : t(`${translationPath}select-event-or-object`)}
                  </ButtonBase>
                </span>
                {state.source && (
                  <span className="mx-1">
                    <ButtonBase
                      className={`query-placeholder ${
                        cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                      } ${!state.source_operator ? 'active' : 'highlighted'} ${
                        isSubmitted
                        && !viewMode
                        && !cardMode
                        && localErrors?.['source_operator.key']
                          ? 'query-item-error-class'
                          : ''
                      }`}
                      onClick={(e) => {
                        if (!viewMode) {
                          setActiveItem('source_operator');
                          setPopoverAttachedWith(e.target);
                        }
                      }}
                    >
                      {state.source_operator
                        ? state.source_operator.value
                        : t(`${translationPath}operator`)}
                    </ButtonBase>
                  </span>
                )}
                {/* Source operator value */}
                {(!!Object.keys(state.source_group?.operator_values || {}).length
                  || state.source_operator_value) && (
                  <span className="mx-1">
                    <ButtonBase
                      className={`query-placeholder ${
                        cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                      } ${!state.source_operator_value ? 'active' : ''} ${
                        isSubmitted
                        && !viewMode
                        && !cardMode
                        && !state.source_operator_value
                          ? 'query-item-error-class'
                          : ''
                      }`}
                      onClick={(e) => {
                        if (!viewMode) {
                          setActiveItem('source_operator_value');
                          setPopoverAttachedWith(e.target);
                        }
                      }}
                    >
                      {state.source_operator_value?.value
                        ? state.source_operator_value.value
                        : t(`${translationPath}select-source-operator-value`)}
                    </ButtonBase>
                  </span>
                )}
                {/* --------------------- */}
                {state.source?.key
                  && state.source_group?.key
                  && state.source_operator?.key && (
                  <span className="mx-1">
                    <ButtonBase
                      className={`query-placeholder ${
                        cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                      } ${!state.source_value ? 'active' : ''} ${
                        isSubmitted
                          && !viewMode
                          && !cardMode
                          && localErrors?.[
                            `source_value.${
                              sourcesList
                                .find((it) => it.source_key === state.source.key)
                                ?.source_operator_groups?.find(
                                  (it) => it.key === state.source_group.key,
                                )?.options?.primary_key
                            }`
                          ]
                          ? 'query-item-error-class'
                          : ''
                      }`}
                      onClick={(e) => {
                        if (!viewMode) {
                          setActiveItem('source_value');
                          setPopoverAttachedWith(e.target);
                        }
                      }}
                      disabled={
                        (state.source_group?.key
                            && state.source?.key
                            && ComputedSourceOperatorGroup?.auto_filled_source_value)
                          || ComputedSourceOperatorGroup?.options?.type === 'string'
                      }
                    >
                      {(
                        sourcesList.length
                          ? state.source_value?.[
                            ComputedSourceOperatorGroup?.options?.primary_key
                          ]
                              || ComputedSourceOperatorGroup?.options?.type === 'string'
                          : state.source_value
                      )
                        ? `${GetDynamicAPIOptionLabel(state.source_value)} ${
                          state.source_group.value
                        }`
                        : t(`${translationPath}select-source-field`)}
                    </ButtonBase>
                  </span>
                )}
                {(state.source && state.source_group && sourcesList.length
                  ? state.source_value?.[
                    sourcesList
                      .find((it) => it.source_key === state.source.key)
                      ?.source_operator_groups?.find(
                        (it) => it.key === state.source_group.key,
                      )?.options?.primary_key
                  ]
                    && !!sourcesList
                      .find((it) => it.source_key === state.source.key)
                      ?.source_operator_groups?.find(
                        (it) => it.key === state.source_group.key,
                      )?.attributes?.length
                  : state.source_attribute?.key) && (
                  <span className="mx-1">
                    <ButtonBase
                      className={`query-placeholder ${
                        cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                      } ${!state.source_attribute ? 'active' : 'highlighted'} ${
                        isSubmitted
                        && !viewMode
                        && !cardMode
                        && (localErrors?.['source_attribute']
                          || localErrors?.[`source_attribute.key`])
                          ? 'query-item-error-class'
                          : ''
                      }`}
                      onClick={(e) => {
                        if (!viewMode) {
                          setActiveItem('source_attribute');
                          setPopoverAttachedWith(e.target);
                        }
                      }}
                    >
                      {state.source_attribute?.key
                        ? state.source_attribute.value
                        : t(`${translationPath}select-source-attribute`)}
                    </ButtonBase>
                  </span>
                )}
                {state.source_attribute?.key && (
                  <span className="mx-1">
                    <ButtonBase
                      className={`query-placeholder ${
                        cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                      } ${
                        !Object.keys(state.source_attribute_value || {})
                          ? 'active'
                          : ''
                      } ${
                        isSubmitted
                        && !viewMode
                        && !cardMode
                        && (localErrors?.['source_attribute_value']
                          || !ComputedSourceAttribute?.validations?.every((it) => {
                            if (it.type === 'dropdown')
                              return (
                                !localErrors?.[
                                  `source_attribute_value.${it.key}.key`
                                ]
                                && !localErrors?.[`source_attribute_value.${it.key}`]
                              );
                            else
                              return !localErrors?.[
                                `source_attribute_value.${it.key}`
                              ];
                          }))
                          ? 'query-item-error-class'
                          : ''
                      }`}
                      // TODO: Add local error check
                      onClick={(e) => {
                        if (!viewMode) {
                          setActiveItem('source_attribute_value');
                          setPopoverAttachedWith(e.target);
                        }
                      }}
                    >
                      {Object.keys(state.source_attribute_value || {}).length
                        ? ComputedSourceAttribute?.validations
                          ?.map(
                            (it) =>
                              (it.type === 'dropdown'
                                ? state.source_attribute_value?.[it.key]?.value
                                : state.source_attribute_value?.[it.key]) || '-',
                          )
                          .join(' ')
                          || Object.values(state.source_attribute_value)
                            .map((it) => it.value || it)
                            .join(' ')
                        : t(`${translationPath}select-source-attribute-value`)}
                    </ButtonBase>
                  </span>
                )}
              </div>
              {state.filters?.map((filterItem, idx) => (
                <div
                  key={`${idx}-filter-item`}
                  className="query-source-item mx-2 d-flex-v-center-h-between"
                >
                  <div>
                    {!cardMode && (
                      <span className={`${cardMode ? 'fz-13px' : 'fz-16px'}`}>
                        <NestedFilterIcon />
                      </span>
                    )}
                    <span className="mx-1">
                      <ButtonBase
                        id={idx}
                        className={`query-placeholder ${
                          cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                        } ${!filterItem.main_operator ? 'active' : 'highlighted'} ${
                          isSubmitted
                          && !viewMode
                          && !cardMode
                          && localErrors?.[`filters[${idx}].main_operator`]
                            ? 'query-item-error-class'
                            : ''
                        }`}
                        onClick={(e) => {
                          if (!viewMode) {
                            setActiveItem('main_operator');
                            setPopoverAttachedWith(e.target);
                          }
                        }}
                      >
                        {filterItem.main_operator
                          ? filterItem.main_operator.value
                          : t(`${translationPath}operator`)}
                      </ButtonBase>
                    </span>
                    {filterItem.main_operator && (
                      <span className="mx-1">
                        <ButtonBase
                          id={idx}
                          className={`query-placeholder ${
                            cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                          } ${filterItem.filter_key?.key ? '' : 'active'} ${
                            isSubmitted
                            && !viewMode
                            && !cardMode
                            && localErrors?.[`filters[${idx}].filter_key`]
                              ? 'query-item-error-class'
                              : ''
                          }`}
                          onClick={(e) => {
                            if (!viewMode) {
                              setActiveItem('filter_key');
                              setPopoverAttachedWith(e.target);
                            }
                          }}
                        >
                          {filterItem.filter_group?.key && filterItem.filter_key?.key
                            ? filterItem.filter_key.value
                            : t(`${translationPath}filter-key`)}
                        </ButtonBase>
                      </span>
                    )}
                    {filterItem.filter_key && (
                      <span className="mx-1">
                        <ButtonBase
                          id={idx}
                          className={`query-placeholder ${
                            cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                          } ${
                            !filterItem.filter_operator ? 'active' : 'highlighted'
                          } ${
                            isSubmitted
                            && !viewMode
                            && !cardMode
                            && localErrors?.[`filters[${idx}].filter_operator`]
                              ? 'query-item-error-class'
                              : ''
                          }`}
                          onClick={(e) => {
                            if (!viewMode) {
                              setActiveItem('filter_operator');
                              setPopoverAttachedWith(e.target);
                            }
                          }}
                        >
                          {filterItem.filter_operator
                            ? filterItem.filter_operator.value
                            : t(`${translationPath}operator`)}
                        </ButtonBase>
                      </span>
                    )}
                    {filterItem.filter_operator && (
                      <span className="mx-1">
                        <ButtonBase
                          id={idx}
                          className={`query-placeholder ${
                            cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                          } ${!filterItem.filter_value ? 'active' : ''} ${
                            isSubmitted
                            && !viewMode
                            && !cardMode
                            && localErrors?.[`filters[${idx}].filter_value`]
                              ? 'query-item-error-class'
                              : ''
                          }`}
                          onClick={(e) => {
                            if (!viewMode) {
                              setActiveItem('filter_value');
                              setPopoverAttachedWith(e.target);
                            }
                          }}
                        >
                          {filterItem.filter_value
                            ? GetDynamicAPIOptionLabel(filterItem.filter_value)
                            : t(`${translationPath}filter-value`)}
                        </ButtonBase>
                      </span>
                    )}
                  </div>
                  {!cardMode && !viewMode && (
                    <ButtonBase
                      className="btns btns-icon theme-transparent"
                      onClick={() => {
                        let oldValue = [...(state.filters || [])].filter(
                          (it, localIdx) => localIdx !== idx,
                        );
                        onStateChanged({
                          id: 'filters',
                          value: [...oldValue],
                        });
                      }}
                    >
                      <span className="fas fa-times" />
                    </ButtonBase>
                  )}
                </div>
              ))}
            </div>
            {!viewMode && (
              <div className="pb-2 h-100">
                <ButtonBase
                  className="btns btns-icon theme-transparent"
                  onClick={(e) => setFilterPopoverAttachedWith(e.target)}
                >
                  <span className="fas fa-plus " />
                </ButtonBase>
              </div>
            )}
          </div>
        </div>
        <div
          className={`query-action-item d-flex-v-center mx-2 ${
            cardMode ? 'mb-3' : 'my-3'
          }`}
        >
          {!cardMode && <span className="fas fa-arrow-right" />}
          <div className={`${cardMode ? 'mx-1' : 'mx-2'}`}>
            <span className={`${cardMode ? '' : 'mx-1'}`}>
              <ButtonBase className={`${cardMode ? 'fz-13px c-gray' : 'fz-16px'}`}>
                {t(`${translationPath}then`)}
              </ButtonBase>
            </span>
            <span className="mx-1">
              <ButtonBase
                className={`query-placeholder ${
                  cardMode ? 'no-underline card-mode fz-13px' : 'fz-16px'
                } ${!state.action?.key ? 'active' : ''} ${
                  isSubmitted
                  && !viewMode
                  && !cardMode
                  && localErrors?.['action.key']
                    ? 'query-item-error-class'
                    : ''
                }`}
                onClick={(e) => {
                  if (!viewMode) {
                    setActiveItem('action');
                    setPopoverAttachedWith(e.target);
                  }
                }}
              >
                {state.action?.key
                  ? state.action.value
                  : t(`${translationPath}action`)}
              </ButtonBase>
            </span>
            {state.action?.key && (
              <span className="mx-1">
                <ButtonBase
                  className={`${
                    cardMode ? 'fz-13px' : 'btns theme-outline fz-16px'
                  } ${!state.action?.key ? 'active' : ''} ${
                    isSubmitted
                    && !viewMode
                    && !cardMode
                    && localErrors
                    && (localErrors['action_data.title']
                      || localErrors['action_data.type.uuid']
                      || localErrors['action_data.enable_notification']
                      || localErrors['action_data.responsibility']
                      || localErrors['action_data.responsibility_type']
                      || localErrors['action_data.status.uuid']
                      || localErrors['action_data.stage.uuid'])
                      ? 'query-item-error-class with-border'
                      : ''
                  }`}
                  onClick={(e) => {
                    if (!viewMode)
                      if (
                        PipelineTaskQueryActionsEnum.CREATE_TASK.key
                        === state.action.key
                      )
                        setIsTaskDrawerOpen(true);
                      else {
                        setPopoverAttachedWith(e.target);
                        setActiveItem('action_data');
                      }
                  }}
                >
                  {state.action.key
                    === PipelineTaskQueryActionsEnum.CREATE_TASK.key && (
                    <div className="d-flex-center">
                      {!cardMode && (
                        <div className="d-inline-flex-center icon-wrapper p-1">
                          <TaskIcon height="14" width="14" />
                        </div>
                      )}
                      <div
                        className={`texts-truncate mx-2 ${
                          cardMode ? 'fz-13px' : 'fz-14px'
                        } max-width-100`}
                      >
                        {state.action_data.title || t(`${translationPath}untitled`)}
                      </div>
                    </div>
                  )}
                  {state.action.key
                    === PipelineTaskQueryActionsEnum.MOVE_CANDIDATE.key && (
                    <div className="d-flex-center">
                      {!cardMode && (
                        <div className="d-inline-flex-center icon-wrapper p-1">
                          <span className="fas fa-arrow-right" />
                        </div>
                      )}
                      <div
                        className={`texts-truncate mx-2 ${
                          cardMode ? 'fz-13px' : 'fz-14px'
                        } max-width-100`}
                      >
                        {/* TODO: Remove late the dummy value */}
                        {(state.action_data.stage
                          && GetDynamicAPIOptionLabel(state.action_data.stage))
                          || t(`${translationPath}stage`)}
                      </div>
                    </div>
                  )}
                </ButtonBase>
              </span>
            )}
          </div>
        </div>
        {popoverAttachedWith && (
          <QueryItemPopover
            popoverAttachedWith={popoverAttachedWith}
            closePopoversHandler={closePopoversHandler}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            sourcesList={sourcesList}
            onStateChanged={onStateChanged}
            queryData={queryData}
            state={state}
            isSubmitted={isSubmitted}
            localErrors={localErrors}
            getDynamicServicePropertiesHandler={getDynamicServicePropertiesHandler}
            GetDynamicAPIOptionLabel={GetDynamicAPIOptionLabel}
            filtersList={filtersList}
            actions_list={actions_list}
            activePipeline={activePipeline}
            activeItem={activeItem}
            allTasks={allTasks}
          />
        )}
        {filterPopoverAttachedWith && (
          <QueryFilterPopover
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            filterPopoverAttachedWith={filterPopoverAttachedWith}
            setFilterPopoverAttachedWith={setFilterPopoverAttachedWith}
            onStateChanged={onStateChanged}
            state={state}
          />
        )}
        {isTaskDrawerOpen && (
          <TaskDrawer
            drawerOpen={isTaskDrawerOpen}
            setDrawerOpen={setIsTaskDrawerOpen}
            parentTranslationPath="EvarecCandidateModel"
            activeTask={activeItem}
            setActiveTask={setActiveItem}
            createTaskModeOn={isTaskDrawerOpen}
            setCreateTaskModeOn={setIsTaskDrawerOpen}
            getDataOnlyHandler={(data) => {
              onStateChanged({
                id: 'action_data',
                value: {
                  ...data,
                  title: data.title,
                  type: data.type?.key ? data.type : {},
                  status: data.status?.uuid ? data.status : {},
                  ...(TaskResponsibilityUserTypesEnum.Requester.key
                    !== data.responsibility_type
                    && TaskResponsibilityUserTypesEnum.JobCreator.key
                      !== data.responsibility_type && {
                    responsibility_uuid: data.responsibility?.map(
                      (it) => it.user_uuid || it.uuid,
                    ),
                  }),
                  enable_notification: data.enable_notification,
                  responsibility_type: data.responsibility_type,
                  responsibility: data.responsibility?.map((it) => ({
                    ...it,
                    user_uuid: GetUserUUIDHAndler({
                      data: it,
                      type: data.responsibility_type,
                    }),
                  })),
                },
              });
              setIsTaskDrawerOpen(false);
            }}
            editData={state.action_data}
            isPipelineTask
          />
        )}
      </div>
    </>
  );
};

PipelineQueryItem.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    origin_pipeline_uuid: PropTypes.string,
  }),
  index: PropTypes.number.isRequired,
  queryData: PropTypes.shape({
    uuid: PropTypes.string,
    parent_uuid: PropTypes.string,
  }),
  sources_list: PropTypes.array,
  actions_list: PropTypes.array,
  viewMode: PropTypes.bool,
  isTransparent: PropTypes.bool,
  setActiveEditQueryNewData: PropTypes.func,
  cardMode: PropTypes.bool,
  setErrors: PropTypes.func,
  isSubmitted: PropTypes.bool,
  allTasks: PropTypes.array,
};
