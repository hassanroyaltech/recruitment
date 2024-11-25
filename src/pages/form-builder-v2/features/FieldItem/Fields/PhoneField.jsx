import React, { forwardRef, useEffect } from 'react';
import NumberFormat from 'react-number-format';
import _ from 'lodash';
import { TextField, Select, MenuItem } from '@mui/material';
import { CornerDownIcon } from '../../../../form-builder/icons';
import { countries } from '../../../data/countries';

const PhoneCardField = forwardRef(({ onChange, mask, ...props }, ref) => (
  <NumberFormat
    {...props}
    getInputRef={ref}
    onValueChange={(values) => {
      onChange({
        target: {
          name: props.name,
          value: values.value,
        },
      });
    }}
    isNumericString
    format={mask}
    mask="_"
  />
));

PhoneCardField.displayName = 'PhoneCardField';

// eslint-disable-next-line react/display-name
export default React.memo(
  ({
    title,
    isPhoneMaskChecked,
    phoneAllowedCountries,
    phoneDefaultCountry,
    placeholder,
    charMin,
    charMax,
    handleSetValue,
    disabled,
    initialValue,
    isRequired,
    isSubmitted,
  }) => {
    // TODO make object instead of two states
    const [value, setValue] = React.useState('');
    const [selectValue, setSelectValue] = React.useState(phoneDefaultCountry || '');

    const debounceFn = React.useCallback(
      _.debounce((v) => handleSetValue(v), 800, { trailing: true }),
      [],
    );

    const handleChange = (e) => {
      setValue(e.target.value);
      debounceFn(
        `${selectValue}-${
          countries.find((item) => item.iso === selectValue)?.code
        }-${e.target.value}`,
      );
    };
    const handleSelectChange = (e) => {
      setSelectValue(e.target.value);
      debounceFn(
        `${e.target.value}-${
          countries.find((item) => item.iso === e.target.value)?.code
        }-${value}`,
      );
    };

    useEffect(() => {
      if (initialValue) {
        const splittedArr = initialValue.split('-');
        if (splittedArr[0]) {
          const countryIso
            = countries.find(
              (item) =>
                phoneAllowedCountries.includes(item.iso)
                && item.iso === splittedArr[0],
            )?.iso || '';
          if (countryIso) setSelectValue(countryIso);
        }
        if (splittedArr[2]) setValue(splittedArr[2]);
      }
    }, [initialValue, phoneAllowedCountries]);

    useEffect(() => {
      setSelectValue((item) =>
        !item || !phoneAllowedCountries.includes(item)
          ? phoneDefaultCountry || ''
          : item,
      );
    }, [phoneAllowedCountries, phoneDefaultCountry]);

    return (
      <div className="d-flex-v-start w-100">
        <Select
          disabled={disabled}
          displayEmpty
          variant="standard"
          id="modal-placeholder-select"
          sx={{ mr: 2 }}
          IconComponent={CornerDownIcon}
          value={selectValue}
          className={
            (!disabled
              && isRequired
              && isSubmitted
              && !selectValue
              && 'is-required')
            || ''
          }
          onChange={handleSelectChange}
        >
          <MenuItem value="">Select</MenuItem>
          {countries
            .filter((item) => phoneAllowedCountries.includes(item.iso))
            .map((c) => (
              <MenuItem key={c.name} value={c.iso}>
                {c.name} ({c.code})
              </MenuItem>
            ))}
        </Select>
        <TextField
          disabled={disabled}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          required={isRequired}
          name={title}
          id={`${title}-phone`}
          className={
            (!disabled && isRequired && isSubmitted && !value && 'is-required') || ''
          }
          InputProps={{
            inputComponent: PhoneCardField,
            inputProps: {
              minLength: charMin,
              ...(!selectValue && { maxLength: charMax }),
              /* picking the longest mask from the array if exists */
              mask:
                (isPhoneMaskChecked
                  && (Array.isArray(
                    countries.find((country) => country.iso === selectValue)?.mask,
                  )
                    ? countries
                      .find((country) => country.iso === selectValue)
                      ?.mask.sort((a, b) => b.length - a.length)[0]
                    : countries.find((country) => country.iso === selectValue)
                      ?.mask))
                || undefined,
            },
          }}
        />
      </div>
    );
  },
);
