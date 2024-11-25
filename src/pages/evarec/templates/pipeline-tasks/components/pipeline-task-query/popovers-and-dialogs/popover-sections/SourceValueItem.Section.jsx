import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import { DynamicService } from '../../../../../../../../services';

export const SourceValueItemSection = ({
  translationPath,
  parentTranslationPath,
  sourcesList,
  onStateChanged,
  state,
  isSubmitted,
  localErrors,
  getDynamicServicePropertiesHandler,
  GetDynamicAPIOptionLabel,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const ComputedSourceValue = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group.key),
    [sourcesList, state.source.key, state.source_group.key],
  );

  const checkShowSourceValueHandler = useCallback(
    () =>
      ComputedSourceValue?.options?.required_params
        ? ComputedSourceValue?.options?.required_params?.every(
          (a) => state.source_value?.[a.mapping_key]?.[a.primary_key],
        )
        : true,
    [ComputedSourceValue, state.source_value],
  );

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        {!!ComputedSourceValue?.options?.required_params?.length && (
          <div className="my-2 fz-13px c-gray">
            {t(`${translationPath}required-params`)}
          </div>
        )}
        {ComputedSourceValue?.options?.required_params?.map(
          (requiredParam, requiredParamIdx) => (
            <div key={`${requiredParam.key}-${requiredParamIdx}`}>
              {requiredParam?.type === 'string' && (
                <SharedInputControl
                  isFullWidth
                  stateKey={`source_value.${requiredParam.key}`}
                  placeholder="write-required-param-value"
                  errorPath={`source_value.${requiredParam.key}`}
                  isSubmitted={isSubmitted}
                  errors={localErrors}
                  editValue={state.source_value?.[requiredParam.key]}
                  onValueChanged={(e) => {
                    onStateChanged({
                      parentId: 'source_value',
                      id: requiredParam.key,
                      value: e.value,
                    });
                  }}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  textFieldWrapperClasses="w-100 px-3 pt-3"
                />
              )}
              {requiredParam?.type === 'dropdown' && (
                <SharedAPIAutocompleteControl
                  isEntireObject
                  uniqueKey={requiredParam?.primary_key}
                  filterOptions={(options) => options}
                  editValue={
                    state.source_value?.[requiredParam.mapping_key]?.[
                      requiredParam.primary_key
                    ]
                  }
                  placeholder="select-value"
                  stateKey="source_required_param"
                  isSubmitted={isSubmitted}
                  errors={localErrors}
                  // isDisabled={isLoading || !field.is_editable}
                  searchKey="query"
                  getDataAPI={DynamicService}
                  getAPIProperties={getDynamicServicePropertiesHandler}
                  extraProps={{
                    path: requiredParam?.end_point,
                    method: requiredParam?.method,
                    params: {
                      ...(requiredParam?.params?.length
                        && requiredParam?.params.reduce(
                          (a, v) => ({ ...a, [v.key]: v.default_value }),
                          {},
                        )),
                      ...((state.source_value?.[requiredParam.key]
                        || state.source_value?.[requiredParam.mapping_key]?.[
                          requiredParam.primary_key
                        ]) && {
                        with_than: [
                          state.source_value?.[requiredParam.key]
                            || state.source_value?.[requiredParam.mapping_key]?.[
                              requiredParam.primary_key
                            ],
                        ],
                      }),
                    },
                  }}
                  getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  onValueChanged={(e) => {
                    onStateChanged({
                      parentId: 'source_value',
                      id: requiredParam.mapping_key,
                      value: e.value,
                    });
                  }}
                  isFullWidth
                />
              )}
            </div>
          ),
        )}
        {checkShowSourceValueHandler() && (
          <>
            <div className="my-2 fz-13px c-gray">
              {t(`${translationPath}source-value`)}
            </div>
            {ComputedSourceValue?.options?.type === 'string' && (
              <SharedInputControl
                isFullWidth
                stateKey="source_value"
                placeholder="source-value"
                isSubmitted={isSubmitted}
                errors={localErrors}
                editValue={state.source_value || null}
                onValueChanged={(e) => {
                  onStateChanged({ id: 'source_value', value: e.value });
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                textFieldWrapperClasses="w-100 px-3 pt-3"
              />
            )}
            {ComputedSourceValue?.options?.type === 'dropdown' && (
              <SharedAPIAutocompleteControl
                isEntireObject
                filterOptions={(options) => options}
                editValue={
                  state.source_value?.[ComputedSourceValue?.options?.primary_key]
                  || null
                }
                placeholder="select-value"
                stateKey="source_value"
                isSubmitted={isSubmitted}
                errors={localErrors}
                searchKey="query"
                getDataAPI={DynamicService}
                getAPIProperties={getDynamicServicePropertiesHandler}
                extraProps={{
                  method: ComputedSourceValue?.options?.method,
                  path: ComputedSourceValue?.options?.end_point,
                  params: {
                    // TODO: remove special condition later after BE implemnent this case
                    ...(ComputedSourceValue?.options?.params?.length
                      && ComputedSourceValue.options.params.reduce(
                        (a, v) => ({
                          ...a,
                          [v.key]: v.default_value,
                        }),
                        {},
                      )),
                    ...(ComputedSourceValue?.options?.required_params?.length
                      && ComputedSourceValue?.options?.required_params.reduce(
                        (a, v) => ({
                          ...a,
                          [v.key]:
                            state.source_value?.[v.mapping_key]?.[v.primary_key],
                        }),
                        {},
                      )),
                  },
                }}
                getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onValueChanged={(e) => {
                  let newVal = {
                    ...(state.source_value || {}),
                    ...(e.value && e.value),
                  };
                  if (
                    newVal?.[ComputedSourceValue?.options?.primary_key]
                    && !e.value
                  )
                    delete newVal?.[ComputedSourceValue?.options?.primary_key];

                  onStateChanged({
                    id: 'source_value',
                    value: newVal,
                  });
                }}
                isFullWidth
                dataKey={ComputedSourceValue?.options?.data_key}
                uniqueKey={ComputedSourceValue?.options?.primary_key}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

SourceValueItemSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  sourcesList: PropTypes.array.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  state: PropTypes.shape({
    source: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    source_value: PropTypes.shape({}),
    source_group: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    filters: PropTypes.array,
    action: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    action_data: PropTypes.shape({
      stage: PropTypes.shape({
        uuid: PropTypes.string,
      }),
    }),
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  localErrors: PropTypes.shape({}).isRequired,
  getDynamicServicePropertiesHandler: PropTypes.func.isRequired,
  GetDynamicAPIOptionLabel: PropTypes.func.isRequired,
};
