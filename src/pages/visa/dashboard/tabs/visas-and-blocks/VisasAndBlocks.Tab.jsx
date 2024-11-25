import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  DeleteVisaBlocks,
  GetAllVisaDashboardBlocks,
} from '../../../../../services';
import {
  getIsAllowedPermissionV2,
  GlobalSavingDateFormat,
  GlobalSavingHijriDateFormat,
  GlobalSecondaryDateFormat,
  GlobalSecondHijriDateFormat,
  showError,
} from '../../../../../helpers';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';
import moment from 'moment-hijri';
import { SystemActionsEnum, VisaDefaultStagesEnum } from '../../../../../enums';
import { CollapseComponent, LoaderComponent } from '../../../../../components';
import { BlocksFiltersSection, VisasSection } from './sections';
import './VisasAndBlocks.Style.scss';
import { ConfirmDeleteDialog } from '../../../../setups/shared';
import PopoverComponent from '../../../../../components/Popover/Popover.Component';
import { VisasPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const VisasAndBlocksTab = memo(
  ({
    dialogsStatusHandler,
    activeItem,
    onReloadStatistics,
    filter,
    onFilterChanged,
    isOpenDialogs,
    globalSelectedRows,
    isWithoutTableActions,
    onSelectCheckboxChanged,
    onSelectAllCheckboxChanged,
    isWithCheckAll,
    getIsDisabledRow,
    parentTranslationPath,
    translationPath,
  }) => {
    const { t } = useTranslation(parentTranslationPath);
    const permissions = useSelector(
      (reducerState) => reducerState?.permissionsReducer?.permissions,
    );
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const popoverActiveItemRef = useRef(null);
    const isFirstLoadRef = useRef(true);
    const blocksActionsRef = useRef([
      SystemActionsEnum.edit,
      SystemActionsEnum.delete,
    ]);

    const [localFilter, setLocalFilter] = useState({
      page: 1,
      limit: 10,
    });
    const [blocks, setBlocks] = useState({
      results: [],
      totalCount: 0,
    });
    const isOpeningUUIDRef = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [openedBlockCollapseUUID, setOpenedBlockCollapseUUID] = useState(null);
    const [openedCollapseItems, setOpenedCollapseItems] = useState(() => []);

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get all blocks
     */
    const getAllVisaDashboardBlocks = useCallback(async () => {
      setIsLoading(true);
      const response = await GetAllVisaDashboardBlocks(localFilter);
      setIsLoading(false);
      if (response && response.status === 200)
        setBlocks({
          results: response.data.results || [],
          totalCount: response.data.paginate.total || 0,
        });
      else {
        setBlocks({ results: [], totalCount: 0 });
        showError(t('Shared:failed-to-get-saved-data'), response);
      }
    }, [localFilter, t]);

    /**
     * @param stages
     * @param key
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to the current block details by key
     */
    const getBlockSource = useMemo(
      () => (stages, key) => stages.find((item) => item.value === key) || {},
      [],
    );

    /**
     * @param uuid
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to get if the current pipeline is opened before or not
     */
    const getIsOpenedBeforeBlock = useMemo(
      () => (uuid) => openedCollapseItems.includes(uuid),
      [openedCollapseItems],
    );

    /**
     * @param blockUUID
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to the open the collapse
     */
    const openCollapseHandler = useCallback(
      (blockUUID, { source } = {}) =>
        () => {
          if (!source) return;
          if (isOpeningUUIDRef.current !== blockUUID && source === 2) return;
          if (!getIsOpenedBeforeBlock(blockUUID)) {
            isOpeningUUIDRef.current = blockUUID;
            setOpenedCollapseItems((items) => {
              items.push(blockUUID);
              return [...items];
            });
          } else {
            isOpeningUUIDRef.current = null;
            setOpenedBlockCollapseUUID((item) =>
              item === blockUUID ? null : blockUUID,
            );
          }
        },
      [getIsOpenedBeforeBlock],
    );

    /**
     * @param item
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle the toggle for the actions popover
     */
    const popoverToggleHandler = useCallback(
      (item = null) =>
        (event = null) => {
          if (event) {
            event.preventDefault();
            event.stopPropagation();
          }
          popoverActiveItemRef.current = item;
          // dialogsStatusHandler(action, item)
          setPopoverAttachedWith((item && event && event.currentTarget) || null);
        },
      [],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to open dialog of management or delete
     */
    const onActionClicked = useCallback(
      (action) => () => {
        if (action.key === SystemActionsEnum.edit.key)
          dialogsStatusHandler('block', popoverActiveItemRef.current)();
        else if (action.key === SystemActionsEnum.delete.key)
          dialogsStatusHandler('blockDelete', popoverActiveItemRef.current)();
        popoverToggleHandler()();
      },
      [dialogsStatusHandler, popoverToggleHandler],
    );

    /**
     * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
     * @Description this method is to handle the change for local filter from parent or child
     */
    const onLocalFilterChanged = useCallback(() => {
      isFirstLoadRef.current = false;
      setLocalFilter((items) => ({
        ...items,
        ...filter,
        page: 1,
        limit: 10,
      }));
    }, [filter]);

    // this to return all blocks list
    useEffect(() => {
      if (!isFirstLoadRef.current) getAllVisaDashboardBlocks();
    }, [getAllVisaDashboardBlocks, localFilter]);

    useEffect(() => {
      onLocalFilterChanged();
    }, [filter, onLocalFilterChanged]);

    return (
      <div className="visas-and-block-wrapper">
        <BlocksFiltersSection
          blocks={blocks}
          filter={filter}
          onFilterChanged={onFilterChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        {blocks.results.map((item, index, items) => (
          <div
            className="blocks-item-wrapper"
            key={`blocksItemKey${item.uuid}-${index + 1}`}
          >
            <ButtonBase
              className="btns theme-transparent collapse-btn"
              onClick={openCollapseHandler(item.uuid, { source: 1 })}
            >
              <div className="d-inline-flex flex-wrap">
                <span
                  className={`px-2 fas fa-${
                    (openedBlockCollapseUUID === item.uuid
                      && isOpeningUUIDRef.current !== item.uuid
                      && 'chevron-up')
                    || (isOpeningUUIDRef.current !== item.uuid && 'chevron-down')
                    || 'sync fa-spin'
                  }`}
                />
                <span className="px-1">
                  <span className="fas fa-cube" />
                  <span className="px-1">
                    <span>{t(`${translationPath}block`)}</span>
                    <span>:</span>
                    <span className="px-1">{item.block_number}</span>
                  </span>
                </span>
              </div>
              <div className="d-inline-flex flex-wrap c-gray-primary">
                <span className="px-1">
                  <span className="far fa-clock" />
                  <span className="px-1">
                    {moment(
                      item.expiry_date,
                      (item.is_hijri && GlobalSavingHijriDateFormat)
                        || GlobalSavingDateFormat,
                    )
                      .locale(i18next.language)
                      .format(
                        (item.is_hijri && GlobalSecondHijriDateFormat)
                          || GlobalSecondaryDateFormat,
                      )}
                  </span>
                </span>
                <span className="px-1">
                  <span>{item.total || 0}</span>
                  <span className="px-1">{t(`${translationPath}total`)}</span>
                </span>
                <span className="px-2">
                  <span className="fas fa-circle c-accent-secondary-lightest" />
                  <span className="px-1">
                    {getBlockSource(
                      item.blocks_statistics,
                      VisaDefaultStagesEnum.Available.key,
                    ).count || 0}
                  </span>
                  <span>
                    {
                      getBlockSource(
                        item.blocks_statistics,
                        VisaDefaultStagesEnum.Available.key,
                      ).title
                    }
                  </span>
                </span>
                <span className="px-2">
                  <span className="fas fa-circle c-green" />
                  <span className="px-1">
                    {getBlockSource(
                      item.blocks_statistics,
                      VisaDefaultStagesEnum.Reserved.key,
                    ).count || 0}
                  </span>
                  <span>
                    {
                      getBlockSource(
                        item.blocks_statistics,
                        VisaDefaultStagesEnum.Reserved.key,
                      ).title
                    }
                  </span>
                </span>
                <span className="px-2">
                  <span className="fas fa-circle c-green" />
                  <span className="px-1">
                    {getBlockSource(
                      item.blocks_statistics,
                      VisaDefaultStagesEnum.Allocated.key,
                    ).count || 0}
                  </span>
                  <span>{t(`${translationPath}allocated`)}</span>
                </span>
                {!isWithoutTableActions && (
                  <div
                    className="MuiButtonBase-root d-inline-flex-center btns-icon theme-transparent mx-1 c-gray-primary"
                    role="button"
                    tabIndex={-1}
                    onClick={popoverToggleHandler(item)}
                    onKeyDown={() => {}}
                  >
                    <span className="fas fa-ellipsis-h" />
                  </div>
                )}
              </div>
            </ButtonBase>
            {index < items.length - 1 && <div className="separator-h" />}
            <CollapseComponent
              isOpen={openedBlockCollapseUUID === item.uuid}
              wrapperClasses="w-100 px-2"
              component={
                <VisasSection
                  block_uuid={item.uuid}
                  isOpening={Boolean(isOpeningUUIDRef.current)}
                  block={item}
                  // filter={filter}
                  blocksFilter={localFilter}
                  onBlocksReload={onLocalFilterChanged}
                  onReloadStatistics={onReloadStatistics}
                  openCollapseHandler={openCollapseHandler}
                  isOpenedBefore={getIsOpenedBeforeBlock(item.uuid)}
                  globalSelectedRows={globalSelectedRows}
                  isWithoutTableActions={isWithoutTableActions}
                  onSelectCheckboxChanged={onSelectCheckboxChanged}
                  onSelectAllCheckboxChanged={onSelectAllCheckboxChanged}
                  isWithCheckAll={isWithCheckAll}
                  getIsDisabledRow={getIsDisabledRow}
                  parentTranslationPath={parentTranslationPath}
                  translationPath={translationPath}
                />
              }
            />
          </div>
        ))}
        <div
          className={`d-flex-v-center-h-${
            (blocks.results.length < blocks.totalCount && 'between') || 'end'
          } pt-3`}
        >
          {blocks.results.length < blocks.totalCount && (
            <ButtonBase
              className="btns theme-transparent mx-2 mb-3 c-gray-primary"
              onClick={() => {
                setLocalFilter((items) => ({
                  ...items,
                  page: (blocks.results.length > 10 && items.page + 1) || items.page,
                  limit:
                    (blocks.results.length + 100 < blocks.totalCount
                      && items.page === 1
                      && blocks.results.length === 10
                      && blocks.results.length + 100)
                    || (blocks.results.length === 110 && 110)
                    || 100,
                }));
              }}
            >
              <span className="fas fa-ellipsis-h" />
              <span className="px-2">{`${t('Shared:load')} ${
                blocks.results.length + 100 < blocks.totalCount
                  ? 100
                  : blocks.totalCount - blocks.results.length
              } ${t('Shared:more')}`}</span>
            </ButtonBase>
          )}
        </div>
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          wrapperClasses="visas-and-blocks-loader-wrapper"
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { minHeight: 40, width: '100%' },
            },
          ]}
          numberOfRepeat={10}
        />

        <PopoverComponent
          idRef="blocksActionsPopoverRef"
          attachedWith={popoverAttachedWith}
          handleClose={() => popoverToggleHandler(null)()}
          popoverClasses="blocks-actions-popover-wrapper"
          component={
            <div className="blocks-actions-wrapper">
              {blocksActionsRef.current.map((item, actionIndex, items) => (
                <div
                  className="actions-popover-item"
                  key={`blockActionsKey${item.key}-${actionIndex + 1}`}
                >
                  <ButtonBase
                    onClick={onActionClicked(item)}
                    disabled={
                      (item.key === SystemActionsEnum.delete.key
                        && ((popoverActiveItemRef.current
                          && popoverActiveItemRef.current.can_delete === false)
                          || !getIsAllowedPermissionV2({
                            permissionId: VisasPermissions.DeleteVisa.key,
                            permissions,
                          })))
                      || (item.key === SystemActionsEnum.edit.key
                        && !getIsAllowedPermissionV2({
                          permissionId: VisasPermissions.UpdateVisa.key,
                          permissions,
                        }))
                    }
                    className="btns theme-transparent mx-0 actions-popover-btn"
                  >
                    <span className={item.icon} />
                    <span className="px-2">{t(item.value) || ''}</span>
                  </ButtonBase>
                  {actionIndex < items.length - 1 && <div className="separator-h" />}
                </div>
              ))}
            </div>
          }
        />
        {isOpenDialogs.blockDelete && (
          <ConfirmDeleteDialog
            activeItem={activeItem}
            successMessage="block-deleted-successfully"
            onSave={() => {
              setLocalFilter((items) => ({ ...items, page: 1, limit: 10 }));
              if (onReloadStatistics) onReloadStatistics();
            }}
            isOpenChanged={dialogsStatusHandler('blockDelete')}
            descriptionMessage="block-delete-description"
            deleteApi={DeleteVisaBlocks}
            apiProps={{
              uuid: activeItem && [activeItem.uuid],
            }}
            errorMessage="block-delete-failed"
            activeItemKey="uuid"
            apiDeleteKey="uuid"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isOpen={isOpenDialogs.blockDelete}
          />
        )}
      </div>
    );
  },
);

VisasAndBlocksTab.displayName = 'VisasAndBlocksTab';

VisasAndBlocksTab.propTypes = {
  dialogsStatusHandler: PropTypes.func,
  onReloadStatistics: PropTypes.func,
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenDialogs: PropTypes.shape({
    block: PropTypes.bool,
    allocate: PropTypes.bool,
    reserve: PropTypes.bool,
    blockDelete: PropTypes.bool,
  }),
  filter: PropTypes.shape({
    company: PropTypes.string,
    is_expired: PropTypes.bool,
    occupation: PropTypes.string,
    nationality: PropTypes.string,
    gender: PropTypes.string,
    religion: PropTypes.string,
    issue_place: PropTypes.string,
    status: PropTypes.string,
    search: PropTypes.string,
  }).isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  globalSelectedRows: PropTypes.instanceOf(Array),
  isWithoutTableActions: PropTypes.bool,
  onSelectCheckboxChanged: PropTypes.func,
  onSelectAllCheckboxChanged: PropTypes.func,
  isWithCheckAll: PropTypes.bool,
  getIsDisabledRow: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

VisasAndBlocksTab.defaultProps = {
  activeItem: null,
  isOpenDialogs: {
    block: false,
    allocate: false,
    reserve: false,
    blockDelete: false,
  },
  translationPath: 'DashboardPage.',
};
