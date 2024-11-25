import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { JobHiringStatusesEnum } from '../../../../enums';
import { useTranslation } from 'react-i18next';

const TableLabelColorView = memo(({ row, columnKey }) => {
  const { t } = useTranslation('Shared');
  const tableLabelStatus = useCallback(
    (status) =>
      Object.values(JobHiringStatusesEnum).find((item) => item.key === status),
    [],
  );

  return (
    <div>
      {row[columnKey] ? (
        <span className={tableLabelStatus(row[columnKey])?.color || ''}>
          {t(`${tableLabelStatus(row[columnKey])?.value}`)}
        </span>
      ) : (
        '-'
      )}
    </div>
  );
});

TableLabelColorView.displayName = 'TableLabelColorView';
TableLabelColorView.propTypes = {
  row: PropTypes.instanceOf(Object).isRequired,
  columnKey: PropTypes.string.isRequired,
};

export default TableLabelColorView;
