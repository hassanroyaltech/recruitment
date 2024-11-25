import { DialogComponent } from '../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../setups/shared';
import React, { useCallback, useEffect, useState, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  GetAllJobsByBranch,
  GetAllSetupsBranches,
  GetJobById,
} from '../../../services';
import { DynamicFormTypesEnum } from '../../../enums';
import i18next from 'i18next';
import { showError } from '../../../helpers';

export const PipelineFeatureDialog = ({
  isOpen,
  setIsOpen,
  filters,
  setFilters,
  parentTranslationPath,
  isPipeLine = false,
  setSelectedPipeLine = () => null,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    job_uuid: null,
    company_uuid: null,
    pipeline_uuid: null,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [pipelinesList, setPipelinesList] = useState([]);
  const firstTimeRef = useRef(true);
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const GetJobByIdHandler = useCallback(
    async (jobUUID, companyUUID) => {
      firstTimeRef.current = false;
      if (jobUUID) {
        const response = await GetJobById({
          job_uuid: jobUUID,
          company_uuid: companyUUID || state.company_uuid,
        });
        if (response && response.status === 200) {
          setPipelinesList(response.data.results.job.pipelines);
          let filterObject = {};
          filters?.filterItems?.forEach((it) => {
            filterObject[it.slug] = it.value;
          });
          onStateChanged({
            id: 'pipeline_uuid',
            value: filterObject.ats_job_pipelines_uuid?.[0],
          });
          onStateChanged({
            id: 'pipeline_origin_uuid',
            value: filters.pipeline_origin_uuid,
          });
        } else {
          showError(t('Shared:failed-to-get-saved-data'), response);
          setPipelinesList([]);
        }
      } else setPipelinesList([]);
    },
    [filters?.filterItems, filters?.pipeline_origin_uuid, state.company_uuid, t],
  );

  const onSubmitHandler = useCallback(
    (e) => {
      e.preventDefault();
      if (isPipeLine) {
        setSelectedPipeLine({
          job_uuid: state.job_uuid,
          pipeline_uuid: state.pipeline_uuid,
        });
        setIsOpen(false);
        return;
      }

      setFilters((items) => ({
        ...items,
        pipeline_origin_uuid: state.pipeline_origin_uuid,
        pipeline_company_uuid: state.company_uuid,
        pipeline_division: null,
        filterItems: [
          {
            slug: 'job_uuid',
            value: [state.job_uuid],
          },
          {
            slug: 'ats_job_pipelines_uuid',
            value: [state.pipeline_uuid],
          },
        ],
      }));
      setIsOpen(false);
    },
    [setFilters, setIsOpen, state, isPipeLine, setSelectedPipeLine],
  );

  useEffect(() => {
    if (filters) {
      let filterObject = {};
      filters.filterItems?.forEach((it) => {
        filterObject[it.slug] = it.value;
      });
      if (filterObject.job_uuid && firstTimeRef.current) {
        firstTimeRef.current = false;
        onStateChanged({
          id: 'job_uuid',
          value: filterObject.job_uuid?.[0],
        });
        onStateChanged({
          id: 'company_uuid',
          value: filters.pipeline_company_uuid,
        });
        GetJobByIdHandler(filterObject.job_uuid?.[0], filters.pipeline_company_uuid);
      }
    }
  }, [GetJobByIdHandler, filters, pipelinesList.length]);

  return (
    <DialogComponent
      titleText="eva-rec-pipeline-feature"
      maxWidth="sm"
      dialogContent={
        <div>
          <SharedAPIAutocompleteControl
            isFullWidth
            title="branch"
            searchKey="search"
            stateKey="company_uuid"
            placeholder="select-branch"
            idRef="searchBranchAutocompleteRef"
            editValue={state.company_uuid || ''}
            getDataAPI={GetAllSetupsBranches}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            onValueChanged={(newValue) => {
              onStateChanged({
                id: 'edit',
                value: stateInitRef.current,
              });
              onStateChanged({
                id: 'company_uuid',
                value: newValue.value,
              });
            }}
            type={DynamicFormTypesEnum.select.key}
            parentTranslationPath={parentTranslationPath}
            extraProps={{
              has_access: true,
              ...(state.company_uuid && {
                with_than: [state.company_uuid],
              }),
            }}
          />
          {state.company_uuid && (
            <SharedAPIAutocompleteControl
              isFullWidth
              title={t('job')}
              searchKey="search"
              placeholder="select-job"
              stateKey="job_uuid"
              editValue={state.job_uuid || ''}
              onValueChanged={(newValue) => {
                onStateChanged({
                  id: 'job_uuid',
                  value: newValue.value,
                });
                onStateChanged({
                  id: 'pipeline_uuid',
                  value: null,
                });
                GetJobByIdHandler(newValue.value);
              }}
              errorPath="job_uuid"
              getDataAPI={GetAllJobsByBranch}
              parentTranslationPath={parentTranslationPath}
              getOptionLabel={(option) => option.title}
              errors={
                !state.job_uuid
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
                company_uuid: state.company_uuid,
              }}
            />
          )}
          {state.job_uuid && !!pipelinesList.length && (
            <SharedAutocompleteControl
              isEntireObject
              isFullWidth
              editValue={state.pipeline_uuid}
              placeholder="select-pipeline"
              stateKey="pipeline_uuid"
              getOptionLabel={(option) => option.title}
              initValues={pipelinesList || []}
              isSubmitted
              errorPath="pipeline_uuid"
              initValuesKey="uuid"
              initValuesTitle="title"
              onValueChanged={(newValue) => {
                onStateChanged({
                  id: 'pipeline_uuid',
                  value: newValue.value?.uuid,
                });
                onStateChanged({
                  id: 'pipeline_origin_uuid',
                  value: newValue.value?.origin_pipeline_uuid,
                });
              }}
              parentTranslationPath={parentTranslationPath}
              errors={
                !state.pipeline_uuid
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
        </div>
      }
      isOpen={isOpen}
      isOldTheme
      onSubmit={onSubmitHandler}
      onCloseClicked={() => setIsOpen(false)}
      onCancelClicked={() => setIsOpen(false)}
      parentTranslationPath={parentTranslationPath}
      saveIsDisabled={!state.job_uuid || !state.pipeline_uuid}
    />
  );
};

PipelineFeatureDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  filters: PropTypes.shape({
    pipeline_origin_uuid: PropTypes.string,
    pipeline_company_uuid: PropTypes.string,
    filterItems: PropTypes.arrayOf(
      PropTypes.shape({
        ats_job_pipelines_uuid: PropTypes.string,
      }),
    ),
  }),
  setFilters: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  isPipeLine: PropTypes.bool,
  setSelectedPipeLine: PropTypes.func,
};
