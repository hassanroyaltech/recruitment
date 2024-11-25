import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../../helpers';
import { ConfirmDeleteDialog } from '../../shared';

import { useTitle } from '../../../../hooks';

import {
  DeleteNationalitySetting,
  GetAllNationalitySettings,
} from '../../../../services';

import ButtonBase from '@mui/material/ButtonBase';
import { NationalityManagementDialog } from './dialogs/NationalityManagement.Dialog';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import { SystemActionsEnum } from '../../../../enums';
import i18next from 'i18next';

const translationPath = 'NationalitySetting.';
const parentTranslationPath = 'SetupsPage';
const NationalitySetting = () => {
  const { t } = useTranslation(parentTranslationPath);

  useTitle(t(`${translationPath}nationality-settings`));
  const [isLoading, setIsLoading] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [responseData, setResponseData] = useState({ results: [], totalCount: 0 });
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    management: false,
    deleteSetting: false,
  });
  const tableColumns = useMemo(
    () => [
      {
        id: 1,
        isSortable: false,
        label: 'nationality',
        component: (row) => (
          <span>{row?.nationality?.[i18next.language] || row?.nationality?.en}</span>
        ),
      },
      {
        id: 1,
        isSortable: false,
        label: 'regex',
        input: 'regex',
      },
      {
        id: 1,
        isSortable: false,
        label: 'status',
        component: (row) => (
          <span>
            {t(`${translationPath}${row?.status ? 'active' : 'inactive'}`)}
          </span>
        ),
      },
    ],
    [t],
  );
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
  });
  const onPageIndexChanged = (newIndex) => {
    setFilter((items) => ({ ...items, page: newIndex + 1 }));
  };
  const onPageSizeChanged = (newPageSize) => {
    setFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const handleOpenManagementDialog = useCallback(() => {
    setIsOpenDialogs({ management: true });
  }, []);

  const onActionClicked = (action, row) => {
    setActiveItem(row);
    if (action.key === SystemActionsEnum.edit.key)
      setIsOpenDialogs({ management: true });
    else if (action.key === SystemActionsEnum.delete.key)
      setIsOpenDialogs({ deleteSetting: true });
  };
  const handleCloseDialogs = () => {
    setActiveItem(null);
    setIsOpenDialogs({});
  };
  const getAllNationalitySettings = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllNationalitySettings(filter);
    setIsLoading(false);
    if (response && response.status === 200)
      setResponseData({
        results: response.data.results || [],
        totalCount: response.data.paginate.total,
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setResponseData({ results: [], totalCount: 0 });
    }
  }, [filter, t]);
  useEffect(() => {
    getAllNationalitySettings();
  }, [getAllNationalitySettings]);
  return (
    <div className="settings-candidates-page-wrapper px-4 pt-4">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}nationality-settings`)}
        </span>
        <span className="description-text">
          {t(`${translationPath}nationality-settings-description`)}
        </span>
      </div>
      <div className="separator-h mb-3" />
      <div className="page-body-wrapper px-2">
        <div className="setups-card-wrapper">
          <div className="setups-content-wrapper">
            <div className="setups-card-body-wrapper ">
              <div className="body-item-wrapper d-flex-v-center-h-between">
                <span className="header-text">
                  {t(`${translationPath}nationality-setting`)}
                </span>
                <ButtonBase
                  className="btns theme-solid  mx-2 my-3"
                  onClick={() => {
                    handleOpenManagementDialog();
                  }}
                >
                  <span className="fas fa-plus" />
                  <span className="px-1">
                    {t(`${translationPath}add-new-setting`)}
                  </span>
                </ButtonBase>
                <div className="body-item-wrapper">
                  <TablesComponent
                    data={responseData?.results || []}
                    isLoading={isLoading}
                    headerData={tableColumns}
                    pageIndex={filter.page - 1}
                    pageSize={filter.limit}
                    onPageIndexChanged={onPageIndexChanged}
                    onPageSizeChanged={onPageSizeChanged}
                    totalItems={responseData.totalCount}
                    uniqueKeyInput="uuid"
                    isWithTableActions
                    isPopoverActions
                    onActionClicked={onActionClicked}
                    tableActions={[SystemActionsEnum.edit, SystemActionsEnum.delete]}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    isWithoutBoxWrapper
                    themeClasses="theme-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpenDialogs.management && (
        <NationalityManagementDialog
          activeItem={activeItem}
          isOpen={isOpenDialogs.management}
          onSave={() => {
            setFilter((items) => ({ ...items, page: items.page }));
          }}
          isOpenChanged={() => {
            handleCloseDialogs();
          }}
          parentTranslationPath={parentTranslationPath}
        />
      )}
      {isOpenDialogs.deleteSetting && (
        <ConfirmDeleteDialog
          activeItem={activeItem}
          successMessage="nationality-setting-deleted-successfully"
          onSave={() => {
            setFilter((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={() => {
            handleCloseDialogs();
          }}
          descriptionMessage="nationality-setting-delete-description"
          deleteApi={DeleteNationalitySetting}
          apiProps={{
            uuid: activeItem && activeItem.uuid,
          }}
          errorMessage="nationality-setting-delete-failed"
          activeItemKey="uuid"
          apiDeleteKey="uuid"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDialogs.deleteSetting}
        />
      )}
    </div>
  );
};

export default NationalitySetting;
