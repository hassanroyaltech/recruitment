/* eslint-disable */
import React, { memo, useCallback, useState, useEffect } from 'react';
import Chip from '@mui/material/Chip';
import ButtonBase from '@mui/material/ButtonBase';
import { Inputs } from 'components/Inputs/Inputs.Component';
import PropTypes from 'prop-types';
import Autocomplete from '@mui/material/Autocomplete';
import './Autocomplete.Style.scss';
import { useTranslation } from 'react-i18next';

export const AutocompleteComponent = memo(
  ({
    onChange,
    data,
    getOptionLabel,
    defaultValue,
    labelClasses,
    isLoading,
    value,
    inputValue,
    onInputChange,
    disabledOptions,
    chipsLabel,
    chipsDisabled,
    translationPath,
    parentTranslationPath,
    labelValue,
    inputPlaceholder,
    idRef,
    wrapperClasses,
    autocompleteClasses,
    variant,
    multiple,
    isDisabled,
    searchClicked,
    isRequired,
    inputClasses,
    inputWrapperClasses,
    helperText,
    error,
    inputLabel,
    renderOption,
    withLoader,
    buttonOptions,
    disableClearable,
    renderTags,
    isSubmitted,
    paddingReverse,
    inputStartAdornment,
    beforeIconClasses,
    afterIconClasses,
    overInputIcon,
    themeClass,
    autocompleteThemeClass,
    inputThemeClass,
    popperClasses,
    popperThemeClasses,
    withBackdrop,
    dropdownIcon,
    dropdownCloseIcon,
    getOptionSelected,
    onInputKeyUp,
    tagValues,
    filterOptions,
    limitTags,
    groupBy,
    inputEndAdornment,
    startAdornment,
    endAdornment,
    noOptionsText,
    autoComplete,
    maxNumber,
    maxLabel,
    tabIndex,
    maxLabelClasses,
    withExternalChips,
    isWithActiveChip,
    isReleaseActiveChip,
    onScroll,
    onScrollEnd,
    onOpen,
    onClose,
    paperComponent,
    popperComponent,
    onExternalChipClicked,
    autoHighlight,
    isFreeSolo,
    inputName,
    inlineLabel,
    inputLabelComponent,
    loadingText,
    closeText,
    openText,
    clearText,
    inlineLabelClasses,
    scrollPosition,
    listId,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const [isFocusedInput, setIsFocusedInput] = useState(false);
    const [activeChip, setActiveChip] = useState(null);
    const externalChipDeleteHandler = useCallback(
      (index) => () => {
        const localValues = [...(value || [])];
        localValues.splice(index, 1);
        if (onChange) onChange(null, localValues);
      },
      [onChange, value],
    );
    const externalChipClickHandler = useCallback(
      (option, index) => () => {
        if (isWithActiveChip)
          setActiveChip((currentIndex) =>
            isReleaseActiveChip && currentIndex === index ? null : index,
          );
        onExternalChipClicked({ option, index });
      },
      [isReleaseActiveChip, isWithActiveChip, onExternalChipClicked],
    );

    const onScrollEndHandler = useCallback(
      (event) => {
        const targetEvent = event.currentTarget;
        if (
          targetEvent.scrollTop + targetEvent.clientHeight >=
          targetEvent.scrollHeight - 1
        )
          onScrollEnd();
      },
      [onScrollEnd],
    );

    useEffect(() => {
      if (listId) {
        const listElement = document.getElementById(listId);
        if (scrollPosition && listElement) {
          listElement.scrollTop = scrollPosition;
        }
      }
    }, [scrollPosition, listId]);

    return (
      <div
        className={`autocomplete-wrapper ${wrapperClasses} ${
          themeClass || autocompleteThemeClass || ''
        }${(multiple && ' is-multiple') || ''}${
          (startAdornment && ' with-start-adornment') || ''
        }${(endAdornment && ' with-end-andorment') || ''}${
          (isDisabled && ' is-disabled') || ''
        }${(isFocusedInput && ' is-focused-input') || ''}`}
      >
        <div className="autocomplete-contents-wrapper">
          {searchClicked && (
            <ButtonBase
              className="btns-icon theme-transparent mx-2"
              onClick={searchClicked}
            >
              <span className="mdi mdi-magnify" />
            </ButtonBase>
          )}
          {(startAdornment && (
            <div className="start-adornment-wrapper">
              {(typeof startAdornment === 'string' &&
                t(`${translationPath}${startAdornment}`)) ||
                startAdornment}
            </div>
          )) ||
            undefined}
          <Autocomplete
            autoHighlight={autoHighlight}
            multiple={multiple}
            disableClearable={disableClearable}
            id={idRef}
            onOpen={onOpen}
            onClose={onClose}
            limitTags={limitTags}
            className={`autocomplete ${autocompleteClasses}`}
            options={data}
            freeSolo={isFreeSolo}
            classes={{
              popper: `autocomplete-popper-wrapper ${popperClasses} ${
                themeClass || popperThemeClasses || ''
              }${(withBackdrop && ' with-backdrop') || ''}${
                (isFreeSolo && ' is-free-solo') || ''
              }`,
            }}
            PaperComponent={paperComponent}
            PopperComponent={popperComponent}
            groupBy={groupBy}
            onKeyUp={onInputKeyUp}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            defaultValue={defaultValue}
            isOptionEqualToValue={getOptionSelected}
            loading={isLoading}
            value={value}
            onInputChange={onInputChange}
            onChange={onChange}
            getOptionDisabled={disabledOptions}
            disabled={
              isDisabled ||
              (multiple &&
                (maxNumber || maxNumber === 0) &&
                value.length >= maxNumber)
            }
            filterOptions={filterOptions}
            noOptionsText={noOptionsText && t(`Shared:${noOptionsText}`)}
            loadingText={loadingText && t(`Shared:${loadingText}`)}
            closeText={closeText && t(`Shared:${closeText}`)}
            clearText={clearText && t(`Shared:${clearText}`)}
            openText={openText && t(`Shared:${openText}`)}
            clearIcon={
              <span className={`${dropdownCloseIcon} dropdown-close-icon-wrapper`} />
            }
            popupIcon={<span className={`${dropdownIcon} dropdown-icon-wrapper`} />}
            ListboxProps={{
              ...(listId && { id: listId }),
              onScroll: onScroll || (onScrollEnd && onScrollEndHandler),
            }}
            renderTags={
              renderTags ||
              (withExternalChips && (() => null)) ||
              ((tagValue, getTagProps) => (
                <div className="internal-chips-wrapper">
                  {(tagValues || tagValue).map((option, index) => (
                    <Chip
                      className="autocomplete-chip"
                      label={chipsLabel && chipsLabel(option, index)}
                      {...getTagProps({ index })}
                      disabled={chipsDisabled(option, index)}
                      key={`autocompleteChipRef${index + 1}`}
                    />
                  ))}
                </div>
              )) ||
              undefined
            }
            renderInput={(params) => (
              <Inputs
                idRef={idRef}
                label={inputLabel}
                labelValue={labelValue}
                value={inputValue}
                labelClasses={labelClasses}
                autoCompleteParams={params}
                inputPlaceholder={inputPlaceholder}
                variant={variant}
                isSubmitted={isSubmitted}
                paddingReverse={paddingReverse}
                maxNumber={maxNumber}
                maxLabel={maxLabel}
                maxLabelClasses={maxLabelClasses}
                isRequired={isRequired}
                tabIndex={tabIndex}
                wrapperClasses={inputWrapperClasses}
                fieldClasses={inputClasses}
                labelComponent={inputLabelComponent}
                startAdornment={inputStartAdornment}
                endAdornment={inputEndAdornment}
                name={inputName}
                beforeIconClasses={beforeIconClasses}
                afterIconClasses={afterIconClasses}
                overInputIcon={overInputIcon}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                buttonOptions={buttonOptions}
                themeClass={themeClass || inputThemeClass}
                isLoading={isLoading}
                withLoader={withLoader}
                isDisabled={isDisabled}
                error={error}
                helperText={helperText}
                autoComplete={autoComplete}
                inlineLabel={inlineLabel}
                inlineLabelClasses={inlineLabelClasses}
                onInputFocus={() => setIsFocusedInput(true)}
                onInputBlur={() => setIsFocusedInput(false)}
              />
            )}
          />
          {(endAdornment && (
            <div className="end-adornment-wrapper">
              {(typeof endAdornment === 'string' &&
                t(`${translationPath}${endAdornment}`)) ||
                endAdornment}
            </div>
          )) ||
            undefined}
        </div>
        {withExternalChips && multiple && value.length > 0 && (
          <>
            <div className="external-autocomplete-chips-wrapper">
              {value.map((option, index) => (
                <Chip
                  className={`external-autocomplete-chip${
                    (index === activeChip && ' active-chip') || ''
                  }`}
                  key={`externalAutocompleteChipRef${idRef}${index + 1}`}
                  label={chipsLabel && chipsLabel(option, index)}
                  deleteIcon={
                    <ButtonBase
                      disabled={isLoading || disableClearable}
                      className="btns-icon theme-transparent chip-delete-icon-btn"
                    >
                      <span className="fas fa-times chip-delete-icon" />
                    </ButtonBase>
                  }
                  onClick={
                    onExternalChipClicked && externalChipClickHandler(option, index)
                  }
                  disabled={isDisabled || chipsDisabled(option, index)}
                  onDelete={externalChipDeleteHandler(index)}
                />
              ))}
            </div>
            {value.length > 0 && (
              <div
                className={`separator-h ${(value.length === 0 && 'mt-3') || ''}`}
              />
            )}
          </>
        )}
      </div>
    );
  },
);

AutocompleteComponent.displayName = 'AutocompleteComponent';

AutocompleteComponent.propTypes = {
  onChange: PropTypes.func.isRequired,
  data: PropTypes.instanceOf(Array).isRequired,
  getOptionLabel: PropTypes.func.isRequired,
  tagValues: PropTypes.instanceOf(Array),
  disableClearable: PropTypes.bool,
  chipsLabel: PropTypes.func,
  renderTags: PropTypes.func,
  getOptionSelected: PropTypes.func,
  groupBy: PropTypes.func,
  renderOption: PropTypes.func,
  searchClicked: PropTypes.func,
  onInputKeyUp: PropTypes.func,
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.bool,
    PropTypes.string,
    PropTypes.number,
  ]),
  defaultValue: PropTypes.instanceOf(Array),
  isLoading: PropTypes.bool,
  multiple: PropTypes.bool,
  inputValue: PropTypes.string,
  onInputChange: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollEnd: PropTypes.func,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  filterOptions: PropTypes.func,
  disabledOptions: PropTypes.func,
  chipsDisabled: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  labelValue: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  idRef: PropTypes.string,
  wrapperClasses: PropTypes.string,
  autocompleteClasses: PropTypes.string,
  variant: PropTypes.string,
  inputWrapperClasses: PropTypes.string,
  noOptionsText: PropTypes.string,
  inputClasses: PropTypes.string,
  helperText: PropTypes.string,
  inputLabel: PropTypes.string,
  autoComplete: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRequired: PropTypes.bool,
  error: PropTypes.bool,
  withLoader: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  limitTags: PropTypes.number,
  paddingReverse: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  inputStartAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  inputEndAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  endAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  startAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  paperComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  popperComponent: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  beforeIconClasses: PropTypes.string,
  afterIconClasses: PropTypes.string,
  overInputIcon: PropTypes.string,
  themeClass: PropTypes.oneOf([
    'theme-primary',
    'theme-default',
    'theme-solid',
    'theme-solid-v2',
    'theme-solid-v3',
    'theme-dark',
    'theme-underline',
    'theme-outline',
    'theme-underline-light',
    'theme-default-dark',
    'theme-transparent',
  ]),
  autocompleteThemeClass: PropTypes.string,
  inputThemeClass: PropTypes.string,
  inputName: PropTypes.string,
  popperClasses: PropTypes.string,
  popperThemeClasses: PropTypes.string,
  dropdownIcon: PropTypes.string,
  dropdownCloseIcon: PropTypes.string,
  withBackdrop: PropTypes.bool,
  maxNumber: PropTypes.number,
  maxLabel: PropTypes.string,
  maxLabelClasses: PropTypes.string,
  labelClasses: PropTypes.string,
  inlineLabel: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
  withExternalChips: PropTypes.bool,
  isWithActiveChip: PropTypes.bool,
  isReleaseActiveChip: PropTypes.bool,
  onExternalChipClicked: PropTypes.func,
  buttonOptions: PropTypes.shape({
    className: PropTypes.string,
    iconClasses: PropTypes.string,
    onActionClicked: PropTypes.func,
    isDisabled: PropTypes.bool,
    isRequired: PropTypes.bool,
  }),
  autoHighlight: PropTypes.bool,
  inputLabelComponent: PropTypes.node,
  isFreeSolo: PropTypes.bool,
};

AutocompleteComponent.defaultProps = {
  defaultValue: undefined,
  value: undefined,
  tagValues: undefined,
  isLoading: false,
  inputValue: undefined,
  getOptionSelected: undefined,
  labelClasses: undefined,
  onInputChange: undefined,
  onScroll: undefined,
  onScrollEnd: undefined,
  onOpen: undefined,
  onClose: undefined,
  paperComponent: undefined,
  popperComponent: undefined,
  groupBy: undefined,
  limitTags: undefined,
  inputName: undefined,
  renderOption: undefined,
  renderTags: undefined,
  searchClicked: undefined,
  disabledOptions: undefined,
  tabIndex: undefined,
  loadingText: 'loading',
  closeText: 'close',
  openText: 'open',
  clearText: 'clear',
  noOptionsText: 'no-options',
  chipsDisabled: () => false,
  parentTranslationPath: '',
  translationPath: '',
  labelValue: null,
  inputPlaceholder: null,
  idRef: 'autocompleteRef',
  wrapperClasses: '',
  autocompleteClasses: '',
  variant: 'standard',
  inputWrapperClasses: undefined,
  dropdownIcon: 'fas fa-chevron-down',
  dropdownCloseIcon: 'fas fa-times',
  inputClasses: undefined,
  popperClasses: '',
  popperThemeClasses: undefined,
  onInputKeyUp: undefined,
  withBackdrop: false,
  chipsLabel: undefined,
  helperText: null,
  inputLabel: null,
  multiple: false,
  isDisabled: false,
  isRequired: false,
  error: false,
  withLoader: true,
  buttonOptions: null,
  disableClearable: false,
  isSubmitted: false,
  paddingReverse: undefined,
  inputStartAdornment: undefined,
  inputEndAdornment: undefined,
  startAdornment: undefined,
  endAdornment: undefined,
  beforeIconClasses: undefined,
  afterIconClasses: undefined,
  overInputIcon: undefined,
  themeClass: undefined,
  autocompleteThemeClass: undefined,
  autoComplete: 'new-password',
  inputThemeClass: undefined,
  maxNumber: undefined,
  maxLabelClasses: undefined,
  maxLabel: undefined,
  filterOptions: undefined,
  withExternalChips: false,
  isWithActiveChip: false,
  isReleaseActiveChip: false,
  onExternalChipClicked: undefined,
  autoHighlight: undefined,
  isFreeSolo: undefined,
  inlineLabel: undefined,
  inlineLabelClasses: undefined,
};
