import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getDataFromObject, showError, showSuccess } from '../../../../helpers';
import { TablesViewEnum } from '../../../../enums';
import { DynamicService } from '../../../../services';
import LabeledCheckbox from '../../../Inputs/LabeledCheckbox';
const TableCheckboxView = memo( // Renamed the component to TableCheckboxView
  ({
    row,
    columnKey,
    columnName,
    viewItem,
    onReloadData,
    rowIndex,
    globalIsLoading,
  }) => {
    const { t } = useTranslation('Shared');
    const [isLoading, setIsLoading] = useState(false);
    const selectedJobReducer = useSelector(
      (state) => state?.jobReducer,
    );

    const onCheckboxChangedHandler = useCallback(async () => { // Renamed the handler
      setIsLoading(true);
      const response = await DynamicService({
        path: viewItem.end_point,
        method: viewItem.method,
        body: {
          [viewItem.primary_key]: getDataFromObject(row, viewItem.primary_key, true),
          ...(viewItem.switchExtraBody || {}),
        },
      });
      setIsLoading(false);
      if (
        response
        && (response.status === 200
          || response.status === 201
          || response.status === 202)
      ) {
        showSuccess(`"${columnName}" ${t('updated-successfully')}`);
        if (onReloadData)
          onReloadData({
            row,
            rowIndex,
            columnName,
            viewItem,
          });
      } else showError(`"${columnName}" ${t('update-failed')}`, response);
    }, [columnName, onReloadData, row, rowIndex, t, viewItem]);

    return (
      <div className="table-checkbox-view-wrapper table-view-wrapper d-inline-flex">
        <LabeledCheckbox
          id={`status-${rowIndex}`}
          ats
          checked={getDataFromObject(row, columnKey, true) || false}
          onChange={() => onCheckboxChangedHandler()} // Updated the function name
          disabled={
            isLoading
            || globalIsLoading
            || (selectedJobReducer
              && getDataFromObject(row, viewItem.primary_key, true)
              === selectedJobReducer.uuid)
          }
          label={viewItem.label || t('active')}
        />
      </div>
    );
  },
);

TableCheckboxView.displayName = 'TableCheckboxView'; // Updated displayName

TableCheckboxView.propTypes = {
  viewItem: PropTypes.shape({
    type: PropTypes.oneOf(Object.values(TablesViewEnum).map((item) => item.key)),
    key: PropTypes.string,
    columnName: PropTypes.string,
    end_point: PropTypes.string,
    method: PropTypes.oneOf(['post', 'put', 'get', 'delete']),
    primary_key: PropTypes.string,
    switchExtraBody: PropTypes.instanceOf(Object),
    label: PropTypes.string,
  }).isRequired,
  row: PropTypes.instanceOf(Object).isRequired,
  globalIsLoading: PropTypes.bool.isRequired,
  columnKey: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columnName: PropTypes.string.isRequired,
  onReloadData: PropTypes.func,
};

TableCheckboxView.defaultProps = {
  onReloadData: undefined,
};

export default TableCheckboxView; // Updated export name
