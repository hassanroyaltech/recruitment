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
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../../../../../setups/shared';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import * as yup from 'yup';
import {
  AvatarsComponent,
  DialogComponent,
} from '../../../../../../../../../components';
import {
  AssessmentTestCategoriesEnums,
  AssessmentTestMembersTypeEnum,
  AvatarsThemesEnum,
  DynamicFormTypesEnum,
  PipelineBulkSelectTypesEnum,
} from '../../../../../../../../../enums';
import FormMembersPopover from '../../../../../../../../form-builder-v2/popovers/FormMembers.Popover';

import '../FormInviteManagement.Style.scss';
import { evarecAPI } from '../../../../../../../../../api/evarec';
import { CentralAssessmentTabs } from './CentralAssessment.Tabs';
import { SendAssessmentTestReminder } from '../../../../../../../../../services';
import { AssessmentTestTypesEnum } from '../../../../../../../../../enums/Shared/AssessmentTestTypes.Enum';
import {
  CreateTestifyAssessment,
  GetAllTestifyAssessments,
} from '../../../../../../../../../services/Testify.Services';

export const SendCentralAssessmentDialog = ({
  job_uuid,
  pipeline_uuid,
  job_pipeline_uuid,
  selectedCandidates,
  // selectedConfirmedStages,
  titleText,
  isOpen,
  // onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
  type,
  isReminder,
  isDisabledTestlify,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const assessmentTestTypesEnum = useMemo(
    () =>
      Object.values(AssessmentTestTypesEnum)
        .filter(item => item !== AssessmentTestTypesEnum.ElevatueTestlify)
        .map((item) => ({
          ...item,
          title: t(`${translationPath}${item.value}`),
        })),
    [t, translationPath],
  );

  const [errors, setErrors] = useState(() => ({}));
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });

  const stateInitRef = useRef({
    invitedMember: [],
    relation_uuid: job_uuid,
    relation: type,
    assessment_test_type: AssessmentTestTypesEnum.AutomationTest.key,
    // start for the Testify
    assessment_test_uuid: null,
    // candidates: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  console.log({
    state,
  });

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
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          ...(!isReminder && {
            detail_id: yup
              .string()
              .nullable()
              .when('category_id', {
                is: `${AssessmentTestCategoriesEnums.it.key}`,
                then: yup.string().required(t('Shared:this-field-is-required')),
                otherwise: yup.string().nullable(),
              }),
            detail_level_id: yup
              .string()
              .nullable()
              .when('category_id', {
                is: `${AssessmentTestCategoriesEnums.it.key}`,
                then: yup.string().required(t('Shared:this-field-is-required')),
                otherwise: yup.string().nullable(),
              }),
            test_language_id: yup
              .string()
              .nullable()
              .when(
                ['assessment_details', 'assessment_details.data.languages'],
                (state, languages, schema) => {
                  if (languages?.length > 0)
                    return schema.required(t('Shared:this-field-is-required'));
                  return schema;
                },
              ),
            assessment_test_type: yup.number(),
          }),
          assessment_test_uuid: yup.string().nullable(),
          category_id: yup
            .string()
            .nullable()
            .when(['assessment_test_type'], ([value], schema) => {
              if (value !== AssessmentTestTypesEnum.Elevatus.key)
                return schema.required(t('Shared:this-field-is-required'));
              return schema;
            }),
          invitedMember: yup
            .array()
            .of(
              yup.object().shape({
                type: yup.number().nullable(),
                uuid: yup.string().nullable(),
                name: yup.object().nullable(),
              }),
            )
            .nullable()
            .required(
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}member`,
              )}`,
            )
            .min(
              1,
              `${t('Shared:please-select-at-least')} ${1} ${t(
                `${translationPath}member`,
              )}`,
            ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [isReminder, state, t, translationPath]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 2
   */
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the page popovers part 1
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = null) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the deleted for one of the avatar items like invitedMembers
   */
  const onAvatarDeleteClicked = useCallback(
    (index, items, key) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      const localItems = [...items];
      localItems.splice(index, 1);
      setState({
        id: key,
        value: localItems,
      });
    },
    [],
  );
  // Send assessment or reminder depending on isReminder prop
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    const localeState = {
      ...state,
      assessment_test_uuid: state?.assessment_test_uuid,
      category_id: state?.category_id,
      invited_members: state?.invitedMember,
      relation_uuid: state?.relation_uuid,
      relation: state?.relation,
      ...(!isReminder && {
        detail_id: state?.detail_id,
        detail_level_id: state?.detail_level_id,
        test_language_id: state?.test_language_id,
      }),
    };
    setIsSaving(true);
    const response = await (isReminder
      ? SendAssessmentTestReminder
      : (localeState.assessment_test_type
          === AssessmentTestTypesEnum.AutomationTest.key
          && evarecAPI.PostAssessmentTests)
          || CreateTestifyAssessment)(localeState);
    setIsSaving(false);
    if (response && (response.status === 201 || response.status === 200)) {
      if (isReminder) {
        window?.ChurnZero?.push([
          'trackEvent',
          `Assessment Test - Central Test Assessment Reminder`,
          `Central Test Assessment Reminder`,
          1,
          {},
        ]);
        showSuccess(t(`${translationPath}assessment-reminder-sent-successfully`));
      } else {
        window?.ChurnZero?.push([
          'trackEvent',
          `Assessment Test - Central Test Assessment`,
          `Central Test Assessment`,
          1,
          {},
        ]);
        showSuccess(t(`${translationPath}assessment-test-sent-successfully`));
      }
      if (isOpenChanged) isOpenChanged();
    } else if (isReminder)
      showError(t(`${translationPath}assessment-reminder-sending-failed`), response);
    else showError(t(`${translationPath}assessment-test-sending-failed`), response);
  };
  // Reshape the selected candidates JSON
  const getEditInit = useCallback(async () => {
    const localSelectedCandidates = selectedCandidates.map(
      (item) =>
        (item.bulkSelectType === PipelineBulkSelectTypesEnum.Stage.key && {
          type: AssessmentTestMembersTypeEnum.JobStage.key,
          uuid: item.stage.uuid,
          name: item.stage.title,
        }) || {
          type: AssessmentTestMembersTypeEnum.JobCandidate.key,
          uuid: item.candidate.uuid,
          stage_uuid: item.stage.uuid,
          name: item.candidate.name,
        },
    );
    setState({
      id: 'invitedMember',
      value: localSelectedCandidates,
    });
  }, [selectedCandidates]);

  useEffect(() => {
    if (selectedCandidates && selectedCandidates.length > 0) getEditInit();
  }, [selectedCandidates, getEditInit]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  const [categoriesLoading, setCategoriesLoading] = useState('');
  const getAllAssessmentCategories = useCallback(async () => {
    setCategoriesLoading('categories');
    await evarecAPI
      .GetAllCategories()
      .then((res) => {
        const { results } = res.data;
        if (results && results[0])
          setState({
            id: 'categories',
            value: results[0] || [],
          });
        setCategoriesLoading('');
      })
      .catch(() => setCategoriesLoading(''));
  }, []);

  const getAllAssessmentTests = useCallback(async () => {
    if (typeof state?.category_id !== 'number') return;
    setCategoriesLoading('category_assessments');
    await evarecAPI
      .GetAllAssessmentTests(state?.category_id)
      .then((response) => {
        const { results } = response.data;
        if (results && results[0])
          setState({
            id: 'category_assessments',
            value: results[0] || [],
          });
        setCategoriesLoading('');
      })
      .catch(() => setCategoriesLoading(''));
  }, [state?.category_id]);

  useEffect(() => {
    void getAllAssessmentCategories();
  }, [getAllAssessmentCategories]);

  useEffect(() => {
    void getAllAssessmentTests();
  }, [getAllAssessmentTests]);

  // Extract category levels depending on selected assessment
  const extractLevelCategories = useMemo(() => {
    if (
      !state?.assessment_details
      || !state?.test_language_id
      || state?.category_id !== AssessmentTestCategoriesEnums.it.key
    )
      return [];
    const levelByLang
      = (state?.assessment_details?.data?.languages || []).find(
        (item) => item?.id === state?.test_language_id,
      )?.details || [];
    if (levelByLang?.length > 0) return levelByLang;
    return [];
  }, [state?.assessment_details, state?.category_id, state?.test_language_id]);

  // Extract levels depending on category level
  const extractLevels = useMemo(() => {
    if (!state?.detail_id || !extractLevelCategories?.length) return [];
    let tempLevels
      = (extractLevelCategories || []).find((item) => item?.id === state?.detail_id)
        ?.levels || [];
    tempLevels = tempLevels.map((item) => {
      const [name, id] = Object.entries(item)[0];
      return { name, id };
    });
    if (tempLevels?.length > 0) return tempLevels;
    return [];
  }, [extractLevelCategories, state?.detail_id]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={titleText}
      contentClasses="px-0"
      dialogContent={
        <div className="form-invite-management-content-dialog-wrapper">
          <div className="box-field-wrapper">
            <div className="inline-label-wrapper">
              <span>{t(`${translationPath}invited-members`)}</span>
            </div>
            <div
              className="invite-box-wrapper"
              onClick={(event) => {
                setMembersPopoverProps({
                  arrayKey: 'invitedMember',
                  popoverTabs: CentralAssessmentTabs,
                  values: state.invitedMember,
                  getListAPIProps: ({ type }) => ({
                    job_uuid: job_uuid,
                    pipeline_uuid,
                    job_pipeline_uuid,
                    ...(type !== AssessmentTestMembersTypeEnum.JobStage.key
                      && state.invitedMember
                      && state.invitedMember.length > 0 && {
                      with_than: state.invitedMember
                        .filter((item) => item.type === type)
                        .map((item) => item.uuid),
                    }),
                  }),
                });
                popoverToggleHandler('members', event);
              }}
              onKeyUp={() => {}}
              role="button"
              tabIndex={0}
            >
              <div className="invite-box-body-wrapper">
                {state.invitedMember.map((item, index, items) => (
                  <AvatarsComponent
                    key={`invitedMembersKey${item.uuid}`}
                    avatar={item}
                    avatarImageAlt="member"
                    onTagBtnClicked={onAvatarDeleteClicked(
                      index,
                      items,
                      'invitedMember',
                    )}
                    avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                    translationPath={translationPath}
                    parentTranslationPath={parentTranslationPath}
                  />
                ))}
                <span
                  className={`c-gray-primary px-2 pb-2${
                    (state.invitedMember.length > 0 && ' mt-2') || ''
                  }`}
                >
                  {t(`${translationPath}search-members`)}
                </span>
              </div>
            </div>
          </div>
          <div className="box-field-wrapper mt-3 mb-0">
            <div className="inline-label-wrapper"></div>
            {errors.invitedMember && errors.invitedMember.error && isSubmitted && (
              <div className="c-error fz-10 mb-3 px-2">
                <span>{errors.invitedMember.message}</span>
              </div>
            )}
          </div>
          {!isReminder && !isDisabledTestlify && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              initValuesTitle="title"
              initValues={assessmentTestTypesEnum}
              stateKey="assessment_test_type"
              onValueChanged={onStateChanged}
              inlineLabel="assessment-test-type"
              editValue={state.assessment_test_type}
              placeholder="assessment-test-type"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              getOptionLabel={(option) => option.title}
              sharedClassesWrapper="px-3"
              disableClearable
            />
          )}
          {(state.assessment_test_type
            === AssessmentTestTypesEnum.AutomationTest.key
            || isReminder || isDisabledTestlify) && (
            <>
              <div className="box-field-wrapper">
                <SharedAutocompleteControl
                  isFullWidth
                  inlineLabel="assessment-category"
                  placeholder="select-assessment-category"
                  errors={errors}
                  stateKey="category_id"
                  searchKey="search"
                  editValue={state?.category_id}
                  isDisabled={categoriesLoading === 'categories'}
                  isGlobalLoading={categoriesLoading === 'categories'}
                  isSubmitted={isSubmitted}
                  initValues={state?.categories || []}
                  onValueChanged={(newValue) => {
                    const localState = {
                      ...state,
                      category_id: newValue.value,
                      test_language_id: '',
                      assessment_test_uuid: '',
                      category_assessments: [],
                      detail_id: '',
                      detail_level_id: '',
                    };
                    onStateChanged({ id: 'edit', value: localState });
                  }}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  errorPath="category_id"
                  initValuesKey="category_id"
                  initValuesTitle={'title'}
                />
              </div>
              <div className="box-field-wrapper">
                <SharedAutocompleteControl
                  isFullWidth
                  inlineLabel="assessment"
                  placeholder="select-assessment"
                  errors={errors}
                  stateKey="assessment_test_uuid"
                  searchKey="search"
                  editValue={state?.assessment_test_uuid}
                  isDisabled={
                    categoriesLoading
                    || !state?.category_id
                    || categoriesLoading === 'category_assessments'
                  }
                  isGlobalLoading={categoriesLoading === 'category_assessments'}
                  isSubmitted={isSubmitted}
                  initValues={state?.category_assessments || []}
                  onValueChanged={(newValue) => {
                    const localState = {
                      ...state,
                      assessment_test_uuid: newValue?.value?.uuid,
                      assessment_details: newValue?.value,
                      test_language_id: '',
                      detail_id: '',
                      detail_level_id: '',
                    };
                    onStateChanged({ id: 'edit', value: localState });
                  }}
                  translationPath={translationPath}
                  parentTranslationPath={parentTranslationPath}
                  errorPath="assessment_test_uuid"
                  initValuesKey="uuid"
                  isEntireObject={true}
                  disabledOptions={(option) => option.is_available === false}
                  getOptionLabel={(option) => option?.data?.label || 'N/A'}
                />
              </div>
              {!isReminder && (
                <>
                  {state?.assessment_details?.data?.languages?.length > 0 && (
                    <div className="box-field-wrapper">
                      <SharedAutocompleteControl
                        isFullWidth
                        inlineLabel="assessment-language"
                        placeholder="select-assessment-language"
                        errors={errors}
                        stateKey="test_language_id"
                        searchKey="search"
                        editValue={state?.test_language_id}
                        isSubmitted={isSubmitted}
                        initValues={state?.assessment_details?.data?.languages || []}
                        onValueChanged={(newValue) => {
                          onStateChanged({
                            id: 'test_language_id',
                            value: newValue.value,
                          });
                          onStateChanged({ id: 'detail_id', value: '' });
                          onStateChanged({ id: 'detail_level_id', value: '' });
                        }}
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        errorPath="test_language_id"
                        initValuesKey="id"
                        getOptionLabel={(option) => option?.name || 'N/A'}
                      />
                    </div>
                  )}
                  {state?.category_id === AssessmentTestCategoriesEnums.it.key && (
                    <>
                      <div className="box-field-wrapper">
                        <SharedAutocompleteControl
                          isFullWidth
                          inlineLabel="level-category"
                          placeholder="select-level-category"
                          errors={errors}
                          stateKey="detail_id"
                          searchKey="search"
                          isDisabled={extractLevelCategories?.length === 0}
                          editValue={state?.detail_id}
                          isSubmitted={isSubmitted}
                          initValues={extractLevelCategories || []}
                          onValueChanged={(newValue) => {
                            onStateChanged({
                              id: 'detail_id',
                              value: newValue.value,
                            });
                            onStateChanged({ id: 'detail_level_id', value: '' });
                          }}
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                          errorPath="detail_id"
                          initValuesKey="id"
                          getOptionLabel={(option) => option?.name || 'N/A'}
                        />
                      </div>
                      <div className="box-field-wrapper">
                        <SharedAutocompleteControl
                          isFullWidth
                          inlineLabel="assessment-level"
                          placeholder="assessment-level"
                          errors={errors}
                          stateKey="detail_level_id"
                          searchKey="search"
                          isDisabled={extractLevels?.length === 0}
                          editValue={state?.detail_level_id}
                          isSubmitted={isSubmitted}
                          initValues={extractLevels || []}
                          onValueChanged={onStateChanged}
                          translationPath={translationPath}
                          parentTranslationPath={parentTranslationPath}
                          errorPath="detail_level_id"
                          initValuesKey="id"
                          getOptionLabel={(option) => option?.name || 'N/A'}
                        />
                      </div>
                    </>
                  )}
                </>
              )}
            </>
          )}
          {popoverAttachedWith.members && (
            <FormMembersPopover
              {...membersPopoverProps}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
                setMembersPopoverProps(null);
              }}
              onSave={(newValues) => {
                const localNewValues = { ...newValues };
                const localState = { ...state };
                if (membersPopoverProps.arrayKey === 'invitedMember') {
                  localState.invitedMember = [];
                  if (
                    localNewValues.invitedMember.length
                      === state.invitedMember.length
                    && !localNewValues.invitedMember.some((item) =>
                      state.invitedMember.some(
                        (element) => element.uuid !== item.uuid,
                      ),
                    )
                  )
                    return;
                }

                setState({
                  id: 'destructObject',
                  value: {
                    ...localState,
                    ...localNewValues,
                  },
                });
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
          {state.assessment_test_type === AssessmentTestTypesEnum.Elevatus.key
            && !isReminder && !isDisabledTestlify && (
            <SharedAPIAutocompleteControl
              isFullWidth
              inlineLabel="assessment"
              placeholder="select-assessment"
              stateKey="assessment_test_uuid"
              errorPath="assessment_test_uuid"
              wrapperClasses="px-3"
              errors={errors}
              uniqueKey="assessmentId"
              editValue={state.assessment_test_uuid}
              onValueChanged={onStateChanged}
              getOptionLabel={(option) => option.assessmentTitle}
              getDataAPI={GetAllTestifyAssessments}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              searchKey="query"
              type={DynamicFormTypesEnum.select.key}
              // extraProps={{
              //   with_than:
              //     (state.assessment_test_uuid && [state.assessment_test_uuid])
              //     || undefined,
              // }}
            />
          )}
        </div>
      }
      wrapperClasses="form-invite-management-dialog-wrapper"
      isSaving={isSaving}
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

SendCentralAssessmentDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  job_uuid: PropTypes.string.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_pipeline_uuid: PropTypes.string.isRequired,
  // selectedConfirmedStages: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ).isRequired,
  // onSave: PropTypes.func,
  titleText: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  type: PropTypes.string,
  isReminder: PropTypes.bool,
  isDisabledTestlify: PropTypes.bool,
};
SendCentralAssessmentDialog.defaultProps = {
  titleText: 'send-assessment-test',
  parentTranslationPath: 'EvaRecPipelines',
  translationPath: 'SendCentralAssessmentDialog.',
};
