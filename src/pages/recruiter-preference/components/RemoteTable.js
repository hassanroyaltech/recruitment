import React, { useState } from 'react';
import paginationFactory from 'react-bootstrap-table2-paginator';
import BootstrapTable from 'react-bootstrap-table-next';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Tooltip,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';

const translationPath = 'Components.';
const parentTranslationPath = 'RecruiterPreferences';

export default function RemoteTable({
  tableProps,
  totalSize,
  currentPage,
  sizePerPage,
  cellEdit,
  expandRow,
  onTableChange,
  remote,
  footerClasses,
  ...rest
}) {
  const { t } = useTranslation(parentTranslationPath);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  return (
    <BootstrapTable
      {...rest}
      {...tableProps.baseProps}
      pagination={paginationFactory({
        hidePageListOnlyOnePage: false,
        withFirstAndLast: false,
        showTotal: true,
        page: currentPage,
        totalSize,
        sizePerPage,
        paginationTotalRenderer: (from, to, size) => (
          <span className="react-bootstrap-table-pagination-total text-muted font-14">
            {from}-{to}
            {'  '}
            {t(`${translationPath}of`)}
            {'  '}
            {size}
          </span>
        ),
        pageButtonRenderer: ({ page, active, disabled, title, onPageChange }) => {
          const handleClick = (e) => {
            e.preventDefault();
            onPageChange(page);
          };
          return (
            <ButtonBase
              onClick={handleClick}
              title={title}
              className={
                (page !== '<'
                  && page !== '>'
                  && `btns-icon mih-32px miw-32px mx-1 ${
                    (active && 'theme-outline bc-primary')
                    || 'theme-transparent c-black'
                  }`)
                || 'btns theme-transparent c-black'
              }
            >
              {(page === '<' && (
                <span className="d-inline-flex-center">
                  <span className="fas fa-angle-double-left mr-2-reversed" />
                  <span>{t(`${translationPath}previous-page`)}</span>
                </span>
              ))
                || (page === '>' && (
                  <span className="d-inline-flex-center">
                    <span>{t(`${translationPath}next-page`)}</span>
                    <span className="fas fa-angle-double-right ml-2-reversed" />
                  </span>
                ))
                || page}
            </ButtonBase>
          );
        },
        sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
          <div
            className="pl-0-reversed dataTables_length"
            id="datatable-basic_length"
          >
            <UncontrolledDropdown>
              <DropdownToggle
                id="pageNumber"
                className="btn btn-link bg-transparent border-0 rounded-circle"
                style={{
                  color: '#6d737a',
                  width: 30,
                  height: 30,
                  margin: 0,
                  padding: 0,
                }}
              >
                <i className="fa fa-ellipsis-v" />
              </DropdownToggle>
              <Tooltip
                placement="right"
                isOpen={tooltipOpen}
                target="pageNumber"
                toggle={toggle}
              >
                Page Count
              </Tooltip>
              <DropdownMenu left>
                {[10, 25, 50, 100].map((size) => (
                  <DropdownItem
                    key={`${size + 1}-size`}
                    onClick={() => {
                      onSizePerPageChange(size);
                    }}
                  >
                    {size}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledDropdown>
          </div>
        ),
      })}
      bootstrap4
      remote={remote}
      onTableChange={onTableChange}
      bordered={false}
      striped
      hover
      condensed
      cellEdit={cellEdit || {}}
      expandRow={expandRow || {}}
      footerClasses={footerClasses || ''}
    />
  );
}
