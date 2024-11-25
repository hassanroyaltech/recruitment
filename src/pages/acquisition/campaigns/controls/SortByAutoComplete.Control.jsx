import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { useTranslation } from 'react-i18next';
import { CampaignSortByEnum } from '../../../../enums';

export const SortByAutoCompleteControl = ({
  onSelectedValueChanged,
  startAdornment,
  endAdornment,
  filterBy,
  idRef,
  parentTranslationPath,
  translationPath,
  inputPlaceholder,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [data, setData] = useState(() => []);
  const [localSelectedValue, setLocalSelectedValue] = useState(() => null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the data & of autocomplete
   * & to select current value
   */
  const updateCurrentEnums = useCallback(() => {
    const currentEnums = Object.values(CampaignSortByEnum)
      .filter((item) => item.direction === filterBy.direction)
      .map((item) => ({
        ...item,
        value: t(`${translationPath}${item.value}`),
      }));
    setLocalSelectedValue(
      (filterBy.order_by
        && currentEnums.find((item) => item.key === filterBy.order_by))
        || null,
    );
    setData(currentEnums);
  }, [filterBy, t, translationPath]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to monitor if filterBy value changed by parent
   * then update it locally
   */
  useEffect(() => {
    updateCurrentEnums();
  }, [filterBy, updateCurrentEnums]);
  return (
    <AutocompleteComponent
      idRef={idRef}
      getOptionLabel={(option) => option.value || ''}
      value={localSelectedValue}
      isOptionEqualToValue={(option) =>
        localSelectedValue && option.key === localSelectedValue.key
      }
      data={data}
      startAdornment={startAdornment}
      endAdornment={endAdornment}
      inputPlaceholder={inputPlaceholder}
      parentTranslationPath={parentTranslationPath}
      themeClass="theme-solid"
      onChange={(e, newValue) => {
        setLocalSelectedValue(newValue);
        onSelectedValueChanged((newValue && newValue.key) || '');
      }}
    />
  );
};

SortByAutoCompleteControl.propTypes = {
  onSelectedValueChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  startAdornment: PropTypes.string.isRequired,
  filterBy: PropTypes.shape({
    order_by: PropTypes.oneOf(
      Object.values(CampaignSortByEnum).map((item) => item.key),
    ),
    direction: PropTypes.oneOf(
      Object.values(CampaignSortByEnum).map((item) => item.direction),
    ),
  }).isRequired,
  endAdornment: PropTypes.instanceOf(Object).isRequired,
  idRef: PropTypes.string.isRequired,
  inputPlaceholder: PropTypes.string.isRequired,
};
