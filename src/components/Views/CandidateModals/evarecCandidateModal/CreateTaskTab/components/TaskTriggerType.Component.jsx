import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../pages/setups/shared';
import { DynamicService } from '../../../../../../services';
import i18next from 'i18next';
import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

export const TaskTriggerTypeComponent = ({
  parentTranslationPath,
  createTaskModeOn,
  editModeOn,
  isFullScreen,
  activeItem,
  setLocalTaskData,
  errors,
  isSubmitted,
  triggerTaskTypes,
}) => {
  const getDynamicServicePropertiesHandler = useCallback(
    // eslint-disable-next-line max-len
    ({ apiFilter, apiSearch, apiExtraProps }) => ({
      ...(apiExtraProps || {}),
      params: {
        ...((apiExtraProps && apiExtraProps.params) || {}),
        ...(apiFilter || {}),
        query: apiSearch || null,
      },
    }),
    [],
  );
  const GetDynamicAPIOptionLabel = useMemo(
    () => (option) =>
      typeof option === 'string'
        ? option
        : option.value
          || (option.title
            && (typeof option.title === 'object'
              ? option.title[i18next.language] || option.title.en
              : option.title))
          || (option.name
            && (typeof option.name === 'object'
              ? option.name[i18next.language] || option.name.en
              : option.name))
          || `${
            option.first_name
            && (option.first_name[i18next.language] || option.first_name.en)
          }${
            option.last_name
            && ` ${option.last_name[i18next.language] || option.last_name.en}`
          }`,
    [],
  );

  const checkShowOptionField = useCallback(
    (option) =>
      option?.required_params?.length
        ? option?.required_params?.every(
          (a) => activeItem.additional_data?.[a.mapping_key]?.[a.primary_key],
        )
        : true,
    [activeItem],
  );

  const SelectedTypeFullData = useMemo(
    () => triggerTaskTypes?.list?.find((it) => it.key === activeItem.type?.key),
    [triggerTaskTypes, activeItem],
  );

  return createTaskModeOn || editModeOn ? (
    <>
      <SharedAutocompleteControl
        isEntireObject
        disableClearable
        isFullWidth={!isFullScreen}
        isQuarterWidth={isFullScreen}
        stateKey="type"
        placeholder="select-type"
        editValue={SelectedTypeFullData?.key || ''}
        onValueChanged={(e) => {
          setLocalTaskData((items) => ({
            ...items,
            type: e.value || {},
          }));
        }}
        parentTranslationPath={parentTranslationPath}
        inputClasses="small-size"
        errors={errors}
        isSubmitted={isSubmitted}
        errorPath="type.key"
        initValuesKey="key"
        initValuesTitle="value"
        initValues={triggerTaskTypes?.list || []}
        disabledOptions={(option) => option.is_disabled}
      />
      <div className="d-flex-column">
        {SelectedTypeFullData?.options?.type === 'dropdown' && (
          <>
            {SelectedTypeFullData.options.required_params?.length > 0
              && SelectedTypeFullData.options.required_params.map(
                (requiredParam, requiredParamIdx) => (
                  <div key={`${requiredParam.key}-${requiredParamIdx}`}>
                    {requiredParam.type === 'dropdown' && (
                      <SharedAPIAutocompleteControl
                        isEntireObject
                        title={requiredParam.label}
                        uniqueKey={requiredParam?.primary_key}
                        editValue={
                          activeItem.additional_data?.[requiredParam.mapping_key]?.[
                            requiredParam.primary_key
                          ]
                        }
                        placeholder="select-value"
                        stateKey={requiredParam.primary_key}
                        errors={errors}
                        isSubmitted={isSubmitted}
                        errorPath={`additional_data.${requiredParam.mapping_key}.${requiredParam.primary_key}`}
                        searchKey="query"
                        getDataAPI={DynamicService}
                        getAPIProperties={getDynamicServicePropertiesHandler}
                        extraProps={{
                          path: requiredParam?.end_point,
                          method: requiredParam?.method,
                          params: {
                            ...(requiredParam?.params?.length
                              && requiredParam?.params.reduce(
                                (a, v) => ({
                                  ...a,
                                  [v.key]: v.default_value,
                                }),
                                {},
                              )),
                            ...((activeItem?.additional_data?.[requiredParam.key]
                              || activeItem?.additional_data?.[
                                requiredParam.mapping_key
                              ]?.[requiredParam.primary_key]) && {
                              with_than: [
                                activeItem?.additional_data?.[requiredParam.key]
                                  || activeItem?.additional_data?.[
                                    requiredParam.mapping_key
                                  ]?.[requiredParam.primary_key],
                              ],
                            }),
                          },
                        }}
                        getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
                        parentTranslationPath={parentTranslationPath}
                        onValueChanged={(e) => {
                          setLocalTaskData((items) => ({
                            ...items,
                            additional_data: {
                              ...items.additional_data,
                              [requiredParam.mapping_key]: e.value,
                            },
                          }));
                        }}
                        isFullWidth
                        dataKey={requiredParam.data_key}
                      />
                    )}
                  </div>
                ),
              )}
            {checkShowOptionField(SelectedTypeFullData.options) && (
              <SharedAPIAutocompleteControl
                idRef={`additional_data.${SelectedTypeFullData.options.key}`}
                isEntireObject
                title={SelectedTypeFullData.options.label}
                uniqueKey={SelectedTypeFullData.options.primary_key}
                filterOptions={(options) => options}
                editValue={
                  activeItem.additional_data?.[SelectedTypeFullData.options.key]
                  || activeItem.additional_data?.[
                    SelectedTypeFullData.options.mapping_key
                  ]?.[SelectedTypeFullData.options.primary_key]
                }
                placeholder="select-value"
                stateKey={SelectedTypeFullData.options.primary_key}
                errors={errors}
                isSubmitted={isSubmitted}
                errorPath={`additional_data.${SelectedTypeFullData.options.mapping_key}.${SelectedTypeFullData.options.primary_key}`}
                searchKey="query"
                getDataAPI={DynamicService}
                getAPIProperties={getDynamicServicePropertiesHandler}
                extraProps={{
                  path: SelectedTypeFullData.options.end_point,
                  method: SelectedTypeFullData.options.method,
                  params: {
                    ...(SelectedTypeFullData.options.params?.length
                      && SelectedTypeFullData.options.params.reduce(
                        (a, v) => ({
                          ...a,
                          [v.key]: v.default_value,
                        }),
                        {},
                      )),
                    ...(SelectedTypeFullData.options.required_params?.length
                      && SelectedTypeFullData.options.required_params.reduce(
                        (a, v) => ({
                          ...a,
                          [v.key]:
                            activeItem.additional_data?.[v.mapping_key]?.[
                              v.primary_key
                            ],
                        }),
                        {},
                      )),
                    ...((activeItem.additional_data?.[
                      SelectedTypeFullData.options.key
                    ]
                      || activeItem.additional_data?.[
                        SelectedTypeFullData.options.mapping_key
                      ]?.[SelectedTypeFullData.options.primary_key]) && {
                      with_than: [
                        activeItem.additional_data?.[
                          SelectedTypeFullData.options.key
                        ]
                          || activeItem.additional_data?.[
                            SelectedTypeFullData.options.mapping_key
                          ]?.[SelectedTypeFullData.options.primary_key],
                      ],
                    }),
                  },
                }}
                getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
                parentTranslationPath={parentTranslationPath}
                onValueChanged={(e) => {
                  setLocalTaskData((items) => ({
                    ...items,
                    additional_data: {
                      ...items.additional_data,
                      [SelectedTypeFullData.options.mapping_key]: e.value,
                    },
                  }));
                }}
                isFullWidth
                dataKey={SelectedTypeFullData.options.data_key}
              />
            )}
          </>
        )}
        {SelectedTypeFullData?.options?.type === 'string' && (
          <SharedInputControl
            isFullWidth
            stateKey={`additional_data.${SelectedTypeFullData.options.key}`}
            placeholder="write-required-param-value"
            errors={errors}
            isSubmitted={isSubmitted}
            errorPath={`additional_data.${SelectedTypeFullData.options.key}`}
            editValue={
              activeItem.additional_data?.[SelectedTypeFullData.options.key]
            }
            onValueChanged={(e) => {
              setLocalTaskData((items) => ({
                ...items,
                additional_data: {
                  ...items.additional_data,
                  [SelectedTypeFullData.options.key]: e.value,
                },
              }));
            }}
            parentTranslationPath={parentTranslationPath}
            textFieldWrapperClasses="w-100 px-3 pt-3"
          />
        )}
        {/*  Extra Options  */}
        {SelectedTypeFullData?.extra_options?.map((extraOption, extraOptionIdx) => (
          <div key={`${extraOption.key}-${extraOptionIdx}`}>
            {extraOption.type === 'dropdown' && (
              <SharedAPIAutocompleteControl
                isEntireObject
                title={extraOption.label}
                uniqueKey={extraOption?.primary_key}
                editValue={
                  activeItem.additional_data?.[extraOption.mapping_key]?.[
                    extraOption.primary_key
                  ]
                }
                placeholder="select-value"
                stateKey={extraOption.primary_key}
                errors={errors}
                isSubmitted={isSubmitted}
                errorPath={`additional_data.${extraOption.mapping_key}.${extraOption.primary_key}`}
                searchKey="query"
                getDataAPI={DynamicService}
                getAPIProperties={getDynamicServicePropertiesHandler}
                extraProps={{
                  path: extraOption?.end_point,
                  method: extraOption?.method,
                  params: {
                    ...(extraOption?.params?.length
                      && extraOption?.params.reduce(
                        (a, v) => ({
                          ...a,
                          [v.key]: v.default_value,
                        }),
                        {},
                      )),
                    ...((activeItem?.additional_data?.[extraOption.key]
                      || activeItem?.additional_data?.[extraOption.mapping_key]?.[
                        extraOption.primary_key
                      ]) && {
                      with_than: [
                        activeItem?.additional_data?.[extraOption.key]
                          || activeItem?.additional_data?.[extraOption.mapping_key]?.[
                            extraOption.primary_key
                          ],
                      ],
                    }),
                  },
                }}
                getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
                parentTranslationPath={parentTranslationPath}
                onValueChanged={(e) => {
                  setLocalTaskData((items) => ({
                    ...items,
                    additional_data: {
                      ...items.additional_data,
                      [extraOption.mapping_key]: e.value,
                    },
                  }));
                }}
                isFullWidth
                dataKey={extraOption.data_key}
              />
            )}
          </div>
        ))}
      </div>
    </>
  ) : (
    SelectedTypeFullData?.value
      || (SelectedTypeFullData?.name
        && (SelectedTypeFullData.name[i18next.language]
          || SelectedTypeFullData.name.en
          || ''))
  );
};

TaskTriggerTypeComponent.propTypes = {
  parentTranslationPath: PropTypes.string,
  createTaskModeOn: PropTypes.bool,
  editModeOn: PropTypes.bool,
  isFullScreen: PropTypes.bool,
  activeItem: PropTypes.shape({
    additional_data: PropTypes.shape({}),
    type: PropTypes.shape({
      key: PropTypes.number,
      value: PropTypes.string,
      name: PropTypes.shape({
        en: PropTypes.string,
      }),
      options: PropTypes.shape({
        type: PropTypes.oneOf(['string', 'dropdown']),
        key: PropTypes.string,
        mapping_key: PropTypes.string,
        primary_key: PropTypes.string,
        data_key: PropTypes.string,
        required_params: PropTypes.array,
        label: PropTypes.string,
        end_point: PropTypes.string,
        method: PropTypes.string,
        params: PropTypes.array,
      }),
      extra_options: PropTypes.array,
    }),
  }),
  setLocalTaskData: PropTypes.func,
  errors: PropTypes.shape({}),
  isSubmitted: PropTypes.bool,
  triggerTaskTypes: PropTypes.shape({
    list: PropTypes.array,
    object: PropTypes.shape({}),
  }),
};
