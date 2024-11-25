/* eslint-disable max-len */

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 */
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { DynamicFormTypesEnum, DynamicFormHelpersEnum } from '../../../../enums';
import { GetAllItemsByHelperDynamic } from '../../../../services';
import { AutocompleteComponent } from '../../../../components';
import './SharedControls.Style.scss';

export const SharedAutocompleteControl = memo(
  ({
    helper_name,
    initValues,
    isWithPagination,
    editValue,
    initValuesKey,
    initValuesTitle,
    onValueChanged,
    idRef,
    stateKey,
    parentId,
    subParentId,
    parentIndex,
    subParentIndex,
    subSubParentId,
    subSubParentIndex,
    max,
    tabIndex,
    title,
    placeholder,
    errorPath,
    type,
    errors,
    isDisabled,
    isGlobalLoading,
    isSubmitted,
    isRequired,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    isEntireObject,
    disableClearable,
    getOptionLabel,
    labelValue,
    parentTranslationPath,
    translationPath,
    isFreeSolo,
    isStringArray,
    sharedClassesWrapper,
    inlineLabel,
    inlineLabelClasses,
    themeClass,
    inputStartAdornment,
    inputEndAdornment,
    inputName,
    tagValues,
    isWithoutExternalChips,
    defaultValue,
    renderOption,
    optionComponent,
    inputLabelComponent,
    disabledOptions,
  }) => {
    const isMountedRef = useRef(true);
    const [itemEnum] = useState(DynamicFormHelpersEnum[helper_name]);
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState(() => []);
    const dataRef = useRef([]);
    const isOpenAutocompleteRef = useRef(null);
    const [filter, setFilter] = useState({
      page: 0,
      pageSize: 10,
    });
    const [localEditValue, setLocalEditValue] = useState(
      () => (type === DynamicFormTypesEnum.array.key && []) || null,
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to get data from helper api by current helper name
     */
    const getAllItemsByHelper = useCallback(async () => {
      if (!itemEnum) {
        // eslint-disable-next-line no-console
        console.log('not found', helper_name);
        return;
      }
      setIsLoading(true);
      const response = await GetAllItemsByHelperDynamic(
        itemEnum.apiPath,
        itemEnum.apiProps,
      );
      if (!isMountedRef.current) return;
      if (response && response.status === 200) {
        dataRef.current = response.data[itemEnum.dataPath.results];
        setData(response.data[itemEnum.dataPath.results]);
      } else {
        dataRef.current = [];
        setData([]);
      }
      setIsLoading(false);
    }, [helper_name, itemEnum]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init selected data for array autocomplete
     */
    const getArrayEditInit = useCallback(
      async (isFromUseEffect = false) => {
        if (!isFromUseEffect) return;
        if (editValue && editValue.length > 0 && dataRef.current.length > 0) {
          const toAddData = [];
          editValue.map((value) => {
            const currentItem = dataRef.current.find(
              (item) =>
                item[(itemEnum && itemEnum.dataPath.uuid) || initValuesKey]
                === value,
            );
            if (currentItem) toAddData.push(currentItem);
            return undefined;
          });
          if (toAddData.length !== editValue.length && onValueChanged)
            onValueChanged({
              parentId,
              parentIndex,
              subParentId,
              subParentIndex,
              subSubParentId,
              subSubParentIndex,
              id: stateKey,
              value:
                (isEntireObject && toAddData)
                || toAddData.map((item) => item[initValuesKey]),
            });
          setLocalEditValue(toAddData);
        }
      },
      [
        editValue,
        onValueChanged,
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        subSubParentId,
        subSubParentIndex,
        stateKey,
        isEntireObject,
        itemEnum,
        initValuesKey,
      ],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init selected data for select autocomplete
     */
    const getSelectEditInit = useCallback(
      async (isFromUseEffect = false) => {
        if (!isFromUseEffect) return;
        if (
          (editValue || editValue === 0 || editValue === false)
          && dataRef.current.length > 0
          && (!helper_name || (itemEnum && itemEnum.dataPath))
        ) {
          const currentItem = dataRef.current.find(
            (item) =>
              (helper_name && item[itemEnum.dataPath.uuid] === editValue)
              || item.key === editValue,
          );
          if (currentItem) setLocalEditValue(currentItem);
          else if (onValueChanged)
            onValueChanged({
              parentId,
              parentIndex,
              subParentId,
              subParentIndex,
              subSubParentId,
              subSubParentIndex,
              id: stateKey,
              value: null,
            });
        }
      },
      [
        editValue,
        helper_name,
        itemEnum,
        onValueChanged,
        parentId,
        parentIndex,
        subParentId,
        subParentIndex,
        subSubParentId,
        subSubParentIndex,
        stateKey,
      ],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle the pagination for the initValues if they are large
     * number of items and want to be front-end paginated
     */
    const getPaginatedDataHandler = useMemo(
      () =>
        (currentData = []) => {
          const localData = [...currentData];
          if (filter.page === 0)
            localData.slice(
              initValues.length <= filter.pageSize
                ? 0
                : filter.page * filter.pageSize,
              initValues.length <= filter.pageSize
                ? filter.pageSize
                : filter.page * filter.pageSize + filter.pageSize,
            );
          else {
            let newItems = initValues.slice(
              initValues.length <= filter.pageSize
                ? 0
                : filter.page * filter.pageSize,
              initValues.length <= filter.pageSize
                ? filter.pageSize
                : filter.page * filter.pageSize + filter.pageSize,
            );
            // to make sure the new items not exist in the array already because of selected edit values
            // can be existing in the first page also in the new Array
            if (
              newItems.length > 0
              && newItems.some((item) =>
                localData.some((element) => element.key === item[initValuesKey]),
              )
            )
              newItems = newItems.filter(
                (item) =>
                  !localData.some((element) => element.key === item[initValuesKey]),
              );
            localData.push(...newItems);
          }

          if (
            filter.page === 0
            && editValue
            && (type !== DynamicFormTypesEnum.array.key
              || (type === DynamicFormTypesEnum.array.key && editValue.length > 0))
          )
            if (
              !localData.some(
                (item) =>
                  (type === DynamicFormTypesEnum.array.key
                    && editValue.includes(item.key))
                  || (type !== DynamicFormTypesEnum.array.key
                    && item.key === editValue),
              )
            )
              if (type === DynamicFormTypesEnum.array.key) {
                const missingSelectedItems = initValues.filter(
                  (item) =>
                    editValue.includes(item[initValuesKey])
                    && !localData.some((item) => editValue.includes(item.key)),
                );
                localData.push(...missingSelectedItems);
              } else {
                const missingSelectedItem = initValues.find(
                  (item) => editValue === item[initValuesKey],
                );
                if (missingSelectedItem) localData.push(missingSelectedItem);
              }
          return localData;
        },
      [editValue, filter.page, filter.pageSize, initValues, initValuesKey, type],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init data for select autocomplete if data is from
     * external source
     */
    const getSelectDataInit = useCallback(
      (isFromUseEffect = false) => {
        if (
          isFromUseEffect
          && !helper_name
          && initValues
          && Array.isArray(initValues)
        ) {
          let localData
            = (!isStringArray
              && initValues.map((item) => ({
                ...item,
                key: item[initValuesKey],
                title: item[initValuesTitle],
              })))
            || initValues;
          if (isWithPagination) localData = getPaginatedDataHandler(localData);
          dataRef.current = localData;
          setLocalEditValue((type === DynamicFormTypesEnum.array.key && []) || null);
          setData(localData);
        }
      },
      [
        getPaginatedDataHandler,
        helper_name,
        initValues,
        initValuesKey,
        initValuesTitle,
        isStringArray,
        isWithPagination,
        type,
      ],
    );

    // to init select data if data came from external source
    useEffect(() => {
      if (type === DynamicFormTypesEnum.select.key || initValues)
        getSelectDataInit(true);
    }, [type, getSelectDataInit, initValues, editValue]);

    // to get data by helper name on init
    useEffect(() => {
      if (helper_name) getAllItemsByHelper();
    }, [helper_name, getAllItemsByHelper]);

    // to init array autocomplete edit value
    useEffect(() => {
      if (type === DynamicFormTypesEnum.array.key && !isFreeSolo && !isStringArray)
        getArrayEditInit(true);
    }, [type, data, editValue, getArrayEditInit, isFreeSolo, isStringArray]);

    useEffect(() => {
      if (isFreeSolo || isStringArray)
        setLocalEditValue(
          editValue || (type === DynamicFormTypesEnum.array.key && []) || null,
        );
    }, [type, editValue, isFreeSolo, isStringArray]);

    // to init select autocomplete edit value
    useEffect(() => {
      if (type === DynamicFormTypesEnum.select.key && !isStringArray)
        getSelectEditInit(true);
    }, [type, data, editValue, getSelectEditInit, isStringArray]);

    useEffect(() => {
      dataRef.current = data;
    }, [data]);

    useEffect(() => {
      if (dataRef.current.length > 0) dataRef.current = [];
    }, [
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      subSubParentId,
      subSubParentIndex,
      stateKey,
      isEntireObject,
      initValuesKey,
    ]);

    // this is to load the data when its paginated and the page changed
    useEffect(() => {
      if (isWithPagination) setData((items) => getPaginatedDataHandler(items));
    }, [filter, getPaginatedDataHandler, isWithPagination]);

    // to prevent memory leak if component destroyed before time finish or API finish
    useEffect(
      () => () => {
        isMountedRef.current = false;
      },
      [],
    );
    return (
      <div
        className={`${
          (type === DynamicFormTypesEnum.array.key
            && 'shared-autocomplete-wrapper')
          || 'shared-select-wrapper'
        }${(isFullWidth && ' is-full-width') || ''}${
          (sharedClassesWrapper && ` ${sharedClassesWrapper}`) || ''
        }${(isTwoThirdsWidth && ' is-two-thirds-width') || ''}${
          (isHalfWidth && ' is-half-width') || ''
        }${(isQuarterWidth && ' is-quarter-width') || ''} shared-control-wrapper`}
      >
        <AutocompleteComponent
          inputEndAdornment={inputEndAdornment}
          inputStartAdornment={
            (inputStartAdornment
              && inputStartAdornment({ selectedOption: localEditValue }))
            || undefined
          }
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
            subParentId || ''
          }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
            subParentIndex || 0
          }-${stateKey}`}
          getOptionLabel={
            getOptionLabel
            || (!isFreeSolo
              && !isStringArray
              && ((option) =>
                (itemEnum && option[itemEnum.dataPath.title])
                || option.title
                || 'N/A'))
            || ((isFreeSolo || isStringArray) && ((option) => option))
            || undefined
          }
          inputLabelComponent={
            (inputLabelComponent
              && inputLabelComponent({ selectedOption: localEditValue }))
            || undefined
          }
          renderOption={
            (optionComponent
              && ((renderProps, option) => (
                <li {...renderProps} key={option.key}>
                  {optionComponent({ renderProps, option })}
                </li>
              )))
            || renderOption
            || ((renderProps, option) => (
              <li {...renderProps} key={option.key}>
                {(getOptionLabel && getOptionLabel(option)) || option.title}
              </li>
            ))
          }
          chipsLabel={
            getOptionLabel
            || (!isFreeSolo
              && !isStringArray
              && ((option) =>
                (itemEnum && option[itemEnum.dataPath.title])
                || option.title
                || 'N/A'))
            || ((option) => option)
          }
          value={localEditValue}
          getOptionSelected={
            (!isFreeSolo
              && !isStringArray
              && ((option, value) =>
                (!helper_name && initValues && option?.key === value?.key)
                || (itemEnum
                  && option?.[itemEnum.dataPath.uuid]
                    === value?.[itemEnum.dataPath.uuid])))
            || ((option, value) => value === option)
          }
          data={data}
          inputName={inputName}
          disableClearable={disableClearable}
          inputLabel={title}
          multiple={type === DynamicFormTypesEnum.array.key}
          maxNumber={
            (max && type === DynamicFormTypesEnum.array.key && max) || undefined
          }
          isDisabled={
            isDisabled
            || (max
              && type === DynamicFormTypesEnum.array.key
              && localEditValue.length >= max)
            || undefined
          }
          labelValue={labelValue}
          inlineLabel={inlineLabel}
          inlineLabelClasses={inlineLabelClasses}
          error={
            (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
          }
          isSubmitted={isSubmitted}
          helperText={
            (errorPath && errors[errorPath] && errors[errorPath].message)
            || undefined
          }
          onOpen={() => {
            isOpenAutocompleteRef.current = true;
            if (isWithPagination)
              setFilter(
                (items) => (items.page !== 0 && { ...items, page: 0 }) || items,
              );
          }}
          onClose={() => {
            isOpenAutocompleteRef.current = false;
          }}
          onScrollEnd={
            (isWithPagination
              && (() => {
                if (data.length !== initValues.length)
                  setFilter((items) => ({ ...items, page: items.page + 1 }));
              }))
            || undefined
          }
          inputPlaceholder={placeholder}
          isLoading={isGlobalLoading || isLoading}
          themeClass={themeClass}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isRequired={isRequired}
          tabIndex={tabIndex}
          disabledOptions={disabledOptions}
          withExternalChips={
            type === DynamicFormTypesEnum.array.key && !isWithoutExternalChips
          }
          isFreeSolo={isFreeSolo}
          onChange={(e, newValue) => {
            setLocalEditValue(newValue);
            let savingValue = type === DynamicFormTypesEnum.select.key ? null : [];

            if (newValue && !isStringArray && !isFreeSolo && !isEntireObject) {
              if (type === DynamicFormTypesEnum.select.key)
                savingValue = helper_name
                  ? newValue[itemEnum.dataPath.uuid]
                  : newValue.key;

              if (type === DynamicFormTypesEnum.array.key)
                savingValue = newValue.map(
                  (item) =>
                    (!initValues && item[itemEnum.dataPath.uuid])
                    || item[initValuesKey],
                );
            } else if (newValue) savingValue = newValue;

            if (onValueChanged)
              onValueChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                subSubParentId,
                subSubParentIndex,
                id: stateKey,
                value: savingValue,
              });
          }}
          tagValues={tagValues}
          defaultValue={defaultValue}
        />
        {type === DynamicFormTypesEnum.array.key && !isWithoutExternalChips && (
          <div
            className={`separator-h ${
              (localEditValue.length === 0 && 'mt-3') || ''
            }`}
          />
        )}
      </div>
    );
  },
);

SharedAutocompleteControl.displayName = 'SharedAutocompleteControl';

SharedAutocompleteControl.propTypes = {
  errors: PropTypes.instanceOf(Object),
  type: PropTypes.oneOf(Object.values(DynamicFormTypesEnum).map((item) => item.key)),
  onValueChanged: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  title: PropTypes.string,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  max: PropTypes.number,
  tabIndex: PropTypes.number,
  errorPath: PropTypes.string,
  helper_name: PropTypes.oneOf(
    Object.values(DynamicFormHelpersEnum).map((item) => item.key),
  ),
  initValues: PropTypes.instanceOf(Array),
  editValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.string,
    PropTypes.bool,
    PropTypes.number,
  ]),
  initValuesKey: PropTypes.string,
  initValuesTitle: PropTypes.string,
  isSubmitted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isGlobalLoading: PropTypes.bool,
  isRequired: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  isEntireObject: PropTypes.bool,
  isWithPagination: PropTypes.bool,
  disableClearable: PropTypes.bool,
  isFreeSolo: PropTypes.bool,
  isStringArray: PropTypes.bool,
  idRef: PropTypes.string,
  labelValue: PropTypes.string,
  sharedClassesWrapper: PropTypes.string,
  getOptionLabel: PropTypes.func,
  inlineLabel: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
  inputName: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  themeClass: PropTypes.string,
  tagValues: PropTypes.instanceOf(Array),
  isWithoutExternalChips: PropTypes.bool,
  inputEndAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  renderOption: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  disabledOptions: PropTypes.func,
  optionComponent: PropTypes.func,
  inputLabelComponent: PropTypes.func,
  inputStartAdornment: PropTypes.func,
  defaultValue: PropTypes.instanceOf(Array),
};

SharedAutocompleteControl.defaultProps = {
  idRef: 'SharedAutocompleteControl',
  editValue: null,
  title: undefined,
  type: DynamicFormTypesEnum.select.key,
  initValues: undefined,
  errors: {},
  isSubmitted: undefined,
  isDisabled: undefined,
  isGlobalLoading: undefined,
  isRequired: undefined,
  helper_name: undefined,
  tabIndex: undefined,
  initValuesKey: 'key',
  initValuesTitle: 'value',
  parentId: undefined,
  subParentId: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  max: undefined,
  errorPath: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  isQuarterWidth: undefined,
  isFreeSolo: undefined,
  isStringArray: undefined,
  isEntireObject: undefined,
  disableClearable: undefined,
  getOptionLabel: undefined,
  labelValue: undefined,
  sharedClassesWrapper: undefined,
  inlineLabel: undefined,
  inlineLabelClasses: undefined,
  inputName: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  themeClass: 'theme-solid',
  tagValues: undefined,
  isWithoutExternalChips: false,
  inputEndAdornment: undefined,
  renderOption: undefined,
  disabledOptions: undefined,
  defaultValue: undefined,
};
