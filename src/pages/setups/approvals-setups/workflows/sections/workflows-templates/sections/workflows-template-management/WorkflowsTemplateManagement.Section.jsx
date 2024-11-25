import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonBase from '@mui/material/ButtonBase';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import moment from 'moment';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import {
  getErrorByName,
  LanguageUpdateKey,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import {
  getLanguageTitle,
  getNotSelectedLanguage,
  PropertiesComponent,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../shared';
import {
  CreateSetupsWorkflowsTemplate,
  DynamicService,
  GetAllBuilderTemplates,
  GetAllFormTemplates,
  GetAllSetupsEmployees,
  GetSetupsWorkflowTemplateById,
  UpdateSetupsWorkflowsTemplate,
} from '../../../../../../../../services';
import './WorkflowsTemplateManagement.Style.scss';
import {
  LoaderComponent,
  RadiosComponent,
  SwitchComponent,
} from '../../../../../../../../components';
import {
  DynamicFormTypesEnum,
  WorkflowsOperationsEnum,
  WorkflowsPeriodTypesEnum,
  WorkflowsStaticDropdownsEnum,
} from '../../../../../../../../enums';
import { HierarchyListDialog } from './dialogs';
import { useEventListener } from '../../../../../../../../hooks';

export const WorkflowsTemplateManagementSection = ({
  activeItem,
  onSave,
  isOpenChanged,
  selectedWorkflowType,
  approvals,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const isMountedRef = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedItem, setFocusedItem] = useState(null);
  const [approvalsList, setApprovalsList] = useState({
    results: [],
    totalCount: 0,
  });
  const [searchApprovals, setSearchApprovals] = useState(null);
  const userReducer = useSelector((state) => state?.userReducer);
  const [currentHierarchyApproval, setCurrentHierarchyApproval] = useState(null);
  const selectedBranchReducer = useSelector((state) => state?.selectedBranchReducer);
  const bodyRef = useRef(null);
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    query: '',
  });
  const [isForceToReload, setIsForceToReload] = useState(false);
  const [approvalType, setApprovalType] = useState(
    (approvals && approvals.length > 0 && approvals[0].key) || null,
  );
  // eslint-disable-next-line max-len
  // const [conditionTypes] = useState(() => Object.values(WorkflowsStaticDropdownsEnum.Conditions).map((item) => ({
  //   ...item,
  //   value: t(item.value),
  // })));
  const [operations] = useState(() =>
    Object.values(WorkflowsOperationsEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [periodTypes] = useState(() =>
    Object.values(WorkflowsPeriodTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );

  const stateInitRef = useRef({
    title: {},
    notes: {},
    type: selectedWorkflowType.key,
    status: false,
    allow_conditions: false,
    conditions: [],
    approvals: [],
    allow_watchers: false,
    watchers: [],
    notifications: [
      {
        title: t(`${translationPath}approvals`),
        type: 1,
        on_request: false,
        on_approval: false,
        on_decline: false,
        on_cancel_withdraw: false,
      },
      {
        title: t(`${translationPath}watchers`),
        type: 2,
        on_request: false,
        on_approval: false,
        on_decline: false,
        on_cancel_withdraw: false,
      },
    ],
    allow_escalation: false,
    escalation: {
      period: null,
      period_type: WorkflowsPeriodTypesEnum.Days.key,
      repeat: null,
      // repeat_from: '16:11',
      // repeat_to: '20:11',
      // recurring: 2,
      repeat_from: null,
      repeat_to: null,
      recurring: null,
      auto_approve: false,
      auto_delegate: false,
      auto_scale_touched: false,
      // approve_delegate_after: 1,
      approve_delegate_after: null,
    },
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  // /**
  //  * @param groupOrRelatedTo - the current enum by group
  //  * @param items - the current enum list (as array)
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to return the entire value Object by group
  //  */
  // const getEnumsByGroup = useMemo(
  //   () => (groupOrRelatedTo, items) => items.filter(
  //     (item) => groupOrRelatedTo
  //         && (item.group === groupOrRelatedTo
  //           || (item.relatedTo && item.relatedTo.some((el) => el === groupOrRelatedTo))),
  //   ),
  //   [],
  // );

  /**
   * @param key - the current enum key
   * @param enums - the current enum list (as object)
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the entire value Object by key
   */
  const getEnumValueByKey = useMemo(
    () => (key, enums) => Object.values(enums).find((item) => item.key === key),
    [],
  );

  /**
   * @param key - the current enum key
   * @param localArray - the current enum list (as object)
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the entire value Object by key
   */
  const getValueByKey = useMemo(
    // eslint-disable-next-line max-len
    () =>
      (key = approvalType, localArray = approvals) =>
        localArray.find((item) => item.key === key) || {},
    [approvalType, approvals],
  );

  /**
   * @param key - the current condition by type
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current active
   */
  const getActiveCondition = useMemo(
    // eslint-disable-next-line max-len
    () =>
      (key, typeKey = 'condition') =>
        selectedWorkflowType.conditions.find((item) => item.key === key)?.[
          typeKey
        ] || [],
    [selectedWorkflowType.conditions],
  );

  /**
   * @param key - the current approval type
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if it can add more direct managers to approvals or not
   */
  const getIsDisabledApprovalsAdd = useCallback(
    (key = approvalType) =>
      state.approvals.length > 0
      && key === 106
      && state.approvals.filter((item) => item.key === 101).length
        <= state.approvals.filter((item, index) => item.key === 106 && index !== 0)
          .length,
    [approvalType, state.approvals],
  );

  /**
   * @param key - the current approval type
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the last available employee without a direct manager
   */
  const getLastEmptyEmployeeIndex = useCallback(
    () =>
      state.approvals
        .map(
          (item, index, items) =>
            item.key === 101
            && (index === items.length - 1 || items[index + 1].key !== 106),
        )
        .lastIndexOf(true),
    [state.approvals],
  );

  /**
   * @param itemIndex - the current approval index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return if the direct manager is
   * connected with employee or not
   */
  const getIsValidDirectManager = useCallback(
    (itemIndex) => itemIndex !== 0 && state.approvals[itemIndex - 1].key === 101,
    [state.approvals],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to control the props of autocomplete from parent
   */
  const getDynamicServicePropertiesHandler = useCallback(
    // eslint-disable-next-line max-len
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

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          title: yup.lazy((obj) =>
            yup
              .object()
              .shape(
                Object.keys(obj).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  }),
                  {},
                ),
              )
              .nullable()
              .test(
                'isRequired',
                `${t('please-add-at-least')} ${1} ${t('name')}`,
                (value) => value && Object.keys(value).length > 0,
              ),
          ),
          notes: yup.lazy((obj) =>
            yup
              .object()
              .shape(
                Object.keys(obj).reduce(
                  (newMap, key) => ({
                    ...newMap,
                    [key]: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  }),
                  {},
                ),
              )
              .nullable()
              .test(
                'isRequired',
                `${t('please-add-at-least')} ${1} ${t('note')}`,
                (value) => value && Object.keys(value).length > 0,
              ),
          ),
          conditions: yup
            .array()
            .when(
              'allow_conditions',
              (value, field) =>
                (value
                  && field
                    .of(
                      yup.object({
                        operation: yup
                          .number()
                          .nullable()
                          .required(t('this-field-is-required')),
                        type: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                        condition: yup
                          .number()
                          .nullable()
                          .required(t('this-field-is-required')),
                        conditional_section_uuid: yup
                          .string()
                          .nullable()
                          .required(t('this-field-is-required')),
                        template_uuid: yup
                          .array(yup.string())
                          .nullable()
                          .when('type', (value, schema) => {
                            if (+value === 35 || +value === 19)
                              return schema.min(
                                1,
                                `${t('please-add-at-least')} ${1} ${t(
                                  `${translationPath}template`,
                                )}`,
                              );
                            return schema;
                          }),
                      }),
                    )
                    .min(
                      1,
                      `${t('please-add-at-least')} ${1} ${t(
                        `${translationPath}condition`,
                      )}`,
                    ))
                || field,
            )
            .nullable(),
          approvals: yup
            .array()
            .of(
              yup.object({
                condition: yup
                  .mixed()
                  .nullable()
                  .required(t('this-field-is-required')),
              }),
            )
            .nullable()
            .min(
              1,
              `${t('please-add-at-least')} ${1} ${t(`${translationPath}approval`)}`,
            ),
          watchers: yup
            .array()
            .of(yup.string())
            .nullable()
            .when(
              'allow_watchers',
              (value, field) =>
                (value
                  && field.min(
                    1,
                    `${t('please-add-at-least')} ${1} ${t(
                      `${translationPath}watcher`,
                    )}`,
                  ))
                || field,
            ),
          allow_escalation: yup.bool().nullable(),
          escalation: yup
            .object()
            .shape({
              period: yup
                .number()
                .nullable()
                .test(
                  'isRequired',
                  t('this-field-is-required'),
                  (value) => value || value === 0 || !state.allow_escalation,
                )
                .test(
                  'isNeedAtLeastOneFieldMoreThan',
                  t(`${translationPath}at-least-this-field-need-to-be-more-than-0`),
                  (value, { parent }) => value !== 0 || parent.repeat !== 0,
                ),
              period_type: yup
                .number()
                .nullable()
                .test(
                  'isRequired',
                  t('this-field-is-required'),
                  (value) => value || !state.allow_escalation,
                ),
              repeat: yup
                .number()
                .nullable()
                .test(
                  'isRequired',
                  t('this-field-is-required'),
                  (value) => value || value === 0 || !state.allow_escalation,
                )
                .test(
                  'isNeedAtLeastOneFieldMoreThan',
                  t(`${translationPath}at-least-this-field-need-to-be-more-than-0`),
                  (value, { parent }) => value !== 0 || parent.period !== 0,
                ),
              repeat_from: yup
                .string()
                .nullable()
                // .test(
                //   'isRequired',
                //   t('this-field-is-required'),
                //   (value) => value || !state.allow_escalation
                // )
                .test(
                  'isLessThan',
                  t(`${translationPath}from-field-must-be-less-than-to`),
                  (value) =>
                    !value
                    || !state.allow_escalation
                    || !state.escalation
                    || !state.escalation.repeat_to
                    || moment(value, 'HH:mm').isBefore(
                      moment(state.escalation.repeat_to, 'HH:mm'),
                    ),
                ),
              repeat_to: yup.string().nullable(),
              // .test(
              //   'isRequired',
              //   t('this-field-is-required'),
              //   (value) => value || !state.allow_escalation
              // )
              // ,
              // recurring: yup
              //   .number()
              //   .nullable()
              //   .test(
              //     'isRequired',
              //     t('this-field-is-required'),
              //     (value) => value || value === 0 || !state.allow_escalation
              //   )
              auto_approve: yup.bool().nullable(),
              auto_delegate: yup.bool().nullable(),
              auto_scale: yup.bool().nullable(),
              // .test(
              //   'isRequired',
              //   t(`${translationPath}auto-scale-description`),
              //   (value, { parent }) =>
              //     value || parent.auto_approve || parent.auto_delegate
              // )
              approve_delegate_after: yup.number().nullable(),
              // .test(
              //   'isRequired',
              //   t('this-field-is-required'),
              //   (value) =>
              //     value
              //     || value === 0
              //     || !state.allow_escalation
              //     || (!state.escalation.auto_approve
              //       && !state.escalation.auto_delegate)
              // )
            })
            .nullable(),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t, translationPath]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetSetupsWorkflowTemplateById({
      uuid: activeItem && activeItem.uuid,
    });
    if (!isMountedRef.current) return;
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: {
          ...response.data.results,
          escalation: {
            ...(response.data.results.escalation || {}),
            period_type:
              (response.data.results.escalation || {}).period_type
              || WorkflowsPeriodTypesEnum.Days.key,
          },
        },
      });
    // else showError(t('Shared:failed-to-get-saved-data'), response);
    // isOpenChanged();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to add new language key
   */
  const addLanguageHandler = (key, item) => () => {
    const localItem = { ...item };
    localItem[getNotSelectedLanguage(languages, localItem, -1)[0].code] = null;
    setState({ id: key, value: localItem });
  };

  /**
   * @param key - the state key to update
   * @param item - the value of the key to update
   * @param code - the code to delete
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove language key
   */
  const removeLanguageHandler = useCallback(
    (key, item, code) => () => {
      const localItem = { ...item };
      delete localItem[code];
      setState({ id: key, value: localItem });
    },
    [],
  );

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove condition by index
   */
  const removeConditionsHandler = useCallback(
    (index) => () => {
      const localItems = [...state.conditions];
      localItems.splice(index, 1);
      setState({ id: 'conditions', value: localItems });
    },
    [state.conditions],
  );

  /**
   * @param index
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove approval by index
   */
  const removeApprovalHandler = useCallback(
    (index) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (focusedItem && focusedItem.isRightSide && focusedItem.itemIndex === index)
        setFocusedItem(null);
      const localApprovals = [...state.approvals];
      // if (localApprovals[index].key === approvalType) {
      //   const itemToPush = { ...localApprovals[index] };
      //   setApprovalsList((items) => {
      //     const localItems = { ...items };
      //     localItems.results.push(itemToPush);
      //     return localItems;
      //   });
      // }
      localApprovals.splice(index, 1);
      setState({ id: 'approvals', value: localApprovals });
    },
    [focusedItem, state.approvals],
  );

  /**
   * @param key - state key
   * @param type - 'increment, decrement'
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle period increment and decrement
   */
  const responsePeriodHandler = (key, type) => () => {
    let localResponsePeriod = state.escalation?.[key] || 0;
    if (type === 'increment') localResponsePeriod += 1;
    else localResponsePeriod -= 1;
    setState({
      parentId: 'escalation',
      id: key,
      value: localResponsePeriod,
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (
      state.approvals.some(
        (item, index) =>
          index !== 0 && item.key === 106 && !getIsValidDirectManager(index),
      )
    )
      return;
    if (Object.keys(errors).length > 0) {
      if (errors.title) showError(errors.title.message);
      if (errors.notes) showError(errors.notes.message);
      if (errors.conditions) showError(errors.conditions.message);
      if (errors.approvals) showError(errors.approvals.message);
      if (
        !(
          Object.keys(errors).length === 1
          && errors[`approvals[${state.approvals.length - 1}].condition`]
        )
      )
        return;
    }
    setIsLoading(true);
    let response;
    if (activeItem) response = await UpdateSetupsWorkflowsTemplate(state);
    else response = await CreateSetupsWorkflowsTemplate(state);
    if (!isMountedRef.current) return;
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'workflows-template-updated-successfully')
            || 'workflows-template-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
      if (!activeItem)
        window?.ChurnZero?.push([
          'trackEvent',
          `Create new ${(
            selectedWorkflowType?.title?.en || 'workflow'
          ).toLowerCase()} template`,
          `Create new ${(
            selectedWorkflowType?.title?.en || 'workflow'
          ).toLowerCase()} template from setups`,
          1,
          {},
        ]);
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'branch-setups-update-failed')
            || 'branch-setups-create-failed'
          }`,
        ),
        response,
      );
  };
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get approvals by type
   */
  const getSetupsWorkflowsApprovalsByType = useCallback(async () => {
    if (!approvalType) {
      setApprovalsList({
        results: [],
        totalCount: 0,
      });
      setIsLoading(false);
      return;
    }
    const response = await DynamicService({
      path: getValueByKey().api.end_point,
      method: getValueByKey().api.method,
      params:
        { ...filter, company_uuid: selectedBranchReducer.uuid, all_employee: 1 }
        || null,
    });
    if (!isMountedRef.current) return;
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      const { data } = response;
      const localResults = (data.results.direct || data.results).map((item) => ({
        key: approvalType,
        approvals_section_uuid: item.key || item.uuid,
        value:
          item.value
          || (item.title && (item.title[i18next.language] || item.title.en))
          || (item.name && (item.name[i18next.language] || item.name.en))
          || `${
            item.first_name
            && (item.first_name[i18next.language] || item.first_name.en)
          }${
            item.last_name
            && ` ${item.last_name[i18next.language] || item.last_name.en}`
          }`,
      }));

      if (filter.page === 1)
        setApprovalsList((items) => ({
          ...items,
          results: localResults,
          totalCount: data.paginate?.total || localResults.length,
        }));
      else
        setApprovalsList((items) => ({
          ...items,
          results: items.results.concat(localResults),
          totalCount: data.paginate?.total || localResults.length,
        }));
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [
    approvalType,
    filter,
    getValueByKey,
    isOpenChanged,
    selectedBranchReducer.uuid,
    t,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is added new condition
   */
  const addConditionHandler = () => {
    const localConditions = [...(state.conditions || [])];
    localConditions.push({
      operation: WorkflowsOperationsEnum.And.key,
      type: null,
      condition: null,
      conditional_section_uuid: null,
    });
    setState({ id: 'conditions', value: localConditions });
  };

  /**
   * @param dropEvent - event generated by drag handler
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle drag and drop
   */
  const onDragEndHandler = (dropEvent) => {
    if (
      !dropEvent
      || !dropEvent.destination
      || !dropEvent.destination.droppableId
      || dropEvent.destination.droppableId === 'approvalsLeftSectionDroppableId'
    )
      return;
    const localApprovals = [...(state.approvals || [])];
    const localApprovalsList = [...approvalsList.results];
    if (dropEvent.destination.droppableId === dropEvent.source.droppableId) {
      localApprovals.splice(
        dropEvent.destination.index,
        0,
        localApprovals.splice(dropEvent.source.index, 1)[0],
      );
      setState({ id: 'approvals', value: localApprovals });
      setFocusedItem((items) => ({
        ...items,
        itemIndex: dropEvent.destination.index,
      }));
    } else if (approvalType === WorkflowsStaticDropdownsEnum.Approvals.Hierarchy.key)
      setCurrentHierarchyApproval({
        ...focusedItem,
        to: dropEvent.destination.index,
      });
    else {
      // todo:- use uuid or key instead of index for read or split from approvalList
      localApprovals.splice(
        dropEvent.destination.index,
        0,
        localApprovalsList[dropEvent.source.index],
      );
      // localApprovalsList.splice(dropEvent.source.index, 1);
      setState({ id: 'approvals', value: localApprovals });
      setFocusedItem(null);
      // setApprovalsList((items) => ({ ...items, results: localApprovalsList }));
    }
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle move to right list
   */
  const moveToRight = () => {
    if (approvalType === WorkflowsStaticDropdownsEnum.Approvals.Hierarchy.key)
      setCurrentHierarchyApproval({
        ...focusedItem,
        to: state.approvals.length - 1,
      });
    else {
      const localApprovals = [...state.approvals];
      const localApprovalsList = [...approvalsList.results];
      if (approvalType === 106 && localApprovals.length > 0) {
        const firstEmptyEmployeeIndex = getLastEmptyEmployeeIndex();
        if (firstEmptyEmployeeIndex !== -1)
          localApprovals.splice(
            firstEmptyEmployeeIndex + 1,
            0,
            localApprovalsList[focusedItem.itemIndex],
          );
      } else localApprovals.push(localApprovalsList[focusedItem.itemIndex]);
      // localApprovalsList.splice(focusedItem.itemIndex, 1);
      setState({ id: 'approvals', value: localApprovals });
      setFocusedItem((items) => ({
        ...items,
        itemIndex: localApprovals.length - 1,
        isRightSide: true,
      }));
      // setApprovalsList((items) => ({ ...items, results: localApprovalsList }));
    }
  };

  /**
   * @param direction - up, down
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle move to up and down of
   * approvals list
   */
  const moveToUpAndDownHandler = (direction) => () => {
    const localApprovals = [...state.approvals];
    localApprovals.splice(
      direction === 'up' ? focusedItem.itemIndex - 1 : focusedItem.itemIndex + 1,
      0,
      localApprovals.splice(focusedItem.itemIndex, 1)[0],
    );
    setFocusedItem((items) => ({
      ...items,
      itemIndex:
        direction === 'up' ? focusedItem.itemIndex - 1 : focusedItem.itemIndex + 1,
    }));
    setState({ id: 'approvals', value: localApprovals });
  };
  /**
   * @param key - the current enum key
   * @param localArray - the current enum list (as object)
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to lode more data on scroll if there is more total than the results
   */
  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight
      && approvalsList.results.length < approvalsList.totalCount
      && !isLoading
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [bodyRef, approvalsList.results.length, approvalsList.totalCount, isLoading]);
  useEventListener('scroll', onScrollHandler, bodyRef.current);
  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else {
      showError(t('Shared:failed-to-get-languages'));
      isOpenChanged();
    }
  }, [isOpenChanged, t, userReducer]);

  useEffect(() => {
    if (!activeItem) {
      const localEnLanguage = languages.find((item) => item.code === 'en');
      if (localEnLanguage) {
        setState({
          id: 'title',
          value: {
            [localEnLanguage.code]: null,
          },
        });
        setState({
          id: 'notes',
          value: {
            [localEnLanguage.code]: null,
          },
        });
      }
    }
  }, [activeItem, languages]);

  // this to get
  useEffect(() => {
    setIsLoading(true);
    getSetupsWorkflowsApprovalsByType();
  }, [getSetupsWorkflowsApprovalsByType, filter]);

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  return (
    <>
      <form
        noValidate
        onSubmit={saveHandler}
        className="workflow-type-management-section-wrapper"
      >
        <div className="page-header-wrapper px-2 pb-3">
          <div className="d-inline-flex flex-wrap px-2">
            <span className="header-text-x2 d-flex mb-1">
              <ButtonBase
                className="btns-icon theme-transparent mr-3-reversed"
                onClick={isOpenChanged}
              >
                <i className="fas fa-arrow-left" />
              </ButtonBase>
              <span className="text-gray pr-2-reversed">
                {t(`${translationPath}workflows`)}
              </span>
              <span className="text-gray px-1">/</span>
              <span className="text-gray">
                {(selectedWorkflowType
                  && selectedWorkflowType.title
                  && (selectedWorkflowType.title[i18next.language]
                    || selectedWorkflowType.title.en))
                  || 'N/A'}
              </span>
              <span className="text-gray px-1">/</span>
              <span>
                {t(
                  `${translationPath}${
                    (activeItem && 'edit-template') || 'add-template'
                  }`,
                )}
              </span>
            </span>
            <span className="description-text">
              {t(`${translationPath}template-description`)}
            </span>
          </div>
        </div>
        <div className="px-3 mb-2">
          <div className="separator-h" />
        </div>
        <div className="d-inline-flex px-3">
          <SwitchComponent
            idRef="TemplateIsActiveSwitchRef"
            label="template-is-active"
            isChecked={state.status}
            isReversedLabel
            onChange={(event, newValue) => {
              setState({ id: 'status', value: newValue });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-flex px-3 mb-2">
          <span className="description-text">
            {t(`${translationPath}template-is-active-description`)}
          </span>
        </div>
        <div className="d-flex-v-center-h-end">
          <ButtonBase
            className="btns theme-transparent mx-3 mb-2"
            onClick={addLanguageHandler('title', state.title)}
            disabled={
              isLoading
              || languages.length === 0
              || (state.title && languages.length === Object.keys(state.title).length)
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t('add-language')}</span>
          </ButtonBase>
        </div>
        {state.title
          && Object.entries(state.title).map((item, index) => (
            <React.Fragment key={`namesKey${item[0]}`}>
              {index > 0 && (
                <div className="d-flex-h-between">
                  <SharedAutocompleteControl
                    editValue={item[0]}
                    placeholder="select-language"
                    title="language"
                    stateKey="title"
                    onValueChanged={(newValue) => {
                      let localItems = { ...state.title };
                      // eslint-disable-next-line prefer-destructuring
                      localItems = LanguageUpdateKey(
                        { [item[0]]: newValue.value },
                        localItems,
                      );
                      onStateChanged({ id: 'title', value: localItems });
                    }}
                    initValues={getNotSelectedLanguage(
                      languages,
                      state.title,
                      index,
                    )}
                    initValuesKey="code"
                    initValuesTitle="title"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <ButtonBase
                    className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                    onClick={removeLanguageHandler('title', state.title, item[0])}
                  >
                    <span className="fas fa-times" />
                    <span className="px-1">{t('remove-language')}</span>
                  </ButtonBase>
                </div>
              )}
              <SharedInputControl
                editValue={item[1]}
                parentTranslationPath={parentTranslationPath}
                stateKey={item[0]}
                parentId="title"
                errors={errors}
                errorPath={`title.${[item[0]]}`}
                title={`${t(`${translationPath}name`)} (${getLanguageTitle(
                  languages,
                  item[0],
                )})`}
                isSubmitted={isSubmitted}
                onValueChanged={onStateChanged}
              />
            </React.Fragment>
          ))}
        <div className="d-flex-v-center-h-between">
          <div className="header-text px-3">
            <span>{t(`${translationPath}notes`)}</span>
          </div>
          <ButtonBase
            className="btns theme-transparent mx-3 mb-2"
            onClick={addLanguageHandler('notes', state.notes)}
            disabled={
              isLoading
              || languages.length === 0
              || (state.notes && languages.length === Object.keys(state.notes).length)
            }
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t('add-language')}</span>
          </ButtonBase>
        </div>
        {state.notes
          && Object.entries(state.notes).map((item, index) => (
            <React.Fragment key={`notesKey${item[0]}`}>
              {index > 0 && (
                <div className="d-flex-h-between">
                  <SharedAutocompleteControl
                    editValue={item[0]}
                    placeholder="select-language"
                    title="language"
                    stateKey="notes"
                    onValueChanged={(newValue) => {
                      let localItems = { ...state.notes };
                      // eslint-disable-next-line prefer-destructuring
                      localItems = LanguageUpdateKey(
                        { [item[0]]: newValue.value },
                        localItems,
                      );
                      onStateChanged({ id: 'notes', value: localItems });
                    }}
                    initValues={getNotSelectedLanguage(
                      languages,
                      state.notes,
                      index,
                    )}
                    initValuesKey="code"
                    initValuesTitle="title"
                    parentTranslationPath={parentTranslationPath}
                  />
                  <ButtonBase
                    className="btns theme-transparent c-danger mx-3 mt-1 mb-2"
                    onClick={removeLanguageHandler('notes', state.notes, item[0])}
                  >
                    <span className="fas fa-times" />
                    <span className="px-1">{t('remove-language')}</span>
                  </ButtonBase>
                </div>
              )}
              <SharedInputControl
                editValue={item[1]}
                parentTranslationPath={parentTranslationPath}
                stateKey={item[0]}
                parentId="notes"
                errors={errors}
                errorPath={`notes.${[item[0]]}`}
                title={`${t(`${translationPath}notes`)} (${getLanguageTitle(
                  languages,
                  item[0],
                )})`}
                multiline
                rows={4}
                isSubmitted={isSubmitted}
                onValueChanged={onStateChanged}
              />
            </React.Fragment>
          ))}
        <div className="d-inline-flex px-3">
          <SwitchComponent
            idRef="ApplyConditionsSwitchRef"
            label="apply-conditions"
            isChecked={state.allow_conditions}
            isReversedLabel
            onChange={(event, newValue) => {
              if (!newValue && state.conditions && state.conditions.length > 0)
                setState({ id: 'conditions', value: [] });
              setState({ id: 'allow_conditions', value: newValue });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-flex px-3 mb-2">
          <span className="description-text">
            {t(`${translationPath}apply-conditions-description`)}
          </span>
        </div>

        {state.conditions.map((item, index, items) => (
          <React.Fragment key={`conditionKey${index + 1}`}>
            <div className="condition-item-wrapper">
              <div className="d-flex px-2 condition-controls-wrapper">
                <div className="d-flex first-controls-group">
                  {index > 0 && (
                    <div
                      className={`d-inline-flex px-2 condition-type-item colored${
                        (getEnumValueByKey(
                          item.operation,
                          WorkflowsOperationsEnum,
                        )
                          && ` ${
                            getEnumValueByKey(
                              item.operation,
                              WorkflowsOperationsEnum,
                            ).color
                          }`)
                        || ''
                      }`}
                    >
                      <SharedAutocompleteControl
                        editValue={item.operation}
                        placeholder="select-condition"
                        // title="condition"
                        stateKey="operation"
                        parentIndex={index}
                        parentId="conditions"
                        errorPath={`conditions[${index}].operation`}
                        onValueChanged={onStateChanged}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        initValues={operations}
                        initValuesTitle="value"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isFullWidth
                      />
                    </div>
                  )}
                  <div className="d-flex px-2 first-section-item">
                    <SharedAutocompleteControl
                      editValue={item.type}
                      placeholder="select"
                      // title="type"
                      stateKey="type"
                      parentIndex={index}
                      parentId="conditions"
                      errorPath={`conditions[${index}].type`}
                      onValueChanged={(newValue) => {
                        if (item.condition)
                          onStateChanged({
                            parentId: 'conditions',
                            parentIndex: index,
                            id: 'condition',
                            value: null,
                          });
                        if (item.conditional_section_uuid)
                          onStateChanged({
                            parentId: 'conditions',
                            parentIndex: index,
                            id: 'conditional_section_uuid',
                            value: null,
                          });
                        if (item.template_uuid)
                          onStateChanged({
                            parentId: 'conditions',
                            parentIndex: index,
                            id: 'template_uuid',
                            value: [],
                          });
                        onStateChanged(newValue);
                        setIsForceToReload((prev) => !prev);
                      }}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      initValues={selectedWorkflowType.conditions}
                      getOptionLabel={(option) =>
                        (option.title
                          && (option.title[i18next.language] || option.title.en))
                        || 'N/A'
                      }
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isFullWidth
                    />
                  </div>
                  {item.type && (
                    <div className="d-inline-flex px-2 existence-type-item">
                      <SharedAutocompleteControl
                        editValue={item.condition}
                        placeholder="select-condition"
                        // title="condition"
                        stateKey="condition"
                        parentIndex={index}
                        parentId="conditions"
                        errorPath={`conditions[${index}].condition`}
                        onValueChanged={onStateChanged}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        initValues={getActiveCondition(item.type)}
                        getOptionLabel={(option) =>
                          (option.title
                            && (option.title[i18next.language] || option.title.en))
                          || 'N/A'
                        }
                        initValuesTitle="title"
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isFullWidth
                      />
                    </div>
                  )}
                </div>
                {item.type && (
                  <div className="d-flex px-2 second-controls-group">
                    <SharedAPIAutocompleteControl
                      editValue={item.conditional_section_uuid}
                      placeholder="select"
                      stateKey="conditional_section_uuid"
                      parentIndex={index}
                      parentId="conditions"
                      errorPath={`conditions[${index}].conditional_section_uuid`}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      searchKey="query"
                      getDataAPI={DynamicService}
                      getAPIProperties={getDynamicServicePropertiesHandler}
                      extraProps={{
                        path: getActiveCondition(item.type, 'api').end_point,
                        method: getActiveCondition(item.type, 'api').method,
                        params: {
                          with_than:
                            (item.conditional_section_uuid && [
                              item.conditional_section_uuid,
                            ])
                            || [],
                        },
                      }}
                      isForceToReload={isForceToReload}
                      renderOption={
                        (item.type === 19
                          && ((renderProps, option) => (
                            <li {...renderProps} key={option.uuid}>
                              {option.value
                                || (option.title
                                  && (option.title[i18next.language]
                                    || option.title.en))
                                || (option.name
                                  && ((typeof option.name === 'object'
                                    && (option.name[i18next.language]
                                      || option.name.en))
                                    || option.name))
                                || `${
                                  option.first_name
                                  && (option.first_name[i18next.language]
                                    || option.first_name.en)
                                }${
                                  option.last_name
                                  && ` ${
                                    option.last_name[i18next.language]
                                    || option.last_name.en
                                  }`
                                }`}
                            </li>
                          )))
                        || undefined
                      }
                      getOptionLabel={(option) =>
                        option.value
                        || (option.title
                          && (option.title[i18next.language] || option.title.en))
                        || (option.name
                          && ((typeof option.name === 'object'
                            && (option.name[i18next.language] || option.name.en))
                            || option.name))
                        || `${
                          option.first_name
                          && (option.first_name[i18next.language]
                            || option.first_name.en)
                        }${
                          option.last_name
                          && ` ${
                            option.last_name[i18next.language] || option.last_name.en
                          }`
                        }`
                      }
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      onValueChanged={(newValue) => {
                        if (item.template_uuid)
                          onStateChanged({
                            parentId: 'conditions',
                            parentIndex: index,
                            id: 'template_uuid',
                            value: [],
                          });
                        onStateChanged(newValue);
                      }}
                      isFullWidth
                    />
                  </div>
                )}
                {item.type
                  && (item.type === 35 || item.type === 19)
                  && item.conditional_section_uuid && (
                  <div className="d-flex px-2 third-controls-group">
                    <SharedAPIAutocompleteControl
                      isFullWidth
                      placeholder="select-templates"
                      stateKey="template_uuid"
                      parentIndex={index}
                      parentId="conditions"
                      errorPath={`conditions[${index}].template_uuid`}
                      errors={errors}
                      searchKey="search"
                      editValue={item.template_uuid}
                      isDisabled={isLoading}
                      isSubmitted={isSubmitted}
                      onValueChanged={onStateChanged}
                      translationPath={translationPath}
                      getDataAPI={
                        item.type === 35
                          ? GetAllBuilderTemplates
                          : GetAllFormTemplates
                      }
                      type={DynamicFormTypesEnum.array.key}
                      parentTranslationPath={parentTranslationPath}
                      getOptionLabel={(option) => option.title || 'N/A'}
                      extraProps={{
                        form_type_uuid: item.conditional_section_uuid,
                        ...(item.template_uuid?.length > 0 && {
                          with_than: item.template_uuid,
                        }),
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="d-inline-flex">
                <ButtonBase
                  className="btns-icon theme-transparent condition-remove-btn my-1 mx-2"
                  onClick={removeConditionsHandler(index)}
                >
                  <span className="fas fa-times" />
                </ButtonBase>
              </div>
            </div>

            {index < items.length - 1 && (
              <div className="px-3 mb-3">
                <div className="separator-h" />
              </div>
            )}
          </React.Fragment>
        ))}
        <div className="px-3">
          <ButtonBase
            className="btns theme-solid condition-add-btn mx-0 mb-3"
            onClick={addConditionHandler}
            disabled={isLoading || !state.allow_conditions}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-condition`)}</span>
          </ButtonBase>
        </div>
        <div className="d-flex px-3 mb-1">
          <span className="header-text c-black-light">
            {t(`${translationPath}set-approvals`)}
          </span>
        </div>
        <div className="d-flex px-3 mb-3">
          <span className="description-text">
            {t(`${translationPath}approvals-description`)}
          </span>
        </div>
        <div className="approvals-wrapper">
          <DragDropContext onDragEnd={onDragEndHandler}>
            <div className="approvals-left-section-wrapper approval-section">
              <Droppable droppableId="approvalsLeftSectionDroppableId">
                {(droppableProvided) => (
                  <div
                    className="approvals-left-section-items-wrapper"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    <SharedAutocompleteControl
                      editValue={approvalType}
                      placeholder="select-approval-type"
                      // title="condition"
                      stateKey="approval_type"
                      errorPath="approval_type"
                      onValueChanged={(newValue) => {
                        setApprovalType(newValue.value);
                        setFilter((items) => ({ ...items, page: 1 }));
                        if (focusedItem && !focusedItem.isRightSide)
                          setFocusedItem(null);
                      }}
                      isGlobalLoading={isLoading}
                      isDisabled={isLoading}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      getOptionLabel={(option) =>
                        (option.title
                          && (option.title[i18next.language] || option.title.en))
                        || 'N/A'
                      }
                      initValues={approvals}
                      initValuesTitle="title"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                      isFullWidth
                    />
                    <div className="approval-content-wrapper">
                      <div className="px-2">
                        <SharedInputControl
                          idRef="searchRef"
                          title="search"
                          placeholder="search"
                          isFullWidth
                          stateKey="query"
                          endAdornment={
                            <span className="end-adornment-wrapper">
                              <span className="fas fa-search" />
                            </span>
                          }
                          onValueChanged={(newValue) => {
                            setFilter((items) => ({
                              ...items,
                              page: 1,
                              query: newValue.value,
                            }));
                          }}
                          parentTranslationPath={parentTranslationPath}
                        />
                      </div>
                      <div className="approval-items-wrapper" ref={bodyRef}>
                        {approvalsList.results
                          && approvalsList.results
                            // .filter(
                            //   (item) => !state.approvals
                            //     || state.approvals.length === 0
                            //     || state.approvals.findIndex(
                            // (el) => el.approvals_section_uuid === item.approvals_section_uuid,
                            //     ) === -1,
                            // )
                            .map(
                              (item, index) =>
                                (!state.approvals
                                  || state.approvals.length === 0
                                  || !state.approvals.some(
                                    (el) =>
                                      el.approvals_section_uuid
                                      === item.approvals_section_uuid,
                                  )) && (
                                  <Draggable
                                    key={`approvalsListKey${index + 1}`}
                                    draggableId={`approvalsListId${index + 1}`}
                                    isDragDisabled={getIsDisabledApprovalsAdd()}
                                    index={index}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        className={`approval-item-wrapper${
                                          (snapshot.isDragging && ' is-dragging')
                                          || ''
                                        }${
                                          (focusedItem
                                            && !focusedItem.isRightSide
                                            && focusedItem.itemIndex === index
                                            && ' is-focused-item')
                                          || ''
                                        }`}
                                        {...provided.draggableProps}
                                        ref={provided.innerRef}
                                        role="button"
                                        tabIndex="0"
                                        onFocus={() =>
                                          setFocusedItem({
                                            itemIndex: index,
                                            uuid: item.approvals_section_uuid,
                                            isRightSide: false,
                                          })
                                        }
                                        onMouseDown={() =>
                                          setFocusedItem({
                                            itemIndex: index,
                                            uuid: item.approvals_section_uuid,
                                            isRightSide: false,
                                          })
                                        }
                                      >
                                        <div
                                          className={`dragging-btn${
                                            (getIsDisabledApprovalsAdd()
                                              && ' is-disabled')
                                            || ''
                                          }`}
                                          {...provided.dragHandleProps}
                                        >
                                          <span className="fas fa-ellipsis-v" />
                                          <span className="fas fa-ellipsis-v" />
                                          <span className="fas fa-ellipsis-v" />
                                        </div>
                                        <span className="px-3">{item.value}</span>
                                      </div>
                                    )}
                                  </Draggable>
                                ),
                            )}
                        <LoaderComponent
                          isLoading={isLoading}
                          isSkeleton
                          skeletonItems={[
                            {
                              variant: 'rectangular',
                              style: { minHeight: 40 },
                            },
                          ]}
                          numberOfRepeat={3}
                        />
                      </div>
                    </div>
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <ButtonBase
              className="btns theme-solid miw-32px mx-2"
              disabled={
                !focusedItem
                || focusedItem.isRightSide
                || getIsDisabledApprovalsAdd()
              }
              onClick={moveToRight}
            >
              <span className="fas fa-chevron-right" />
            </ButtonBase>
            <div className="approvals-right-section-wrapper approval-section">
              <Droppable droppableId="approvalsRightSectionDroppableId">
                {(droppableProvided) => (
                  <div
                    className="approvals-right-section-items-wrapper"
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    <SharedInputControl
                      editValue={searchApprovals}
                      parentTranslationPath={parentTranslationPath}
                      stateKey="searchApprovals"
                      errors={errors}
                      title="search"
                      endAdornment={
                        <span className="end-adornment-wrapper">
                          <span className="fas fa-search" />
                        </span>
                      }
                      isSubmitted={isSubmitted}
                      isFullWidth
                      onValueChanged={(newValue) => {
                        setSearchApprovals(newValue.value);
                        if (focusedItem && focusedItem.isRightSide)
                          setFocusedItem(null);
                      }}
                    />
                    <div className="approval-content-wrapper">
                      <div className="d-flex-v-center px-3 py-2 mb-2">
                        <span className="fas fa-map-marker-alt" />
                        <span className="px-2">
                          {t(`${translationPath}start-approval`)}
                        </span>
                      </div>
                      <div className="approval-items-wrapper">
                        {state.approvals
                          && state.approvals
                            .filter(
                              (item) =>
                                !item.value
                                || !searchApprovals
                                || item.value
                                  .toLowerCase()
                                  .includes(searchApprovals.toLowerCase()),
                            )
                            .map((item, index, items) => (
                              <Draggable
                                key={`approvalsItemKey${index + 1}`}
                                draggableId={`approvalsItemId${index + 1}`}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    className={`approval-item-wrapper flex-wrap${
                                      (snapshot.isDragging && ' is-dragging') || ''
                                    }${
                                      (focusedItem
                                        && focusedItem.isRightSide
                                        && focusedItem.itemIndex === index
                                        && ' is-focused-item')
                                      || ''
                                    }`}
                                    {...provided.draggableProps}
                                    ref={provided.innerRef}
                                    role="button"
                                    tabIndex="0"
                                    onFocus={() => {
                                      setFocusedItem({
                                        itemIndex: index,
                                        uuid: item.approvals_section_uuid,
                                        isRightSide: true,
                                      });
                                    }}
                                    onMouseDown={() => {
                                      setFocusedItem({
                                        itemIndex: index,
                                        uuid: item.approvals_section_uuid,
                                        isRightSide: true,
                                      });
                                    }}
                                  >
                                    <div className="d-flex">
                                      <div className="d-inline-flex pt-1">
                                        <div
                                          className="dragging-btn mt-1"
                                          {...provided.dragHandleProps}
                                        >
                                          <span className="fas fa-ellipsis-v" />
                                          <span className="fas fa-ellipsis-v" />
                                          <span className="fas fa-ellipsis-v" />
                                        </div>
                                      </div>
                                      <div className="approval-number-wrapper">
                                        <span>{index + 1}</span>
                                      </div>
                                      <div className="approval-text-wrapper">
                                        <span>{item.value}</span>
                                      </div>
                                      {index < items.length - 1 && (
                                        <div className="d-inline-flex px-2 condition-type-item colored">
                                          <SharedAutocompleteControl
                                            editValue={item.condition}
                                            placeholder="select-condition"
                                            // title="condition"
                                            stateKey="condition"
                                            parentIndex={index}
                                            parentId="approvals"
                                            errorPath={`approvals[${index}].condition`}
                                            onValueChanged={onStateChanged}
                                            isSubmitted={isSubmitted}
                                            errors={errors}
                                            initValues={getValueByKey()?.condition}
                                            getOptionLabel={(option) =>
                                              (option.title
                                                && (option.title[i18next.language]
                                                  || option.title.en))
                                              || 'N/A'
                                            }
                                            initValuesTitle="title"
                                            parentTranslationPath={
                                              parentTranslationPath
                                            }
                                            translationPath={translationPath}
                                            isFullWidth
                                          />
                                        </div>
                                      )}
                                      <div className="d-inline-flex pt-1">
                                        <ButtonBase
                                          className="btns-icon theme-transparent c-danger mx-2 mt-1 mb-2"
                                          onClick={removeApprovalHandler(index)}
                                        >
                                          <span className="fas fa-times" />
                                        </ButtonBase>
                                      </div>
                                    </div>
                                    {index !== 0
                                      && item.key === 106
                                      && !getIsValidDirectManager(index) && (
                                      <div className="c-error py-1">
                                        <span>
                                          {t(
                                            `${translationPath}direct-manager-error-description`,
                                          )}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                      </div>
                      <div className="d-flex-v-center px-3 py-2 mt-2">
                        <span className="fas fa-flag-checkered" />
                        <span className="px-2">
                          {t(`${translationPath}end-approval`)}
                        </span>
                      </div>
                    </div>
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
            <div className="approval-actions-wrapper">
              <ButtonBase
                className="btns theme-solid miw-32px mb-3 mx-2"
                disabled={
                  !focusedItem
                  || !focusedItem.isRightSide
                  || focusedItem.itemIndex === 0
                }
                onClick={moveToUpAndDownHandler('up')}
              >
                <span className="fas fa-chevron-up" />
              </ButtonBase>
              <ButtonBase
                className="btns theme-solid miw-32px mx-2"
                disabled={
                  !focusedItem
                  || !focusedItem.isRightSide
                  || focusedItem.itemIndex === state.approvals.length - 1
                }
                onClick={moveToUpAndDownHandler('down')}
              >
                <span className="fas fa-chevron-down" />
              </ButtonBase>
            </div>
          </DragDropContext>
        </div>
        <div className="d-inline-flex px-3">
          <SwitchComponent
            idRef="AllowWatchersSwitchRef"
            label="allow-watchers"
            isChecked={state.allow_watchers}
            isReversedLabel
            onChange={(event, newValue) => {
              setState({ id: 'allow_watchers', value: newValue });
              if (!newValue && state.watchers && state.watchers.length > 0)
                setState({
                  id: 'watchers',
                  value: [],
                });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-flex px-3 mb-2">
          <span className="description-text">
            {t(`${translationPath}watchers-description`)}
          </span>
        </div>
        <SharedAPIAutocompleteControl
          idRef="watchersAutocompleteRef"
          editValue={state.watchers}
          title="watchers"
          placeholder="select-watchers"
          stateKey="watchers"
          errorPath="watchers"
          isSubmitted={isSubmitted}
          errors={errors}
          searchKey="search"
          getDataAPI={GetAllSetupsEmployees}
          extraProps={{
            all_employee: 1,
            with_than_users: 1,
            with_than: state.watchers,
          }}
          isDisabled={!state.allow_watchers}
          getOptionLabel={(option) =>
            `${
              (option.first_name
                && (option.first_name[i18next.language] || option.first_name.en))
              || ''
            }${
              (option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`)
              || ''
            }` || 'N/A'
          }
          // extraProps={{ users_category: state.users_category }}
          uniqueKey="user_uuid"
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onValueChanged={onStateChanged}
        />
        <div className="d-flex px-3 mb-1">
          <span className="header-text c-black-light">
            {t(`${translationPath}notifications`)}
          </span>
        </div>
        <div className="d-flex px-3 mb-3">
          <span className="description-text">
            {t(`${translationPath}notifications-description`)}
          </span>
        </div>
        <div className="notifications-responsive-handler-container">
          <div className="notifications-responsive-handler mb-3">
            <PropertiesComponent
              isWithHeader
              properties={state.notifications}
              parentId="notifications"
              propertiesTitle={t(`${translationPath}type`)}
              columns={[
                {
                  input: 'on_request',
                  title: t(`${translationPath}on-request`),
                  disabledInput: 'on_request_disabled',
                  // getIsDisabled: (item, index) => index === 0,
                },
                {
                  input: 'on_approval',
                  title: t(`${translationPath}on-approval`),
                },
                {
                  input: 'on_decline',
                  title: t(`${translationPath}on-decline`),
                },
                {
                  input: 'on_cancel_withdraw',
                  title: t(`${translationPath}on-cancel-withdraw`),
                },
              ]}
              onStateChanged={onStateChanged}
            />
          </div>
        </div>
        <div className="d-inline-flex px-3">
          <SwitchComponent
            idRef="EscalationRolesSwitchRef"
            label="escalation-rules"
            isChecked={state.allow_escalation}
            isReversedLabel
            onChange={(event, newValue) => {
              setState({ id: 'allow_escalation', value: newValue });
              // if (!newValue && state.watchers && state.watchers.length > 0)
              //   setState({
              //     id: 'watchers',
              //     value: [],
              //   });
            }}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
        <div className="d-flex px-3 mb-3">
          <span className="description-text">
            {t(`${translationPath}escalation-rules-description`)}
          </span>
        </div>
        {state.allow_escalation && (
          <div className="escalation-rules-wrapper">
            <div className="d-flex px-3">
              <span className="label-wrapper">
                {t(`${translationPath}period-description`)}
              </span>
              <span className="px-1">
                (
                {t(
                  getEnumValueByKey(
                    state.escalation.period_type,
                    WorkflowsPeriodTypesEnum,
                  ).value,
                )}
                )
              </span>
            </div>
            <div className="period-controls-wrapper">
              <div className="d-inline-flex px-2">
                <SharedInputControl
                  editValue={state.escalation?.period}
                  parentId="escalation"
                  stateKey="period"
                  isSubmitted={isSubmitted}
                  errors={errors}
                  errorPath="escalation.period"
                  onValueChanged={onStateChanged}
                  type="number"
                  min={0}
                  floatNumbers={0}
                  startAdornment={
                    <ButtonBase
                      className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                      disabled={
                        !state.escalation?.period || state.escalation?.period <= 0
                      }
                      onClick={responsePeriodHandler('period', 'decrement', 1)}
                    >
                      <span className="fas fa-minus" />
                    </ButtonBase>
                  }
                  endAdornment={
                    <ButtonBase
                      className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                      onClick={responsePeriodHandler('period', 'increment', 1)}
                    >
                      <span className="fas fa-plus" />
                    </ButtonBase>
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
              {/*<div></div>*/}
              <div className="d-inline-flex px-2">
                <SharedAutocompleteControl
                  editValue={state.escalation?.period_type}
                  placeholder="select-period"
                  // title="condition"
                  stateKey="period_type"
                  parentId="escalation"
                  errorPath="escalation.period_type"
                  onValueChanged={(newValue) => {
                    if (
                      (
                        getEnumValueByKey(
                          newValue.value,
                          WorkflowsPeriodTypesEnum,
                        ) || {}
                      ).maxRepeating < state.escalation.repeat
                    )
                      onStateChanged({
                        parentId: 'escalation',
                        id: 'repeat',
                        value: (
                          getEnumValueByKey(
                            newValue.value,
                            WorkflowsPeriodTypesEnum,
                          ) || {}
                        ).maxRepeating,
                      });
                    if (
                      (
                        getEnumValueByKey(
                          newValue.value,
                          WorkflowsPeriodTypesEnum,
                        ) || {}
                      ).maxRecurring < state.escalation.recurring
                    )
                      onStateChanged({
                        parentId: 'escalation',
                        id: 'recurring',
                        value: (
                          getEnumValueByKey(
                            newValue.value,
                            WorkflowsPeriodTypesEnum,
                          ) || {}
                        ).maxRecurring,
                      });
                    onStateChanged(newValue);
                  }}
                  isSubmitted={isSubmitted}
                  errors={errors}
                  initValues={periodTypes}
                  disableClearable
                  initValuesTitle="value"
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
            </div>
            <div className="times-controls-wrapper">
              <div className="d-inline-flex px-2 repeated-input">
                <SharedInputControl
                  editValue={state.escalation?.repeat}
                  parentId="escalation"
                  stateKey="repeat"
                  labelValue="send-daily-reminder-for"
                  errorPath="escalation.repeat"
                  isSubmitted={isSubmitted}
                  errors={errors}
                  placeholder=""
                  onValueChanged={onStateChanged}
                  type="number"
                  min={0}
                  floatNumbers={0}
                  max={
                    (
                      getEnumValueByKey(
                        state.escalation.period_type,
                        WorkflowsPeriodTypesEnum,
                      ) || {}
                    ).maxRepeating
                  }
                  startAdornment={
                    <ButtonBase
                      className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                      disabled={
                        !state.escalation?.repeat || state.escalation?.repeat <= 0
                      }
                      onClick={responsePeriodHandler('repeat', 'decrement', 1)}
                    >
                      <span className="fas fa-minus" />
                    </ButtonBase>
                  }
                  endAdornment={
                    <span>
                      <span className="px-1">{t('days')}</span>
                      <ButtonBase
                        className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                        disabled={
                          (
                            getEnumValueByKey(
                              state.escalation.period_type,
                              WorkflowsPeriodTypesEnum,
                            ) || {}
                          ).maxRepeating <= state.escalation.repeat
                        }
                        onClick={responsePeriodHandler('repeat', 'increment', 1)}
                      >
                        <span className="fas fa-plus" />
                      </ButtonBase>
                    </span>
                  }
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  isFullWidth
                />
              </div>
              {/*<div className="d-inline-flex px-2">*/}
              {/*  <SharedInputControl*/}
              {/*    editValue={state.escalation?.repeat_from}*/}
              {/*    parentId="escalation"*/}
              {/*    stateKey="repeat_from"*/}
              {/*    labelValue="from"*/}
              {/*    isSubmitted={isSubmitted}*/}
              {/*    errors={errors}*/}
              {/*    errorPath="escalation.repeat_from"*/}
              {/*    onValueChanged={onStateChanged}*/}
              {/*    type="time"*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    translationPath={translationPath}*/}
              {/*    isFullWidth*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className="d-inline-flex px-2">*/}
              {/*  <SharedInputControl*/}
              {/*    editValue={state.escalation?.repeat_to}*/}
              {/*    parentId="escalation"*/}
              {/*    stateKey="repeat_to"*/}
              {/*    labelValue="to"*/}
              {/*    isSubmitted={isSubmitted}*/}
              {/*    errors={errors}*/}
              {/*    errorPath="escalation.repeat_to"*/}
              {/*    onValueChanged={onStateChanged}*/}
              {/*    type="time"*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    translationPath={translationPath}*/}
              {/*    isFullWidth*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className="d-inline-flex px-2 repeated-input">*/}
              {/*  <SharedInputControl*/}
              {/*    editValue={state.escalation?.recurring}*/}
              {/*    parentId="escalation"*/}
              {/*    stateKey="recurring"*/}
              {/*    labelValue="recurring-for"*/}
              {/*    errorPath="escalation.recurring"*/}
              {/*    isSubmitted={isSubmitted}*/}
              {/*    errors={errors}*/}
              {/*    placeholder=""*/}
              {/*    onValueChanged={onStateChanged}*/}
              {/*    type="number"*/}
              {/*    min={0}*/}
              {/*    floatNumbers={0}*/}
              {/*    max={*/}
              {/*      (*/}
              {/*        getEnumValueByKey(*/}
              {/*          state.escalation.period_type,*/}
              {/*          WorkflowsPeriodTypesEnum*/}
              {/*        ) || {}*/}
              {/*      ).maxRecurring*/}
              {/*    }*/}
              {/*    startAdornment={*/}
              {/*      <ButtonBase*/}
              {/*        className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"*/}
              {/*        disabled={*/}
              {/*          !state.escalation?.recurring*/}
              {/*          || state.escalation?.recurring <= 0*/}
              {/*        }*/}
              {/*        onClick={responsePeriodHandler('recurring', 'decrement', 1)}*/}
              {/*      >*/}
              {/*        <span className="fas fa-minus" />*/}
              {/*      </ButtonBase>*/}
              {/*    }*/}
              {/*    endAdornment={*/}
              {/*      <span>*/}
              {/*        <span className="px-1">*/}
              {/*          {t(*/}
              {/*            (*/}
              {/*              getEnumValueByKey(*/}
              {/*                state.escalation.period_type,*/}
              {/*                WorkflowsPeriodTypesEnum*/}
              {/*              ) || {}*/}
              {/*            ).value*/}
              {/*          )}*/}
              {/*        </span>*/}
              {/*        <ButtonBase*/}
              {/*          className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"*/}
              {/*          disabled={*/}
              {/*            (*/}
              {/*              getEnumValueByKey(*/}
              {/*                state.escalation.period_type,*/}
              {/*                WorkflowsPeriodTypesEnum*/}
              {/*              ) || {}*/}
              {/*            ).maxRecurring <= state.escalation.recurring*/}
              {/*          }*/}
              {/*          onClick={responsePeriodHandler('recurring', 'increment', 1)}*/}
              {/*        >*/}
              {/*          <span className="fas fa-plus" />*/}
              {/*        </ButtonBase>*/}
              {/*      </span>*/}
              {/*    }*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    translationPath={translationPath}*/}
              {/*    isFullWidth*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
            <div className="automation-controls-wrapper">
              <div className="d-inline-flex-column">
                <div className="label-wrapper">
                  <span>{t(`${translationPath}else`)}</span>
                </div>
                <div className="d-inline-flex flex-wrap">
                  <div
                    className={`automation-checkboxes-wrapper${
                      ((isSubmitted || state.escalation.auto_scale_touched)
                        && errors['escalation.auto_scale']
                        && ' bc-error')
                      || ''
                    }`}
                  >
                    <div className="d-inline-flex px-2">
                      {/*<CheckboxesComponent*/}
                      {/*  idRef="autoApproveCheckboxRef"*/}
                      {/*  label={t(`${translationPath}auto-approve`)}*/}
                      {/*  singleChecked={state.escalation?.auto_approve || false}*/}
                      {/*  onSelectedCheckboxChanged={() =>*/}
                      {/*    onStateChanged({*/}
                      {/*      parentId: 'escalation',*/}
                      {/*      id: 'auto_approve',*/}
                      {/*      value: !state.escalation?.auto_approve,*/}
                      {/*    })*/}
                      {/*  }*/}
                      {/*/>*/}
                      <RadiosComponent
                        idRef="autoApproveCheckboxRef"
                        singleLabelValue="auto-approve"
                        value={state.escalation.auto_approve || false}
                        onSelectedRadioClicked={() => {
                          if (!state.escalation.auto_scale_touched)
                            onStateChanged({
                              parentId: 'escalation',
                              id: 'auto_scale_touched',
                              value: true,
                            });
                          if (state.escalation.auto_delegate)
                            onStateChanged({
                              parentId: 'escalation',
                              id: 'auto_delegate',
                              value: false,
                            });
                          onStateChanged({
                            parentId: 'escalation',
                            id: 'auto_approve',
                            value: !state.escalation.auto_approve,
                          });
                        }}
                        parentTranslationPath={parentTranslationPath}
                        translationPathForData={translationPath}
                      />
                    </div>
                    {/*<div className="d-inline-flex px-2">*/}
                    {/*<CheckboxesComponent*/}
                    {/*  idRef="autoDelegateCheckboxRef"*/}
                    {/*  label={t(`${translationPath}auto-delegate`)}*/}
                    {/*  singleChecked={state.escalation?.auto_delegate || false}*/}
                    {/*  onSelectedCheckboxChanged={() =>*/}
                    {/*    onStateChanged({*/}
                    {/*      parentId: 'escalation',*/}
                    {/*      id: 'auto_delegate',*/}
                    {/*      value: !state.escalation?.auto_delegate,*/}
                    {/*    })*/}
                    {/*  }*/}
                    {/*/>*/}
                    {/*<RadiosComponent*/}
                    {/*  idRef="autoDelegateCheckboxRef"*/}
                    {/*  singleLabelValue="auto-delegate"*/}
                    {/*  value={state.escalation.auto_delegate || false}*/}
                    {/*  onSelectedRadioClicked={() => {*/}
                    {/*    if (!state.escalation.auto_scale_touched)*/}
                    {/*      onStateChanged({*/}
                    {/*        parentId: 'escalation',*/}
                    {/*        id: 'auto_scale_touched',*/}
                    {/*        value: true,*/}
                    {/*      });*/}
                    {/*    if (state.escalation.auto_approve)*/}
                    {/*      onStateChanged({*/}
                    {/*        parentId: 'escalation',*/}
                    {/*        id: 'auto_approve',*/}
                    {/*        value: false,*/}
                    {/*      });*/}
                    {/*    onStateChanged({*/}
                    {/*      parentId: 'escalation',*/}
                    {/*      id: 'auto_delegate',*/}
                    {/*      value: !state.escalation.auto_delegate,*/}
                    {/*    });*/}
                    {/*  }}*/}
                    {/*  parentTranslationPath={parentTranslationPath}*/}
                    {/*  translationPathForData={translationPath}*/}
                    {/*/>*/}
                    {/*</div>*/}
                  </div>
                </div>
                {/*{(isSubmitted || state.escalation.auto_scale_touched)*/}
                {/*  && errors['escalation.auto_scale'] && (*/}
                {/*  <div className="c-error fz-10 mb-3">*/}
                {/*    {errors['escalation.auto_scale'].message}*/}
                {/*  </div>*/}
                {/*)}*/}
              </div>
              {/*<div className="d-inline-flex px-2 repeated-input">*/}
              {/*  <SharedInputControl*/}
              {/*    editValue={state.escalation?.approve_delegate_after}*/}
              {/*    parentId="escalation"*/}
              {/*    stateKey="approve_delegate_after"*/}
              {/*    labelValue="after"*/}
              {/*    errorPath="escalation.approve_delegate_after"*/}
              {/*    isSubmitted={isSubmitted}*/}
              {/*    errors={errors}*/}
              {/*    placeholder=""*/}
              {/*    onValueChanged={onStateChanged}*/}
              {/*    type="number"*/}
              {/*    min={0}*/}
              {/*    floatNumbers={0}*/}
              {/*    startAdornment={*/}
              {/*      <ButtonBase*/}
              {/*        className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"*/}
              {/*        disabled={*/}
              {/*          !state.escalation?.approve_delegate_after*/}
              {/*          || state.escalation?.approve_delegate_after <= 0*/}
              {/*        }*/}
              {/*        onClick={responsePeriodHandler(*/}
              {/*          'approve_delegate_after',*/}
              {/*          'decrement',*/}
              {/*          1*/}
              {/*        )}*/}
              {/*      >*/}
              {/*        <span className="fas fa-minus" />*/}
              {/*      </ButtonBase>*/}
              {/*    }*/}
              {/*    endAdornment={*/}
              {/*      <div className="d-flex-v-center">*/}
              {/*        <span className="px-1">{t('hours')}</span>*/}
              {/*        <ButtonBase*/}
              {/*          className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"*/}
              {/*          onClick={responsePeriodHandler(*/}
              {/*            'approve_delegate_after',*/}
              {/*            'increment',*/}
              {/*            1*/}
              {/*          )}*/}
              {/*        >*/}
              {/*          <span className="fas fa-plus" />*/}
              {/*        </ButtonBase>*/}
              {/*        <div className="from-last-reminder-wrapper">*/}
              {/*          <span>{t(`${translationPath}from-last-reminder`)}</span>*/}
              {/*        </div>*/}
              {/*      </div>*/}
              {/*    }*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    translationPath={translationPath}*/}
              {/*    isFullWidth*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          </div>
        )}
        <div className="d-flex-center flex-wrap px-2">
          <ButtonBase className="btns theme-outline mx-2" onClick={isOpenChanged}>
            <span>{t('Shared:cancel')}</span>
          </ButtonBase>
          <ButtonBase
            className={`btns theme-solid mx-2${
              (activeItem && ' bg-secondary') || ' bg-green-primary'
            }`}
            disabled={isLoading}
            type="submit"
          >
            <span>{t(`Shared:${(activeItem && 'update') || 'create'}`)}</span>
          </ButtonBase>
        </div>
      </form>
      {currentHierarchyApproval && (
        <HierarchyListDialog
          activeItem={currentHierarchyApproval}
          onSave={(selected_hierarchies) => {
            const localApprovals = [...state.approvals];
            const localApprovalsList = [...approvalsList.results];
            localApprovals.splice(currentHierarchyApproval.to, 0, {
              ...localApprovalsList[currentHierarchyApproval.itemIndex],
              selected_hierarchies,
            });
            localApprovalsList.splice(currentHierarchyApproval.itemIndex, 1);
            setFocusedItem((items) => ({
              ...items,
              itemIndex: currentHierarchyApproval.to,
              isRightSide: true,
            }));
            setState({ id: 'approvals', value: localApprovals });
            setApprovalsList((items) => ({ ...items, results: localApprovalsList }));
          }}
          isOpenChanged={() => {
            setCurrentHierarchyApproval(null);
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen
        />
      )}
    </>
  );
};

WorkflowsTemplateManagementSection.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  selectedWorkflowType: PropTypes.shape({
    key: PropTypes.number,
    title: PropTypes.instanceOf(Object),
    conditions: PropTypes.instanceOf(Array),
  }).isRequired,
  approvals: PropTypes.instanceOf(Array).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
WorkflowsTemplateManagementSection.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'WorkflowsTemplateManagementSection.',
};
