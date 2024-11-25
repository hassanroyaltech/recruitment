import React, { memo, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import { LoaderComponent } from '../Loader/Loader.Component';
import { PopoverComponent } from '../Popover/Popover.Component';
import { CheckboxesComponent } from '../Checkboxes/Checkboxes.Component';
import './TableColumnsPopover.Styles.scss';
import { GetTableColumns, UpdateTableColumns } from '../../services';
import { showError, showSuccess, TableColumnsPainter } from '../../helpers';
import { TablesNameEnum } from '../../enums';

export const TableColumnsPopoverComponent = memo(
  ({
    idRef,
    columns,
    onColumnsChanged,
    onColumnChanged,
    onIsLoadingColumnsChanged,
    feature_name,
    isDisabled,
    isLoading,
    onReloadData,
    wrapperClasses,
  }) => {
    const { t } = useTranslation('Shared');
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const [localColumns, setLocalColumns] = useState([]);
    const [tableColumnsResponse, setTableColumnsResponse] = useState(null);
    const [isLocalLoading, setIsLocalLoading] = useState(false);

    /**
         * @param item
         * @param index
         * @param items
         // * @param isFromCheckbox
         * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
         * @Description this method is to update column status locally
         * and send it to parent if needed
         */
    const onSelectColumnHandler = useCallback(
      (item, index, items) => (event) => {
        const localItems = [...items];
        localItems[index].isHidden = !localItems[index].isHidden;
        setLocalColumns(localItems);
        if (onColumnChanged) onColumnChanged(localItems, event);
      },
      [onColumnChanged],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description get the table columns with its status from backend by feature name
     */
    const getTableColumns = useCallback(async () => {
      setIsLocalLoading(true);
      if (onIsLoadingColumnsChanged) onIsLoadingColumnsChanged(true);
      const response = await GetTableColumns({ feature_name });
      setIsLocalLoading(false);
      if (onIsLoadingColumnsChanged) onIsLoadingColumnsChanged(false);
      if (response && response.status === 200) setTableColumnsResponse(response);
      else showError(t('failed-to-get-saved-data'), response);
    }, [feature_name, onIsLoadingColumnsChanged, t]);

    const updateTableColumns = async (event) => {
      if (!feature_name) {
        if (onColumnsChanged) onColumnsChanged(localColumns, event);
        setPopoverAttachedWith(null);
      }
      setIsLocalLoading(true);
      if (onIsLoadingColumnsChanged) onIsLoadingColumnsChanged(true);
      const response = await UpdateTableColumns({
        columns: localColumns
          .filter((item) => !item.isHidden)
          .map((item) => item.input),
        feature_name,
      });
      getTableColumns();
      setIsLocalLoading(false);
      if (onIsLoadingColumnsChanged) onIsLoadingColumnsChanged(false);
      if (response && response.status === 200) {
        showSuccess(t('columns-updated-successfully'));
        if (onColumnsChanged) onColumnsChanged(localColumns, event);
        setPopoverAttachedWith(null);
      } else showError(t('columns-update-failed'), response);
    };

    useEffect(() => {
      if (tableColumnsResponse)
        TableColumnsPainter(
          tableColumnsResponse,
          onColumnsChanged,
          isLoading,
          onReloadData,
        );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, onColumnsChanged, tableColumnsResponse]);

    // this is to init localColumns on parent columns change
    useEffect(() => {
      setLocalColumns(columns.map((item) => ({ ...item })));
    }, [columns]);

    // this is to return the columns & visible columns from backend
    useEffect(() => {
      if (feature_name) getTableColumns();
    }, [feature_name, getTableColumns]);

    return (
      <div className={`table-columns-popover-component-wrapper ${wrapperClasses}`}>
        <ButtonBase
          className="btns-icon theme-transparent c-primary mb-1"
          disabled={isDisabled || isLoading || isLocalLoading}
          onClick={(event) => setPopoverAttachedWith(event.target)}
        >
          <LoaderComponent
            isLoading={isLoading}
            isSkeleton
            wrapperClasses="position-absolute w-100 h-100"
            skeletonStyle={{ width: '100%', height: '100%', borderRadius: '100%' }}
          />
          <span className="fas fa-bars" />
        </ButtonBase>
        <PopoverComponent
          idRef={`tableColumnsPopoverRef${idRef}`}
          attachedWith={popoverAttachedWith}
          handleClose={() => {
            setLocalColumns(columns.map((item) => ({ ...item })));
            setPopoverAttachedWith(null);
          }}
          popoverClasses="columns-popover-wrapper"
          component={
            <div className="table-columns-wrapper">
              <div className="table-columns-header">
                <span>{localColumns.filter((item) => !item.isHidden).length}</span>
                <span className="px-1">{t('of')}</span>
                <span>{localColumns.length}</span>
              </div>
              <div className="table-columns-body">
                {localColumns
                  && localColumns.map(
                    (item, index, items) =>
                      (
                        <ButtonBase
                          key={`checkbox${idRef}-${index + 1}`}
                          className="btns theme-transparent fj-start w-100 mx-0 br-0"
                          onClick={onSelectColumnHandler(item, index, items)}
                        >
                          <CheckboxesComponent
                            idRef={`checkbox${idRef}${index + 1}`}
                            label={item.label}
                            isDisabled={item.isDisabled || isDisabled}
                            singleChecked={!item.isHidden}
                          />
                        </ButtonBase>
                      ) || undefined,
                  )}
              </div>
              <div className="table-columns-footer">
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={() => {
                    setLocalColumns(columns.map((item) => ({ ...item })));
                    setPopoverAttachedWith(null);
                  }}
                >
                  <span>{t('cancel')}</span>
                </ButtonBase>
                <div className="separator-v py-3" />
                <ButtonBase
                  className="btns theme-transparent"
                  onClick={updateTableColumns}
                >
                  <LoaderComponent
                    isLoading={isLoading || isLocalLoading}
                    isSkeleton
                    wrapperClasses="position-absolute w-100 h-100"
                    skeletonStyle={{ width: '100%', height: '100%' }}
                  />
                  <span>{t('save')}</span>
                </ButtonBase>
              </div>
            </div>
          }
        />
      </div>
    );
  },
);

TableColumnsPopoverComponent.displayName = 'TableColumnsPopoverComponent';

TableColumnsPopoverComponent.propTypes = {
  idRef: PropTypes.string,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      label: PropTypes.string,
      isHidden: PropTypes.bool,
      isDisabled: PropTypes.bool,
    }),
  ),
  feature_name: PropTypes.oneOf(
    Object.values(TablesNameEnum).map((item) => item.key),
  ),
  isDisabled: PropTypes.bool,
  wrapperClasses: PropTypes.string,
  isLoading: PropTypes.bool,
  onColumnsChanged: PropTypes.func,
  onColumnChanged: PropTypes.func,
  onReloadData: PropTypes.func,
  onIsLoadingColumnsChanged: PropTypes.func,
};

TableColumnsPopoverComponent.defaultProps = {
  idRef: 'TableColumnsPopoverComponent',
  wrapperClasses: '',
  columns: [],
  feature_name: undefined,
  isDisabled: false,
  isLoading: false,
  onColumnsChanged: undefined,
  onColumnChanged: undefined,
  onReloadData: undefined,
  onIsLoadingColumnsChanged: undefined,
};
