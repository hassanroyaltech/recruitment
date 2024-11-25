// noinspection JSCheckFunctionSignatures

import React, { useCallback, useState, useRef, memo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Table from '@mui/material/Table';
import './Tables.Style.scss';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableFooter from '@mui/material/TableFooter';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import { useEventListener } from '../../hooks';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';
import { getDataFromObject, GlobalDisplayDateTimeFormat } from '../../helpers';
import { PaginationComponent } from '../Pagination/Pagination.Component';
import {
  PaginationEnum,
  SystemActionsEnum,
  TableActionsThemesEnum,
} from '../../enums';
import { LoaderComponent } from '../Loader/Loader.Component';
import Empty from '../../pages/recruiter-preference/components/Empty';
import { ActionsButtonsSection, ActionsPopoverSection } from './sections';

const TablesComponent = memo(
  ({
    tableOptions,
    parentTranslationPath,
    translationPath,
    data,
    headerData,
    footerData,
    sortColumnClicked,
    focusedRowChanged,
    dateFormat,
    headerRowRef,
    bodyRowRef,
    onHeaderColumnsReorder,
    isSelectAllDisabled,
    uniqueKeyInput,
    isWithCheckAll,
    isWithCheck,
    isWithEmpty,
    message,
    defaultMessage,
    onSelectAllCheckboxChanged,
    localSelectedRowsController,
    onSelectCheckboxChanged,
    getIsSelectedRow,
    getIsDisabledRow,
    isSelectAll,
    isStickyCheckboxColumn,
    leftCheckboxColumn,
    rightCheckboxColumn,
    selectedRows,
    onSelectedRowsCountChanged,
    isResizable,
    isLoading,
    tableActions,
    isWithTableActions,
    tableActionsOptions,
    isDisabledActions,
    onActionClicked,
    isResizeCheckboxColumn,
    isOriginalPagination,
    paginationIdRef,
    onPageIndexChanged,
    totalItems,
    pageIndex,
    pageSize,
    onPageSizeChanged,
    isWithoutHeader,
    isDynamicDate,
    isWithoutBoxWrapper,
    tooltipPlacement,
    getTableHeaderContent,
    tableHeaderClasses,
    themeClasses,
    isWithHeaderDetails,
    headerDetailsTitle,
    wrapperClasses,
    isTriggerFocus,
    isWithoutTableHeader,
    tableActionsThemes,
    onBodyRowClicked,
    isWithNumbering,
  }) => {
    const { t } = useTranslation([parentTranslationPath, 'Shared']);
    const [reorderedHeader, setReorderedHeader] = useState(null);
    const [currentDraggingColumn, setCurrentDraggingColumn] = useState(null);
    const [currentDragOverIndex, setCurrentDragOverIndex] = useState(null);
    const currentResizingColumnRef = useRef(null);
    const startResizePointRef = useRef(null);
    const [localSelectedRows, setLocalSelectedRows] = useState([]);
    const [currentOrderById, setCurrentOrderById] = useState(-1);
    const [activeItem, setActiveItem] = useState(null);
    const [currentOrderDirection, setCurrentOrderDirection] = useState('desc');
    const tableRef = useRef(null);
    const [focusedRow, setFocusedRow] = useState(-1);
    const descendingComparator = (a, b, orderBy) => {
      if (b[orderBy] < a[orderBy]) return -1;
      if (b[orderBy] > a[orderBy]) return 1;
      return 0;
    };
    const getComparator = (order, orderBy) =>
      order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
    const createSortHandler = useCallback(
      (columnId) => () => {
        if (!tableOptions) return;
        setCurrentOrderDirection((item) => (item === 'desc' ? 'asc' : 'desc'));
        setCurrentOrderById(columnId);
        if (tableOptions.sortFrom === 2)
          sortColumnClicked(columnId, currentOrderDirection);
      },
      [currentOrderDirection, tableOptions, sortColumnClicked],
    );
    const stableSort = (array, comparator) => {
      const stabilizedThis = array.map((el, index) => [el, index]);
      stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
      });
      return stabilizedThis.map((el) => el[0]);
    };
    const getCurrentSelectedItemIndex = useCallback(
      (row) =>
        localSelectedRows.findIndex(
          (item) =>
            getDataFromObject(row, uniqueKeyInput)
            === getDataFromObject(item, uniqueKeyInput),
        ),
      [localSelectedRows, uniqueKeyInput],
    );
    const onSelectAllCheckboxChangedHandler = useCallback(
      (event, isChecked) => {
        if (!selectedRows)
          setLocalSelectedRows((items) => {
            const localItems = [...items];
            const notSelectedFields = data.filter(
              (item) =>
                localItems.findIndex(
                  (element) =>
                    getDataFromObject(item, uniqueKeyInput)
                    === getDataFromObject(element, uniqueKeyInput),
                ) === -1,
            );
            if (notSelectedFields.length === 0) return [];
            return [...localItems, ...notSelectedFields];
          });
        else if (onSelectAllCheckboxChanged)
          onSelectAllCheckboxChanged({
            selectedRows,
            isChecked,
          });
      },
      [data, onSelectAllCheckboxChanged, selectedRows, uniqueKeyInput],
    );
    const onSelectCheckboxChangedHandler = useCallback(
      (row, rowIndex) => (event) => {
        event.stopPropagation();
        const isChecked = event.target.checked;
        if (!selectedRows)
          setLocalSelectedRows((items) => {
            const localRowIndex = getCurrentSelectedItemIndex(row);
            if (isChecked) items.push(row);
            else if (localRowIndex !== -1) items.splice(localRowIndex, 1);

            if (onSelectCheckboxChanged)
              onSelectCheckboxChanged({
                selectedRows: items,
                selectedRow: row,
                rowIndex,
              });
            return [...items];
          });
        else if (onSelectCheckboxChanged)
          onSelectCheckboxChanged({ selectedRow: row, rowIndex });
      },
      [getCurrentSelectedItemIndex, onSelectCheckboxChanged, selectedRows],
    );

    const bodyRowClicked = useCallback(
      (rowIndex, item) => {
        setActiveItem(item);
        setFocusedRow((oldIdx) => {
          if (oldIdx === -1 || oldIdx !== rowIndex) return rowIndex;
          return -1;
        });
        if (onBodyRowClicked) onBodyRowClicked(rowIndex, item);
      },
      [onBodyRowClicked],
    );

    useEffect(() => {
      if (focusedRowChanged)
        if (isTriggerFocus && isTriggerFocus(activeItem))
          focusedRowChanged(focusedRow, activeItem);
        else if (!isTriggerFocus) focusedRowChanged(focusedRow, activeItem);
    }, [focusedRowChanged, focusedRow, activeItem, isTriggerFocus]);

    // const getTableActionValue = (key) =>
    //   Object.values(TableActions).find((item) => item.key === key);
    const getSortDataName = () => {
      const currentHeader = (reorderedHeader || headerData).find(
        (item) => item.id === currentOrderById,
      );
      if (currentHeader) return currentHeader.input;
      return null;
    };
    const getStickyStyle = useCallback(
      (item) => ({
        position: 'sticky',
        left:
          i18next.dir() === 'ltr'
            ? ((item.left || item.left === 0) && item.left) || 'initial'
            : ((item.right || item.right === 0) && item.right) || 'initial',
        right:
          i18next.dir() === 'ltr'
            ? ((item.right || item.right === 0) && item.right) || 'initial'
            : ((item.left || item.left === 0) && item.left) || 'initial',
        zIndex: 1,
      }),
      [],
    );
    const onDragColumnHandler = useCallback(
      (index) => (event) => {
        event.dataTransfer.setData('text', event.currentTarget.id);
        setCurrentDraggingColumn(index);
      },
      [],
    );
    const onDragEndColumnHandler = useCallback(() => {
      if (currentDragOverIndex !== null) setCurrentDragOverIndex(null);
    }, [currentDragOverIndex]);
    const onDragOverColumnHandler = useCallback(
      (index) => (event) => {
        event.preventDefault();
        if (currentDragOverIndex !== index) setCurrentDragOverIndex(index);
      },
      [currentDragOverIndex],
    );
    const onDropColumnHandler = useCallback(
      (index) => (event) => {
        event.preventDefault();
        if (!currentDraggingColumn && currentDraggingColumn !== 0) return;

        const localColumns = [...(reorderedHeader || headerData)];
        localColumns.splice(
          index,
          0,
          localColumns.splice(currentDraggingColumn, 1)[0],
        );
        if (onHeaderColumnsReorder) onHeaderColumnsReorder(localColumns);
        else setReorderedHeader(localColumns);
      },
      [currentDraggingColumn, headerData, onHeaderColumnsReorder, reorderedHeader],
    );
    const onResizeDownHandler = useCallback(
      (idRef) => (event) => {
        event.preventDefault();
        if (!idRef) return;
        currentResizingColumnRef.current = document.querySelector(idRef);
        startResizePointRef.current
          = currentResizingColumnRef.current.offsetWidth - event.pageX;
      },
      [],
    );
    const onResizeMoveHandler = useCallback((event) => {
      if (!currentResizingColumnRef.current || startResizePointRef.current === null)
        return;
      currentResizingColumnRef.current.style.width = `${
        startResizePointRef.current + event.pageX
      }px`;
    }, []);
    const onResizeUpHandler = useCallback(() => {
      currentResizingColumnRef.current = null;
      currentResizingColumnRef.current = null;
    }, []);
    useEventListener('mousemove', onResizeMoveHandler);
    useEventListener('mouseup', onResizeUpHandler);

    const onActionClickedHandler = useCallback(
      (action, row, rowIndex) => (event) => {
        if (onActionClicked) onActionClicked(action, row, rowIndex, event);
      },
      [onActionClicked],
    );

    useEffect(() => {
      if ((selectedRows || localSelectedRows) && onSelectedRowsCountChanged)
        onSelectedRowsCountChanged((selectedRows || localSelectedRows).length);
    }, [localSelectedRows, onSelectedRowsCountChanged, selectedRows]);
    useEffect(() => {
      if (selectedRows) setLocalSelectedRows(selectedRows);
    }, [selectedRows]);
    useEffect(() => {
      if (!selectedRows && onSelectCheckboxChanged)
        onSelectCheckboxChanged({ selectedRows: localSelectedRows });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localSelectedRows, selectedRows]);

    // this is to control the localSelectedRows without the fields control
    // (do not send this if u send the selected rows)
    useEffect(() => {
      if (localSelectedRowsController && Array.isArray(localSelectedRowsController))
        setLocalSelectedRows(localSelectedRowsController);
    }, [localSelectedRowsController]);

    return (
      ((isWithEmpty && totalItems === 0) || isLoading || totalItems > 0) && (
        <div
          className={`tables-content-wrapper${
            (wrapperClasses && ` ${wrapperClasses}`) || ''
          }${(themeClasses && ` ${themeClasses}`) || ''}${
            isWithoutBoxWrapper ? '' : ' table-box-wrapper'
          }`}
          ref={tableRef}
        >
          <div className="tables-content">
            {getTableHeaderContent && (
              <div
                className={`table-header-wrapper${
                  (tableHeaderClasses && ` ${tableHeaderClasses}`) || ''
                }`}
              >
                {isWithHeaderDetails && (
                  <div className="header-details-wrapper">
                    <span>
                      <span className="show-text">{t('Shared:showing')}</span>
                      <span className="counts-text">
                        <span className="px-1">{totalItems}</span>
                        {headerDetailsTitle && (
                          <span>{t(`${translationPath}${headerDetailsTitle}`)}</span>
                        )}
                      </span>
                    </span>
                  </div>
                )}
                {getTableHeaderContent()}
              </div>
            )}
            <div className="table-responsive">
              {((headerData && headerData.length > 0) || isWithoutHeader) && (
                <TableContainer>
                  <Table
                    className="table-wrapper"
                    aria-labelledby="tableTitle"
                    size={tableOptions.tableSize} // 'small' or 'medium'
                    aria-label="enhanced table"
                  >
                    {!isWithoutTableHeader && (
                      <TableHead>
                        <TableRow>
                          {(isWithCheckAll || isWithCheck || isWithNumbering) && (
                            <TableCell
                              padding="checkbox"
                              className="checkboxes-cell"
                              style={
                                (isStickyCheckboxColumn
                                  && getStickyStyle({
                                    right: rightCheckboxColumn,
                                    left: leftCheckboxColumn,
                                  }))
                                || undefined
                              }
                              id={`${headerRowRef}checkAllColumnId`}
                            >
                              {(isWithCheckAll || isWithNumbering) && (
                                <>
                                  {isWithNumbering && (
                                    <span className="d-inline-flex-center h-100">
                                      #
                                    </span>
                                  )}
                                  {isWithCheckAll && (
                                    <CheckboxesComponent
                                      idRef={`${headerRowRef}tableSelectAllRef`}
                                      singleIndeterminate={
                                        localSelectedRows
                                        && localSelectedRows.length > 0
                                        && localSelectedRows.length < totalItems
                                        && !isSelectAll
                                      }
                                      singleChecked={
                                        isSelectAll
                                        || (totalItems > 0
                                          && localSelectedRows
                                          && localSelectedRows.length === totalItems)
                                      }
                                      isDisabled={
                                        isSelectAllDisabled || totalItems === 0
                                      }
                                      onSelectedCheckboxChanged={
                                        onSelectAllCheckboxChangedHandler
                                      }
                                    />
                                  )}
                                  {(isResizeCheckboxColumn || isResizable) && (
                                    <ButtonBase
                                      className="resize-btn"
                                      onMouseDown={onResizeDownHandler(
                                        `#${headerRowRef}checkAllColumnId`,
                                      )}
                                    >
                                      <span />
                                    </ButtonBase>
                                  )}
                                </>
                              )}
                            </TableCell>
                          )}
                          {(reorderedHeader || headerData)
                            .filter((column) => !column.isHidden)
                            .map((item, index) => (
                              <TableCell
                                key={`${headerRowRef}${index + 1}`}
                                sortDirection={
                                  item.isSortable && currentOrderById === item.id
                                    ? currentOrderDirection
                                    : false
                                }
                                className={`${
                                  (index === currentDragOverIndex
                                    && 'drag-over-cell')
                                  || ''
                                }`}
                                draggable={item.isDraggable}
                                onDragOver={onDragOverColumnHandler(index)}
                                onDragEnd={onDragEndColumnHandler}
                                onDrag={onDragColumnHandler(index)}
                                onDrop={onDropColumnHandler(index)}
                                id={`${headerRowRef}${index + 1}`}
                                style={
                                  (item.isSticky && getStickyStyle(item))
                                  || undefined
                                }
                              >
                                {item.isSortable ? (
                                  <TableSortLabel
                                    active={currentOrderById === item.id}
                                    direction={
                                      currentOrderById === item.id
                                        ? currentOrderDirection
                                        : 'desc'
                                    }
                                    onClick={createSortHandler(item.id)}
                                  >
                                    {(item.headerComponent
                                      && item.headerComponent(item, index))
                                      || (item.label
                                        && t(`${translationPath}${item.label}`))
                                      || t('Shared:actions')}
                                  </TableSortLabel>
                                ) : (
                                  (item.headerComponent
                                    && item.headerComponent(item, index))
                                  || (item.isCounter && item.label)
                                  || t(`${translationPath}${item.label}`)
                                )}
                                {(item.isResizable || isResizable) && (
                                  <ButtonBase
                                    className="resize-btn"
                                    onMouseDown={onResizeDownHandler(
                                      `#${headerRowRef}${index + 1}`,
                                    )}
                                  >
                                    <span />
                                  </ButtonBase>
                                )}
                              </TableCell>
                            ))}
                          {isWithTableActions && tableActionsOptions && (
                            <TableCell
                              id={`${headerRowRef}tableActionsOptionsRef`}
                              className="actions-cell"
                              style={
                                (tableActionsOptions.isSticky
                                  && getStickyStyle(tableActionsOptions))
                                || undefined
                              }
                            >
                              {(tableActionsOptions.headerComponent
                                && tableActionsOptions.headerComponent)
                                || (tableActionsOptions.label
                                  && t(
                                    `${translationPath}${tableActionsOptions.label}`,
                                  ))
                                || t('Shared:actions')}
                              {tableActionsOptions.isResizable && (
                                <ButtonBase
                                  className="resize-btn"
                                  onMouseDown={onResizeDownHandler(
                                    `#${headerRowRef}tableActionsOptionsRef`,
                                  )}
                                >
                                  <span />
                                </ButtonBase>
                              )}
                            </TableCell>
                          )}
                        </TableRow>
                      </TableHead>
                    )}
                    {!isLoading && (
                      <TableBody>
                        {stableSort(
                          data,
                          getComparator(currentOrderDirection, getSortDataName()),
                        )
                          .slice(
                            ((onPageIndexChanged || onPageSizeChanged)
                            && data.length <= pageSize
                              ? 0
                              : pageIndex * pageSize) || 0,
                            ((onPageIndexChanged || onPageSizeChanged)
                            && data.length <= pageSize
                              ? pageSize
                              : pageIndex * pageSize + pageSize) || data.length,
                          )
                          .map((row, rowIndex) => (
                            <React.Fragment
                              key={`bodyRow${rowIndex * (pageIndex + 1)}`}
                            >
                              <TableRow
                                role="checkbox"
                                aria-checked={
                                  (getIsSelectedRow
                                    && getIsSelectedRow(row, rowIndex))
                                  || getCurrentSelectedItemIndex(row) !== -1
                                }
                                tabIndex={-1}
                                selected={
                                  (getIsSelectedRow
                                    && getIsSelectedRow(row, rowIndex))
                                  || getCurrentSelectedItemIndex(row) !== -1
                                }
                                id={`${bodyRowRef}${rowIndex * (pageIndex + 1)}`}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  bodyRowClicked(rowIndex, row);
                                }}
                                className={
                                  rowIndex === focusedRow ? 'table-row-overlay' : ''
                                }
                              >
                                {(isWithCheck
                                  || getIsSelectedRow
                                  || selectedRows
                                  || isWithNumbering) && (
                                  <TableCell
                                    padding="checkbox"
                                    className="checkboxes-cell"
                                    style={
                                      (row.isSticky && getStickyStyle(row))
                                      || undefined
                                    }
                                  >
                                    <div className="d-inline-flex-center h-100">
                                      {isWithNumbering && (
                                        <span className="d-inline-flex-center h-100">
                                          {rowIndex + 1 + pageIndex * pageSize}
                                        </span>
                                      )}
                                      {isWithCheck && (
                                        <div className="d-inline-flex-center h-100">
                                          <CheckboxesComponent
                                            idRef={`tableSelectRef${rowIndex + 1}`}
                                            singleChecked={
                                              isSelectAll
                                              || (getIsSelectedRow
                                                && getIsSelectedRow(row, rowIndex))
                                              || getCurrentSelectedItemIndex(row)
                                                !== -1
                                              || false
                                            }
                                            isDisabled={
                                              isSelectAllDisabled
                                              || (getIsDisabledRow
                                                && getIsDisabledRow(row, rowIndex))
                                            }
                                            onSelectedCheckboxClicked={onSelectCheckboxChangedHandler(
                                              row,
                                              rowIndex,
                                            )}
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </TableCell>
                                )}
                                {headerData.length > 0
                                  && (reorderedHeader || headerData)
                                    .filter((column) => !column.isHidden)
                                    .map((column, columnIndex) => (
                                      <TableCell
                                        key={`bodyColumn${
                                          columnIndex * (pageIndex + 1) + rowIndex
                                        }`}
                                        className={column.cellClasses || ''}
                                        style={
                                          (column.isSticky
                                            && getStickyStyle(column))
                                          || undefined
                                        }
                                      >
                                        {(column.isCounter && rowIndex + 1)
                                          || ((column.isDate
                                            || (isDynamicDate
                                              && getDataFromObject(row, column.input)
                                              && isNaN(
                                                getDataFromObject(row, column.input),
                                              )
                                              && moment(
                                                getDataFromObject(row, column.input),
                                                moment.ISO_8601,
                                              ).isValid()))
                                            && ((getDataFromObject(row, column.input)
                                              && moment(
                                                getDataFromObject(row, column.input),
                                              )
                                                .locale(i18next.language)
                                                .format(
                                                  column.dateFormat
                                                    || tableOptions.dateFormat
                                                    || dateFormat,
                                                ))
                                              || ''))
                                          || (column.component
                                            && column.component(
                                              row,
                                              rowIndex,
                                              column,
                                              columnIndex,
                                            ))
                                          || getDataFromObject(row, column.input)}
                                      </TableCell>
                                    ))}
                                {isWithTableActions && tableActionsOptions && (
                                  <TableCell
                                    key={`bodyActionsColumn${rowIndex + 1}`}
                                    className={`actions-cell-wrapper ${
                                      tableActionsOptions.cellClasses || ''
                                    }`}
                                    style={
                                      (tableActionsOptions.isSticky
                                        && getStickyStyle(tableActionsOptions))
                                      || undefined
                                    }
                                  >
                                    {(tableActionsOptions.component
                                      && tableActionsOptions.component(
                                        row,
                                        rowIndex,
                                      ))
                                      || (tableActions
                                        && ((tableActionsThemes
                                          === TableActionsThemesEnum.Buttons.key && (
                                          <ActionsButtonsSection
                                            row={row}
                                            tableActions={tableActions}
                                            isDisabledActions={isDisabledActions}
                                            tableActionsOptions={tableActionsOptions}
                                            onActionClickedHandler={
                                              onActionClickedHandler
                                            }
                                            rowIndex={rowIndex}
                                            tooltipPlacement={tooltipPlacement}
                                            parentTranslationPath={
                                              parentTranslationPath
                                            }
                                            translationPath={translationPath}
                                          />
                                        ))
                                          || (tableActionsThemes
                                            === TableActionsThemesEnum.Popover.key && (
                                            <ActionsPopoverSection
                                              row={row}
                                              tableActions={tableActions}
                                              isDisabledActions={isDisabledActions}
                                              tableActionsOptions={
                                                tableActionsOptions
                                              }
                                              onActionClickedHandler={
                                                onActionClickedHandler
                                              }
                                              rowIndex={rowIndex}
                                              tooltipPlacement={tooltipPlacement}
                                              parentTranslationPath={
                                                parentTranslationPath
                                              }
                                              translationPath={translationPath}
                                            />
                                          ))))
                                      || null}
                                  </TableCell>
                                )}
                              </TableRow>
                            </React.Fragment>
                          ))}
                      </TableBody>
                    )}
                    {footerData && footerData.length > 0 && (
                      <TableFooter className="footer-wrapper">
                        <TableRow>
                          {footerData.map((item, index) => (
                            <TableCell
                              colSpan={item.colSpan}
                              key={`footerCell${index + 1}`}
                            >
                              {(item.component && item.component(item, index))
                                || item.value}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableFooter>
                    )}
                  </Table>
                </TableContainer>
              )}
              <LoaderComponent
                isLoading={isLoading}
                isSkeleton
                wrapperClasses="table-loader-wrapper"
                skeletonItems={[
                  {
                    variant: 'rectangular',
                    className: 'table-loader-row',
                    style: { minHeight: 40 },
                  },
                ]}
                numberOfRepeat={(totalItems / pageIndex > pageSize && pageSize) || 6}
              />
              {isWithEmpty && totalItems === 0 && !isLoading && (
                <Empty
                  message={message}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                  defaultMessage={defaultMessage}
                />
              )}
              {!isOriginalPagination
                && (onPageIndexChanged || onPageSizeChanged)
                && totalItems
                  > (pageSize || pageSize === 0
                    ? pageSize
                    : PaginationEnum['10'].value) && (
                <PaginationComponent
                  idRef={paginationIdRef}
                  isButtonsNavigation
                  isReversedSections
                  isRemoveTexts
                  totalCount={totalItems}
                  pageIndex={pageIndex}
                  pageSize={pageSize}
                  onPageIndexChanged={onPageIndexChanged}
                  onPageSizeChanged={onPageSizeChanged}
                />
              )}
            </div>
          </div>
        </div>
      )
    );
  },
);

TablesComponent.propTypes = {
  tableOptions: PropTypes.shape({
    pageSizeOptions: PropTypes.instanceOf(Array),
    tableSize: PropTypes.string,
    dateFormat: PropTypes.string,
    sortFrom: PropTypes.number,
  }),
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  dateFormat: PropTypes.string,
  isResizable: PropTypes.bool,
  isWithoutBoxWrapper: PropTypes.bool,
  // checkboxes related features
  isSelectAllDisabled: PropTypes.bool,
  isWithCheckAll: PropTypes.bool,
  isSelectAll: PropTypes.bool,
  selectedRows: PropTypes.instanceOf(Array),
  localSelectedRowsController: PropTypes.instanceOf(Array),
  uniqueKeyInput: PropTypes.string,
  onSelectAllCheckboxChanged: PropTypes.func,
  onSelectCheckboxChanged: PropTypes.func,
  onSelectedRowsCountChanged: PropTypes.func,
  getIsSelectedRow: PropTypes.func, // function to return bool
  getIsDisabledRow: PropTypes.func, // function to return bool
  isWithCheck: PropTypes.bool,
  isWithoutHeader: PropTypes.bool,
  isResizeCheckboxColumn: PropTypes.bool,
  isStickyCheckboxColumn: PropTypes.bool,
  leftCheckboxColumn: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rightCheckboxColumn: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  // end checkboxes related features
  // start table actions
  tableActions: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(SystemActionsEnum).map((item) => item)),
  ),
  onActionClicked: PropTypes.func,
  isWithTableActions: PropTypes.bool,
  // defaultTableActions: PropTypes.oneOf(
  //   Object.values(SystemActionsEnum).map((item) => item)
  // ),
  tableActionsOptions: PropTypes.shape({
    label: PropTypes.string,
    cellClasses: PropTypes.string,
    isSticky: PropTypes.bool,
    left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    isResizable: PropTypes.bool,
    headerComponent: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    component: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    getDisabledAction: PropTypes.func,
    getTooltipTitle: PropTypes.func,
    tooltipTitle: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.string,
      PropTypes.node,
    ]),
  }),
  themeClasses: PropTypes.oneOf(['theme-solid', 'theme-transparent','theme-strip']),
  tooltipPlacement: PropTypes.oneOf([
    'top-start',
    'top',
    'top-end',
    'left-start',
    'left',
    'left-end',
    'right-start',
    'right',
    'right-end',
    'bottom-start',
    'bottom',
    'bottom-end',
  ]),
  isDisabledActions: PropTypes.bool,
  // end table actions
  sortColumnClicked: PropTypes.func,
  headerData: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      isSortable: PropTypes.bool,
      isHidden: PropTypes.bool,
      label: PropTypes.string,
      input: PropTypes.string,
      isDate: PropTypes.bool,
      cellClasses: PropTypes.string,
      isDraggable: PropTypes.bool,
      isCounter: PropTypes.bool,
      isSticky: PropTypes.bool,
      left: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      right: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      isResizable: PropTypes.bool,
      headerComponent: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
      getActionTitle: PropTypes.func,
    }),
  ),
  data: PropTypes.instanceOf(Array),
  footerData: PropTypes.arrayOf(
    PropTypes.shape({
      colSpan: PropTypes.number,
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
        PropTypes.instanceOf(Date),
        PropTypes.bool,
      ]),
    }),
  ),
  onHeaderColumnsReorder: PropTypes.func,
  focusedRowChanged: PropTypes.func,
  headerRowRef: PropTypes.string,
  bodyRowRef: PropTypes.string,
  isLoading: PropTypes.bool,
  isWithEmpty: PropTypes.bool,
  defaultMessage: PropTypes.string,
  message: PropTypes.string,
  // pagination
  paginationIdRef: PropTypes.string,
  tableHeaderClasses: PropTypes.string,
  onPageIndexChanged: PropTypes.func,
  onPageSizeChanged: PropTypes.func,
  pageSize: PropTypes.oneOf(Object.values(PaginationEnum).map((item) => item.key)),
  isOriginalPagination: PropTypes.bool,
  pageIndex: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  isDynamicDate: PropTypes.bool,
  isWithHeaderDetails: PropTypes.bool,
  isWithoutTableHeader: PropTypes.bool,
  headerDetailsTitle: PropTypes.string,
  getTableHeaderContent: PropTypes.func,
  wrapperClasses: PropTypes.string,
  isTriggerFocus: PropTypes.func,
  tableActionsThemes: PropTypes.oneOf(
    Object.values(TableActionsThemesEnum).map((item) => item.key),
  ),
  isWithNumbering: PropTypes.bool,
  onBodyRowClicked: PropTypes.func,
};

TablesComponent.displayName = 'TablesComponent';

TablesComponent.defaultProps = {
  // checkboxes related features
  selectedRows: undefined,
  localSelectedRowsController: undefined,
  uniqueKeyInput: undefined,
  onSelectAllCheckboxChanged: undefined,
  isDynamicDate: false,
  isWithoutBoxWrapper: false,
  onSelectCheckboxChanged: undefined,
  onSelectedRowsCountChanged: undefined,
  getIsSelectedRow: undefined,
  getIsDisabledRow: undefined,
  isResizable: false,
  isWithCheckAll: false,
  isWithCheck: false,
  isSelectAll: false,
  isResizeCheckboxColumn: false,
  isWithoutHeader: false,
  isStickyCheckboxColumn: false,
  leftCheckboxColumn: undefined,
  rightCheckboxColumn: undefined,
  // start table actions
  tableActions: undefined,
  isWithTableActions: false,
  tableActionsOptions: {},
  onActionClicked: undefined,
  isDisabledActions: undefined,
  tooltipPlacement: 'top',
  // end table actions
  // end checkboxes related features
  isSelectAllDisabled: false,
  dateFormat: GlobalDisplayDateTimeFormat,
  tableOptions: {
    pageSizeOptions: [10, 20, 25, 50, 100],
    tableSize: 'small',
    dateFormat: null,
    sortFrom: 1, // 1:front,2:do nothing only send that it change
  },
  parentTranslationPath: '',
  translationPath: '',
  sortColumnClicked: () => {},
  headerData: [],
  data: [],
  footerData: [],
  onHeaderColumnsReorder: undefined,
  focusedRowChanged: () => {},
  headerRowRef: 'headerRowRef',
  bodyRowRef: 'bodyRowRef',
  // pagination
  paginationIdRef: undefined,
  onPageIndexChanged: undefined,
  onPageSizeChanged: undefined,
  isOriginalPagination: false,
  isLoading: false,
  isWithEmpty: false,
  defaultMessage: undefined,
  message: undefined,
  pageSize: 10,
  getTableHeaderContent: undefined,
  tableHeaderClasses: undefined,
  themeClasses: 'theme-solid',
  isWithHeaderDetails: undefined,
  headerDetailsTitle: undefined,
  wrapperClasses: undefined,
  isTriggerFocus: undefined,
  isWithoutTableHeader: false,
  tableActionsThemes: TableActionsThemesEnum.Popover.key,
  isWithNumbering: undefined,
};

export default TablesComponent;
