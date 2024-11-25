import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';

export default function RemoteTable({
  tableProps,
  totalSize,
  cellEdit,
  expandRow,
  footerClasses,
  ...rest
}) {
  return (
    <React.Fragment>
      <div>
        <BootstrapTable
          {...rest}
          {...tableProps.baseProps}
          bootstrap4
          bordered={false}
          striped
          hover
          condensed
          cellEdit={cellEdit || {}}
          expandRow={expandRow || {}}
          footerClasses={footerClasses || ''}
        />
      </div>
    </React.Fragment>
  );
}
