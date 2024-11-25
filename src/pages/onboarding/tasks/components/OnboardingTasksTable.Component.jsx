import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TablesComponent from '../../../../components/Tables/Tables.Component';

export const OnboardingTasksTableComponent = ({
  totalItems,
  data,
  headerData,
  onColumnsChanged,
  onIsLoadingColumnsChanged,
  onActionClicked,
  tableActions,
  isLoading,
  isLoadingColumns,
  isWithNumbering,
  isWithoutBoxWrapper,
  themeClasses,
  isWithTableActions,
  tableActionsOptions,
}) => {
  const [localTablesFilter, setLocalTablesFilter] = useState({});

  const onPageIndexChanged = (newIndex) => {
    setLocalTablesFilter((items) => ({
      ...items,
      page: newIndex + 1,
    }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setLocalTablesFilter((items) => ({
      ...items,
      page: 1,
      limit: newPageSize,
    }));
  };

  return (
    <TablesComponent
      isWithNumbering={isWithNumbering}
      isWithoutBoxWrapper={isWithoutBoxWrapper}
      themeClasses={themeClasses}
      pageSize={localTablesFilter?.limit || 10}
      totalItems={totalItems}
      data={data}
      headerData={headerData}
      onColumnsChanged={onColumnsChanged}
      onIsLoadingColumnsChanged={onIsLoadingColumnsChanged}
      isWithTableActions={isWithTableActions}
      onActionClicked={onActionClicked}
      tableActions={tableActions}
      pageIndex={(localTablesFilter?.page || 1) - 1}
      isLoading={isLoading || isLoadingColumns}
      onPageIndexChanged={onPageIndexChanged}
      onPageSizeChanged={onPageSizeChanged}
      tableActionsOptions={tableActionsOptions}
    />
  );
};

OnboardingTasksTableComponent.propTypes = {
  totalItems: PropTypes.number,
  data: PropTypes.instanceOf(Array),
  headerData: PropTypes.instanceOf(Array),
  onColumnsChanged: PropTypes.func,
  onIsLoadingColumnsChanged: PropTypes.func,
  onActionClicked: PropTypes.func,
  tableActions: PropTypes.instanceOf(Array),
  isLoading: PropTypes.bool,
  isLoadingColumns: PropTypes.bool,
  isWithNumbering: PropTypes.bool,
  isWithoutBoxWrapper: PropTypes.bool,
  themeClasses: PropTypes.string,
  isWithTableActions: PropTypes.bool,
  tableActionsOptions: PropTypes.instanceOf(Object),
};
