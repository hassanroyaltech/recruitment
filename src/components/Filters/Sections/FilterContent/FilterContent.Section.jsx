import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import FormControl from '@mui/material/FormControl';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../pages/setups/shared';
import {
  AssessmentTestStatusesEnums,
  CandidateAssignmentStatusesEnum,
  CandidateQuestionnaireStatusesEnum,
  CandidateTypesEnum,
  CandidateVideoAssessmentStatusesEnum,
  DynamicFormTypesEnum,
  FilterDialogCallLocationsEnum,
  LookupsTypesEnum,
  PipelineQuickFilterTypesEnum,
  ProfileSourcesTypesEnum,
} from '../../../../enums';
import i18next from 'i18next';
import {
  DynamicService,
  GetAllRmsFiltersDropdown,
  GetAllSetupsCandidateProperties,
  GetAllSetupsCareerLevels,
  GetAllSetupsCategories,
  GetAllSetupsCertificates,
  GetAllSetupsCountries,
  GetAllSetupsDegreeTypes,
  GetAllSetupsEmployees,
  GetAllSetupsGender,
  GetAllSetupsIndustries,
  GetAllSetupsJobMajors,
  GetAllSetupsJobTypes,
  GetAllSetupsLanguages,
  GetAllSetupsNationality,
  GetAllSetupsPositionsTitle,
  GetAllSetupsProviders,
  GetAllSetupsUsers,
  GetEvaRecPipelineQuestionnaires,
  GetEvaRecVideoAssessment,
} from '../../../../services';
import ButtonBase from '@mui/material/ButtonBase';
import { CollapseComponent } from '../../../Collapse/Collapse.Component';
import { numbersExpression } from '../../../../utils';
import { SliderComponent } from '../../../Slider/Slider.Component';
import { CheckboxesComponent } from '../../../Checkboxes/Checkboxes.Component';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import moment from 'moment';
import ToggleButton from '@mui/material/ToggleButton';
import { CustomDateFilterDialog } from '../../../../pages/analytics/Dialogs/CustomDateFilter.Dialog';
import { CustomCandidatesFilterTagsEnum } from '../../../../enums/Pages/CandidateFilterTags.Enum';
import { useTranslation } from 'react-i18next';
import { PagesFilterInitValue, showError } from '../../../../helpers';
import './FilterContent.Style.scss';

const FilterContentSection = ({
  onClose,
  onApply,
  isWithCheckboxes,
  isWithSliders,
  filterEditValue,
  filterEditValueTags,
  hideIncomplete,
  // showTags,
  callLocation,
  job_uuid,
  hideIncludeExclude,
  showAssessmentTestFilter,
  hideSourceFilter,
  hideReferenceAndApplicant,
  hideAssigneeFilters,
  showRmsFilters,
  showCandidateType,
  isShowHeightAndWeight,
  isShowVideoAssessmentFilter,
  isShowQuestionnaireFilter,
  isShowDynamicProperty,
  isShowAssigneeFilter,
  quickFilters,
  isTwoThirdsWidth,
  isQuarterWidth,
  isHalfWidth,
  parentTranslationPath,
  translationPath,
  isShowAge
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [candidateProperties, setCandidateProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filterToggleButtons, setFilterToggleButtons] = useState([]);
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const timeRef = useRef();
  const [profileSourcesTypes] = useState(
    Object.values(ProfileSourcesTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [assessmentTestStatuses] = useState(
    Object.values(AssessmentTestStatusesEnums)
      .filter((it) => it.showInFilter)
      .map((item) => ({
        ...item,
        value: t(item.value),
      })),
  );
  const [candidateTypes] = useState(
    Object.values(CandidateTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [questionnaireStatuses] = useState(
    Object.values(CandidateQuestionnaireStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [videoAssessmentStatuses] = useState(
    Object.values(CandidateVideoAssessmentStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [candidateAssignmentStatusesEnum] = useState(
    Object.values(CandidateAssignmentStatusesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const [isOpenCandidatePropertiesCollapse, setIsOpenCandidatePropertiesCollapse]
    = useState(false);
  const [isChangedFromFields, setIsChangedFromFields] = useState(false);
  const stateInitRef = useRef(PagesFilterInitValue);
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const stateRef = useRef(state);

  const applyFilters = useCallback(
    (isChanged = false) => {
      if (!isChanged) return;
      let errors = [];
      if (
        isShowHeightAndWeight
        && stateRef.current?.from_weight
        && stateRef.current?.to_weight
        && stateRef.current?.to_weight < stateRef.current?.from_weight
      )
        errors.push('filter-weight-error');
      if (
        isShowHeightAndWeight
        && stateRef.current?.from_height
        && stateRef.current?.to_height
        && stateRef.current?.to_height < stateRef.current?.from_height
      )
        errors.push('filter-height-error');
      if (
        isShowAge
        && stateRef.current?.age_lte
        && stateRef.current?.age_gte
        && stateRef.current?.age_gte < stateRef.current?.age_lte
      )
        errors.push('filter-age-error');
      if (errors.length) {
        errors.forEach((item) => {
          showError(t(`${translationPath}${item}`));
        });
        return;
      }
      const stateCopy = { ...stateRef.current };
      delete stateCopy.checkboxFilters;
      console.log({
        state: stateRef.current,
        stateCopy,
      });
      onApply(
        stateRef.current.is_include,
        {
          ...stateCopy,
          ...stateRef.current.checkboxFilters,
        },
        [...(stateRef.current.tags || []), ...(stateRef.current.custom_tags || [])],
        { ...stateRef.current },
      );
    },
    [isShowHeightAndWeight, onApply, t, translationPath],
  );

  const onStateChanged = useCallback((newValue) => {
    setState(newValue);
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      setIsChangedFromFields((item) => !item);
    }, 400);
  }, []);

  useEffect(() => {
    if (quickFilters && quickFilters.length > 0) applyFilters(true);
  }, [applyFilters, quickFilters, isChangedFromFields]);

  const getCandidatePropertyIndex = useMemo(
    () =>
      (candidatePropertyUUID, candidate_property = state.candidate_property) =>
        (candidate_property || []).findIndex(
          (item) => item.uuid === candidatePropertyUUID,
        ),
    [state.candidate_property],
  );
  const getCandidatePropertyValue = useMemo(
    () => (candidatePropertyUUID) =>
      (getCandidatePropertyIndex(candidatePropertyUUID) !== -1
        && state.candidate_property[getCandidatePropertyIndex(candidatePropertyUUID)]
          .value)
      || null,
    [getCandidatePropertyIndex, state.candidate_property],
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

  const getDisplayedLabel = useMemo(
    () => (option) =>
      option.value
      || (option.title && (option.title[i18next.language] || option.title.en))
      || (option.name && (option.name[i18next.language] || option.name.en))
      || `${
        option.first_name
        && (option.first_name[i18next.language] || option.first_name.en)
      }${
        option.last_name
        && ` ${option.last_name[i18next.language] || option.last_name.en}`
      }`,
    [],
  );

  const onTagDeleteHandler = useCallback(
    (currentIndex, items, id) => () => {
      const localVals = [...items];
      localVals.splice(currentIndex, 1);
      onStateChanged({
        id,
        value: localVals,
      });
    },
    [onStateChanged],
  );

  const getIsQuickFilterVisibleField = useMemo(
    () =>
      ({ key }) =>
        !quickFilters
        || quickFilters.findIndex((item) => item.key === key && item.status) !== -1,
    [quickFilters],
  );

  const getAllCandidateProperties = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllSetupsCandidateProperties({
      is_paginate: 0,
      use_for: 'list',
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      let temp = (response?.data?.results || []).map((item) => ({
        ...item,
        lookup_type: LookupsTypesEnum.Multiple.key,
      }));
      setCandidateProperties(temp);
    } else {
      if (onClose) onClose();
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [onClose, t]);

  useEffect(() => {
    if (isShowDynamicProperty) void getAllCandidateProperties();
  }, [getAllCandidateProperties, isShowDynamicProperty]);

  useEffect(() => {
    if (filterEditValue && Object.keys(filterEditValue).length)
      setState({ id: 'edit', value: filterEditValue });
  }, [filterEditValue]);

  useEffect(() => {
    if (filterEditValueTags) {
      const customTags = filterEditValueTags
        .filter((item) => item)
        .filter((item) =>
          Object.values(CustomCandidatesFilterTagsEnum).some(
            (element) => element.key === item.key,
          ),
        );
      setState({
        id: 'custom_tags',
        value: Object.values(CustomCandidatesFilterTagsEnum).map((item) =>
          customTags.find((tag) => tag?.key === item.key),
        ),
      });
    }
  }, [filterEditValueTags]);

  useEffect(() => {
    let localFilterToggleButtons = [];
    const localFiltersWithoutCustom = [
      { key: 1, value: 'default', filterValue: null },
      {
        key: 2,
        value: 'today',
        filterValue: {
          from_date: moment(new Date()).format('YYYY-MM-DD'),
          to_date: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
      {
        key: 3,
        value: 'yesterday',
        filterValue: {
          from_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
          to_date: moment().subtract(1, 'days').format('YYYY-MM-DD'),
        },
      },
      {
        key: 4,
        value: '7D',
        filterValue: {
          from_date: moment().subtract(7, 'days').format('YYYY-MM-DD'),
          to_date: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
      {
        key: 5,
        value: '30D',
        filterValue: {
          from_date: moment().subtract(30, 'days').format('YYYY-MM-DD'),
          to_date: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
      {
        key: 6,
        value: '60D',
        filterValue: {
          from_date: moment().subtract(60, 'days').format('YYYY-MM-DD'),
          to_date: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
      {
        key: 7,
        value: '3M',
        filterValue: {
          from_date: moment().subtract(3, 'months').format('YYYY-MM-DD'),
          to_date: moment(new Date()).format('YYYY-MM-DD'),
        },
      },
    ];
    const localFiltersWithCustom = [
      {
        key: 8,
        value: 'custom',
        filterValue: null, // TODO: Diana : Add dialog later for custom date range filter
      },
    ];
    if (!quickFilters)
      localFilterToggleButtons = [
        ...localFiltersWithoutCustom,
        ...localFiltersWithCustom,
      ];
    else {
      if (
        getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.DateFilterType.key,
        })
      )
        localFilterToggleButtons = [...localFiltersWithoutCustom];
      if (
        getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.FromDate.key,
        })
        || getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.ToDate.key,
        })
      )
        localFilterToggleButtons.push(...localFiltersWithCustom);
    }
    setFilterToggleButtons(localFilterToggleButtons);
  }, [getIsQuickFilterVisibleField, quickFilters]);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(
    () => () => {
      if (timeRef.current) clearTimeout(timeRef.current);
    },
    [],
  );

  return (
    <div className="filter-content-section">
      {!quickFilters && (
        <div className="d-flex flex-wrap mb-4">
          <div className="d-flex-h-between">
            {/* <--- RADIO BUTTONS --> */}
            {!hideIncludeExclude && (
              <div className="mx-3">
                <FormControl component="fieldset">
                  <div className="h6 font-weight-normal text-gray">
                    {t(`${translationPath}type`)}
                  </div>
                  <RadioGroup
                    aria-label="is_include"
                    name="is_includeRadio"
                    value={state.is_include}
                    onChange={(e) =>
                      onStateChanged({ id: 'is_include', value: e.target?.value })
                    }
                  >
                    <FormControlLabel
                      value={true}
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}included`)}
                    />
                    <FormControlLabel
                      value={false}
                      control={<Radio color="primary" />}
                      label={t(`${translationPath}excluded`)}
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            )}
            <div className="w-100">
              <SharedAutocompleteControl
                editValue={state.query}
                placeholder="type-in-a-keyword-and-click-enter-to-confirm"
                labelValue="by-keyword(s)"
                isFreeSolo
                stateKey="query"
                onValueChanged={(e) =>
                  onStateChanged({ id: 'query', value: e.value })
                }
                type={DynamicFormTypesEnum.array.key}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
          </div>
          <div className="separator-h mt-3 mb-4 px-2" />
          <div className="h6 font-weight-normal text-gray">
            {t(`${translationPath}filter-results-based-on-the-below`)}:
          </div>
        </div>
      )}
      {callLocation === FilterDialogCallLocationsEnum.SearchDB.key
        && getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.CategoryUuid.key,
        }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="category"
          placeholder="select-category"
          stateKey="category_uuid"
          errorPath="category_uuid"
          onValueChanged={onStateChanged}
          idRef="category_uuid"
          getOptionLabel={(option) =>
            option.title[i18next.language] || option.title.en
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsCategories}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.category_uuid?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
                (state.category_uuid
                  && state.category_uuid?.map((item) => item?.uuid))
                || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.JobType.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}job-type`)}
          placeholder={t(`${translationPath}job-type`)}
          stateKey="job_type"
          errorPath="job_type"
          onValueChanged={onStateChanged}
          idRef="job_type"
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsJobTypes}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.job_type?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.job_type && state.job_type?.map((item) => item?.uuid)) || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.DegreeType.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="degree-type"
          placeholder="degree-type"
          stateKey="degree_type"
          errorPath="degree_type"
          onValueChanged={onStateChanged}
          idRef="degree_type"
          getOptionLabel={(option) =>
            option.name[i18next.language] || option.name.en
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsDegreeTypes}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.degree_type?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.degree_type && state.degree_type?.map((item) => item?.uuid))
              || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Major.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}job-major`)}
          placeholder={t(`${translationPath}job-major`)}
          stateKey="major"
          errorPath="major"
          onValueChanged={onStateChanged}
          idRef="major"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsJobMajors}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.major?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.major && state.major?.map((item) => item?.uuid)) || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.CareerLevel.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}career-level`)}
          placeholder={t(`${translationPath}career-level`)}
          stateKey="career_level"
          errorPath="career_level"
          onValueChanged={onStateChanged}
          idRef="career_level"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsCareerLevels}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.career_level?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.career_level
                && state.career_level?.map((item) => item?.uuid))
              || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Country.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}country`)}
          placeholder={t(`${translationPath}country`)}
          stateKey="country"
          errorPath="country"
          onValueChanged={onStateChanged}
          idRef="country"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsCountries}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.country?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.country && state.country?.map((item) => item?.uuid)) || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Industry.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}industry`)}
          placeholder={t(`${translationPath}industry`)}
          stateKey="industry"
          errorPath="industry"
          onValueChanged={onStateChanged}
          idRef="industry"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsIndustries}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.industry?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.industry && state.industry?.map((item) => item?.uuid)) || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Nationality.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}nationality`)}
          placeholder={t(`${translationPath}nationality`)}
          stateKey="nationality"
          errorPath="nationality"
          onValueChanged={onStateChanged}
          idRef="nationality"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsNationality}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.nationality?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.nationality && state.nationality?.map((item) => item?.uuid))
              || null,
          }}
        />
      )}
      {(getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.LanguagesProficiency.key,
      })
        || getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.Language.key,
        })) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}language-proficiency`)}
          placeholder={t(`${translationPath}language-proficiency`)}
          stateKey="language"
          errorPath="language"
          onValueChanged={onStateChanged}
          idRef="language"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.array.key}
          getDataAPI={GetAllSetupsLanguages}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.language?.map((item) => item.uuid) || []}
          extraProps={{
            with_than:
              (state.language && state.language?.map((item) => item?.uuid)) || null,
          }}
        />
      )}
      {callLocation === FilterDialogCallLocationsEnum.InitialApproval.key && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.AcademicCertificate.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="dr-certificates"
              placeholder="select-dr-certificates"
              stateKey="academic_certificate"
              errorPath="academic_certificate"
              onValueChanged={onStateChanged}
              idRef="academic_certificate"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsCertificates}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.academic_certificate?.map((item) => item.uuid) || []}
              extraProps={{
                with_than:
                  (state.academic_certificate
                    && state.academic_certificate?.map((item) => item?.uuid))
                  || null,
              }}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.InterestedPositionTitle.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="position-title"
              placeholder="select-position-title"
              stateKey="interested_position_title"
              errorPath="interested_position_title"
              onValueChanged={onStateChanged}
              idRef="interested_position_title"
              getOptionLabel={(option) =>
                option.name ? option.name[i18next.language] || option.name.en : ''
              }
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsPositionsTitle}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={
                state.interested_position_title?.map((item) => item.uuid) || []
              }
              extraProps={{
                with_than:
                  (state.interested_position_title
                    && state.interested_position_title?.map((item) => item?.uuid))
                  || null,
              }}
            />
          )}
        </>
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Gender.key,
      }) && (
        <SharedAPIAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title={t(`${translationPath}gender`)}
          placeholder={t(`${translationPath}gender`)}
          stateKey="gender"
          errorPath="gender"
          onValueChanged={onStateChanged}
          idRef="gender"
          getOptionLabel={(option) =>
            option.name ? option.name[i18next.language] || option.name.en : ''
          }
          type={DynamicFormTypesEnum.select.key}
          getDataAPI={GetAllSetupsGender}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          searchKey="search"
          editValue={state.gender?.uuid || ''}
          extraProps={{
            with_than: (state.gender?.uuid && [state.gender.uuid]) || null,
          }}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.Skills.key,
      }) && (
        <SharedAutocompleteControl
          placeholder="press-enter-to-add"
          title="skills"
          // title="condition"
          isFreeSolo
          stateKey="skills"
          errorPath="skills"
          onValueChanged={onStateChanged}
          // initValues={operations}
          // initValuesTitle="value"
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          editValue={state.skills || []}
        />
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.JobPosition.key,
      }) && (
        <SharedAutocompleteControl
          placeholder="press-enter-to-add"
          title="job-position"
          // title="condition"
          isFreeSolo
          stateKey="job_position"
          errorPath="job_position"
          onValueChanged={onStateChanged}
          // initValues={operations}
          // initValuesTitle="value"
          type={DynamicFormTypesEnum.array.key}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          editValue={state.job_position || []}
        />
      )}
      {!hideSourceFilter && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.SourceType.key,
          }) && (
            <SharedAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="source-type"
              stateKey="source_type"
              placeholder="select-source-type"
              onValueChanged={(newValue) => {
                if (state.source) onStateChanged({ id: 'source', value: null });
                onStateChanged(newValue);
              }}
              initValues={profileSourcesTypes}
              editValue={(state.source_type && state.source_type.key) || undefined}
              parentTranslationPath={parentTranslationPath}
              errorPath="source_type"
            />
          )}
          {((state.source_type
            && state.source_type.key === ProfileSourcesTypesEnum.RecruiterUser.key)
            || (state.source_type
              && state.source_type.key
                === ProfileSourcesTypesEnum.RecruiterEmployee.key))
            && getIsQuickFilterVisibleField({
              key: PipelineQuickFilterTypesEnum.SourceUuid.key,
            }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              title={
                (state.source_type.key
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                  || ProfileSourcesTypesEnum.RecruiterUser.value
              }
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              placeholder={`select-${
                (state.source_type.key
                    === ProfileSourcesTypesEnum.RecruiterEmployee.key
                    && ProfileSourcesTypesEnum.RecruiterEmployee.value)
                  || ProfileSourcesTypesEnum.RecruiterUser.value
              }`}
              stateKey="source"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${
                  option.first_name
                    && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                    && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }` || 'N/A'
              }
              getDataAPI={GetAllSetupsUsers}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={(state.source && state.source.uuid) || undefined}
              extraProps={{
                committeeType:
                    (state.source_type.key
                      === ProfileSourcesTypesEnum.RecruiterEmployee.key
                      && 'all')
                    || undefined,
                ...(state.uuid
                    && state.source && {
                  with_than: [state.source.uuid],
                }),
              }}
            />
          )}
          {state.source_type
            && state.source_type.key === ProfileSourcesTypesEnum.Agency.key
            && getIsQuickFilterVisibleField({
              key: PipelineQuickFilterTypesEnum.SourceUuid.key,
            }) && (
            <SharedAPIAutocompleteControl
              title="agency"
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              isEntireObject
              placeholder="select-agency"
              stateKey="source"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              uniqueKey="user_uuid"
              editValue={(state.source && state.source.user_uuid) || undefined}
              extraProps={{
                job_uuid,
                type: ProfileSourcesTypesEnum.Agency.userType,
                ...(state.uuid
                    && state.source && {
                  with_than: [state.source.user_uuid],
                }),
              }}
            />
          )}
          {state.source_type
            && state.source_type.key === ProfileSourcesTypesEnum.University.key
            && getIsQuickFilterVisibleField({
              key: PipelineQuickFilterTypesEnum.SourceUuid.key,
            }) && (
            <SharedAPIAutocompleteControl
              title="university"
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              isEntireObject
              placeholder="select-university"
              stateKey="source"
              uniqueKey="user_uuid"
              onValueChanged={onStateChanged}
              getOptionLabel={(option) =>
                `${option.first_name || ''}${option.last_name || ''}` || 'N/A'
              }
              getDataAPI={GetAllSetupsProviders}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={(state.source && state.source.user_uuid) || undefined}
              extraProps={{
                job_uuid,
                type: ProfileSourcesTypesEnum.University.userType,
                ...(state.uuid
                    && state.source && {
                  with_than: [state.source.user_uuid],
                }),
              }}
            />
          )}
        </>
      )}
      {getIsQuickFilterVisibleField({
        key: PipelineQuickFilterTypesEnum.NationalID.key,
      }) && (
        <SharedInputControl
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="national-id"
          stateKey="national_id"
          searchKey="search"
          placeholder="national-id"
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          editValue={state.national_id || ''}
        />
      )}
      {!hideReferenceAndApplicant && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.CandidateName.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="candidate-name"
              stateKey="candidate_name"
              searchKey="search"
              placeholder="candidate-name"
              errorPath="candidate_name"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              editValue={state.candidate_name || ''}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.ReferenceNumber.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="candidate-reference-number"
              stateKey="reference_number"
              searchKey="search"
              placeholder="candidate-reference-number"
              errorPath="reference_number"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              editValue={state.reference_number || ''}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.ApplicantNumber.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="application-reference-number"
              stateKey="applicant_number"
              searchKey="search"
              placeholder="application-reference-number"
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              editValue={state.applicant_number || ''}
            />
          )}
        </>
      )}
      {showCandidateType
        && getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.CandidateType.key,
        }) && (
        <SharedAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="candidate-type"
          stateKey="candidate_type"
          placeholder="select-candidate-type"
          onValueChanged={onStateChanged}
          initValues={candidateTypes}
          editValue={
            (state.candidate_type && state.candidate_type.key) || undefined
          }
          parentTranslationPath={parentTranslationPath}
          errorPath="candidate_type"
        />
      )}
      {showAssessmentTestFilter
        && getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.AssessmentTestStatus.key,
        }) && (
        <SharedAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="assessment-test-status"
          stateKey="assessment_test_status"
          placeholder="select-assessment-test-status"
          onValueChanged={(newValue) => {
            if (state.source) onStateChanged({ id: 'source', value: null });
            onStateChanged(newValue);
          }}
          initValues={assessmentTestStatuses}
          editValue={
            (state.assessment_test_status && state.assessment_test_status.key)
              || undefined
          }
          parentTranslationPath={parentTranslationPath}
          errorPath="assessment_test_status"
        />
      )}
      {isShowVideoAssessmentFilter && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.VaAssessmentUuid.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="video-assessment"
              placeholder="select-video-assessment"
              stateKey="va_assessment_uuid"
              errorPath="va_assessment_uuid"
              onValueChanged={onStateChanged}
              idRef="va_assessment_uuid"
              getOptionLabel={(option) => option.title}
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetEvaRecVideoAssessment}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={state.va_assessment_uuid?.map((item) => item.uuid) || []}
              extraProps={{ job_uuid }}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.VaAssessmentStatus.key,
          }) && (
            <SharedAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="video-assessment-status"
              stateKey="va_assessment_status"
              placeholder="select-video-assessment-status"
              onValueChanged={onStateChanged}
              initValues={videoAssessmentStatuses}
              editValue={
                (state.va_assessment_status && state.va_assessment_status.key)
                || undefined
              }
              parentTranslationPath={parentTranslationPath}
              errorPath="va_assessment_status"
            />
          )}
        </>
      )}
      {isShowQuestionnaireFilter && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.QuestionnaireUuid.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="questionnaire"
              placeholder="select-questionnaire"
              stateKey="questionnaire_uuid"
              errorPath="questionnaire_uuid"
              onValueChanged={onStateChanged}
              idRef="questionnaire_uuid"
              getOptionLabel={(option) => option.title}
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetEvaRecPipelineQuestionnaires}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              editValue={
                state.questionnaire_uuid?.map(
                  (item) => item.job_questionnaire_uuid,
                ) || []
              }
              extraProps={{ job_uuid }}
              uniqueKey={'job_questionnaire_uuid'}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.QuestionnaireStatus.key,
          }) && (
            <SharedAutocompleteControl
              isEntireObject
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title="questionnaire-status"
              stateKey="questionnaire_status"
              placeholder="select-questionnaire-status"
              onValueChanged={onStateChanged}
              initValues={questionnaireStatuses}
              editValue={
                (state.questionnaire_status && state.questionnaire_status.key)
                || undefined
              }
              parentTranslationPath={parentTranslationPath}
              errorPath="questionnaire_status"
            />
          )}
        </>
      )}
      {isShowAssigneeFilter
        && getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.HasAssignee.key,
        }) && (
        <SharedAutocompleteControl
          isEntireObject
          isTwoThirdsWidth={isTwoThirdsWidth}
          isQuarterWidth={isQuarterWidth}
          isHalfWidth={isHalfWidth}
          title="has-assignee"
          stateKey="has_assignee"
          placeholder="select-assignment-status"
          onValueChanged={onStateChanged}
          initValues={candidateAssignmentStatusesEnum}
          editValue={(state.has_assignee && state.has_assignee.key) || undefined}
          parentTranslationPath={parentTranslationPath}
          errorPath="has_assignee"
        />
      )}
      {(callLocation === FilterDialogCallLocationsEnum.InitialApproval.key
        || isShowDynamicProperty)
        && candidateProperties.length > 0
        && !isLoading && (
        <div className="candidate-properties-wrapper">
          <ButtonBase
            className={`btns theme-transparent collapse-btn w-100 mx-0${
              (isOpenCandidatePropertiesCollapse && ' is-active') || ''
            }`}
            onClick={() => setIsOpenCandidatePropertiesCollapse((item) => !item)}
          >
            <span className="header-text px-2">
              {t(`${translationPath}dynamic-candidates-properties`)}
            </span>
            <span
              className={`px-2 fas fa-chevron-${
                (isOpenCandidatePropertiesCollapse && 'up') || 'down'
              }`}
            />
          </ButtonBase>
          <CollapseComponent
            isOpen={isOpenCandidatePropertiesCollapse}
            wrapperClasses="w-100"
            component={
              <div className="candidate-properties-content-wrapper">
                {candidateProperties?.length > 0
                    && candidateProperties.map(
                      (item, index) =>
                        (item.from_lookup && (
                          <SharedAPIAutocompleteControl
                            isEntireObject
                            editValue={getCandidatePropertyValue(item.uuid)}
                            title={
                              (item.name
                                && (item.name[i18next.language] || item.name.en))
                              || 'N/A'
                            }
                            placeholder={
                              (item.name
                                && (item.name[i18next.language] || item.name.en))
                              || 'N/A'
                            }
                            key={`candidatePropertiesKeys${index + 1}`}
                            stateKey="value"
                            parentIndex={index}
                            parentId="candidate_property"
                            // errorPath={`conditions[${index}].conditional_section_uuid`}
                            // isSubmitted={isSubmitted}
                            // errors={errors}
                            searchKey="query"
                            getDataAPI={DynamicService}
                            uniqueKey={item.config.api.primary_key}
                            getAPIProperties={getDynamicServicePropertiesHandler}
                            extraProps={{
                              path: item.config.api.end_point,
                              method: item.config.api.method,
                              params: {
                                with_than:
                                  (getCandidatePropertyValue(item.uuid)
                                    && ((item.lookup_type
                                      === LookupsTypesEnum.Multiple.key
                                      && getCandidatePropertyValue(item.uuid)) || [
                                      getCandidatePropertyValue(item.uuid),
                                    ]))
                                  || [],
                              },
                            }}
                            getOptionLabel={getDisplayedLabel}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            type={
                              (item.lookup_type === LookupsTypesEnum.Multiple.key
                                && DynamicFormTypesEnum.array.key)
                              || undefined
                            }
                            onValueChanged={({ value }) => {
                              const localCandidateProperties = [
                                ...state.candidate_property,
                              ];
                              const candidateIndex = getCandidatePropertyIndex(
                                item.uuid,
                                localCandidateProperties,
                              );
                              if (value) {
                                const toBeSavedValue
                                  = (item.lookup_type
                                    === LookupsTypesEnum.Multiple.key
                                    && value.map(
                                      (element) =>
                                        element[
                                          item.config.api.primary_key || 'uuid'
                                        ],
                                    ))
                                  || value[item.config.api.primary_key || 'uuid'];
                                const toBeSavedLookup = (item.lookup_type
                                  === LookupsTypesEnum.Multiple.key
                                  && value.map((element) => ({
                                    uuid: element[
                                      item.config.api.primary_key || 'uuid'
                                    ],
                                    title: getDisplayedLabel(element),
                                  }))) || [
                                  {
                                    uuid: value[
                                      item.config.api.primary_key || 'uuid'
                                    ], // option uuid not candidate property uuid
                                    title: getDisplayedLabel(value),
                                  },
                                ];
                                if (candidateIndex !== -1) {
                                  localCandidateProperties[candidateIndex].value
                                    = toBeSavedValue;
                                  localCandidateProperties[candidateIndex].lookup
                                    = toBeSavedLookup;
                                } else
                                  localCandidateProperties.push({
                                    uuid: item.uuid,
                                    value: toBeSavedValue,
                                    lookup: toBeSavedLookup,
                                  });
                              } else if (candidateIndex !== -1)
                                localCandidateProperties.splice(candidateIndex, 1);

                              onStateChanged({
                                id: 'candidate_property',
                                value: localCandidateProperties,
                              });
                            }}
                            isTwoThirdsWidth={isTwoThirdsWidth}
                            isQuarterWidth={isQuarterWidth}
                            isHalfWidth={isHalfWidth}
                          />
                        )) || (
                          <SharedAutocompleteControl
                            isTwoThirdsWidth={isTwoThirdsWidth}
                            isQuarterWidth={isQuarterWidth}
                            isHalfWidth={isHalfWidth}
                            title={
                              (item.name
                                && (item.name[i18next.language] || item.name.en))
                              || 'N/A'
                            }
                            placeholder={
                              (item.name
                                && (item.name[i18next.language] || item.name.en))
                              || 'N/A'
                            }
                            key={`candidatePropertiesKeys${index + 1}`}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                            parentId="candidate_property"
                            parentIndex={index}
                            stateKey="value"
                            isFreeSolo
                            type={DynamicFormTypesEnum.array.key}
                            editValue={getCandidatePropertyValue(item.uuid) || []}
                            onValueChanged={({ value }) => {
                              const localCandidateProperties = [
                                ...state.candidate_property,
                              ];
                              const candidateIndex = getCandidatePropertyIndex(
                                item.uuid,
                                localCandidateProperties,
                              );
                              if (value)
                                if (candidateIndex !== -1)
                                  localCandidateProperties[candidateIndex].value
                                    = value;
                                else
                                  localCandidateProperties.push({
                                    uuid: item.uuid,
                                    value: value,
                                  });
                              else if (candidateIndex !== -1)
                                localCandidateProperties.splice(candidateIndex, 1);

                              onStateChanged({
                                id: 'candidate_property',
                                value: localCandidateProperties,
                              });
                            }}
                          />
                        ),
                    )}
              </div>
            }
          />
        </div>
      )}
      {isShowAge && (
        <>

          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.FromAge.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type={'number'}
              labelValue={(!quickFilters && 'age') || undefined}
              title={(!quickFilters && 'from-age')}
              stateKey="age_lte"
              errorPath="age_lte"
              editValue={state?.age_lte}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.ToAge.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type={'number'}
              labelValue={(!quickFilters && ' ') || undefined}
              title={(!quickFilters && 'to-age') }
              stateKey="age_gte"
              errorPath="age_gte"
              editValue={state?.age_gte}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}


        </>
      )}

      {isShowHeightAndWeight && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.FromHeight.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type={'number'}
              labelValue={(!quickFilters && 'height') || undefined}
              title={(!quickFilters && 'from-height') || 'from-height-cm'}
              stateKey="from_height"
              errorPath="from_height"
              editValue={state?.from_height}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
              max={(state?.to_height && state?.to_height) || null}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.ToHeight.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type={'number'}
              labelValue={(!quickFilters && ' ') || undefined}
              title={(!quickFilters && 'to-height') || 'to-height-cm'}
              stateKey="to_height"
              errorPath="to_height"
              editValue={state?.to_height}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.FromWeight.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type={'number'}
              labelValue={(!quickFilters && 'weight') || undefined}
              title={(!quickFilters && 'from-weight') || 'from-weight-kg'}
              stateKey="from_weight"
              errorPath="from_weight"
              editValue={state?.from_weight}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
              max={(state?.to_weight && state?.to_weight) || null}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.ToWeight.key,
          }) && (
            <SharedInputControl
              isTwoThirdsWidth={isTwoThirdsWidth}
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              type="number"
              labelValue={(!quickFilters && ' ') || undefined}
              title={(!quickFilters && 'to-weight') || 'to-weight-kg'}
              stateKey="to_weight"
              errorPath="to_weight"
              editValue={state?.to_weight}
              pattern={numbersExpression}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              wrapperClasses="px-2"
            />
          )}
        </>
      )}
      {!hideAssigneeFilters && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.AssignedUserUuid.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title={t(`${CustomCandidatesFilterTagsEnum.user.label}`)}
              placeholder={t(`select-${CustomCandidatesFilterTagsEnum.user.label}`)}
              stateKey="assigned_user_uuid"
              errorPath="assigned_user_uuid"
              // errorPath={`custom_tags[3].value`}
              // parentIndex={3}
              // parentId="custom_tags"
              onValueChanged={(e) => {
                onStateChanged(e);
                // if (e.value?.length) {
                //   onStateChanged(e);
                //   onStateChanged({
                //     parentId: 'custom_tags',
                //     parentIndex: 3,
                //     id: 'key',
                //     value: CustomCandidatesFilterTagsEnum.user.key,
                //   });
                // } else {
                //   const customTagsClone = [...state.custom_tags];
                //   customTagsClone[3] = [];
                //   onStateChanged({ value: customTagsClone, id: 'custom_tags' })
                // }
              }}
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={CustomCandidatesFilterTagsEnum.user.getApiFunction}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              controlWrapperClasses="mb-3"
              editValue={state.assigned_user_uuid?.map((it) => it.uuid) || []}
              // editValue={state?.custom_tags?.[3]?.value?.map(item=> item.uuid) || []}
              extraProps={{
                with_than:
                  (state.assigned_user_uuid?.length
                    && state.assigned_user_uuid?.map((it) => it.uuid))
                  || null,
                // (state?.custom_tags?.[3]?.value && state?.custom_tags?.[3]?.value?.map(item=>item?.uuid)) || null,
              }}
              getOptionLabel={(option) =>
                `${
                  option.first_name
                  && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                  && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }`
              }
              translationPath={translationPath}
              // isDisabled={Boolean(state.assigned_user_uuid?.length)}
            />
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.AssignedEmployeeUuid.key,
          }) && (
            <SharedAPIAutocompleteControl
              isEntireObject
              isQuarterWidth={isQuarterWidth}
              isHalfWidth={isHalfWidth}
              title={t(`${CustomCandidatesFilterTagsEnum.employee.label}`)}
              placeholder={t(
                `select-${CustomCandidatesFilterTagsEnum.employee.label}`,
              )}
              stateKey="assigned_employee_uuid"
              errorPath="assigned_employee_uuid"
              // stateKey='value'
              // errorPath={`custom_tags[3].value`}
              // parentIndex={4}
              // parentId="custom_tags"
              onValueChanged={(e) => {
                onStateChanged(e);
                // if (e.value?.length) {
                //   onStateChanged(e);
                //   onStateChanged({
                //     parentId: 'custom_tags',
                //     parentIndex: 4,
                //     id: 'key',
                //     value: CustomCandidatesFilterTagsEnum.employee.key,
                //   });
                // } else {
                //   const customTagsClone = [...state.custom_tags];
                //   customTagsClone[4] = [];
                //   onStateChanged({ value: customTagsClone, id: 'custom_tags' })
                // }
              }}
              type={DynamicFormTypesEnum.array.key}
              getDataAPI={GetAllSetupsEmployees}
              parentTranslationPath={parentTranslationPath}
              searchKey="search"
              uniqueKey="user_uuid"
              editValue={
                state.assigned_employee_uuid?.map((it) => it.user_uuid) || []
              }
              extraProps={{
                all_employee: 1,
                with_than:
                  (state.assigned_employee_uuid?.length
                    && state.assigned_employee_uuid?.map((it) => it.user_uuid))
                  || null,
              }}
              getOptionLabel={(option) =>
                `${
                  option.first_name
                  && (option.first_name[i18next.language] || option.first_name.en)
                }${
                  option.last_name
                  && ` ${option.last_name[i18next.language] || option.last_name.en}`
                }`
              }
              translationPath={translationPath}
              // isDisabled={Boolean(state.assigned_user_uuid?.length)}
            />
          )}
        </>
      )}
      {isWithSliders
        && getIsQuickFilterVisibleField({
          key: PipelineQuickFilterTypesEnum.Score.key,
        }) && (
        <div className="d-flex flex-wrap" style={{ flexDirection: 'row' }}>
          <div className="w-50 w-t-100 px-3 mb-3">
            <div className="text-gray text-right d-flex flex-grow-1 h7 font-14">
              {t(`${translationPath}min-score`)}
            </div>
            <SliderComponent
              max={100}
              step={10}
              value={state.score || 0}
              valueLabelDisplay="auto"
              onChange={(e, newValue) => {
                onStateChanged({ id: 'score', value: newValue });
              }}
              marks={Array.from(Array(10)).map((item, idx) => ({
                label: (idx + 1) * 10,
                value: (idx + 1) * 10,
              }))}
            />
          </div>
          <div className="w-50 w-t-100 px-3 mb-3">
            <div className="text-gray text-right d-flex flex-grow-1 h7 font-14">
              {t(`${translationPath}min-years-of-experience`)}
            </div>
            <SliderComponent
              max={10}
              step={1}
              valueLabelDisplay="auto"
              value={state.years_of_experience || 0}
              onChange={(e, newValue) => {
                onStateChanged({ id: 'years_of_experience', value: newValue });
              }}
              marks={Array.from({ length: 11 }, (element, subIndex) => ({
                label: subIndex,
                value: subIndex,
              }))}
            />
          </div>
        </div>
      )}

      {callLocation === FilterDialogCallLocationsEnum.SearchDB.key && (
        <>
          {!quickFilters && <div className="separator-h mt-3 mb-4 px-2" />}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.CandidateRegistered.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="CandidateRegistered"
                onSelectedCheckboxChanged={(e, value) => {
                  onStateChanged({
                    id: 'candidate_registered',
                    value,
                  });
                  onStateChanged({
                    id: 'candidate_applied',
                    value: false,
                  });
                }}
                label={t(`${translationPath}candidate-registered`)}
                singleChecked={state?.candidate_registered || false}
              />
            </div>
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.CandidateApplied.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="CandidateApplied"
                onSelectedCheckboxChanged={(e, value) => {
                  onStateChanged({
                    id: 'candidate_applied',
                    value,
                  });
                  onStateChanged({
                    id: 'candidate_registered',
                    value: false,
                  });
                }}
                label={t(`${translationPath}candidate-applied`)}
                singleChecked={state?.candidate_applied || false}
              />
            </div>
          )}
          {(state?.candidate_registered || state?.candidate_applied)
            && (getIsQuickFilterVisibleField({
              key: PipelineQuickFilterTypesEnum.DateFilterType.key,
            })
              || getIsQuickFilterVisibleField({
                key: PipelineQuickFilterTypesEnum.FromDate.key,
              })
              || getIsQuickFilterVisibleField({
                key: PipelineQuickFilterTypesEnum.ToDate.key,
              })) && (
            <div className="d-flex-v-center flex-wrap mb-2">
              <span className="text-gray px-2">
                {t(`${translationPath}date-filter`)}
              </span>
              <ToggleButtonGroup
                exclusive
                value={state?.date_filter_type}
                onChange={(e, value) => {
                  onStateChanged({
                    id: 'date_filter_type',
                    value,
                  });
                }}
                aria-label="filters-date-range"
                size="small"
              >
                {filterToggleButtons.map((item, idx) => (
                  <ToggleButton
                    key={`filter-toggle-button-${item.key}-${idx}`}
                    value={item.value}
                    aria-label={item.value}
                    onClick={() => {
                      if (item.value === 'custom') setShowCustomDateDialog(true);
                      else {
                        const localState = {
                          ...state,
                          from_date: item.filterValue?.from_date,
                          to_date: item.filterValue?.to_date,
                          date_filter_type: item.value,
                        };
                        onStateChanged({
                          id: 'edit',
                          value: localState,
                        });
                      }
                    }}
                  >
                    <span className="px-2">{t(item.value)}</span>
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
              <CustomDateFilterDialog
                isOpen={showCustomDateDialog}
                setIsOpen={setShowCustomDateDialog}
                parentTranslationPath={'Analytics'}
                setFilters={(value) => {
                  const localState = {
                    ...state,
                    ...value,
                  };
                  onStateChanged({
                    id: 'edit',
                    value: localState,
                  });
                }}
                isReturnValue={true}
                isLoading={isLoading}
                setSelectedDateRange={(value) => {
                  onStateChanged({
                    id: 'date_filter_type',
                    value,
                  });
                }}
                filters={{
                  from_date: state.from_date,
                  to_date: state.to_date,
                  date_filter_type: state.date_filter_type,
                }}
              />
              {/*<div className="w-50 px-2 mt-1">*/}
              {/*  <DatePickerComponent*/}
              {/*  isTwoThirdsWidth={isTwoThirdsWidth}*/}
              {/*  isQuarterWidth={isQuarterWidth}*/}
              {/*    // isHalfWidth=isHalfWidth*/}
              {/*    datePickerWrapperClasses='px-0 mt-2 mb-0'*/}
              {/*    idRef="fromDateRef"*/}
              {/*    maxDate={*/}
              {/*      (state.to_date && new Date(state.to_date)) || moment().toDate()*/}
              {/*    }*/}
              {/*    inputPlaceholder="YYYY-MM-DD"*/}
              {/*    value={state.from_date || ''}*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    label="from-date"*/}
              {/*    onChange={(date) => {*/}
              {/*      if (date?.value !== 'Invalid date')*/}
              {/*        onStateChanged({ id: 'from_date', value: date.value });*/}
              {/*      else onStateChanged({ id: 'from_date', value: null });*/}
              {/*    }}*/}
              {/*    helperText={t('this-field-is-required')}*/}
              {/*    error={!state.from_date}*/}
              {/*    // isSubmitted={isSubmitted}*/}
              {/*  />*/}
              {/*</div>*/}
              {/*<div className="w-50 px-2 mt-1">*/}
              {/*  <DatePickerComponent*/}
              {/*  isTwoThirdsWidth={isTwoThirdsWidth}*/}
              {/*  isQuarterWidth={isQuarterWidth}*/}
              {/*    // isHalfWidth=isHalfWidth*/}
              {/*    datePickerWrapperClasses='px-0 mt-2 mb-0'*/}
              {/*    idRef="toDateRef"*/}
              {/*    maxDate={moment().toDate()}*/}
              {/*    minDate={state.from_date && new Date(state.from_date)}*/}
              {/*    inputPlaceholder="YYYY-MM-DD"*/}
              {/*    value={state.to_date || ''}*/}
              {/*    parentTranslationPath={parentTranslationPath}*/}
              {/*    label="to-date"*/}
              {/*    onChange={(date) => {*/}
              {/*      if (date?.value !== 'Invalid date')*/}
              {/*        onStateChanged({ id: 'to_date', value: date.value });*/}
              {/*      else onStateChanged({ id: 'to_date', value: null });*/}
              {/*    }}*/}
              {/*    helperText={t('this-field-is-required')}*/}
              {/*    error={!state.to_date}*/}
              {/*    // isSubmitted={isSubmitted}*/}
              {/*  />*/}
              {/*</div>*/}
            </div>
          )}
          {!quickFilters && <div className="separator-h mt-3 mb-4 px-2" />}
        </>
      )}
      {isWithCheckboxes && (
        <>
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.RightToWork.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="RightToWorkRef"
                onSelectedCheckboxChanged={(e, value) =>
                  onStateChanged({
                    id: 'right_to_work',
                    parentId: 'checkboxFilters',
                    value,
                  })
                }
                label={t(`${translationPath}right-to-work`)}
                singleChecked={state?.checkboxFilters?.right_to_work || false}
              />
            </div>
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.WillingToTravel.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="WillingToTravelRef"
                onSelectedCheckboxChanged={(e, value) =>
                  onStateChanged({
                    id: 'willing_to_travel',
                    parentId: 'checkboxFilters',
                    value,
                  })
                }
                label={t(`${translationPath}willing-to-travel`)}
                singleChecked={state?.checkboxFilters?.willing_to_travel || false}
              />
            </div>
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.WillingToRelocate.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="WillingToRelocateRef"
                onSelectedCheckboxChanged={(e, value) =>
                  onStateChanged({
                    id: 'willing_to_relocate',
                    parentId: 'checkboxFilters',
                    value,
                  })
                }
                label={t(`${translationPath}willing-to-relocate`)}
                singleChecked={state?.checkboxFilters?.willing_to_relocate || false}
              />
            </div>
          )}
          {getIsQuickFilterVisibleField({
            key: PipelineQuickFilterTypesEnum.OwnsACar.key,
          }) && (
            <div
              className={`${
                (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
              } mb-1 px-2`}
            >
              <CheckboxesComponent
                idRef="OwnsCarRef"
                onSelectedCheckboxChanged={(e, value) =>
                  onStateChanged({
                    id: 'owns_a_car',
                    parentId: 'checkboxFilters',
                    value,
                  })
                }
                label={t(`${translationPath}owns-a-car`)}
                singleChecked={state?.checkboxFilters?.owns_a_car || false}
              />
            </div>
          )}
          {!hideIncomplete && (
            <>
              {getIsQuickFilterVisibleField({
                key: PipelineQuickFilterTypesEnum.IsCompletedProfile.key,
              }) && (
                <div
                  className={`${
                    (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
                  } mb-1 px-2`}
                >
                  <CheckboxesComponent
                    idRef="CompletedProfilesRef"
                    onSelectedCheckboxChanged={(e, value) =>
                      onStateChanged({
                        id: 'is_completed_profile',
                        parentId: 'checkboxFilters',
                        value,
                      })
                    }
                    label={t(`${translationPath}is-completed-profile`)}
                    singleChecked={
                      state?.checkboxFilters?.is_completed_profile || false
                    }
                  />
                </div>
              )}
              {getIsQuickFilterVisibleField({
                key: PipelineQuickFilterTypesEnum.UncompletedProfile.key,
              }) && (
                <div
                  className={`${
                    (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
                  } mb-1 px-2`}
                >
                  <CheckboxesComponent
                    idRef="CompletedProfilesRef"
                    onSelectedCheckboxChanged={(e, value) =>
                      onStateChanged({
                        id: 'un_completed_profile',
                        parentId: 'checkboxFilters',
                        value,
                      })
                    }
                    label={t(`${translationPath}un-completed-profile`)}
                    singleChecked={
                      state?.checkboxFilters?.un_completed_profile || false
                    }
                  />
                </div>
              )}
              {getIsQuickFilterVisibleField({
                key: PipelineQuickFilterTypesEnum.UncompletedProfile.key,
              }) && (
                <div
                  className={`${
                    (quickFilters && 'is-quarter-width') || 'w-50 w-t-100'
                  } mb-1 px-2`}
                >
                  <CheckboxesComponent
                    idRef="CompletedProfilesRef"
                    onSelectedCheckboxChanged={(e, value) =>
                      onStateChanged({
                        id: 'un_completed_profile',
                        parentId: 'checkboxFilters',
                        value,
                      })
                    }
                    label={t(`${translationPath}un-completed-profile`)}
                    singleChecked={
                      state?.checkboxFilters?.un_completed_profile || false
                    }
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
      {showRmsFilters && (
        <div>
          <ButtonBase
            className="btns theme-transparent mx-3 mb-2"
            onClick={() => {
              const localVals = [...(state.rms_filters || [])];
              localVals.push({
                key: '',
                value: '',
              });
              onStateChanged({ id: 'rms_filters', value: localVals });
            }}
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t('add-filter')}</span>
          </ButtonBase>
          {state?.rms_filters?.map((item, idx, items) => (
            <div key={`rmsFiltersKey${idx}`} className="my-2 d-flex">
              <SharedAPIAutocompleteControl
                isTwoThirdsWidth={isTwoThirdsWidth}
                isQuarterWidth={isQuarterWidth}
                isHalfWidth={isHalfWidth}
                title="filter-key"
                placeholder="select-filter-key"
                stateKey="key"
                parentIndex={idx}
                parentId="rms_filters"
                onValueChanged={onStateChanged}
                getOptionLabel={(option) => option?.title}
                getDataAPI={GetAllRmsFiltersDropdown}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                controlWrapperClasses="mb-0"
                extraProps={{
                  slug: 'rms',
                }}
                editValue={item.key || ''}
                uniqueKey="slug"
              />
              <SharedInputControl
                isTwoThirdsWidth={isTwoThirdsWidth}
                isQuarterWidth={isQuarterWidth}
                isHalfWidth={isHalfWidth}
                title="filter-value"
                stateKey="value"
                parentId="rms_filters"
                parentIndex={idx}
                searchKey="search"
                placeholder="filter-value"
                onValueChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                editValue={item.value || ''}
              />
              <ButtonBase
                className="btns-icon theme-transparent mx-3"
                onClick={onTagDeleteHandler(idx, items, 'rms_filters')}
              >
                <span className="fas fa-times" />
              </ButtonBase>
            </div>
          ))}
        </div>
      )}
      {!quickFilters && (
        <div className="mt-5 d-flex justify-content-center">
          <ButtonBase
            className="btns theme-solid mx-3 mb-2"
            style={{ width: 220 }}
            onClick={() => {
              applyFilters(true);
            }}
          >
            {t(`${translationPath}apply-filters`)}
          </ButtonBase>
        </div>
      )}
    </div>
  );
};

FilterContentSection.propTypes = {
  callLocation: PropTypes.oneOf(
    Object.values(FilterDialogCallLocationsEnum).map((item) => item.key),
  ).isRequired,
  quickFilters: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      status: PropTypes.bool,
    }),
  ),
  isWithSliders: PropTypes.bool,
  onClose: PropTypes.func,
  onApply: PropTypes.func,
  isWithCheckboxes: PropTypes.bool,
  filterEditValue: PropTypes.shape({}),
  filterEditValueTags: PropTypes.instanceOf(Array),
  hideIncomplete: PropTypes.bool,
  // showTags: PropTypes.bool,
  job_uuid: PropTypes.string,
  hideIncludeExclude: PropTypes.bool,
  showAssessmentTestFilter: PropTypes.bool,
  hideSourceFilter: PropTypes.bool,
  hideReferenceAndApplicant: PropTypes.bool,
  hideAssigneeFilters: PropTypes.bool,
  showRmsFilters: PropTypes.bool,
  showCandidateType: PropTypes.bool,
  isShowHeightAndWeight: PropTypes.bool,
  isShowVideoAssessmentFilter: PropTypes.bool,
  isShowQuestionnaireFilter: PropTypes.bool,
  isShowDynamicProperty: PropTypes.bool,
  isShowAssigneeFilter: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  isShowAge:PropTypes.bool
};
FilterContentSection.displayName = 'FilterContentSection';
export default memo(FilterContentSection);
