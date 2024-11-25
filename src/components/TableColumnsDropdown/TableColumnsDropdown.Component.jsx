import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { AutocompleteComponent } from '../Autocomplete/Autocomplete.Component';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';

export const TableColumnsDropdownComponent = memo(
  ({ idRef, columns, onColumnsChanged, isDisabled, isLoading }) => (
    <AutocompleteComponent
      idRef={idRef}
      data={columns}
      getOptionLabel={(option) => option.label}
      chipsLabel={(option) => option.label}
      isOptionEqualToValue={(option, value) => !value.isHidden}
      multiple
      limitTags={3}
      value={columns.filter((column) => !column.isHidden)}
      isDisabled={isDisabled}
      isLoading={isLoading}
      renderOption={(renderProps, option, { selected }) => (
        <li {...renderProps}>
          <span>
            <CheckboxesComponent
              idRef={`checkbox${idRef}`}
              label={option.label}
              isDisabled={option.isDisabled || isDisabled}
              singleChecked={selected}
              onSelectedCheckboxClicked={(event) => {
                event.preventDefault();
                event.stopPropagation();
                const localColumns = [...columns];
                const itemIndex = columns.findIndex(
                  (column) => column.id === option.id,
                );
                if (itemIndex === -1) return;
                localColumns[itemIndex].isHidden = selected;
                if (onColumnsChanged) onColumnsChanged(localColumns, event);
              }}
            />
          </span>
        </li>
      )}
      onChange={(event, newValue) => {
        const localColumns = [...columns];
        const addedItems = localColumns.filter(
          (column) =>
            newValue.findIndex(
              (item) =>
                column.isHidden !== localColumns.isHidden && item.id === column.id,
            ) !== -1,
        );
        const deletedItems = localColumns.filter(
          (column) => newValue.findIndex((item) => item.id === column.id) === -1,
        );
        addedItems.map((item) => {
          const itemIndex = localColumns.findIndex(
            (column) => column.id === item.id,
          );
          if (itemIndex !== -1) localColumns[itemIndex].isHidden = false;
          return undefined;
        });
        deletedItems.map((item) => {
          const itemIndex = localColumns.findIndex(
            (column) => column.id === item.id,
          );
          if (itemIndex !== -1) localColumns[itemIndex].isHidden = true;
          return undefined;
        });
        if (onColumnsChanged) onColumnsChanged(localColumns, event);
      }}
    />
  ),
);

TableColumnsDropdownComponent.displayName = 'TableColumnsDropdownComponent';

TableColumnsDropdownComponent.propTypes = {
  idRef: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      isHidden: PropTypes.bool,
      isDisabled: PropTypes.bool,
    }),
  ),
  isDisabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  onColumnsChanged: PropTypes.func,
};

TableColumnsDropdownComponent.defaultProps = {
  idRef: 'TableColumnsDropdownComponentRef',
  columns: [],
  isDisabled: false,
  isLoading: false,
  onColumnsChanged: undefined,
};
