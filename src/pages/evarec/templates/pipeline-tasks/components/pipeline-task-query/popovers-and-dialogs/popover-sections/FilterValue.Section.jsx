import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import { DynamicService } from '../../../../../../../../services';
import { useTranslation } from 'react-i18next';

export const FilterValueItemSection = ({
  translationPath,
  parentTranslationPath,
  popoverAttachedWith,
  closePopoversHandler,
  onStateChanged,
  state,
  filtersList,
  isSubmitted,
  localErrors,
  getDynamicServicePropertiesHandler,
  GetDynamicAPIOptionLabel,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const ComputedFilterOptions = useMemo(
    () =>
      filtersList.filter_groups.find(
        (it) => it.key === state.filters[popoverAttachedWith.id].filter_group.key,
      ).properties[state.filters[popoverAttachedWith.id].filter_key.key],
    [filtersList, popoverAttachedWith.id, state.filters],
  );

  console.log({
    state,
    key: state.filters[popoverAttachedWith.id]?.filter_value?.key,
    popoverAttachedWith,
  });
  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column mx-2 mb-2">
        <div className="my-2 fz-13px c-gray">
          {t(`${translationPath}select-filter-value`)}
        </div>
        {ComputedFilterOptions.default_options?.length > 0 && (
          <SharedAutocompleteControl
            isEntireObject
            editValue={state.filters[popoverAttachedWith.id]?.filter_value?.key}
            placeholder={ComputedFilterOptions.value}
            title={ComputedFilterOptions.value}
            stateKey="filter_value"
            isFullWidth
            initValuesKey="key"
            initValuesTitle="value"
            onValueChanged={({ value }) => {
              onStateChanged({
                id: 'filter_value',
                value,
                parentId: 'filters',
                parentIndex: popoverAttachedWith.id,
              });
              closePopoversHandler();
            }}
            initValues={ComputedFilterOptions.default_options}
            errorPath="filter_value"
            errors={localErrors}
          />
        )}
        {ComputedFilterOptions.options?.type === 'string' && (
          <SharedInputControl
            isFullWidth
            stateKey="title"
            placeholder="write-filter-value"
            errorPath="filter_value"
            isSubmitted={isSubmitted}
            errors={localErrors}
            editValue={state.filters[popoverAttachedWith.id]?.filter_value?.key}
            // isDisabled={isLoading}
            onValueChanged={(e) =>
              onStateChanged({
                id: 'filter_value',
                value: e.value,
                parentId: 'filters',
                parentIndex: popoverAttachedWith.id,
              })
            }
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            textFieldWrapperClasses="w-100 px-3 pt-3"
          />
        )}
        {ComputedFilterOptions.options?.type === 'dropdown' && (
          <SharedAPIAutocompleteControl
            isEntireObject
            filterOptions={(options) => options}
            editValue={state.filters[popoverAttachedWith.id]?.filter_value?.uuid}
            placeholder="select-filter-value"
            stateKey="filter_value"
            isSubmitted={isSubmitted}
            errors={localErrors}
            // isDisabled={isLoading || !field.is_editable}
            searchKey="query"
            getDataAPI={DynamicService}
            getAPIProperties={getDynamicServicePropertiesHandler}
            extraProps={{
              path: ComputedFilterOptions.options.end_point,
              method: ComputedFilterOptions.options.method,
              params: {
                ...(ComputedFilterOptions.options.params?.length
                  && ComputedFilterOptions.options.params.reduce(
                    (a, v) => ({ ...a, [v.key]: v.default_value }),
                    {},
                  )),
                ...(state.filters[popoverAttachedWith.id]?.filter_value?.uuid && {
                  with_than: [
                    state.filters[popoverAttachedWith.id]?.filter_value?.uuid,
                  ],
                }),
              },
            }}
            getOptionLabel={(option) => GetDynamicAPIOptionLabel(option)}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onValueChanged={(e) => {
              const primaryKey = ComputedFilterOptions.options.primary_key;
              onStateChanged({
                id: 'filter_value',
                value: {
                  [primaryKey]: e.value?.[primaryKey],
                  name: GetDynamicAPIOptionLabel(e.value),
                },
                parentId: 'filters',
                parentIndex: popoverAttachedWith.id,
              });
              closePopoversHandler();
            }}
            errorPath="filter_value"
            isFullWidth
          />
        )}
      </div>
    </div>
  );
};

FilterValueItemSection.propTypes = {
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  popoverAttachedWith: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  closePopoversHandler: PropTypes.func.isRequired,
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
  filtersList: PropTypes.shape({
    filter_groups: PropTypes.array,
    main_operators: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.number,
        value: PropTypes.string,
        allow_to_be_first_filter: PropTypes.bool,
      }),
    ),
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  localErrors: PropTypes.shape({}),
  getDynamicServicePropertiesHandler: PropTypes.func.isRequired,
  GetDynamicAPIOptionLabel: PropTypes.func.isRequired,
};
