import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';

export const FilterOperatorItemSection = ({
  popoverAttachedWith,
  closePopoversHandler,
  onStateChanged,
  state,
  filtersList,
}) => (
  <div className="min-width-200px m-2">
    <div className="d-flex-column">
      {Object.keys(
        filtersList.filter_groups.find(
          (it) => it.key === state.filters[popoverAttachedWith.id].filter_group.key,
        ).operators,
      ).map((filterOperator, idx) => (
        <div key={`${idx}-filterOperator-item-${filterOperator}`}>
          <ButtonBase
            onClick={() => {
              onStateChanged({
                id: 'filter_operator',
                value: {
                  key: filterOperator,
                  value: filtersList.filter_groups.find(
                    (it) =>
                      it.key
                      === state.filters[popoverAttachedWith.id].filter_group.key,
                  ).operators[filterOperator],
                },
                parentId: 'filters',
                parentIndex: popoverAttachedWith.id,
              });
              closePopoversHandler();
            }}
            className="popover-item-justify btns theme-transparent"
          >
            <span className="mx-2">
              {
                filtersList.filter_groups.find(
                  (it) =>
                    it.key
                    === state.filters[popoverAttachedWith.id].filter_group.key,
                ).operators[filterOperator]
              }
            </span>
          </ButtonBase>
        </div>
      ))}
    </div>
  </div>
);

FilterOperatorItemSection.propTypes = {
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
};
