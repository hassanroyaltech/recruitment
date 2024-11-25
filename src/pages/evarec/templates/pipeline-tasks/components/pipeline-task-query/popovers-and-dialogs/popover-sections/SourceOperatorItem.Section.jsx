import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';

export const SourceOperatorItemSection = ({
  closePopoversHandler,
  sourcesList,
  onStateChanged,
  queryData,
  state,
}) => (
  <div className="min-width-200px m-2">
    <div className="d-flex-column pb-2 mx-2">
      {sourcesList
        .find((it) => it.source_key === state.source?.key)
        ?.source_operator_groups.map((sourceGroup, idx) => (
          <div key={`${idx}-sourceGroup-item-${sourceGroup.key}`}>
            <div className="mt-2 fz-13px c-gray">{sourceGroup.value}</div>
            <div className="d-flex-column">
              {sourceGroup.operators.map((op) => (
                <ButtonBase
                  key={`${idx}-sourceGroup-operator-${sourceGroup.key}-${op.key}`}
                  onClick={() => {
                    onStateChanged({
                      id: 'edit',
                      value: {
                        source_operator: op,
                        source_group: sourceGroup,
                        source: state.source,
                        is_grouped: state.is_grouped || false,
                        ...(sourceGroup.options.type === 'string'
                          && sourceGroup.options.default_value && {
                          source_value: sourceGroup.options.default_value,
                        }),
                        ...(sourceGroup.auto_filled_source_value && {
                          source_value: state.source_value,
                          ...(sourceGroup.options.default_value && {
                            source_value:
                              sourceGroup.options.type === 'string'
                              && sourceGroup.options.default_value,
                          }),
                        }),
                        ...(queryData?.uuid && {
                          uuid: queryData.uuid,
                        }),
                      },
                    });
                    closePopoversHandler();
                  }}
                  className="popover-item-justify btns theme-transparent mx-0 px-0"
                >
                  <span className="mx-2">{op.value}</span>
                </ButtonBase>
              ))}
            </div>
          </div>
        ))}
    </div>
  </div>
);

SourceOperatorItemSection.propTypes = {
  closePopoversHandler: PropTypes.func.isRequired,
  sourcesList: PropTypes.array.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  queryData: PropTypes.shape({
    uuid: PropTypes.string,
  }),
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
