import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import ButtonBase from '@mui/material/ButtonBase';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../setups/shared';
import {
  GetAllBlockNumber,
  GetAllFeaturesList,
  GetAllJobsByBranch,
  GetAllSetupsBranches,
  GetAllSetupsCategories,
  GetAllSetupsTeams,
  GetAllUsersPython,
  GetJobById,
} from '../../../services';
import moment from 'moment';
import { CustomDateFilterDialog } from '../Dialogs/CustomDateFilter.Dialog';
import { showError } from '../../../helpers';
import i18next from 'i18next';
import { DynamicFormTypesEnum } from '../../../enums';

export const DashboardFilter = ({
  parentTranslationPath,
  setFilters,
  filters,
  is_static,
  isDisabled,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [selectedDateRange, setSelectedDateRange] = useState('default');
  const [showCustomDateDialog, setShowCustomDateDialog] = useState(false);
  const [currentWidth, setCurrentWidth] = useState(992);
  const [pipelinesList, setPipelinesList] = useState([]);
  const [featuresList, setFeaturesList] = useState([]);

  const GetJobByIdHandler = useCallback(async () => {
    const response = await GetJobById({
      job_uuid: filters.job_uuid,
      company_uuid: filters.company_uuid,
    });
    if (response && response.status === 200)
      setPipelinesList(response.data.results.job.pipelines);
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setPipelinesList([]);
    }
  }, [filters, t]);

  const GetFeaturesListHandler = useCallback(async () => {
    const response = await GetAllFeaturesList({
      is_static,
    });
    if (response && response.status === 200) {
      setFeaturesList(response.data.results);
      const firstEnabledOption = response.data.results?.find(
        (it) => !it.is_disabled,
      );
      if (firstEnabledOption)
        setFilters((items) => ({
          ...items,
          category: firstEnabledOption.slug,
          pipeline_uuid: null,
          job_uuid: null,
          full_category: firstEnabledOption,
        }));
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setFeaturesList([]);
    }
  }, [is_static, setFilters, t]);

  useEffect(() => {
    if ((!is_static || filters.category === 'pipeline') && filters.job_uuid)
      void GetJobByIdHandler();
  }, [is_static, filters, GetJobByIdHandler]);

  useEffect(() => {
    if (typeof window !== 'undefined') setCurrentWidth(window.innerWidth);
  }, []);

  useEffect(() => {
    if (is_static) GetFeaturesListHandler();
  }, [GetFeaturesListHandler, is_static]);
  return (
    <div
      style={{
        border: '1px solid rgba(36, 37, 51, 0.06)',
        borderRadius: 8,
      }}
    >
      <div className="dashboard-filter d-flex-v-center flex-wrap p-3 mx-2">
        <div className="dashboard-filter-toggle-group-wrapper">
          <ToggleButtonGroup
            exclusive
            value={selectedDateRange}
            onChange={(e, value) => {
              setSelectedDateRange(value);
            }}
            aria-label="filters-date-range"
            size="small"
            disabled={isDisabled}
            orientation={currentWidth >= 992 ? 'horizontal' : 'vertical'}
          >
            {[
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
              {
                key: 8,
                value: 'custom',
                filterValue: null, // TODO: Diana : Add dialog later for custom date range filter
              },
            ].map((item, idx) => (
              <ToggleButton
                key={`filter-toggle-button-${item.key}-${idx}`}
                value={item.value}
                aria-label={item.value}
                onClick={() => {
                  if (item.value === 'custom') setShowCustomDateDialog(true);
                  else
                    setFilters((items) => ({
                      ...items,
                      from_date: item.filterValue?.from_date,
                      to_date: item.filterValue?.to_date,
                      date_filter_type: item.value,
                    }));
                }}
              >
                <span className="px-2">{t(item.value)}</span>
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </div>
        {is_static && (
          <SharedAutocompleteControl
            isEntireObject
            disableClearable
            title={`${t('feature')}: ${t('all')}`}
            searchKey="search"
            placeholder="select-category"
            stateKey="feature"
            editValue={filters.category || ''}
            errorPath="feature"
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                category: newValue.value.slug,
                pipeline_uuid: null,
                job_uuid: null,
                full_category: newValue.value,
                user_uuid:
                  ((newValue?.value?.filters || []).includes('user_uuid')
                    && items?.user_uuid)
                  || null,
                team_uuid:
                  ((newValue?.value?.filters || []).includes('team_uuid')
                    && items?.team_uuid)
                  || null,
              }))
            }
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              option.title[i18next.language] || option.title.en
            }
            uniqueKey="slug"
            controlWrapperClasses="mx-2 px-0 my-0"
            disabledOptions={(option) => option.is_disabled}
            isDisabled={isDisabled}
            initValues={featuresList || []}
            initValuesKey="slug"
            initValuesTitle="title"
          />
        )}
        {filters.full_category?.filters?.includes('block_uuid') && (
          <SharedAPIAutocompleteControl
            title="block-number"
            searchKey="search"
            stateKey="uuid"
            placeholder="select-block-number"
            idRef="searchBlockNumberAutocompleteRef"
            controlWrapperClasses="p-0 m-0 mx-2"
            editValue={filters.block_uuid || ''}
            getDataAPI={GetAllBlockNumber}
            getOptionLabel={(option) => option.block_number || 'N/A'}
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                block_uuid: newValue.value,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
          />
        )}
        {is_static ? (
          filters.full_category?.filters?.includes('company_uuid') && (
            <SharedAPIAutocompleteControl
              title="branches"
              searchKey="search"
              stateKey="company_uuid"
              placeholder="select-branches"
              idRef="searchBranchAutocompleteRef"
              controlWrapperClasses="p-0 m-0 mx-2"
              editValue={filters.company_uuid || ''}
              getDataAPI={GetAllSetupsBranches}
              getOptionLabel={(option) =>
                (option.name
                  && (option.name[i18next.language] || option.name.en || 'N/A'))
                || 'N/A'
              }
              onValueChanged={(newValue) =>
                setFilters((items) => ({
                  ...items,
                  company_uuid: newValue.value,
                  category_code: null,
                  job_uuid: null,
                }))
              }
              type={DynamicFormTypesEnum.select.key}
              parentTranslationPath={parentTranslationPath}
              extraProps={{
                has_access: true,
              }}
            />
          )
        ) : (
          <SharedAPIAutocompleteControl
            title="branches"
            searchKey="search"
            stateKey="company_uuid"
            placeholder="select-branches"
            idRef="searchBranchAutocompleteRef"
            controlWrapperClasses="p-0 m-0 mx-2"
            editValue={filters.company_uuid || ''}
            getDataAPI={GetAllSetupsBranches}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                company_uuid: newValue.value,
                job_uuid: null,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              has_access: true,
            }}
          />
        )}
        {is_static && filters.full_category?.filters?.includes('category_uuid') && (
          <SharedAPIAutocompleteControl
            title="category"
            searchKey="search"
            stateKey="category_uuid"
            placeholder="select-category"
            idRef="searchBranchAutocompleteRef"
            controlWrapperClasses="p-0 m-0"
            editValue={filters.category_uuid || ''}
            getDataAPI={GetAllSetupsCategories}
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language] || option.title.en || 'N/A'))
              || 'N/A'
            }
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                category_uuid: newValue.value,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              has_access: true,
              ...(filters.company_uuid && {
                branch_uuid: filters.company_uuid,
              }),
            }}
          />
        )}
        {is_static && filters.full_category?.filters?.includes('category_code') && (
          <SharedAPIAutocompleteControl
            title="category"
            searchKey="search"
            stateKey="code"
            uniqueKey="code"
            placeholder="select-category"
            idRef="searchBranchAutocompleteRef"
            controlWrapperClasses="p-0 m-0"
            editValue={filters.category_code || ''}
            getDataAPI={GetAllSetupsCategories}
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language] || option.title.en || 'N/A'))
              || 'N/A'
            }
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                category_code: newValue?.value,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              use_for: 'list',
              has_access: true,
              ...(filters.company_uuid && {
                branch_uuid: filters.company_uuid,
              }),
            }}
          />
        )}
        {!(is_static && filters.full_category?.filters?.includes('job_uuid')) && (
          <SharedAPIAutocompleteControl
            title={`${t('job')}: ${t('all')}`}
            searchKey="search"
            placeholder="select-job"
            stateKey="job_uuid"
            editValue={filters.job_uuid || ''}
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                job_uuid: newValue.value,
                pipeline_uuid: null,
              }))
            }
            errorPath="job_uuid"
            getDataAPI={GetAllJobsByBranch}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => option.title}
            controlWrapperClasses="mx-2 px-0 my-0"
            isDisabled={isDisabled}
            errors={
              !filters.job_uuid && filters.category === 'pipeline'
                ? {
                  job_uuid: {
                    error: true,
                    message: t('Shared:this-field-is-required'),
                    messages: [],
                  },
                }
                : {}
            }
            isSubmitted
            extraProps={{
              company_uuid: filters.company_uuid,
            }}
          />
        )}
        {!is_static && filters.job_uuid && pipelinesList.length > 0 && (
          <SharedAutocompleteControl
            editValue={filters.pipeline_uuid}
            placeholder="select-pipeline"
            stateKey="pipeline_uuid"
            getOptionLabel={(option) => option.title}
            initValues={pipelinesList || []}
            isSubmitted
            errorPath="pipeline_uuid"
            initValuesKey="uuid"
            initValuesTitle="title"
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                pipeline_uuid: newValue.value,
              }))
            }
            parentTranslationPath={parentTranslationPath}
            errors={
              !filters.pipeline_uuid && filters.category === 'pipeline'
                ? {
                  pipeline_uuid: {
                    error: true,
                    message: t('Shared:this-field-is-required'),
                    messages: [],
                  },
                }
                : {}
            }
            title={t('pipeline')}
          />
        )}
        {is_static && filters.full_category?.filters?.includes('job_uuid') && (
          <SharedAPIAutocompleteControl
            title={`${t('job')}: ${t('all')}`}
            searchKey="search"
            placeholder="select-job"
            stateKey="job_uuid"
            editValue={filters.job_uuid || ''}
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                job_uuid: newValue.value,
                pipeline_uuid: null,
              }))
            }
            errorPath="job_uuid"
            getDataAPI={GetAllJobsByBranch}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) => option.title}
            controlWrapperClasses="mx-2 px-0 my-0"
            isDisabled={isDisabled}
            errors={
              !filters.job_uuid && filters.category === 'pipeline'
                ? {
                  job_uuid: {
                    error: true,
                    message: t('Shared:this-field-is-required'),
                    messages: [],
                  },
                }
                : {}
            }
            isSubmitted
            extraProps={{
              company_uuid: filters.company_uuid,
            }}
          />
        )}
        {is_static
          && filters.job_uuid
          && !!pipelinesList.length
          && filters.full_category?.filters?.includes('pipeline_uuid') && (
          <SharedAutocompleteControl
            editValue={filters.pipeline_uuid}
            placeholder="select-pipeline"
            stateKey="pipeline_uuid"
            getOptionLabel={(option) => option.title}
            initValues={pipelinesList || []}
            isSubmitted
            errorPath="pipeline_uuid"
            initValuesKey="uuid"
            initValuesTitle="title"
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                pipeline_uuid: newValue.value,
              }))
            }
            parentTranslationPath={parentTranslationPath}
            errors={
              !filters.pipeline_uuid && filters.category === 'pipeline'
                ? {
                  pipeline_uuid: {
                    error: true,
                    message: t('Shared:this-field-is-required'),
                    messages: [],
                  },
                }
                : {}
            }
            title={t('pipeline')}
          />
        )}
        {is_static && filters.full_category?.filters?.includes('user_uuid') && (
          <SharedAPIAutocompleteControl
            title="user-employee"
            searchKey="search"
            stateKey="uuid"
            placeholder="select-user-employee"
            idRef="searchUsersAutocompleteRef"
            controlWrapperClasses="p-0 m-0 mx-2"
            editValue={filters?.user_uuid || ''}
            getDataAPI={GetAllUsersPython}
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                user_uuid: newValue.value,
                team_uuid: null,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            getOptionLabel={(option) =>
              `${
                option.first_name
                && (option.first_name[i18next.language] || option.first_name.en)
              }${
                option.last_name
                && ` ${option.last_name[i18next.language] || option.last_name.en}`
              }`
            }
            extraProps={{
              ...(filters?.user_uuid && {
                with_than: [filters?.user_uuid],
              }),
            }}
          />
        )}
        {is_static && filters.full_category?.filters?.includes('team_uuid') && (
          <SharedAPIAutocompleteControl
            title="team"
            searchKey="search"
            stateKey="uuid"
            placeholder="select-team"
            idRef="searchTeamsAutocompleteRef"
            controlWrapperClasses="p-0 m-0 mx-2"
            editValue={filters.team_uuid || ''}
            getDataAPI={GetAllSetupsTeams}
            getOptionLabel={(option) =>
              option.title?.[i18next.language] || option.title?.en || 'N/A'
            }
            onValueChanged={(newValue) =>
              setFilters((items) => ({
                ...items,
                team_uuid: newValue.value,
                user_uuid: null,
              }))
            }
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              ...(filters?.team_uuid && {
                with_than: [filters?.team_uuid],
              }),
            }}
          />
        )}
        <CustomDateFilterDialog
          isOpen={showCustomDateDialog}
          setIsOpen={setShowCustomDateDialog}
          parentTranslationPath={parentTranslationPath}
          setFilters={setFilters}
          filters={filters}
          setSelectedDateRange={setSelectedDateRange}
        />
      </div>
      {filters.date_filter_type === 'custom' && (
        <div className="d-flex px-3 pb-3 mx-2">
          <ButtonBase className="btns theme-outline">
            <div className="m-2">
              <span className="fas fa-calendar" />
              <span className="mx-2">{`${t('from-date')}: ${
                filters.from_date
              }`}</span>
              <span>-</span>
              <span className="fas fa-calendar mx-2" />
              <span>{`${t('to-date')}: ${filters.to_date}`}</span>
              <ButtonBase
                onClick={() => {
                  setFilters((items) => ({
                    ...items,
                    from_date: null,
                    to_date: null,
                    date_filter_type: 'default',
                  }));
                  setSelectedDateRange('default');
                }}
              >
                <span className="fas fa-times ml-2" />
              </ButtonBase>
            </div>
          </ButtonBase>
          {/*<div className="d-flex-v-center dashboard-filter-add-extra-btn">*/}
          {/*  <ButtonBase className="btns c-black" disabled={isDisabled}>*/}
          {/*    <PlusIcon />*/}
          {/*    <span className="mx-2">{t('filter')}</span>*/}
          {/*  </ButtonBase>*/}
          {/*</div>*/}
        </div>
      )}
    </div>
  );
};

DashboardFilter.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  setFilters: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    category: PropTypes.string.isRequired,
    team_uuid: PropTypes.string,
    user_uuid: PropTypes.string,
    job_uuid: PropTypes.oneOf([PropTypes.string, null]),
    pipeline_uuid: PropTypes.oneOf([PropTypes.string, null]),
    slug: PropTypes.oneOf([PropTypes.string, null]),
    from_date: PropTypes.oneOf([PropTypes.string, null]),
    to_date: PropTypes.oneOf([PropTypes.string, null]),
    company_uuid: PropTypes.string,
    date_filter_type: PropTypes.oneOf(['custom', 'default']),
    full_category: PropTypes.shape({
      filters: PropTypes.array,
    }),
    category_uuid: PropTypes.string,
    block_uuid: PropTypes.string,
  }).isRequired,
  is_static: PropTypes.bool,
  isWithEditModeToggle: PropTypes.bool,
  isDisabled: PropTypes.bool,
};
