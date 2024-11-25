import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import { numbersExpression } from '../../../../../../../../utils';

export const SourceAttributeValueSection = ({
  translationPath,
  parentTranslationPath,
  sourcesList,
  onStateChanged,
  state,
  isSubmitted,
  localErrors,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const ComputedSourceAttribute = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group.key)
        ?.attributes?.find((it) => it.key === state.source_attribute.key),
    [sourcesList, state.source.key, state.source_attribute, state.source_group.key],
  );

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        {!!ComputedSourceAttribute?.validations?.length && (
          <div className="my-2 fz-13px c-gray">
            {t(`${translationPath}attributes-fields`)}
          </div>
        )}
        {ComputedSourceAttribute?.validations?.map((field, fieldIdx) => (
          <div key={`${field.key}-${fieldIdx}`}>
            {field?.type === 'number' && (
              <SharedInputControl
                isFullWidth
                stateKey={`source_attribute_value.${field.key}`}
                placeholder={field.value}
                errorPath={`source_attribute_value.${field.key}`}
                isSubmitted={isSubmitted}
                errors={localErrors}
                editValue={state.source_attribute_value?.[field.key]}
                onValueChanged={(e) => {
                  onStateChanged({
                    parentId: 'source_attribute_value',
                    id: field.key,
                    value: e.value,
                  });
                }}
                parentTranslationPath={parentTranslationPath}
                textFieldWrapperClasses="w-100"
                type="number"
                pattern={numbersExpression}
              />
            )}
            {field?.type === 'dropdown' && (
              <SharedAutocompleteControl
                isEntireObject
                editValue={state.source_attribute_value?.[field.key]?.key}
                stateKey={`source_attribute_value.${field.key}`}
                placeholder={field.value}
                errorPath={`source_attribute_value.${field.key}.key`}
                isSubmitted={isSubmitted}
                errors={localErrors}
                initValues={field.options}
                initValuesKey="key"
                initValuesTitle="value"
                parentTranslationPath={parentTranslationPath}
                onValueChanged={(e) => {
                  onStateChanged({
                    parentId: 'source_attribute_value',
                    id: field.key,
                    value: e.value,
                  });
                }}
                isFullWidth
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

SourceAttributeValueSection.propTypes = {
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
    source_attribute: PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
    source_attribute_value: PropTypes.shape({}),
  }).isRequired,
  isSubmitted: PropTypes.bool.isRequired,
  localErrors: PropTypes.shape({}).isRequired,
};
