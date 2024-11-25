import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import './CardFilterBy.Style.scss';
import {
  GetAllChannelsTaxonomyBusinessModel,
  GetAllChannelsTaxonomyCategories,
  GetAllChannelsTaxonomyCurrency,
  GetAllChannelsTaxonomyIndustry,
  GetAllChannelsTaxonomyJobs,
  GetAllChannelsTaxonomyLocations,
} from '../../../../../services';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import { useTranslation } from 'react-i18next';

export const CardFilterBy = ({
  // isDisabled,
  onFilterByChanged,
  parentTranslationPath,
  translationPath,
  filterBy,
  wrapperClasses,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  // Memoized Yes No Options
  const yesNoOptions = useMemo(
    () => [
      { key: true, value: t(`${translationPath}yes`) },
      { key: false, value: t(`${translationPath}no`) },
    ],
    [t, translationPath],
  );
  return (
    <div className={`card-filter-by-wrapper ${wrapperClasses || ''}`}>
      <div className="card-filter-by-body">
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0 mt-1"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title="industries"
          placeholder="select-industry"
          stateKey="industry_id"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.industry_id}
          uniqueKey="id"
          titleKey="name"
          // dataKey={"results"}
          getDataAPI={GetAllChannelsTaxonomyIndustry}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          // searchKey="search"
        />
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title={'job-category'}
          placeholder="select-job-category"
          stateKey="category"
          onValueChanged={(newValue) => {
            onFilterByChanged({
              id: 'category',
              value: { parent: newValue.value, sub_category_id: '' },
            });
          }}
          isEntireObject
          editValue={filterBy.category?.parent?.id}
          uniqueKey="id"
          titleKey="name"
          // dataKey={"results"}
          getDataAPI={GetAllChannelsTaxonomyCategories}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          // searchKey="search"
        />
        <SharedInputControl
          editValue={filterBy.duration_from}
          onValueChanged={onFilterByChanged}
          stateKey="duration_from"
          idRef="title"
          title="duration-from"
          placeholder={'duration-from'}
          min={0}
          isFullWidth
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          wrapperClasses="px-0 mb-2"
          type={'number'}
        />
        <SharedInputControl
          editValue={filterBy.duration_to}
          onValueChanged={onFilterByChanged}
          stateKey="duration_to"
          idRef="title"
          title="duration-to"
          placeholder={'duration-to'}
          min={0}
          isFullWidth
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          wrapperClasses="px-0 mb-2"
          type={'number'}
        />
        <SharedAutocompleteControl
          isFullWidth
          stateKey="mc_enabled"
          title="mc-enabled"
          sharedClassesWrapper={'mb-2'}
          placeholder="mc-enabled"
          onValueChanged={onFilterByChanged}
          initValues={yesNoOptions}
          initValuesTitle={'value'}
          initValueskey={'key'}
          editValue={filterBy.mc_enabled}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedAutocompleteControl
          isFullWidth
          stateKey="recommended"
          title="recommended"
          sharedClassesWrapper={'mb-2'}
          placeholder="recommended"
          onValueChanged={onFilterByChanged}
          initValues={yesNoOptions}
          initValuesTitle={'value'}
          initValueskey={'key'}
          editValue={filterBy.recommended}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <SharedAutocompleteControl
          isFullWidth
          stateKey="exclude_recommended"
          title="exclude-recommended"
          sharedClassesWrapper={'mb-2'}
          placeholder="exclude-recommended"
          onValueChanged={onFilterByChanged}
          initValues={yesNoOptions}
          initValuesTitle={'value'}
          initValueskey={'key'}
          editValue={filterBy.exclude_recommended}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        {/*{filterBy.category?.parent?.children?.length > 0 && (*/}
        {/*  <SharedAutocompleteControl*/}
        {/*    wrapperClasses="mx-0 mb-1"*/}
        {/*    sharedClassesWrapper={'mb-3'}*/}
        {/*    isFullWidth*/}
        {/*    title={'sub-category'}*/}
        {/*    placeholder="select-sub-category"*/}
        {/*    stateKey="sub_category_id"*/}
        {/*    initValues={filterBy.category.parent.children}*/}
        {/*    onValueChanged={(newValue) => {*/}
        {/*      onFilterByChanged({*/}
        {/*        id: 'category',*/}
        {/*        value: {*/}
        {/*          parent: filterBy.category.parent,*/}
        {/*          sub_category_id: newValue.value,*/}
        {/*        },*/}
        {/*      });*/}
        {/*    }}*/}
        {/*    editValue={filterBy.category?.sub_category_id}*/}
        {/*    initValuesKey="id"*/}
        {/*    initValuesTitle="name"*/}
        {/*    getDataAPI={GetAllChannelsTaxonomyCategories}*/}
        {/*    parentTranslationPath={parentTranslationPath}*/}
        {/*    translationPath={translationPath}*/}
        {/*  />*/}
        {/*)}*/}
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title={'job-title'}
          placeholder="select-job-title"
          stateKey="job_title_id"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.job_title_id}
          uniqueKey="id"
          titleKey="name"
          getDataAPI={GetAllChannelsTaxonomyJobs}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="title"
          isIgnoreResetTextSearch
          initialTextSearchValue={'a'}
        />
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title="business-model"
          placeholder="select-business-model"
          stateKey="business_model"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.business_model}
          uniqueKey="id"
          titleKey="name"
          getDataAPI={GetAllChannelsTaxonomyBusinessModel}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="title"
          isIgnoreResetTextSearch
          // initialTextSearchValue={'a'}
        />
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title="currency"
          placeholder="select-currency"
          stateKey="currency"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.currency}
          uniqueKey="id"
          titleKey="name"
          getDataAPI={GetAllChannelsTaxonomyCurrency}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="title"
          isIgnoreResetTextSearch
          // initialTextSearchValue={'a'}
        />
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title={'exact-location'}
          placeholder="select-location"
          stateKey="exact_location_id"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.exact_location_id}
          uniqueKey="id"
          titleKey="name"
          getDataAPI={GetAllChannelsTaxonomyLocations}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="title"
          isIgnoreResetTextSearch
          initialTextSearchValue={'a'}
        />
        <SharedAPIAutocompleteControl
          wrapperClasses="mx-0"
          controlWrapperClasses={'mb-2'}
          isFullWidth
          title={'include-location'}
          placeholder="select-location"
          stateKey="include_location_id"
          onValueChanged={onFilterByChanged}
          editValue={filterBy.include_location_id}
          uniqueKey="id"
          titleKey="name"
          getDataAPI={GetAllChannelsTaxonomyLocations}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          searchKey="title"
          isIgnoreResetTextSearch
          initialTextSearchValue={'a'}
        />
        {/*<RegionsAutocompleteControl*/}
        {/*  idRef="RegionsControlRef"*/}
        {/*  stateKey="country_uuid"*/}
        {/*  isDisabled={isDisabled}*/}
        {/*  onSelectedValueChanged={onFilterByChanged}*/}
        {/*  parentTranslationPath={parentTranslationPath}*/}
        {/*  translationPath={translationPath}*/}
        {/*/>*/}
        {/*<ChannelTypesAutocompleteControl*/}
        {/*  idRef="ChannelTypesControlRef"*/}
        {/*  stateKey="channel_type"*/}
        {/*  isDisabled={isDisabled}*/}
        {/*  onSelectedValueChanged={onFilterByChanged}*/}
        {/*  parentTranslationPath={parentTranslationPath}*/}
        {/*  translationPath={translationPath}*/}
        {/*/>*/}
        {/*<JobCategoryAutocompleteControl*/}
        {/*  idRef="JobCategoryControlRef"*/}
        {/*  stateKey="job_category_uuid"*/}
        {/*  isDisabled={isDisabled}*/}
        {/*  onSelectedValueChanged={onFilterByChanged}*/}
        {/*  parentTranslationPath={parentTranslationPath}*/}
        {/*  translationPath={translationPath}*/}
        {/*/>*/}
        {/*<IndustriesAutocompleteControl*/}
        {/*  idRef="IndustriesControlRef"*/}
        {/*  stateKey="industry_uuid"*/}
        {/*  isDisabled={isDisabled}*/}
        {/*  onSelectedValueChanged={onFilterByChanged}*/}
        {/*  parentTranslationPath={parentTranslationPath}*/}
        {/*  translationPath={translationPath}*/}
        {/*/>*/}
        {/* <FilterInputControl */}
        {/*  idRef="JobTitleControlRef" */}
        {/*  stateKey="job_title" */}
        {/*  title="position-title" */}
        {/*  placeholder="position-title" */}
        {/*  isDisabled={isDisabled} */}
        {/*  onValueChanged={onFilterByChanged} */}
        {/*  parentTranslationPath={parentTranslationPath} */}
        {/*  translationPath={translationPath} */}
        {/* /> */}
      </div>
    </div>
  );
};

CardFilterBy.propTypes = {
  onFilterByChanged: PropTypes.func.isRequired,
  isDisabled: PropTypes.bool,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  wrapperClasses: PropTypes.string,
  filterBy: PropTypes.object,
};

CardFilterBy.defaultProps = {
  translationPath: 'CardFilterBy.',
  isDisabled: false,
};
