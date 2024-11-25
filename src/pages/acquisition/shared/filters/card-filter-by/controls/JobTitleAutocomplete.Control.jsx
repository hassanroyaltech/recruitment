import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { GlobalSearchDelay } from 'helpers';
import { GetAllActiveJobs } from 'services';

export const JobTitleAutocompleteControl = ({
  onSelectedValueChanged,
  idRef,
  stateKey,
  isDisabled,
  parentTranslationPath,
  translationPath,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(() => []);
  const [localSelectedValue, setLocalSelectedValue] = useState(() => []);
  const [search, setSearch] = useState('');
  const [filter] = useState({
    page: 1,
    limit: 10,
  });
  const searchTimerRef = useRef(null);
  const searchHandler = (event) => {
    const { value } = event.target;
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearch(value);
    }, GlobalSearchDelay);
  };
  const getAllActiveJobs = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllActiveJobs({ ...filter, query: search });
    if (response && response.status === 200) setData(response.data.results.jobs);
    else setData([]);
    setIsLoading(false);
  }, [filter, search]);
  useEffect(() => {
    getAllActiveJobs();
  }, [getAllActiveJobs, search]);
  useEffect(
    () => () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    },
    [],
  );
  return (
    <div className="mb-2">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => option.title || ''}
        chipsLabel={(option) => option.title || ''}
        value={localSelectedValue}
        isOptionEqualToValue={(option) =>
          localSelectedValue
          && localSelectedValue.findIndex((item) => item.uuid === option.uuid) !== -1
        }
        data={data}
        onInputKeyUp={searchHandler}
        labelValue="job-title"
        multiple
        maxNumber={1}
        isDisabled={localSelectedValue.length >= 1 || isDisabled}
        inputPlaceholder="select-job-title"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        withExternalChips
        onChange={(e, newValue) => {
          setLocalSelectedValue(newValue);
          if (onSelectedValueChanged)
            onSelectedValueChanged({
              id: stateKey,
              value: (newValue && newValue.length > 0 && newValue[0].title) || null,
            });
        }}
      />
      <div
        className={`separator-h ${
          (localSelectedValue.length === 0 && 'mt-3') || ''
        }`}
      />
    </div>
  );
};

JobTitleAutocompleteControl.propTypes = {
  onSelectedValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
