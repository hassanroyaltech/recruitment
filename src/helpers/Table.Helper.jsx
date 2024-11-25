import React from 'react';
import { getDataFromObject } from './Middleware.Helper';
import TableAvatarsView from '../components/TableColumnsPopover/Views/TableAvatars/TableAvatars.View';
import TableSwitchView from '../components/TableColumnsPopover/Views/TableSwitch/TableSwitch.View';
import { TablesViewEnum } from '../enums';
import TableLabelView from '../components/TableColumnsPopover/Views/BooleanLabel/TableLabel.View';
import TableLabeledCheckboxView
  from '../components/TableColumnsPopover/Views/TableLabelCheckbox/TableLabeledCheckbox.View';
import TableLabelColorView from '../components/TableColumnsPopover/Views/TableLabelColor/TableLabelColor.View';
/**
 * @param selectedRows - array of all selected rows
 * @param pageData - the current page data
 * @param uniqueKeyInput - the unique column item
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get all selected rows after update
 */
export const globalSelectedRowsHandler = (
  selectedRows = [],
  pageData = [],
  uniqueKeyInput = 'uuid',
) => {
  const localItems = [...selectedRows];
  const notSelectedFields = pageData.filter(
    (item) =>
      localItems.findIndex(
        (element) =>
          getDataFromObject(item, uniqueKeyInput)
          === getDataFromObject(element, uniqueKeyInput),
      ) === -1,
  );
  if (notSelectedFields.length === 0) return [];
  return [...localItems, ...notSelectedFields];
};

/**
 * @param selectedRows - array of all selected rows
 * @param selectedRow - the current checkbox value
 * @param uniqueKeyInput - the unique column item
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to get all selected rows after update
 */
export const globalSelectedRowHandler = (
  selectedRows = [],
  selectedRow = {},
  uniqueKeyInput = 'uuid',
) => {
  const localItems = [...selectedRows];
  const itemIndex = localItems.findIndex(
    (item) =>
      getDataFromObject(item, uniqueKeyInput)
      === getDataFromObject(selectedRow, uniqueKeyInput),
  );
  if (itemIndex !== -1) localItems.splice(itemIndex, 1);
  else localItems.push(selectedRow);
  return localItems;
};

/**
 * @param columnKey -- the column key
 * @param options -- the options of table
 * @param columnName -- the column name
 * @param globalIsLoading -- the is loading
 * @param onReloadData -- the reload function
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to return the component to display in the table if key
 * displayed in the table
 */
const getOptionsComponent
  = (columnKey, options, columnName, globalIsLoading, onReloadData) =>
  // eslint-disable-next-line react/display-name
    (row, rowIndex) => {
      if (!options || !options.view) return undefined;
      const { view } = options;
      const viewItem = view.find((item) => item.key === columnKey);
      if (!viewItem) return undefined;
      if (
        viewItem.type === TablesViewEnum.Avatar.key
      || viewItem.type === TablesViewEnum.TextAndAvatar.key
      )
        return (
          <TableAvatarsView
            row={row}
            rowIndex={rowIndex}
            columnKey={columnKey}
            isWithText={viewItem.type === TablesViewEnum.TextAndAvatar.key}
            viewItem={viewItem}
            onReloadData={onReloadData}
            columnName={columnName}
          />
        );
      if (viewItem.type === TablesViewEnum.Switch.key)
        return (
          <TableSwitchView
            viewItem={viewItem}
            row={row}
            rowIndex={rowIndex}
            onReloadData={onReloadData}
            columnKey={columnKey}
            globalIsLoading={globalIsLoading}
            columnName={columnName}
          />
        );
      if (viewItem.type === TablesViewEnum.LabelCheckBox.key)
        return (
          <TableLabeledCheckboxView
            viewItem={viewItem}
            row={row}
            rowIndex={rowIndex}
            onReloadData={onReloadData}
            columnKey={columnKey}
            globalIsLoading={globalIsLoading}
            columnName={columnName}
          />
        );
      if (viewItem.type === TablesViewEnum.Label.key)
        return <TableLabelView columnKey={columnKey} row={row} viewItem={viewItem} />;
      if(viewItem.type === TablesViewEnum.LabelColor.key)
        return <TableLabelColorView columnKey={columnKey} row={row}  />
      return undefined;
    };

/**
 * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
 * @Description this method is to redraw the table on response or isLoading change
 */
export const TableColumnsPainter = (
  response,
  onColumnsChanged,
  isLoading = undefined,
  onReloadData = undefined,
) => {
  if (onColumnsChanged)
    onColumnsChanged(
      Object.entries(
        (response.data.results && response.data.results.default_columns) || {},
      )
        .filter((item) => !item[0].includes('uuid'))
        .map((item) => ({
          input: item[0],
          label: item[1],
          isHidden: !response.data.results.columns.includes(item[0]),
          component: getOptionsComponent(
            item[0],
            response.data.results.options,
            item[1],
            isLoading,
            onReloadData,
          ),
        })),
    );
};
