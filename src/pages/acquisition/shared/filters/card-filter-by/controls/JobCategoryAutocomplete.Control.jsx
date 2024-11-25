import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { GetAllItemsByHelper } from '../../../../../../services';

export const JobCategoryAutocompleteControl = ({
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

  const getAllItemsByHelper = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllItemsByHelper('job-major', { for_campaign: true });
    if (response && response.status === 200) setData(response.data.results);
    else setData([]);
    setIsLoading(false);
  }, []);
  useEffect(() => {
    getAllItemsByHelper();
  }, [getAllItemsByHelper]);

  return (
    <div className="mb-2">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => option.title || ''}
        chipsLabel={(option) => option.title || ''}
        value={localSelectedValue}
        isOptionEqualToValue={(option) =>
          localSelectedValue
          && localSelectedValue.findIndex((item) => item.id === option.id) !== -1
        }
        data={data}
        labelValue="job-category"
        multiple
        maxNumber={5}
        isDisabled={isDisabled}
        inputPlaceholder="select-job-category"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        withExternalChips
        onChange={(e, newValue) => {
          setLocalSelectedValue(newValue);
          if (onSelectedValueChanged)
            onSelectedValueChanged({
              id: stateKey,
              value: (newValue && newValue.map((item) => item.id)) || [],
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

JobCategoryAutocompleteControl.propTypes = {
  onSelectedValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
