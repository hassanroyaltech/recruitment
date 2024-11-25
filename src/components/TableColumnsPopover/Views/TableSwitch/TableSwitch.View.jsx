import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getDataFromObject, showError, showSuccess } from '../../../../helpers';
import { SwitchComponent } from '../../../Switch/Switch.Component';
import { TablesViewEnum } from '../../../../enums';
import { DynamicService } from '../../../../services';

const TableSwitchView = memo(
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
    const selectedBranchReducer = useSelector(
      (state) => state?.selectedBranchReducer,
    );
    const onSwitchChangedHandler = useCallback(async () => {
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
      <div className="table-switch-view-wrapper table-view-wrapper d-inline-flex">
        <SwitchComponent
          isChecked={getDataFromObject(row, columnKey, true) || false}
          label={viewItem.label || t('active')}
          isDisabled={
            isLoading
            || globalIsLoading
            || (selectedBranchReducer
              && getDataFromObject(row, viewItem.primary_key, true)
                === selectedBranchReducer.uuid)
          }
          onChange={onSwitchChangedHandler}
        />
      </div>
    );
  },
);

TableSwitchView.displayName = 'TableSwitchView';

TableSwitchView.propTypes = {
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

TableSwitchView.defaultProps = {
  onReloadData: undefined,
};

export default TableSwitchView;
