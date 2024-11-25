import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { GlobalSearchDelay } from '../../../../../../helpers';
import { GetAllCampaignActiveJobs } from '../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../enums';
import { SharedAPIAutocompleteControl } from '../../../../../setups/shared';

export const JobsAutocompleteControl = ({
  onSelectedValueChanged,
  stateKey,
  errors,
  job_uuid,
  isSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(() => []);
  const isFirstTimeRef = useRef(true);
  const [localSelectedValue, setLocalSelectedValue] = useState(() => null);
  const [search, setSearch] = useState('');
  const [filter] = useState({
    page: 1,
    limit: 10,
  });
  const searchTimerRef = useRef(null);
  const getAllSortedByName = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllCampaignActiveJobs({
      ...filter,
      query: search,
      job_uuid,
    });
    if (response && response.status === 200) setData(response.data.results.jobs);
    else setData([]);
    setIsLoading(false);
  }, [filter, job_uuid, search]);

  useEffect(() => {
    getAllSortedByName();
  }, [getAllSortedByName, search]);
  useEffect(() => {
    if (
      job_uuid
      && isFirstTimeRef.current
      && !localSelectedValue
      && data.length > 0
    ) {
      isFirstTimeRef.current = false;
      const currentJob = data.find((item) => item.uuid === job_uuid);
      if (currentJob) setLocalSelectedValue(currentJob);
      else t('job-not-found-description');
    }
  }, [job_uuid, data, localSelectedValue, t]);

  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );
  return (
    <SharedAPIAutocompleteControl
      isFullWidth
      isEntireObject
      errors={errors}
      searchKey="search"
      labelValue="jobs"
      stateKey={stateKey}
      isDisabled={isLoading}
      errorPath={stateKey}
      placeholder="select-job"
      isSubmitted={isSubmitted}
      editValue={localSelectedValue?.uuid}
      onValueChanged={(e) => {
        setLocalSelectedValue(e?.value);
        if (onSelectedValueChanged)
          onSelectedValueChanged({
            id: stateKey,
            value: e?.value?.uuid || '',
          });
      }}
      type={DynamicFormTypesEnum.select.key}
      getDataAPI={GetAllCampaignActiveJobs}
      extraProps={{
        ...(localSelectedValue?.uuid && { with_than: [localSelectedValue.uuid] }),
      }}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      getOptionLabel={(option) => option.title || ''}
      dataKey="jobs"
    />
  );
};

JobsAutocompleteControl.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  onSelectedValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  job_uuid: PropTypes.string,
};

JobsAutocompleteControl.defaultProps = {
  job_uuid: null,
};
