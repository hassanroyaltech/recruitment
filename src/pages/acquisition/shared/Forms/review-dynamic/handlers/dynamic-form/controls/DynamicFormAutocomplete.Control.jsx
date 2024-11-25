import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from 'components';
import { GetAllItemsByHelperDynamic } from 'services';
import {
  DynamicFormTypesEnum,
  ReviewTypesEnum,
  ReviewDynamicFormHelperEnum,
} from 'enums';
import { GlobalSearchDelay } from '../../../../../../../../helpers';

export const DynamicFormAutocompleteControl = ({
  controlItem,
  editValue,
  reviewType,
  onEditValueChanged,
  idRef,
  errors,
  isSubmitted,
  isRequired,
  errorPath,
}) => {
  const [itemEnum] = useState(ReviewDynamicFormHelperEnum[controlItem.helper_name]);
  const searchTimerRef = useRef(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(() => []);
  const [localEditValue, setLocalEditValue] = useState(
    () => (controlItem.type === DynamicFormTypesEnum.array.key && []) || null,
  );
  const getAllItemsByHelper = useCallback(async () => {
    if (!itemEnum.apiPath && !controlItem.end_point) return;

    setIsLoading(true);
    const response = await GetAllItemsByHelperDynamic(
      itemEnum.apiPath || controlItem.end_point,
      { ...itemEnum.apiProps, query },
    );
    if (response && response.status === 200)
      setData(response.data[itemEnum.dataPath.results]);
    else setData([]);
    setIsLoading(false);
  }, [controlItem.end_point, controlItem.helper_name, itemEnum, query]);
  const getArrayEditInit = useCallback(async () => {
    if (controlItem.type !== DynamicFormTypesEnum.array.key) return;
    if (editValue && editValue.length > 0 && data.length > 0) {
      const toAddData = [];
      editValue.map((value) => {
        const currentItem = data.find(
          (item) =>
            item[
              (itemEnum && itemEnum.dataPath.uuid)
                || ((controlItem.values || controlItem.options) && 'key')
                || 'uuid'
            ] === value,
        );

        if (currentItem) toAddData.push(currentItem);

        return undefined;
      });
      if (toAddData.length !== editValue.length && onEditValueChanged)
        onEditValueChanged({
          parentId: reviewType,
          subParentId: controlItem.parent_key || controlItem.subParentId,
          parentIndex: controlItem.parentIndex,
          id: controlItem.name,
          value: toAddData,
        });
      setLocalEditValue(toAddData);
    }
  }, [
    controlItem.type,
    controlItem.parent_key,
    controlItem.subParentId,
    controlItem.parentIndex,
    controlItem.name,
    controlItem.values,
    controlItem.options,
    editValue,
    data,
    onEditValueChanged,
    reviewType,
    itemEnum,
  ]);
  const getSelectEditInit = useCallback(async () => {
    if (controlItem.type !== DynamicFormTypesEnum.select.key) return;
    if (controlItem?.isVonqAutoComplete && editValue) {
      setLocalEditValue(editValue);
      setQuery(editValue.title);
    } else if (
      editValue
      && data.length > 0
      && (!controlItem.helper_name || (itemEnum && itemEnum.dataPath))
    ) {
      const currentItem = data.find(
        (item) =>
          (controlItem.helper_name && item[itemEnum.dataPath.uuid] === editValue)
          || item.key === editValue,
      );
      if (currentItem) setLocalEditValue(currentItem);
      else if (onEditValueChanged)
        onEditValueChanged({
          parentId: reviewType,
          subParentId: controlItem.parent_key || controlItem.subParentId,
          parentIndex: controlItem.parentIndex,
          id: controlItem.name,
          value: currentItem,
        });
    }
  }, [
    controlItem.type,
    controlItem.helper_name,
    controlItem?.isVonqAutoComplete,
    controlItem.parent_key,
    controlItem.subParentId,
    controlItem.parentIndex,
    controlItem.name,
    editValue,
    data,
    itemEnum,
    onEditValueChanged,
    reviewType,
  ]);
  const getSelectDataInit = useCallback(() => {
    if (
      !controlItem.helper_name
      && (controlItem?.options?.length || controlItem?.values?.length)
    ) {
      const localeOptions = controlItem?.options || controlItem?.values || [];

      const localData = localeOptions.map((item) => ({
        // to handel the case of empty key
        key: item.id || item.name,
        title: item.name,
      }));
      setData(localData);
    }
  }, [controlItem.helper_name, controlItem?.options, controlItem?.values]);

  useEffect(() => {
    if (controlItem?.options?.length > 0) getSelectDataInit();
  }, [controlItem?.options?.length, getSelectDataInit]);

  useEffect(() => {
    if (controlItem.helper_name) getAllItemsByHelper();
  }, [controlItem.helper_name, getAllItemsByHelper]);

  useEffect(() => {
    if (controlItem.type === DynamicFormTypesEnum.array.key) getArrayEditInit();
  }, [controlItem.type, getArrayEditInit]);

  useEffect(() => {
    if (controlItem.type === DynamicFormTypesEnum.select.key) getSelectEditInit();
  }, [controlItem.type, getSelectEditInit]);

  const searchHandler = useCallback(
    (event) => {
      if (event?.keyCode === 40 || !controlItem.end_point) return;
      const { value } = event.target;
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        setQuery(value);
      }, GlobalSearchDelay);
    },
    [controlItem.end_point],
  );

  return (
    <div
      className={`form-control-item-wrapper ${
        (controlItem.type === DynamicFormTypesEnum.array.key
          && 'dynamic-form-autocomplete')
        || 'dynamic-form-select'
      }`}
    >
      <AutocompleteComponent
        idRef={`${idRef}${controlItem.name}`}
        getOptionLabel={(option) =>
          (itemEnum && option[itemEnum.dataPath.title]) || option.title || ''
        }
        chipsLabel={(option) =>
          (itemEnum && option[itemEnum.dataPath.title]) || option.title || ''
        }
        value={localEditValue}
        isOptionEqualToValue={(option) =>
          localEditValue
          && ((controlItem.type === DynamicFormTypesEnum.array.key
            && localEditValue.findIndex(
              (item) =>
                item[itemEnum?.dataPath?.uuid || 'key']
                === option[itemEnum?.dataPath?.uuid || 'key'],
            ) !== -1)
            || (controlItem.type === DynamicFormTypesEnum.select.key
              && ((controlItem.helper_name
                && localEditValue[itemEnum.dataPath.uuid]
                  === option[itemEnum.dataPath.uuid])
                || (!controlItem.helper_name && localEditValue.key === option.key))))
        }
        data={data}
        labelValue={controlItem.title}
        multiple={controlItem.type === DynamicFormTypesEnum.array.key}
        maxNumber={
          (controlItem.max_items
            && controlItem.type === DynamicFormTypesEnum.array.key
            && controlItem.max_items)
          || undefined
        }
        // isDisabled={
        //   (controlItem.max_items
        //     && controlItem.type === DynamicFormTypesEnum.array.key
        //     && localEditValue.length >= controlItem.max_items)
        //   || undefined
        // }
        error={
          (localEditValue
            // && (controlItem.type !== DynamicFormTypesEnum.array.key
            //   || localEditValue.length > 0)
            && editValue
            && ((controlItem.helper_name
              && itemEnum
              && localEditValue[itemEnum.dataPath.uuid]
                === editValue[itemEnum.dataPath.uuid])
              || editValue.key === localEditValue.key))
          || !localEditValue
          || localEditValue.length === 0
            ? (controlItem.parent_key
                && errors[
                  `${reviewType}.${controlItem.parent_key}.${controlItem.name}`
                ]
                && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
                  .error)
              || (errors[`${reviewType}.${controlItem.name}`]
                && errors[`${reviewType}.${controlItem.name}`].error)
              || (errors && errors[errorPath] && errors[errorPath].error)
            : undefined
        }
        isSubmitted={isSubmitted}
        isRequired={isRequired}
        helperText={
          (controlItem.parent_key
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.parent_key}.${controlItem.name}`]
              .message)
          || (errors[`${reviewType}.${controlItem.name}`]
            && errors[`${reviewType}.${controlItem.name}`].message)
          || (errors && errors[errorPath] && errors[errorPath].message)
          || undefined
        }
        inputPlaceholder={controlItem.title}
        isLoading={isLoading}
        withExternalChips={controlItem.type === DynamicFormTypesEnum.array.key}
        onInputKeyUp={searchHandler}
        onChange={(e, newValue) => {
          setLocalEditValue(newValue);

          if (onEditValueChanged)
            onEditValueChanged({
              parentId: reviewType,
              subParentId: controlItem.parent_key || controlItem.subParentId,
              parentIndex: controlItem.parentIndex,
              id: controlItem.name,
              value: controlItem?.isVonqAutoComplete
                ? { ...newValue, autocomplete: true }
                : (controlItem.type === DynamicFormTypesEnum.array.key
                    && ((newValue
                      && newValue.map(
                        (item) => item[itemEnum?.dataPath?.uuid || 'key'],
                      ))
                      || []))
                  || (controlItem.type === DynamicFormTypesEnum.select.key
                    && newValue
                    && ((controlItem.helper_name && newValue[itemEnum.dataPath.uuid])
                      || newValue.key))
                  || null,
            });
        }}
      />
      {controlItem.type === DynamicFormTypesEnum.array.key && (
        <div
          className={`separator-h ${(localEditValue.length === 0 && 'mt-3') || ''}`}
        />
      )}
    </div>
  );
};

DynamicFormAutocompleteControl.propTypes = {
  errors: PropTypes.instanceOf(Object).isRequired,
  controlItem: PropTypes.instanceOf(Object).isRequired,
  editValue: PropTypes.oneOfType([
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
    PropTypes.string,
  ]),
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  errorPath: PropTypes.string,
  reviewType: PropTypes.oneOf(Object.values(ReviewTypesEnum).map((item) => item.key))
    .isRequired,
  onEditValueChanged: PropTypes.func.isRequired,
  idRef: PropTypes.string,
};
DynamicFormAutocompleteControl.defaultProps = {
  idRef: 'DynamicFormAutocompleteControlRef',
  editValue: null,
};
