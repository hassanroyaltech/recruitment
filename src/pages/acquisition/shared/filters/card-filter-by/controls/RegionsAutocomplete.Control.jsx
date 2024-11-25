import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { GetAllItemsByHelper } from '../../../../../../services';

export const RegionsAutocompleteControl = ({
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
    const response = await GetAllItemsByHelper('country', { for_campaign: true });
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
        // getOptionLabel={(option) => option.title || ''}
        // chipsLabel={(option) => option.title || ''}
        value={localSelectedValue}
        // isOptionEqualToValue={(option) => localSelectedValue
        //   && localSelectedValue.findIndex((item) => item.uuid === option.uuid) !== -1}
        data={data}
        labelValue="regions"
        maxNumber={1}
        multiple
        isDisabled={isDisabled}
        inputPlaceholder="select-regions"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        isLoading={isLoading}
        // withExternalChips
        onChange={(e, newValue) => {
          setLocalSelectedValue(newValue);
          if (onSelectedValueChanged)
            onSelectedValueChanged({
              id: stateKey,
              value: (newValue && newValue.length > 0 && newValue[0].id) || null,
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

RegionsAutocompleteControl.propTypes = {
  onSelectedValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
