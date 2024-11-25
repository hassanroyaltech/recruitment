import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  showError,
  showSuccess,
  getErrorByName,
  GlobalHistory,
  LanguageUpdateKey,
} from '../../../../../helpers';
import {
  SetupsReset,
  SetupsReducer,
  getLanguageTitle,
  SharedInputControl,
  getNotSelectedLanguage,
  SharedAutocompleteControl,
  SharedAPIAutocompleteControl,
} from '../../../../setups/shared';
import {
  GetAllSetupsTeams,
  GetAllSetupsUsers,
  CreateSetupsPreScreening,
  UpdateSetupsPreScreening,
  getSetupsPreScreeningById,
  GetAllJobCategoriesByCode,
  GetAllSetupsPositions,
  GetAllSetupsEmployees,
  GetAllSetupsBranches,
  getSetupsUsersById,
} from '../../../../../services';
import {
  AssignTypesOfApprovals,
  DynamicFormTypesEnum,
  EvaluationQuestionsTypesEnum,
  NumberOfApprovalsEnum,
  ProfileSourcesTypesEnum,
} from '../../../../../enums';
import ApprovalsQuestionCard from './ApprovalsQuestionCard';
import './PreScreeningApprovalManagement.Style.scss';
import item from '../../../../evassess/pipeline/Item';

// eslint-disable-next-line func-names
// yup.addMethod(yup.array, 'uniqueItem', function (message, mapper) {
//   return this.test(
//     'uniqueItem',
//     message,
//     (list) => list.length === new Set(list.map(mapper)).size,
//   );
// });

const translationPath = '';
const parentTranslationPath = 'InitialApproval';

const PreScreeningApprovalManagement = () => {
  const { t } = useTranslation(parentTranslationPath);
  const uuid = new URLSearchParams(useLocation()?.search).get('uuid');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaveLoading, setIsSaveLoading] = useState(false);
  const [assignTypesOfApprovals] = useState(() =>
    Object.values(AssignTypesOfApprovals),
  );
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [expanded, setExpanded] = useState('');
  const [languages, setLanguages] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);
  const [editCategory, setEditCategoryCode] = useState([]);
  const [profileSourcesTypes] = useState(
    Object.values(ProfileSourcesTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const schema = useRef(null);
  const stateInitRef = useRef({
    title: {
      en: '',
    },
    description: {},
    category_code: [],
    number: '',
    evaluations: [
      {
        order: 1,
        assignable: [
          {
            assignable_type: '',
            company_uuid: null,
            assignable_ids: [],
            source_type: [],
          },
        ],
        questions: [],
      },
    ],
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const handleEvaluationChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : '');
  };

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is for sending new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the data on edit
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsPreScreeningById({ uuid });
    setIsLoading(false);
    if (response && response.status === 200) {
      const { results } = response.data;
      setState({
        id: 'edit',
        value: { ...results, number: results.evaluations.length },
      });
      setEditCategoryCode(results.category_code);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t, uuid]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    const errorsKeys = Object.keys(errors);
    if (errorsKeys.length > 0) {
      const firstInvalidEvaluationIndex = errorsKeys.findIndex((item) =>
        item.includes('evaluations['),
      );
      if (firstInvalidEvaluationIndex !== -1)
        setExpanded(
          `panel-${
            +errorsKeys[firstInvalidEvaluationIndex].match(/\[(.*?)]/)[1] + 1
          }`,
        );
      return;
    }
    setIsLoading(true);
    setIsSaveLoading(true);

    let response;
    if (uuid) response = await UpdateSetupsPreScreening(state);
    else response = await CreateSetupsPreScreening(state);

    setIsLoading(false);
    setIsSaveLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      GlobalHistory.push('/recruiter/job/initial-approval/pre-screening-approval');

      showSuccess(
        t(
          `${translationPath}${
            (uuid && 'approvals-updated-successfully')
            || 'approvals-created-successfully'
          }`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}${
            (uuid && 'approvals-update-failed') || 'approvals-create-failed'
          }`,
        ),
        response,
      );
  };

  /**
   * @param questionIndex
   * @param parentIndex
   * @param uuid
   * @param newValue
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to handle update question on edit
   */
  const updateQuestionHandler = useCallback(
    (questionIndex, parentIndex) => (id, newValue) => {
      state.evaluations[parentIndex].questions[questionIndex] = newValue;
      setState({ id: 'evaluations', value: state.evaluations });
    },
    [state.evaluations],
  );

  /**
   * @param questionIndex
   * @param parentIndex
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method to handle remove question
   */
  const removeQuestionHandler = useCallback(
    (questionIndex, parentIndex) => () => {
      state.evaluations[parentIndex].questions.splice(questionIndex, 1);
      setState({ id: 'evaluations', value: state.evaluations });
    },
    [state.evaluations],
  );

  /**
   * @param evaluationIndex
   * @param assignableType
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to return if assignable type is duplicated
   */
  // const getIsDuplicatedAssignType = useCallback(
  //   (evaluationIndex, assignableType) => state.evaluations[evaluationIndex].assignable
  //     && state.evaluations[evaluationIndex].assignable.filter(
  //       (item) => item.assignable_type && item.assignable_type === assignableType,
  //     ).length > 1,
  //   [state.evaluations],
  // );
  console.log({ errors, state });
  /**
   * @param evaluationIndex
   * @param assignableIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle remove assignable items
   */
  const removeAssignableItemHandler = useCallback(
    (evaluationIndex, assignableIndex) => () => {
      state.evaluations[evaluationIndex].assignable.splice(assignableIndex, 1);
      setState({ id: 'evaluations', value: state.evaluations });
    },
    [state.evaluations],
  );

  /**
   * @param evaluationIndex
   * @param assignableIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle add item
   */
  const addAssignableItemHandler = useCallback(
    (evaluationIndex) => () => {
      if (state.evaluations[evaluationIndex].assignable)
        state.evaluations[evaluationIndex].assignable.push({
          assignable_type: '',
          company_uuid: '',
          assignable_ids: [],
          source_type: [],
        });
      else
        state.evaluations[evaluationIndex].assignable = [
          {
            assignable_type: '',
            company_uuid: '',
            assignable_ids: [],
            source_type: [],
          },
        ];

      setState({ id: 'evaluations', value: state.evaluations });
    },
    [state.evaluations],
  );

  /**
   * @param evaluationIndex
   * @param assignableIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle change for the assignable type
   */
  const onAssignableTypeChanged = useCallback(
    (newValue) => {
      const localEvaluations = [...(state.evaluations || [])];
      const localAssignable = [
        ...(localEvaluations[newValue.parentIndex]?.assignable || []),
      ];
      if (localAssignable[newValue.subParentIndex]?.assignable_ids?.length > 0) {
        localAssignable[newValue.subParentIndex].assignable_ids = [];
        localEvaluations[newValue.parentIndex].assignable = localAssignable;
        setState({ id: 'evaluations', value: localEvaluations });
      }

      setState(newValue);
    },
    [state.evaluations],
  );

  /**
   * @param evaluationIndex
   * @param assignableIndex
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to handle change for the branch
   */
  const onBranchChanged = useCallback(
    (newValue) => {
      const localEvaluations = [...(state.evaluations || [])];
      const localAssignable = [
        ...(localEvaluations[newValue.parentIndex]?.assignable || []),
      ];
      if (localAssignable[newValue.subParentIndex]?.assignable_type) {
        localAssignable[newValue.subParentIndex].assignable_type = null;
        localEvaluations[newValue.parentIndex].assignable = localAssignable;
        setState({ id: 'evaluations', value: localEvaluations });
      }
      setState(newValue);
    },
    [state.evaluations],
  );

  /**
   * @param questionIndex
   * @param parentIndex
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method to handle duplicate question
   */
  const duplicateQuestionHandler = useCallback(
    (questionIndex, parentIndex) => (toDuplicateItem) => {
      const localNewItem = { ...toDuplicateItem };
      if (localNewItem.uuid) delete localNewItem.uuid;
      localNewItem.order = state.evaluations[parentIndex].questions.length + 1;

      state.evaluations[parentIndex].questions.push(localNewItem);
      setState({ id: 'evaluations', value: state.evaluations });
    },
    [state.evaluations],
  );

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
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method to handle add a new question
   */
  const onAddQuestionClicked = (index) => {
    const currentQuestion = state.evaluations[index].questions.length;
    const newDto = {
      title: {
        en: '',
      },
      description: {
        en: '',
      },
      type: 1,
      is_required: false,
      order: currentQuestion + 1 || 1,
    };

    state.evaluations[index].questions.push(newDto);
    setState({ id: 'evaluations', value: state.evaluations });
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (uuid) getEditInit();
  }, [uuid, getEditInit]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
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
                  .required(t('Shared:this-field-is-required')),
              }),
              {},
            ),
          )
          .nullable()
          .test(
            'isRequired',
            `${t('please-add-at-least')} ${1} ${t('title')}`,
            (value) => value && Object.keys(value).length > 0,
          ),
      ),
      category_code: yup
        .array()
        .nullable()
        .min(1, `${t('please-select-at-least')} ${1} ${t('category')}`),
      evaluations: yup.array().of(
        yup.object().shape({
          assignable: yup.array().of(
            yup.object().shape({
              assignable_type: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              company_uuid: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              assignable_ids: yup
                .array()
                .nullable()
                .min(1, `${t('please-select-at-least')} ${1} ${t('item')}`),
              source_type: yup.array().nullable(),
            }),
          ),
          // .uniqueItem(t('assign-type-is-duplicated'), (a) => a.assignable_type),
          questions: yup
            .array()
            .of(
              yup.object().shape({
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
                            .required(t('Shared:this-field-is-required')),
                        }),
                        {},
                      ),
                    )
                    .nullable()
                    .test(
                      'isRequired',
                      `${t('Shared:please-add-at-least')} ${1} ${t('title')}`,
                      (value) => value && Object.keys(value).length > 0,
                    ),
                ),
                description: yup.lazy((obj) =>
                  yup
                    .object()
                    .shape(
                      Object.keys(obj).reduce(
                        (newMap, key) => ({
                          ...newMap,
                          [key]: yup
                            .string()
                            .nullable()
                            .required(t('Shared:this-field-is-required')),
                        }),
                        {},
                      ),
                    )
                    .nullable()
                    .test(
                      'isRequired',
                      `${t('please-add-at-least')} ${1} ${t('description')}`,
                      (value) => value && Object.keys(value).length > 0,
                    ),
                ),
                type: yup
                  .number()
                  .nullable()
                  .required(t('Shared:this-field-is-required')),
                file_answer: yup
                  .object()
                  .nullable()
                  .when('type', (value, field) => {
                    if (value === EvaluationQuestionsTypesEnum.Files.key)
                      return field.shape({
                        file_type: yup
                          .string()
                          .nullable()
                          .required(t('Shared:this-field-is-required')),
                        file_size: yup
                          .string()
                          .nullable()
                          .required(t('Shared:this-field-is-required')),
                      });
                    return field;
                  }),
                options: yup.array().when('type', (typeValue, field) => {
                  if (
                    typeValue === EvaluationQuestionsTypesEnum.MultipleChoice.key
                    || typeValue === EvaluationQuestionsTypesEnum.Checkbox.key
                    || typeValue === EvaluationQuestionsTypesEnum.Dropdown.key
                  )
                    return field
                      .of(
                        yup
                          .object()
                          .nullable()
                          .shape({
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
                                        .required(
                                          t('Shared:this-field-is-required'),
                                        ),
                                    }),
                                    {},
                                  ),
                                )
                                .nullable()
                                .test(
                                  'isRequired',
                                  `${t('Shared:please-add-at-least')} ${1} ${t(
                                    'title',
                                  )}`,
                                  (value) => value && Object.keys(value).length > 0,
                                ),
                            ),
                          }),
                      )
                      .min(
                        1,
                        `${t('Shared:please-add-at-least')} ${1} ${t('option')}`,
                      );
                  return field;
                }),
                is_required: yup.bool().nullable(),
                order: yup.number().nullable(),
              }),
            )
            .nullable(),
          // .min(1, `${t('please-select-at-least')} ${1} ${t('question')}`),
        }),
      ),
    });
  }, [t]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else showError(t('Shared:failed-to-get-languages'));
  }, [t, userReducer]);

  return (
    <div className="page-wrapper">
      <div className="page-header-wrapper px-2 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {uuid
            ? t(`${translationPath}edit-approval`)
            : t(`${translationPath}add-approval`)}
        </span>
      </div>
      <div className="page-body-wrapper">
        <div className="approval-management-content-wrapper">
          <div>
            <div className="d-flex-v-center-h-end">
              <ButtonBase
                className="btns theme-transparent mx-3 mb-2"
                onClick={() => {
                  addLanguageHandler('title', state.title)();
                }}
                disabled={
                  isLoading
                  || languages.length === 0
                  || (state.title
                    && languages.length === Object.keys(state.title).length)
                }
              >
                <span className="fas fa-plus" />
                <span className="px-1">{t('add-language')}</span>
              </ButtonBase>
            </div>
            {state.title
              && Object.entries(state.title).map((item, index) => (
                <React.Fragment key={`namesKey${index + 1}`}>
                  {index > 0 && (
                    <div className="d-flex-h-between">
                      <SharedAutocompleteControl
                        stateKey="title"
                        title="language"
                        editValue={item[0]}
                        placeholder="select-language"
                        onValueChanged={({ value }) => {
                          let localState = { ...state };
                          // eslint-disable-next-line prefer-destructuring
                          localState.title = LanguageUpdateKey(
                            { [item[0]]: value },
                            localState.title,
                          );
                          onStateChanged({ id: 'edit', value: localState });
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
                        onClick={() => {
                          removeLanguageHandler('title', state.title, item[0])();
                        }}
                      >
                        <span className="fas fa-times" />
                        <span className="px-1">{t('remove-language')}</span>
                      </ButtonBase>
                    </div>
                  )}
                  <SharedInputControl
                    isQuarterWidth
                    errors={errors}
                    parentId="title"
                    stateKey={item[0]}
                    editValue={item[1]}
                    errorPath={`title.${[item[0]]}`}
                    parentTranslationPath={parentTranslationPath}
                    title={`${t(
                      `${translationPath}pre-screening-title`,
                    )} (${getLanguageTitle(languages, item[0])})`}
                    isSubmitted={isSubmitted}
                    onValueChanged={onStateChanged}
                  />
                </React.Fragment>
              ))}
          </div>
          <div>
            <div className="description-text px-2 pb-3">
              {t(`${translationPath}category-description`)}
            </div>
            <SharedAPIAutocompleteControl
              isQuarterWidth
              errors={errors}
              title="categories"
              isSubmitted={isSubmitted}
              getOptionLabel={(option) =>
                (option.title
                  && (option.title[i18next.language] || option.title.en))
                || ''
              }
              stateKey="category_code"
              errorPath="category_code"
              placeholder="select-categories"
              onValueChanged={onStateChanged}
              idRef="categoriesAutocompleteRef"
              translationPath={translationPath}
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllJobCategoriesByCode}
              editValue={state.category_code || []}
              uniqueKey="code"
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                ...((state.category_code?.length || editCategory.length > 0) && {
                  with_than: [
                    ...(state.category_code || []),
                    ...(editCategory || []),
                  ],
                }),
                for_settings: true,
              }}
            />
          </div>
          <div>
            <div className="description-text px-2 pb-3">
              {t(`${translationPath}number-description`)}
            </div>
            <SharedAutocompleteControl
              title="number-of-approvals"
              errors={errors}
              stateKey="number"
              disableClearable
              placeholder="select-number-of-approvals"
              editValue={state.number}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={(newValue) => {
                setState(newValue);
                if (+newValue.value < state.evaluations.length) {
                  state.evaluations.length = +newValue.value;
                  setState({ id: 'evaluations', value: state.evaluations });
                } else {
                  const evaluationsLocalArray = Array.from({
                    length: +newValue.value - state.evaluations.length,
                  }).map((item, idx) => ({
                    order: idx + state.evaluations.length + 1 || 1,
                    assignable: [
                      {
                        assignable_type: '',
                        company_uuid: null,
                        assignable_ids: [],
                      },
                    ],
                    questions: [],
                  }));
                  setState({
                    id: 'evaluations',
                    value: state.evaluations.concat(evaluationsLocalArray),
                  });
                }
              }}
              initValues={Object.values(NumberOfApprovalsEnum)}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              errorPath="number"
              getOptionLabel={(option) => option.title || 'N/A'}
            />
          </div>
          <hr />
          <div>
            <div className="description-text px-2 pb-3">
              {t(`${translationPath}evaluation-description`)}
            </div>
            <div className="approvals-evaluations-wrapper px-2">
              {state.evaluations
                && state.evaluations.map((item, index) => (
                  <div
                    className="evaluation-item"
                    key={`${index + 1}-evaluation-item`}
                  >
                    <Accordion
                      expanded={expanded === `panel-${index + 1}`}
                      onChange={handleEvaluationChange(`panel-${index + 1}`)}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        {`${t(`${translationPath}approver`)} ( ${index + 1} )`}
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="approval-item-wrapper">
                          {item.assignable
                            && item.assignable.map(
                              (assignableItem, assignableIndex, assignableItems) => (
                                <div
                                  className="d-flex flex-wrap"
                                  key={`assignableItemKey${index + 1}-${
                                    assignableIndex + 1
                                  }`}
                                >
                                  <div className="d-flex-h-between">
                                    <div className="d-flex flex-wrap">
                                      <SharedAPIAutocompleteControl
                                        title="branch"
                                        errors={errors}
                                        errorPath={`evaluations[${index}].assignable[${assignableIndex}].company_uuid`}
                                        isQuarterWidth
                                        searchKey="search"
                                        parentIndex={index}
                                        parentId="evaluations"
                                        subParentId="assignable"
                                        subParentIndex={assignableIndex}
                                        stateKey="company_uuid"
                                        isRequired
                                        isSubmitted={isSubmitted}
                                        placeholder="select-branch"
                                        idRef="branchAutocompleteRef"
                                        getDataAPI={GetAllSetupsBranches}
                                        editValue={assignableItem.company_uuid}
                                        getOptionLabel={(option) =>
                                          (option.name
                                            && (option.name[i18next.language]
                                              || option.name.en
                                              || 'N/A'))
                                          || 'N/A'
                                        }
                                        onValueChanged={onBranchChanged}
                                        translationPath={translationPath}
                                        parentTranslationPath={parentTranslationPath}
                                        extraProps={
                                          (assignableItem.company_uuid && {
                                            with_than: [assignableItem.company_uuid],
                                          })
                                          || undefined
                                        }
                                      />
                                      {assignableItem.company_uuid && (
                                        <SharedAutocompleteControl
                                          parentIndex={index}
                                          title="assign-type"
                                          errors={
                                            // (getIsDuplicatedAssignType(
                                            //   index,
                                            //   assignableItem.assignable_type,
                                            // ) && {
                                            // [`evaluations[${index}].assignable
                                            // [${assignableIndex}]
                                            //     .assignable_type`]:
                                            //     {
                                            //       message: t(
                                            //         'assign-type-is-duplicated',
                                            //       ),
                                            //       error: true,
                                            //     },
                                            // })
                                            // ||
                                            errors
                                          }
                                          errorPath={`evaluations[${index}].assignable[${assignableIndex}].assignable_type`}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          stateKey="assignable_type"
                                          isRequired
                                          isSubmitted={isSubmitted}
                                          isQuarterWidth
                                          idRef="assignAutocompleteRef"
                                          onValueChanged={onAssignableTypeChanged}
                                          editValue={assignableItem.assignable_type}
                                          placeholder="select-assign-type"
                                          translationPath={translationPath}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          initValues={assignTypesOfApprovals}
                                          getOptionLabel={(option) =>
                                            `${t(
                                              `${translationPath}${option.title}`,
                                            )}` || 'N/A'
                                          }
                                        />
                                      )}

                                      {assignableItem.assignable_type
                                        === AssignTypesOfApprovals.User.key && (
                                        <SharedAPIAutocompleteControl
                                          title="users"
                                          errors={errors}
                                          errorPath={`evaluations[${index}].assignable[${assignableIndex}].assignable_ids`}
                                          isQuarterWidth
                                          searchKey="search"
                                          parentIndex={index}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          stateKey="assignable_ids"
                                          isRequired
                                          isSubmitted={isSubmitted}
                                          placeholder="select-users"
                                          idRef="usersAutocompleteRef"
                                          getDataAPI={GetAllSetupsUsers}
                                          getItemByIdAPI={getSetupsUsersById}
                                          editValue={assignableItem.assignable_ids}
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
                                          onValueChanged={onStateChanged}
                                          translationPath={translationPath}
                                          type={DynamicFormTypesEnum.array.key}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          extraProps={{
                                            company_uuid:
                                              assignableItem.company_uuid,
                                            ...(assignableItem.assignable_ids
                                              ?.length && {
                                              with_than:
                                                assignableItem.assignable_ids,
                                            }),
                                          }}
                                        />
                                      )}
                                      {assignableItem.assignable_type
                                        === AssignTypesOfApprovals.Team.key && (
                                        <SharedAPIAutocompleteControl
                                          title="team"
                                          errors={errors}
                                          errorPath={`evaluations[${index}].assignable[${assignableIndex}].assignable_ids`}
                                          isQuarterWidth
                                          parentIndex={index}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          stateKey="assignable_ids"
                                          placeholder="select-team"
                                          searchKey="search"
                                          idRef="teamAutocompleteRef"
                                          isRequired
                                          isSubmitted={isSubmitted}
                                          getDataAPI={GetAllSetupsTeams}
                                          editValue={assignableItem.assignable_ids}
                                          type={DynamicFormTypesEnum.array.key}
                                          onValueChanged={onStateChanged}
                                          translationPath={translationPath}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          getOptionLabel={(option) =>
                                            (option.title
                                              && (option.title[i18next.language]
                                                || option.title.en))
                                            || 'N/A'
                                          }
                                          extraProps={{
                                            company_uuid:
                                              assignableItem.company_uuid,
                                            ...(assignableItem.assignable_ids
                                              ?.length && {
                                              with_than:
                                                assignableItem.assignable_ids,
                                            }),
                                          }}
                                        />
                                      )}
                                      {assignableItem.assignable_type
                                        === AssignTypesOfApprovals.Position.key && (
                                        <SharedAPIAutocompleteControl
                                          title="position"
                                          errors={errors}
                                          errorPath={`evaluations[${index}].assignable[${assignableIndex}].assignable_ids`}
                                          isQuarterWidth
                                          parentIndex={index}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          stateKey="assignable_ids"
                                          placeholder="select-position"
                                          searchKey="search"
                                          isRequired
                                          isSubmitted={isSubmitted}
                                          idRef="positionAutocompleteRef"
                                          getDataAPI={GetAllSetupsPositions}
                                          editValue={assignableItem.assignable_ids}
                                          type={DynamicFormTypesEnum.array.key}
                                          onValueChanged={onStateChanged}
                                          translationPath={translationPath}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          getOptionLabel={(option) =>
                                            (option.name
                                              && (option.name[i18next.language]
                                                || option.name.en))
                                            || 'N/A'
                                          }
                                          extraProps={{
                                            company_uuid:
                                              assignableItem.company_uuid,
                                            ...(assignableItem.assignable_ids
                                              ?.length && {
                                              with_than:
                                                assignableItem.assignable_ids,
                                            }),
                                          }}
                                        />
                                      )}
                                      {assignableItem.assignable_type
                                        === AssignTypesOfApprovals.Employee.key && (
                                        <SharedAPIAutocompleteControl
                                          title="employee"
                                          errors={errors}
                                          errorPath={`evaluations[${index}].assignable[${assignableIndex}].assignable_ids`}
                                          isQuarterWidth
                                          parentIndex={index}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          stateKey="assignable_ids"
                                          placeholder="select-employee"
                                          searchKey="search"
                                          isRequired
                                          isSubmitted={isSubmitted}
                                          idRef="employeeAutocompleteRef"
                                          getDataAPI={GetAllSetupsEmployees}
                                          editValue={assignableItem.assignable_ids}
                                          type={DynamicFormTypesEnum.array.key}
                                          onValueChanged={onStateChanged}
                                          translationPath={translationPath}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
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
                                            }` || 'N/A'
                                          }
                                          extraProps={{
                                            company_uuid:
                                              assignableItem.company_uuid,
                                            ...(assignableItem.assignable_ids
                                              ?.length && {
                                              with_than:
                                                assignableItem.assignable_ids,
                                            }),
                                          }}
                                        />
                                      )}
                                      <div className="d-flex">
                                        <SharedAutocompleteControl
                                          isQuarterWidth
                                          parentIndex={index}
                                          parentId="evaluations"
                                          subParentId="assignable"
                                          subParentIndex={assignableIndex}
                                          errors={errors}
                                          title="auto-approve-source-types"
                                          stateKey="source_type"
                                          isDisabled={isLoading}
                                          isSubmitted={isSubmitted}
                                          placeholder="select-source-types"
                                          onValueChanged={onStateChanged}
                                          type={DynamicFormTypesEnum.array.key}
                                          initValues={profileSourcesTypes}
                                          editValue={assignableItem.source_type}
                                          parentTranslationPath={
                                            parentTranslationPath
                                          }
                                          errorPath="source_type"
                                        />
                                      </div>
                                    </div>
                                    {assignableItems.length > 1 && (
                                      <ButtonBase
                                        className="btns-icon c-warning mx-2 mt-1"
                                        onClick={removeAssignableItemHandler(
                                          index,
                                          assignableIndex,
                                        )}
                                      >
                                        <span className="fas fa-times" />
                                      </ButtonBase>
                                    )}
                                  </div>
                                  {assignableIndex < assignableItems.length - 1 && (
                                    <div className="separator-h mb-3" />
                                  )}
                                </div>
                              ),
                            )}

                          <div className="d-flex-v-center-h-end mb-3">
                            <ButtonBase
                              className="btns theme-solid mx-2 mt-1"
                              onClick={addAssignableItemHandler(index)}
                            >
                              <span className="fas fa-plus" />
                              <span className="px-1">
                                {t(`${translationPath}add-new-type`)}
                              </span>
                            </ButtonBase>
                          </div>
                          <div className="separator-h mb-3" />
                          {/* {item.assignable_type && ( */}
                          {isSubmitted
                            && errors
                            && errors[`evaluations[${index}].questions`] && (
                            <div className="c-error py-1">
                              <span>
                                {errors[`evaluations[${index}].questions`].message}
                              </span>
                            </div>
                          )}
                          <div className="approval-question-card">
                            {item.questions
                              && item.questions.map((el, i) => (
                                <ApprovalsQuestionCard
                                  index={i}
                                  question={el}
                                  errors={errors}
                                  isSubmitted={isSubmitted}
                                  getTitleErrorPath={(language) =>
                                    `evaluations[${index}].questions[${i}].title.${language[0]}`
                                  }
                                  getDescriptionErrorPath={(language) =>
                                    `evaluations[${index}].questions[${i}].description.${language[0]}`
                                  }
                                  getOptionErrorPath={(language, optionIndex) =>
                                    `evaluations[${index}].questions[${i}].options[${optionIndex}].title.${language[0]}`
                                  }
                                  getOptionsErrorPath={() =>
                                    `evaluations[${index}].questions[${i}].options`
                                  }
                                  fileTypeStateKey="file_type"
                                  fileSizeStateKey="file_size"
                                  fileTypeErrorPath={`evaluations[${index}].questions[${i}].file_answer.file_type`}
                                  fileSizeErrorPath={`evaluations[${index}].questions[${i}].file_answer.file_size`}
                                  parentId="evaluations"
                                  parentIndex={index}
                                  subParentId="questions"
                                  subParentIndex={i}
                                  subSubParentId="options"
                                  key={el.uuid || `questionsRef${i}`}
                                  updateQuestion={updateQuestionHandler(i, index)}
                                  removeQuestion={removeQuestionHandler(i, index)}
                                  duplicateQuestion={duplicateQuestionHandler(
                                    i,
                                    index,
                                  )}
                                />
                              ))}
                            <ButtonBase
                              className="btns theme-solid mx-0"
                              onClick={() => onAddQuestionClicked(index)}
                            >
                              <span className="fas fa-plus" />
                              <span className="px-1">
                                {t(`${translationPath}add-new-criteria`)}
                              </span>
                            </ButtonBase>
                          </div>
                          {/* )} */}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end">
          <ButtonBase
            disabled={isSaveLoading || isLoading}
            className="btns theme-solid"
            onClick={saveHandler}
          >
            {t(`${translationPath}save`)}
            {isSaveLoading && (
              <i className="fas fa-circle-notch fa-spin ml-1-reversed" />
            )}
          </ButtonBase>
        </div>
      </div>
    </div>
  );
};

export default PreScreeningApprovalManagement;
