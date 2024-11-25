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
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import Paper from '@mui/material/Paper';
import { AutocompleteComponent, LoaderComponent } from '../../../../components';
import { getDataFromObject, GlobalSearchDelay } from '../../../../helpers';
import { DynamicFormTypesEnum } from '../../../../enums';
const listId = Date.now();
export const SharedAPIAutocompleteControl = memo(
  ({
    getDataAPI,
    editValue,
    extraProps,
    dataKey,
    searchKey,
    titleKey,
    uniqueKey,
    savingKey,
    onValueChanged,
    onInputChange,
    inputValue,
    idRef,
    stateKey,
    parentId,
    subParentId,
    parentIndex,
    subParentIndex,
    subSubParentId,
    subSubParentIndex,
    max,
    title,
    placeholder,
    errorPath,
    isRequired,
    isLoading,
    type,
    errors,
    isSubmitted,
    isDisabled,
    isEntireObject,
    isFullWidth,
    isTwoThirdsWidth,
    isHalfWidth,
    isQuarterWidth,
    getOptionLabel,
    getItemByIdAPI,
    getByIdCompanyUUID,
    getItemByIdUniqueKey,
    byIdDataKey,
    getDisabledOptions,
    parentTranslationPath,
    translationPath,
    labelValue,
    tabIndex,
    isDataObject,
    isDataArrayOfStrings,
    startAdornment,
    endAdornment,
    inputStartAdornment,
    inputEndAdornment,
    wrapperClasses,
    getAPIProperties,
    inlineLabel,
    inlineLabelClasses,
    controlWrapperClasses,
    getReturnedData,
    getOptionSelected,
    disableClearable,
    renderOption,
    isForceToReload,
    autocompleteThemeClass,
    onExternalChipClicked,
    filterOptions,
    inputLabelComponent,
    withExternalChips,
    optionComponent,
    isIgnoreResetTextSearch,
    initialTextSearchValue,
  }) => {
    const { t } = useTranslation('Shared');
    const isMountedRef = useRef(true);
    const changeReasonIsIndexRef = useRef(false);
    const localEditValueRef = useRef(null);
    const localExtraPropsRef = useRef(extraProps);
    const isOpenAutocomplete = useRef(false);
    const [isLocalLoading, setIsLocalLoading] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0);
    const [localType, setLocalType] = useState(type);
    const isLoadingRef = useRef(false);
    const [data, setData] = useState(() => ({
      results: [],
      totalCount: 0,
    }));
    const loadedData = useRef([]);
    const dataRef = useRef({
      results: [],
      totalCount: 0,
    });
    // eslint-disable-next-line max-len
    const isFirstLoadRef = useRef(true);
    const [localEditValue, setLocalEditValue] = useState(() =>
      type === DynamicFormTypesEnum.select.key ? null : [],
    );
    const [search, setSearch] = useState(initialTextSearchValue || '');
    const [filter, setFilter] = useState({
      page: 1,
      limit: 10,
    });
    const searchTimerRef = useRef(null);
    const searchHandler = (event) => {
      if (event?.keyCode === 40) return;
      const { value } = event.target;
      if (!searchKey) return;

      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        changeReasonIsIndexRef.current = false;
        setSearch(value);
        setFilter((items) => ({ ...items, page: 1 }));
      }, GlobalSearchDelay);
    };

    /**
     * @param sourceOfChange 1 for call on open the list, 2 for call on change the extraProps,
     * 3 for call on change the edit (first load)
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to get autocomplete data on search or init
     */
    const getAllData = useCallback(
      async (sourceOfChange) => {
        if (!searchKey && loadedData.current.length > 0) return;
        if (sourceOfChange === 2 && !isOpenAutocomplete.current)
          setData({
            results: [],
            totalCount: 0,
          });

        if (
          !localEditValueRef.current
          && !isOpenAutocomplete.current
          && !getReturnedData
        )
          return;
        let listElement = document.getElementById(listId);
        let scrollVal = listElement?.scrollTop || 0;
        setIsLocalLoading(true);
        isLoadingRef.current = true;
        setScrollPosition(scrollVal - 0.002);
        if (listElement) listElement.scrollTop = scrollVal;
        const tempExtraProps = JSON.stringify(localExtraPropsRef.current || {});
        const response = await getDataAPI(
          (getAPIProperties
            && getAPIProperties({
              apiFilter: filter,
              apiSearch: search,
              apiExtraProps: localExtraPropsRef.current,
            })) || {
            ...((searchKey && filter) || {}),
            ...((searchKey && {
              [searchKey]: search,
            })
              || {}),
            ...((localExtraPropsRef.current && {
              ...localExtraPropsRef.current,
              with_than:
                filter.page > 1 ? undefined : localExtraPropsRef.current?.with_than,
            })
              || {}),
          },
        );
        if (!isMountedRef.current) return;
        listElement = document.getElementById(listId);
        scrollVal = listElement?.scrollTop || 0;
        // setScrollPosition(scrollVal)
        isFirstLoadRef.current = false;
        isLoadingRef.current = false;
        setIsLocalLoading(false);
        // setScrollPosition(scrollVal)
        if (tempExtraProps !== JSON.stringify(localExtraPropsRef.current || {}))
          return;
        // if (getReturnedData && isFirstLoadRef.current) setFilter((items)=> ({ ...items, page: 1 }));
        if (response && (response.status === 200 || response.status === 202)) {
          loadedData.current.push(
            ...((isDataObject
              && Object.entries(response.data.results).map(([key, value]) => ({
                [uniqueKey]: key,
                [titleKey]: value,
              })))
              || (isDataArrayOfStrings
                && (
                  (dataKey
                    && getDataFromObject(response.data.results, dataKey, true))
                  || response.data.results
                ).map((value) => ({
                  [uniqueKey]: value,
                  [titleKey]: value,
                })))
              || (dataKey && getDataFromObject(response.data.results, dataKey, true))
              || response.data.results
              || []),
          );
          if (getReturnedData) getReturnedData(response.data.results);
          if (filter.page === 1)
            setData({
              results:
                (isDataObject
                  && Object.entries(response.data.results).map(([key, value]) => ({
                    [uniqueKey]: key,
                    [titleKey]: value,
                  })))
                || (isDataArrayOfStrings
                  && (
                    (dataKey
                      && getDataFromObject(response.data.results, dataKey, true))
                    || response.data.results
                  ).map((value) => ({
                    [uniqueKey]: value,
                    [titleKey]: value,
                  })))
                || (dataKey
                  && getDataFromObject(response.data.results, dataKey, true))
                || response.data.results
                || [],
              totalCount:
                (response.data.results && response.data.results.total && response.data.results.total)
                || (response.data.paginate && response.data.paginate.total)
                || (
                  (isDataObject && Object.values(response.data.results))
                  || response.data.results
                  || []
                ).length
                || (
                  (dataKey
                    && getDataFromObject(response.data.results, dataKey, true))
                  || response.data.results
                  || []
                ).length,
            });
          else
            setData((items) => ({
              ...items,
              results: [
                ...items.results,
                ...((isDataObject
                  && Object.entries(response.data.results).map(([key, value]) => ({
                    [uniqueKey]: key,
                    [titleKey]: value,
                  })))
                  || (isDataArrayOfStrings
                    && (
                      (dataKey
                        && getDataFromObject(response.data.results, dataKey, true))
                      || response.data.results
                    ).map((value) => ({
                      [uniqueKey]: value,
                      [titleKey]: value,
                    })))
                  || (dataKey
                    && getDataFromObject(response.data.results, dataKey, true))
                  || response.data.results
                  || []),
              ].filter(
                (item, index, items) =>
                  items.findIndex(
                    (element) => item[uniqueKey] === element[uniqueKey],
                  ) === index,
              ),
            }));
        } else setData({ results: [], totalCount: 0 });
        setScrollPosition(scrollVal - 0.0001);
      },
      [
        searchKey,
        getReturnedData,
        getDataAPI,
        getAPIProperties,
        filter,
        search,
        isDataObject,
        isDataArrayOfStrings,
        dataKey,
        uniqueKey,
        titleKey,
      ],
    );
    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to get item by id the item selected but not exists in data
     */
    const getItemByIdHandler = useCallback(
      async (arrayItemUUID = null, localUniqueKey) => {
        setIsLocalLoading(true);
        const response = await getItemByIdAPI({
          [localUniqueKey]: arrayItemUUID,
          company_uuid: getByIdCompanyUUID,
        });
        setIsLocalLoading(false);
        if (response && response.status === 200)
          return (
            (byIdDataKey && response.data.results[byIdDataKey])
            || response.data.results
            || null
          );
        return null;
      },
      [byIdDataKey, getByIdCompanyUUID, getItemByIdAPI],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init selected data for array autocomplete
     */
    const getArrayEditInit = useCallback(async () => {
      if (localType !== DynamicFormTypesEnum.array.key) return;
      if (editValue && data.results.length > 0) {
        const toAddData = [];
        const notFoundInDataItems = [];
        const localData = JSON.stringify(data.results);
        await Promise.all(
          editValue.map(async (value) => {
            let currentItem = data.results.find(
              (item) =>
                (savingKey && item[uniqueKey] === value[savingKey])
                || item[uniqueKey] === value,
            );
            if (!currentItem && loadedData.current.length > 0) {
              currentItem = loadedData.current.find(
                (item) =>
                  (savingKey && item[uniqueKey] === value[savingKey])
                  || item[uniqueKey] === value,
              );
              if (currentItem) notFoundInDataItems.push(currentItem);
            }
            if (!currentItem && getItemByIdAPI) {
              currentItem = await getItemByIdHandler(
                (savingKey && value[savingKey]) || value,
                getItemByIdUniqueKey || uniqueKey,
              );
              if (currentItem) notFoundInDataItems.push(currentItem);
            }

            if (currentItem) toAddData.push(currentItem);
            return undefined;
          }),
        );
        if (localData !== JSON.stringify(data.results)) return;
        if (notFoundInDataItems.length > 0)
          setData((items) => {
            const localItems = { ...items };
            localItems.results = localItems.results.concat(notFoundInDataItems);
            return localItems;
          });
        setLocalEditValue((items) => {
          if (
            !items
            || items.length !== toAddData.length
            || changeReasonIsIndexRef.current
          )
            return toAddData;
          return items;
        });
        if (
          !changeReasonIsIndexRef.current
          && toAddData.length !== editValue.length
          && onValueChanged
        )
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
              || toAddData.map((item) => item[uniqueKey]),
          });
      }
    }, [
      localType,
      editValue,
      data.results,
      onValueChanged,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      subSubParentId,
      subSubParentIndex,
      stateKey,
      isEntireObject,
      getItemByIdAPI,
      savingKey,
      uniqueKey,
      getItemByIdHandler,
      getItemByIdUniqueKey,
    ]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init selected data for select autocomplete
     */
    const getSelectEditInit = useCallback(async () => {
      if (localType !== DynamicFormTypesEnum.select.key || isLoadingRef.current)
        return;
      if (editValue && data.results.length > 0) {
        let currentItem = data.results.find(
          (item) =>
            (savingKey && item[uniqueKey] === editValue[savingKey])
            || item[uniqueKey] === editValue,
        );
        if (!currentItem && loadedData.current.length > 0) {
          currentItem = loadedData.current.find(
            (item) =>
              (savingKey && item[uniqueKey] === editValue[savingKey])
              || item[uniqueKey] === editValue,
          );
          if (currentItem)
            setData((items) => {
              const localItems = { ...items };
              localItems.results.push(currentItem);
              return localItems;
            });
        }
        if (!currentItem && getItemByIdAPI) {
          currentItem = await getItemByIdHandler(
            (savingKey && editValue[savingKey]) || editValue,
            getItemByIdUniqueKey || uniqueKey,
          );
          if (currentItem)
            setData((items) => {
              const localItems = { ...items };
              localItems.results.push(currentItem);
              return localItems;
            });
        }

        if (currentItem) setLocalEditValue(currentItem);
        else if (
          !changeReasonIsIndexRef.current
          && onValueChanged
          && !localEditValue
        )
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
        else if (!changeReasonIsIndexRef.current) setLocalEditValue(null);
      }
    }, [
      localType,
      editValue,
      data.results,
      getItemByIdAPI,
      onValueChanged,
      localEditValue,
      parentId,
      parentIndex,
      subParentId,
      subParentIndex,
      subSubParentId,
      subSubParentIndex,
      stateKey,
      savingKey,
      uniqueKey,
      getItemByIdHandler,
      getItemByIdUniqueKey,
    ]);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method to load more data on scroll to the end of autocomplete
     * if there is more data to load
     */
    const onScrollEndHandler = useCallback(() => {
      if (
        dataRef.current.totalCount > dataRef.current.results.length
        && !isLoadingRef.current
      )
        setFilter((items) => ({ ...items, page: items.page + 1 }));
    }, []);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description to init selected data for select autocomplete
     */
    const paperComponentHandler = useMemo(
      // eslint-disable-next-line react/prop-types,react/display-name
      () => ({ children, className }) => (
        <Paper className={className}>
          {children}
          <ButtonBase
            className="btns mx-0 theme-transparent w-100 br-0"
            disabled={isDisabled || isLocalLoading || isLoading}
            onMouseDown={(event) => event.preventDefault()}
            onClick={onScrollEndHandler}
          >
            <LoaderComponent
              isLoading={isLocalLoading || isLoading}
              isSkeleton
              wrapperClasses="position-absolute w-100 h-100"
              skeletonStyle={{ width: '100%', height: '100%' }}
            />
            <span>{t('load-more')}</span>
          </ButtonBase>
        </Paper>
      ),
      [isDisabled, isLoading, isLocalLoading, onScrollEndHandler, t],
    );

    // to init array autocomplete edit value
    useEffect(() => {
      if (localType === DynamicFormTypesEnum.array.key) getArrayEditInit();
    }, [localType, getArrayEditInit]);

    // to init select autocomplete edit value
    useEffect(() => {
      if (localType === DynamicFormTypesEnum.select.key) getSelectEditInit();
    }, [localType, getSelectEditInit]);

    // to all data on search or search
    useEffect(() => {
      if (isOpenAutocomplete.current || (getReturnedData && isFirstLoadRef.current))
        getAllData(1);
    }, [getAllData, filter, search, getReturnedData]);

    // this method is to remove localSelectedValues if edit value become not have the value
    // the local edit value has it
    useEffect(() => {
      setLocalEditValue((items) => {
        if (localType === DynamicFormTypesEnum.select.key && !editValue && items) {
          localEditValueRef.current = null;
          return null;
        }
        return items;
      });
    }, [editValue, localType]);

    // This is to handle updating the localExtraProps locally
    useEffect(() => {
      if (
        JSON.stringify(extraProps) !== JSON.stringify(localExtraPropsRef.current)
        && !changeReasonIsIndexRef.current
      ) {
        // to prevent reload the data if the change only in with_than and all values exists in the loaded data
        if (
          localExtraPropsRef.current
          && Object.hasOwn(extraProps || {}, 'with_than')
        ) {
          const localExtraProps = { ...extraProps };
          const localLocalExtraPropsRef = { ...localExtraPropsRef.current };
          delete localExtraProps.with_than;
          delete localLocalExtraPropsRef.with_than;
          if (
            JSON.stringify(localExtraProps)
            === JSON.stringify(localLocalExtraPropsRef)
          )
            if (
              !extraProps.with_than
              || extraProps.with_than.length === 0
              || (typeof extraProps.with_than === 'string'
                && loadedData.current.some(
                  (element) => element[uniqueKey] === extraProps.with_than,
                ))
              || (Array.isArray(extraProps.with_than)
                && extraProps.with_than.every((item) =>
                  loadedData.current.some((element) => element[uniqueKey] === item),
                ))
            )
              return;
        }
        loadedData.current = [];
        localExtraPropsRef.current = { ...extraProps };
        if (!isOpenAutocomplete.current) getAllData(2);
      } else if (changeReasonIsIndexRef.current)
        localExtraPropsRef.current = { ...extraProps };
    }, [extraProps, getAllData, uniqueKey]);

    // to all data on edit value change
    useEffect(() => {
      if (
        ((localType === DynamicFormTypesEnum.select.key && editValue)
          || (localType === DynamicFormTypesEnum.array.key
            && editValue
            && editValue.length))
        && JSON.stringify(localEditValueRef.current) !== JSON.stringify(editValue)
      ) {
        localEditValueRef.current = editValue;
        if (loadedData.current.length === 0) getAllData(3);
      }
    }, [editValue, getAllData, localType]);

    useEffect(() => {
      if (loadedData.current) loadedData.current = [];
    }, [parentIndex, subParentIndex, subSubParentIndex]);

    useEffect(() => {
      if (
        parentIndex
        || parentIndex === 0
        || subParentIndex
        || subParentIndex === 0
        || subSubParentIndex
        || subSubParentIndex === 0
      )
        changeReasonIsIndexRef.current = true;
    }, [parentIndex, subParentIndex, subSubParentIndex]);

    // to have reference for the current data value to use it in locations just for read the data
    useEffect(() => {
      dataRef.current = data;
    }, [data]);

    useEffect(() => {
      if (isForceToReload === undefined || isFirstLoadRef.current) return;
      loadedData.current = [];
      isFirstLoadRef.current = true;
      setData({
        results: [],
        totalCount: 0,
      });
      setFilter((items) => ({ ...items, page: 1 }));
    }, [isForceToReload, getDataAPI]);

    // to rest the dropdown when any of the APIs functions changed
    useEffect(() => {
      loadedData.current = [];
      isFirstLoadRef.current = true;
      setData({
        results: [],
        totalCount: 0,
      });
      setFilter((items) => ({ ...items, page: 1 }));
    }, [getDataAPI, getItemByIdAPI]);

    // to rest the dropdown when type changed after render
    useEffect(() => {
      setLocalEditValue((item) => {
        if (type === DynamicFormTypesEnum.array.key && !Array.isArray(item)) {
          localEditValueRef.current = [];
          return [];
        }
        if (type === DynamicFormTypesEnum.select.key && Array.isArray(item)) {
          localEditValueRef.current = null;
          return null;
        }
        return item;
      });
      setLocalType(type);
    }, [type]);

    // to prevent memory leak if component destroyed before time finish or API finish
    useEffect(
      () => () => {
        isMountedRef.current = false;
        if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      },
      [],
    );

    return (
      <div
        key={type}
        className={`${
          (localType === DynamicFormTypesEnum.array.key
            && 'shared-api-autocomplete-wrapper')
          || 'shared-api-select-wrapper'
        }${(controlWrapperClasses && ` ${controlWrapperClasses}`) || ''}${
          (isFullWidth && ' is-full-width') || ''
        }${(isTwoThirdsWidth && ' is-two-thirds-width') || ''}${
          (isHalfWidth && ' is-half-width') || ''
        }${(isQuarterWidth && ' is-quarter-width') || ''} shared-control-wrapper`}
      >
        <AutocompleteComponent
          scrollPosition={scrollPosition}
          listId={listId}
          idRef={`${idRef}-${parentId || ''}-${parentIndex || 0}-${
            subParentId || ''
          }-${subSubParentId || ''}-${subSubParentIndex || 0}-${
            subParentIndex || 0
          }-${stateKey}`}
          disableClearable={disableClearable}
          isRequired={isRequired}
          endAdornment={endAdornment}
          startAdornment={startAdornment}
          inputEndAdornment={inputEndAdornment}
          inputStartAdornment={inputStartAdornment}
          getOptionLabel={getOptionLabel || ((option) => option[titleKey] || '')}
          chipsLabel={getOptionLabel || ((option) => option[titleKey] || '')}
          disabledOptions={getDisabledOptions}
          value={localEditValue}
          getOptionSelected={
            getOptionSelected
            || ((option, value) => option?.[uniqueKey] === value?.[uniqueKey])
          }
          data={data.results}
          inputLabel={title}
          multiple={localType === DynamicFormTypesEnum.array.key}
          maxNumber={
            (max && localType === DynamicFormTypesEnum.array.key && max) || undefined
          }
          isDisabled={isDisabled || undefined}
          error={
            (errorPath && errors[errorPath] && errors[errorPath].error) || undefined
          }
          isSubmitted={isSubmitted}
          tabIndex={tabIndex}
          helperText={
            (errorPath && errors[errorPath] && errors[errorPath].message)
            || undefined
          }
          onInputKeyUp={searchHandler}
          inputPlaceholder={placeholder}
          labelValue={labelValue}
          inlineLabel={inlineLabel}
          onExternalChipClicked={onExternalChipClicked}
          inlineLabelClasses={inlineLabelClasses}
          isLoading={isLoading || isLocalLoading}
          themeClass="theme-solid"
          paperComponent={
            (data.totalCount > data.results.length && paperComponentHandler)
            || undefined
          }
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          withExternalChips={
            withExternalChips === undefined
              ? localType === DynamicFormTypesEnum.array.key
              : withExternalChips
          }
          onScrollEnd={onScrollEndHandler}
          onInputChange={onInputChange}
          inputValue={inputValue}
          onChange={(e, newValue) => {
            setLocalEditValue(newValue);
            changeReasonIsIndexRef.current = false;
            if (onValueChanged)
              onValueChanged({
                parentId,
                parentIndex,
                subParentId,
                subParentIndex,
                subSubParentId,
                subSubParentIndex,
                id: stateKey,
                value:
                  (localType === DynamicFormTypesEnum.array.key
                    && ((newValue
                      && ((isEntireObject && newValue)
                        || newValue.map(
                          (item) =>
                            (savingKey && { [savingKey]: item[uniqueKey] })
                            || item[uniqueKey],
                        )))
                      || []))
                  || (localType === DynamicFormTypesEnum.select.key
                    && newValue
                    && ((isEntireObject && newValue)
                      || (savingKey && { [savingKey]: newValue[uniqueKey] })
                      || newValue[uniqueKey]))
                  || null,
              });
          }}
          renderOption={
            (optionComponent
              && ((renderProps, option) => optionComponent(renderProps, option)))
            || renderOption
            || ((renderProps, option) => (
              <li {...renderProps} key={option[uniqueKey]}>
                {(getOptionLabel && getOptionLabel(option)) || option[titleKey]}
              </li>
            ))
          }
          inputLabelComponent={
            (inputLabelComponent
              && inputLabelComponent({ selectedOption: localEditValue }))
            || undefined
          }
          wrapperClasses={wrapperClasses}
          onOpen={() => {
            isOpenAutocomplete.current = true;
            changeReasonIsIndexRef.current = false;
            // This was commented because it was preventing re-rendering of dropdown list
            // Commenting it in case we run into issues down the line.
            // if (!data.results.length)
            if (
              dataRef.current.results.length > 0
              && dataRef.current.results.length === dataRef.current.totalCount
            )
              return;
            setFilter((item) => ({
              ...item,
              page: 1,
            }));
          }}
          onClose={() => {
            if (searchKey && search && !onInputChange) {
              if (!isIgnoreResetTextSearch) setSearch('');
              setFilter((items) => ({ ...items, page: 1 }));
              if (searchTimerRef.current && !isIgnoreResetTextSearch)
                clearTimeout(searchTimerRef.current);
              return;
            }
            isOpenAutocomplete.current = false;
            if (search && !isIgnoreResetTextSearch) setSearch('');
          }}
          autocompleteThemeClass={autocompleteThemeClass}
          filterOptions={filterOptions}
        />
      </div>
    );
  },
);

SharedAPIAutocompleteControl.displayName = 'SharedAPIAutocompleteControl';

SharedAPIAutocompleteControl.propTypes = {
  getDataAPI: PropTypes.func.isRequired,
  onValueChanged: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  stateKey: PropTypes.string.isRequired,
  onInputChange: PropTypes.func,
  inputValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  getReturnedData: PropTypes.func,
  labelValue: PropTypes.string,
  title: PropTypes.string,
  getOptionLabel: PropTypes.func,
  getAPIProperties: PropTypes.func,
  getItemByIdAPI: PropTypes.func,
  dataKey: PropTypes.string,
  extraProps: PropTypes.instanceOf(Object),
  type: PropTypes.oneOf(Object.values(DynamicFormTypesEnum).map((item) => item.key)),
  errors: PropTypes.instanceOf(Object),
  searchKey: PropTypes.string,
  savingKey: PropTypes.string,
  parentId: PropTypes.string,
  subParentId: PropTypes.string,
  subSubParentId: PropTypes.string,
  subSubParentIndex: PropTypes.number,
  byIdDataKey: PropTypes.string,
  parentIndex: PropTypes.number,
  subParentIndex: PropTypes.number,
  max: PropTypes.number,
  tabIndex: PropTypes.number,
  errorPath: PropTypes.string,
  isRequired: PropTypes.bool,
  isLoading: PropTypes.bool,
  isDataObject: PropTypes.bool,
  editValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.string,
    PropTypes.number,
  ]),
  uniqueKey: PropTypes.string,
  getItemByIdUniqueKey: PropTypes.string,
  titleKey: PropTypes.string,
  isEntireObject: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  isTwoThirdsWidth: PropTypes.bool,
  isHalfWidth: PropTypes.bool,
  isQuarterWidth: PropTypes.bool,
  idRef: PropTypes.string,
  getByIdCompanyUUID: PropTypes.string,
  inlineLabel: PropTypes.string,
  inlineLabelClasses: PropTypes.string,
  controlWrapperClasses: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  startAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  endAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  inputEndAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  inputStartAdornment: PropTypes.oneOfType([
    PropTypes.elementType,
    PropTypes.func,
    PropTypes.node,
  ]),
  wrapperClasses: PropTypes.string,
  getDisabledOptions: PropTypes.func,
  renderOption: PropTypes.func,
  onExternalChipClicked: PropTypes.func,
  disableClearable: PropTypes.bool,
  isDataArrayOfStrings: PropTypes.bool,
  withExternalChips: PropTypes.bool,
  isForceToReload: PropTypes.bool,
  autocompleteThemeClass: PropTypes.string,
  filterOptions: PropTypes.func,
  getOptionSelected: PropTypes.func,
  inputLabelComponent: PropTypes.func,
  optionComponent: PropTypes.func,
  isIgnoreResetTextSearch: PropTypes.bool,
  initialTextSearchValue: PropTypes.string,
};

SharedAPIAutocompleteControl.defaultProps = {
  idRef: 'SharedAPIAutocompleteControl',
  type: DynamicFormTypesEnum.select.key,
  title: undefined,
  onInputChange: undefined,
  inputValue: undefined,
  getReturnedData: undefined,
  editValue: null,
  extraProps: undefined,
  errors: {},
  isSubmitted: undefined,
  isEntireObject: false,
  dataKey: undefined,
  savingKey: undefined,
  tabIndex: undefined,
  uniqueKey: 'uuid',
  titleKey: 'title',
  searchKey: undefined,
  labelValue: undefined,
  parentId: undefined,
  subParentId: undefined,
  parentIndex: undefined,
  subParentIndex: undefined,
  subSubParentId: undefined,
  subSubParentIndex: undefined,
  max: undefined,
  errorPath: undefined,
  isRequired: undefined,
  isLoading: undefined,
  isDataObject: undefined,
  isDisabled: undefined,
  isFullWidth: undefined,
  isTwoThirdsWidth: undefined,
  isHalfWidth: undefined,
  startAdornment: undefined,
  endAdornment: undefined,
  inputStartAdornment: undefined,
  inputEndAdornment: undefined,
  isQuarterWidth: undefined,
  getOptionLabel: undefined,
  getItemByIdAPI: undefined,
  getByIdCompanyUUID: undefined,
  getItemByIdUniqueKey: undefined,
  getAPIProperties: undefined,
  byIdDataKey: undefined,
  inlineLabel: undefined,
  inlineLabelClasses: undefined,
  wrapperClasses: undefined,
  controlWrapperClasses: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  getDisabledOptions: undefined,
  disableClearable: undefined,
  renderOption: undefined,
  isForceToReload: undefined,
  autocompleteThemeClass: undefined,
  filterOptions: undefined,
  optionComponent: undefined,
};
