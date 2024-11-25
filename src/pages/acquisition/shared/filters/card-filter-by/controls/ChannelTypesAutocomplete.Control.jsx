import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { useTranslation } from 'react-i18next';
import { ChannelTypesEnums } from '../../../../../../enums';

export const ChannelTypesAutocompleteControl = ({
  onSelectedValueChanged,
  idRef,
  stateKey,
  isDisabled,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [data] = useState(() =>
    Object.values(ChannelTypesEnums).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [localSelectedValue, setLocalSelectedValue] = useState(() => []);

  return (
    <div className="mb-2">
      <AutocompleteComponent
        idRef={idRef}
        getOptionLabel={(option) => option.value || ''}
        chipsLabel={(option) => option.value || ''}
        value={localSelectedValue}
        isOptionEqualToValue={(option) =>
          localSelectedValue
          && localSelectedValue.findIndex((item) => item.key === option.key) !== -1
        }
        data={data}
        labelValue="channel-type"
        multiple
        maxNumber={1}
        isDisabled={isDisabled}
        inputPlaceholder="select-channel-type"
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        withExternalChips
        onChange={(e, newValue) => {
          setLocalSelectedValue(newValue);
          if (onSelectedValueChanged)
            onSelectedValueChanged({
              id: stateKey,
              value: (newValue && newValue.length > 0 && newValue[0].key) || null,
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

ChannelTypesAutocompleteControl.propTypes = {
  onSelectedValueChanged: PropTypes.func.isRequired,
  stateKey: PropTypes.string.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  idRef: PropTypes.string.isRequired,
};
