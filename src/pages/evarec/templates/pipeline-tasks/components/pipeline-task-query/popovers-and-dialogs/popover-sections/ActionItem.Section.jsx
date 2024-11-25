import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';

export const ActionItemSection = ({
  closePopoversHandler,
  onStateChanged,
  actions_list,
}) => (
  <div className="min-width-200px m-2">
    <div>
      <div className="d-flex-column">
        {actions_list.map((actionItem, idx) => (
          <ButtonBase
            key={`${idx}-action-item-${actionItem.key}`}
            onClick={() => {
              onStateChanged({
                id: 'action',
                value: actionItem,
              });
              onStateChanged({
                id: 'action_data',
                value: Object.keys(actionItem.validations).reduce(
                  (accumulator, currentValue) => {
                    accumulator[currentValue] = null;
                    return accumulator;
                  },
                  {},
                ),
              });
              closePopoversHandler();
            }}
            className="popover-item-justify btns theme-transparent m-2"
          >
            <span className="fas fa-user" />
            <span className="mx-2">{actionItem.value}</span>
          </ButtonBase>
        ))}
      </div>
    </div>
  </div>
);

ActionItemSection.propTypes = {
  closePopoversHandler: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  actions_list: PropTypes.array.isRequired,
};
