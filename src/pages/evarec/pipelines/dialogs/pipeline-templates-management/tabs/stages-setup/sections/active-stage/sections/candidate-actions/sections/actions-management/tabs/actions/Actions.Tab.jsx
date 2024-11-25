import React from 'react';
import PropTypes from 'prop-types';
import { CheckboxesComponent } from '../../../../../../../../../../../../../../../components';
import Avatar from '@mui/material/Avatar';
import { StringToColor } from '../../../../../../../../../../../../../../../helpers';

export const ActionsTab = ({
  savedItems,
  activeStage,
  arrayKey,
  stageCandidateActionsEnum,
  getIsActionSelectedByType,
  onStateChanged,
}) => (
  <div className="actions-tab">
    <div className="actions-types-items-wrapper">
      {stageCandidateActionsEnum.map((item, index) => (
        <div className="actions-types-item" key={`actionsTypesItemKey${index + 1}`}>
          <CheckboxesComponent
            idRef={`actionsTypesItemRef${index + 1}`}
            singleChecked={getIsActionSelectedByType(item.key)}
            onSelectedCheckboxChanged={(event, isChecked) => {
              if (!onStateChanged) return;
              const localItems = [...savedItems];
              if (isChecked)
                localItems.push({
                  type: item.key,
                  ...(item.listDetails
                    && item.listDetails.savingKey && {
                    [item.listDetails.savingKey]: [],
                  }),
                  ...(item.listDetails
                    && item.listDetails.fullDataKey && {
                    [item.listDetails.fullDataKey]: [],
                  }),
                });
              else {
                const itemIndex = localItems.findIndex(
                  (element) => element.type === item.key,
                );
                if (itemIndex !== -1) localItems.splice(itemIndex, 1);
              }
              onStateChanged({
                parentId: 'stages',
                parentIndex: activeStage,
                id: arrayKey,
                value: [...localItems],
              });
            }}
          />
          <span className="d-inline-flex-v-center">
            <Avatar
              style={{
                backgroundColor: StringToColor(item.value),
              }}
            >
              {item.value
                .split(' ')
                .filter(
                  (element, elementIndex, elements) =>
                    elementIndex === 0 || elementIndex === elements.length - 1,
                )
                .map((word) => word[0]) || ''}
            </Avatar>
            <span className="px-2">{item.value}</span>
          </span>
        </div>
      ))}
    </div>
  </div>
);

ActionsTab.propTypes = {
  stageCandidateActionsEnum: PropTypes.instanceOf(Array).isRequired,
  getIsActionSelectedByType: PropTypes.func.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  activeStage: PropTypes.number.isRequired,
  savedItems: PropTypes.instanceOf(Array).isRequired,
  arrayKey: PropTypes.string.isRequired,
};
