import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';

export const SourceAttributeItemSection = ({
  translationPath,
  parentTranslationPath,
  sourcesList,
  onStateChanged,
  state,
  closePopoversHandler,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  const ComputedSourceValue = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group.key),
    [sourcesList, state.source.key, state.source_group.key],
  );

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column m-2">
        {!!ComputedSourceValue?.attributes?.length && (
          <div className="my-2 fz-13px c-gray">
            {t(`${translationPath}attributes`)}
          </div>
        )}
        {ComputedSourceValue?.attributes?.map((attribute, attributeIdx) => (
          <div key={`${attribute.key}-${attributeIdx}`}>
            <ButtonBase
              onClick={() => {
                const isDeselect = state.source_attribute?.key === attribute.key;
                onStateChanged({
                  id: 'source_attribute',
                  value: isDeselect ? null : attribute,
                });
                if (isDeselect)
                  onStateChanged({
                    id: 'source_attribute_value',
                    value: null,
                  });

                closePopoversHandler();
              }}
              className={`popover-item-justify btns theme-transparent w-100${
                state.source_attribute?.key === attribute.key ? ' is-active' : ''
              }`}
            >
              <span className="mx-2">{attribute.value}</span>
            </ButtonBase>
          </div>
        ))}
      </div>
    </div>
  );
};

SourceAttributeItemSection.propTypes = {
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
      key: PropTypes.number,
    }),
  }).isRequired,
  closePopoversHandler: PropTypes.func.isRequired,
};
