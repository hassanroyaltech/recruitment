import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';

export const FilterItemSection = ({
  popoverAttachedWith,
  closePopoversHandler,
  onStateChanged,
  state,
  filtersList,
}) => (
  <div className="min-width-200px m-2">
    <div className="d-flex-column mx-2">
      {filtersList.filter_groups?.map((filterGroup, idx) => (
        <div key={`${idx}-filterGroup-item-${filterGroup.key}`}>
          <div className="my-2 fz-13px c-gray-dark">{filterGroup.value}</div>
          <div className="d-flex-column">
            {Object.keys(filterGroup.properties).map((property) => (
              <ButtonBase
                key={`${idx}-filterGroup-operator-${filterGroup.key}-${property}`}
                onClick={() => {
                  onStateChanged({
                    value: {
                      filter_key: {
                        key: property,
                        value: filterGroup.properties[property].value,
                      },
                      filter_group: {
                        key: filterGroup.key,
                        value: filterGroup.value,
                      },
                      main_operator:
                        state.filters[popoverAttachedWith.id].main_operator,
                      filter_operator: null,
                      filter_value: null,
                      is_grouped: false,
                    },
                    parentId: 'filters',
                    parentIndex: popoverAttachedWith.id,
                  });
                  closePopoversHandler();
                }}
                className="popover-item-justify btns theme-transparent"
              >
                <span className="mx-2">
                  {filterGroup.properties[property].value}
                </span>
              </ButtonBase>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

FilterItemSection.propTypes = {
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
