import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Inputs } from '../Inputs/Inputs.Component';
import i18next from 'i18next';
import { InputThemesEnum } from '../../enums';
import './DatePicker.Style.scss';
import { GlobalSavingDateFormat, GlobalSavingHijriDateFormat } from '../../helpers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import moment from 'moment-hijri';
import 'moment/locale/ar';
import 'moment/locale/tr';
import 'moment/locale/ro';
import 'moment/locale/ar-sa';
import MomentUtils from '@date-io/hijri';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
const localeMap = {
  ar: 'ar',
  tr: 'tr',
  ro: 'ro',
};

const DatePickerComponent = ({
  label,
  labelValue,
  inputPlaceholder,
  maxDate,
  minDate,
  parentTranslationPath,
  translationPath,
  value,
  onChange,
  onDelayedChange,
  idRef,
  inlineLabel,
  autoComplete,
  inputRef,
  error,
  isSubmitted,
  isDisabled,
  helperText,
  themeClass,
  datePickerWrapperClasses,
  isFullWidth,
  isTwoThirdsWidth,
  isHalfWidth,
  isQuarterWidth,
  errorPath,
  errors,
  parentId,
  parentIndex,
  subParentId,
  subParentIndex,
  subSubParentId,
  subSubParentIndex,
  stateKey,
  savingFormat,
  hijriSavingFormat,
  displayFormat,
  hijriDisplayFormat,
  toolbarPlaceholder,
  isHijri,
  mask,
  hijriMask,
  fieldClasses,
  disableMaskedInput,
  disableFuture,
  disablePast,
  disabled,
  inline,
  isRequired,
  views,
}) => {
  const [localValue, setLocalValue] = useState(null);
  const localValueRef = useRef(null);
  const [, startTransition] = useTransition();
  const [localTextValue, setLocalTextValue] = useState(null);

  const onChangeHandler = useCallback(
    (newValue) => {
      setLocalValue(newValue);
      if (newValue && !moment(newValue).isValid()) return;
      setLocalTextValue(
        moment(newValue)
          .locale(localeMap[i18next.language] || 'en')
          .format((isHijri && hijriDisplayFormat) || displayFormat),
      );
      if (onChange)
        onChange({
          parentId,
          parentIndex,
          subParentId,
          subParentIndex,
          subSubParentId,
          subSubParentIndex,
          id: stateKey,
          value:
            (newValue
              && moment(newValue)
                .locale('en')
                .format((isHijri && hijriSavingFormat) || savingFormat))
            || null,
        });
      if (onDelayedChange)
        startTransition(() =>
          onDelayedChange({
            parentId,
            parentIndex,
            subParentId,
            subParentIndex,
            subSubParentId,
            subSubParentIndex,
            id: stateKey,
            value:
              (newValue
                && moment(newValue)
                  .locale('en')
                  .format((isHijri && hijriSavingFormat) || savingFormat))
              || null,
          }),
        );
    },
    [
      displayFormat,
      hijriDisplayFormat,
      hijriSavingFormat,
      isHijri,
      onChange,
      onDelayedChange,
      parentId,
      parentIndex,
      savingFormat,
      stateKey,
      subParentId,
      subParentIndex,
      subSubParentId,
      subSubParentIndex,
    ],
  );
  useEffect(() => {
    setLocalValue((item) =>
      value
        ? (value
            && moment(value, (isHijri && hijriSavingFormat) || savingFormat)
              .locale('en')
              .toDate())
          || null
        : !value && item
          ? null
          : item,
    );
  }, [
    hijriDisplayFormat,
    displayFormat,
    value,
    isHijri,
    hijriSavingFormat,
    savingFormat,
  ]);
  useEffect(() => {
    localValueRef.current = localValue;
  }, [localValue]);

  useEffect(() => {
    if (localValueRef.current) onChangeHandler(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHijri]);

  useEffect(() => {
    moment.locale(i18next.language || 'en');
  }, []);
  const inputChangeHandler = useCallback(
    (e) => {
      setLocalTextValue(e.target.value);
      const timeOutId = setTimeout(() => {
        e.target.value
          && onChangeHandler(moment(e.target.value).isValid() ? e.target.value : null);
      }, 0);
      clearTimeout(timeOutId);
    },
    [onChangeHandler],
  );
  const inputBlurHandler = useCallback(
    (e) => {
      e.target.value
        && moment(e.target.value).isValid()
        && onChangeHandler(e.target.value);
    },
    [onChangeHandler],
  );
  return (
    <div
      className={`datepicker-wrapper${
        (datePickerWrapperClasses && ` ${datePickerWrapperClasses}`) || ''
      }${(isFullWidth && ' is-full-width') || ''}${
        (isTwoThirdsWidth && ' is-two-thirds-width') || ''
      }${(isHalfWidth && ' is-half-width') || ''}${
        (isQuarterWidth && ' is-quarter-width') || ''
      } shared-control-wrapper`}
    >
      <LocalizationProvider
        dateAdapter={isHijri ? MomentUtils : AdapterMoment}
        dateLibInstance={moment}
        adapterLocale={(isHijri && 'ar-sa') || localeMap[i18next.language] || 'en'}
      >
        {!inline ? (
          <DatePicker
            views={views}
            value={localValue}
            onChange={onChangeHandler}
            className="date-picker-component-wrapper"
            maxDate={
              isHijri && !maxDate ? moment('1499-12-29', 'iYYYY-iMM-iDD') : maxDate
            }
            minDate={
              isHijri && !minDate ? moment('1356-01-01', 'iYYYY-iMM-iDD') : minDate
            }
            toolbarPlaceholder={toolbarPlaceholder}
            inputFormat={(isHijri && hijriDisplayFormat) || displayFormat}
            mask={(isHijri && hijriMask) || mask}
            disableMaskedInput={disableMaskedInput}
            disableFuture={disableFuture}
            disablePast={disablePast}
            disabled={isDisabled}
            renderInput={(params) => (
              <Inputs
                idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
                  subParentId || ''
                }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
                  subParentIndex || 0
                }-${stateKey}`}
                label={label}
                value={localTextValue}
                onInputChanged={(e) => {
                  inputChangeHandler(e);
                }}
                onInputBlur={(e) => {
                  inputBlurHandler(e);
                }}
                labelValue={labelValue}
                // value={
                //   localValue
                //   && moment(localValue)
                //     .locale(localeMap[i18next.language] || 'en')
                //     .format((isHijri && hijriDisplayFormat) || displayFormat)
                // }
                inlineLabel={inlineLabel}
                inputRef={inputRef}
                autoComplete={autoComplete}
                error={
                  error || (errors && errors[errorPath] && errors[errorPath].error)
                }
                isSubmitted={isSubmitted}
                isRequired={isRequired}
                isDisabled={isDisabled}
                fieldClasses={fieldClasses}
                helperText={
                  helperText
                  || (errors && errors[errorPath] && errors[errorPath].message)
                }
                themeClass={themeClass}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                datePickerParams={{
                  ...params,
                  mask: (isHijri && hijriMask) || mask,
                  inputProps: {
                    ...params.inputProps,
                    placeholder: inputPlaceholder || params.inputProps.placeholder,
                  },
                }}
              />
            )}
          />
        ) : (
          <StaticDatePicker
            disableToolbar
            disableFuture={disableFuture}
            disablePast={disablePast}
            disabled={disabled}
            value={localValue}
            isRequired={isRequired}
            onChange={onChangeHandler}
            maxDate={
              isHijri && !maxDate ? moment('1499-12-29', 'iYYYY-iMM-iDD') : maxDate
            }
            minDate={
              isHijri && !minDate ? moment('1356-01-01', 'iYYYY-iMM-iDD') : minDate
            }
            displayStaticWrapperAs="desktop"
            renderInput={(pickerProps) => <Inputs {...pickerProps} />}
          />
        )}
      </LocalizationProvider>
    </div>
  );
};

DatePickerComponent.displayName = 'DatePickerComponent';

DatePickerComponent.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  idRef: PropTypes.string,
  labelValue: PropTypes.string,
  maxDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  minDate: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  onChange: PropTypes.func,
  onDelayedChange: PropTypes.func,
  inlineLabel: PropTypes.string,
  autoComplete: PropTypes.string,
  inputRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  error: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  datePickerWrapperClasses: PropTypes.string,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  helperText: PropTypes.string,
  errorPath: PropTypes.string,
  errors: PropTypes.instanceOf(Object),
  parentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentId: PropTypes.string,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  stateKey: PropTypes.string,
  inputFormat: PropTypes.string,
  toolbarPlaceholder: PropTypes.string,
  mask: PropTypes.string,
  hijriMask: PropTypes.string,
  disableMaskedInput: PropTypes.bool,
  disableFuture: PropTypes.bool,
  disablePast: PropTypes.bool,
  disabled: PropTypes.bool,
  savingFormat: PropTypes.string,
  hijriSavingFormat: PropTypes.string,
  displayFormat: PropTypes.string,
  hijriDisplayFormat: PropTypes.string,
  fieldClasses: PropTypes.string,
  themeClass: PropTypes.oneOf(
    Object.values(InputThemesEnum).map((item) => item.key),
  ),
  isHijri: PropTypes.bool,
  inline: PropTypes.bool,
  isRequired: PropTypes.bool,
  views: PropTypes.array,
};
DatePickerComponent.defaultProps = {
  label: undefined,
  labelValue: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  inputPlaceholder: undefined,
  maxDate: undefined,
  minDate: undefined,
  value: undefined,
  onChange: undefined,
  onDelayedChange: undefined,
  inlineLabel: undefined,
  inputRef: undefined,
  isSubmitted: undefined,
  isDisabled: undefined,
  error: undefined,
  helperText: undefined,
  themeClass: undefined,
  datePickerWrapperClasses: undefined,
  isFullWidth: false,
  isTwoThirdsWidth: false,
  isHalfWidth: false,
  isQuarterWidth: false,
  autoComplete: 'new-password',
  idRef: 'DatePickerComponentRef',
  errorPath: undefined,
  errors: undefined,
  parentId: undefined,
  parentIndex: undefined,
  subParentId: undefined,
  subParentIndex: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  stateKey: undefined,
  toolbarPlaceholder: undefined,
  fieldClasses: undefined,
  savingFormat: GlobalSavingDateFormat,
  hijriSavingFormat: GlobalSavingHijriDateFormat,
  displayFormat: GlobalSavingDateFormat,
  hijriDisplayFormat: GlobalSavingHijriDateFormat,
  isHijri: false,
  mask: '____-__-__',
  hijriMask: '____-__-__',
  disableMaskedInput: false,
  disableFuture: false,
  disablePast: false,
  disabled: false,
  inline: false,
  isRequired: false,
  views: undefined,
};

export default memo(DatePickerComponent);
