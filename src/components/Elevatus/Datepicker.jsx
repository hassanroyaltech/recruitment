/* eslint-disable react/display-name */
// You can use React or Preact here—just make sure you have the proper aliasing.
import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

// Stylesheet for calendar.
import moment from 'moment';

// Standard datepicker
import DatePicker from 'react-datepicker';

// Date picker styling
import 'react-datepicker/dist/react-datepicker.min.css';
import { Inputs } from '../Inputs/Inputs.Component';

import './Datepicker.Style.scss';
// import ButtonBase from '@mui/material/ButtonBase';
// import { SelectComponent } from '../Select/Select.Component';

// Main class component
const Datepicker = ({
  onChange,
  inline,
  minDate,
  maxDate,
  value,
  valueDateFormat,
  dateFormat,
  timeFormat,
  idRef,
  label,
  inputPlaceholder,
  labelValue,
  inlineLabel,
  parentTranslationPath,
  translationPath,
  error,
  isSubmitted,
  isDisabled,
  helperText,
  showTimeSelect,
  filterDate,
  ...rest
}) => {
  const [localValue, setLocalValue] = useState(null);

  const getCustomInput = useMemo(
    () => () => {
      const LocalCustomInput = forwardRef((references, ref) => (
        <Inputs
          idRef={idRef}
          label={label}
          inputPlaceholder={inputPlaceholder}
          labelValue={labelValue}
          inlineLabel={inlineLabel}
          inputRef={ref}
          autoComplete="new-password"
          defaultValue={references?.value}
          onInputClick={references?.onClick}
          onInputChanged={references?.onChange}
          error={error}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled}
          helperText={helperText}
          themeClass="theme-solid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      ));
      return <LocalCustomInput />;
    },
    [
      error,
      helperText,
      idRef,
      inlineLabel,
      inputPlaceholder,
      isDisabled,
      isSubmitted,
      label,
      labelValue,
      parentTranslationPath,
      translationPath,
    ],
  );
  useEffect(() => {
    if (value && moment(value).isValid())
      setLocalValue((value && moment(value, valueDateFormat).toDate()) || value);
  }, [valueDateFormat, value]);

  return (
    <DatePicker
      {...rest}
      selected={localValue}
      minDate={minDate}
      maxDate={maxDate}
      disabled={isDisabled}
      // renderCustomHeader={({
      //   date,
      //   changeYear,
      //   changeMonth,
      //   decreaseMonth,
      //   increaseMonth,
      //   prevMonthButtonDisabled,
      //   nextMonthButtonDisabled,
      // }) => (
      //   <div className="d-flex-center">
      //     <ButtonBase
      //       className="btns-icon theme-transparent"
      //       onClick={decreaseMonth}
      //       disabled={prevMonthButtonDisabled}
      //     >
      //       <span className="fas fa-chevron-left" />
      //     </ButtonBase>
      //     <SelectComponent
      //       idRef={`yearsDropDownRef${idRef}`}
      //       value={[
      //         {
      //           key: moment(date).format('YYYY'),
      //           value: moment(date).format('YYYY'),
      //         },
      //       ]}
      //       data={Array.from(
      //         {
      //           length:
      //             Math.ceil(moment().add(100, 'year').diff('1970-01-01', 'years'))
      //             || 1,
      //         },
      //         (v, number) => ({ key: `${1970 + number }`, value: `${1970 + number }` }),
      //       )}
      //       onSelectChanged={(newValue) => changeYear(newValue)}
      //     />
      //
      //     <SelectComponent
      //       value={[
      //         { key: moment(date).month(), value: moment(date).format('MMM') },
      //       ]}
      //       idRef={`monthsDropDownRef${idRef}`}
      //       data={moment
      //         .months()
      //         .map((item, index) => ({ key: index, value: item }))}
      //       onSelectChanged={(newValue) => changeMonth(newValue ? newValue.key : null)}
      //     />
      //
      //     <ButtonBase
      //       className="btns-icon theme-transparent"
      //       onClick={increaseMonth}
      //       disabled={nextMonthButtonDisabled}
      //     >
      //       <span className="fas fa-chevron-right" />
      //     </ButtonBase>
      //   </div>
      // )}
      showYearDropdown
      onChange={(date) => {
        setLocalValue(date);
        if (onChange) onChange(moment(date).format(valueDateFormat));
      }}
      filterDate={filterDate}
      dateFormat={dateFormat}
      timeFormat={timeFormat}
      showTimeSelect={showTimeSelect}
      inline={inline}
      customInput={getCustomInput()}
    />
  );
};
Datepicker.propTypes = {
  onChange: PropTypes.func,
  filterDate: PropTypes.func,
  inline: PropTypes.bool,
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  excludeTimes: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  ),
  value: PropTypes.string,
  label: PropTypes.string,
  valueDateFormat: PropTypes.string,
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
  idRef: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  labelValue: PropTypes.string,
  inlineLabel: PropTypes.string,
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  showTimeSelect: PropTypes.bool,
  helperText: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
Datepicker.defaultProps = {
  onChange: undefined,
  filterDate: undefined,
  value: undefined,
  label: undefined,
  labelValue: undefined,
  inlineLabel: undefined,
  inputPlaceholder: undefined,
  error: undefined,
  isSubmitted: undefined,
  isDisabled: undefined,
  helperText: undefined,
  parentTranslationPath: '',
  translationPath: '',
  valueDateFormat: 'YYYY-MM-DD',
  dateFormat: 'yyyy-MM-dd',
  timeFormat: undefined,
  idRef: 'datePickerInputRef',
  inline: false,
  showTimeSelect: undefined,
  minDate: undefined,
  maxDate: undefined,
  excludeTimes: undefined,
};
export default Datepicker;
