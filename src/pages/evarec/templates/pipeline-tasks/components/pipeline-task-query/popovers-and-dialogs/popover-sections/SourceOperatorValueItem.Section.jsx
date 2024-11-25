import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';

export const SourceOperatorValueItemSection = ({
  closePopoversHandler,
  sourcesList,
  onStateChanged,
  state,
}) => {
  const ComputedSourceValue = useMemo(
    () =>
      sourcesList
        .find((it) => it.source_key === state.source.key)
        ?.source_operator_groups?.find((it) => it.key === state.source_group.key),
    [sourcesList, state.source.key, state.source_group.key],
  );

  return (
    <div className="min-width-200px m-2">
      <div className="d-flex-column pb-2 mx-2">
        {Object.entries(ComputedSourceValue?.operator_values || {}).map(
          ([operatorKey, operatorValue]) => (
            <div key={`${operatorKey}-operatorValue-item-${operatorValue}`}>
              <ButtonBase
                onClick={() => {
                  onStateChanged({
                    id: 'source_operator_value',
                    value: { key: operatorKey, value: operatorValue },
                  });
                  closePopoversHandler();
                }}
                className="popover-item-justify btns theme-transparent mx-0 px-0"
              >
                <span className="mx-2">{operatorValue}</span>
              </ButtonBase>
            </div>
          ),
        )}
      </div>
    </div>
  );
};

SourceOperatorValueItemSection.propTypes = {
  closePopoversHandler: PropTypes.func.isRequired,
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
    is_grouped: PropTypes.bool,
  }).isRequired,
};
