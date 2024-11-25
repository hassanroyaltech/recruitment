import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import i18next from 'i18next';
import { getDataFromObject } from '../../../../helpers';
import { TablesViewEnum } from '../../../../enums';
import './TableLabel.Style.scss';

const TableLabelView = memo(({ row, columnKey, viewItem }) => {
  const getLabelByValue = useCallback(
    () =>
      viewItem
      && viewItem.label
      && viewItem.label.find(
        (item) => item.value === (getDataFromObject(row, columnKey, true) || false),
      ),
    [columnKey, row, viewItem],
  );
  return (
    <div
      className={`table-label-view-wrapper table-view-wrapper d-inline-flex${
        (getLabelByValue() && ` ${getLabelByValue().value}-item`) || ''
      }`}
    >
      <span className="fas fa-circle px-1" />
      <span className="table-label-text px-1">
        {getLabelByValue()
          && getLabelByValue().text
          && (getLabelByValue().text[i18next.language] || getLabelByValue().text.en)}
      </span>
    </div>
  );
});

TableLabelView.displayName = 'TableLabelView';

TableLabelView.propTypes = {
  viewItem: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(TablesViewEnum).map((item) => item.key)),
    key: PropTypes.string,
    label: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.bool,
        text: PropTypes.instanceOf(Object),
      }),
    ),
  }).isRequired,
  row: PropTypes.instanceOf(Object).isRequired,
  columnKey: PropTypes.string.isRequired,
};

export default TableLabelView;
