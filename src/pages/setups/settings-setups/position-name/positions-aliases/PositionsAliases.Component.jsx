import React, { useEffect, useState, useCallback, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { showError, showSuccess } from '../../../../../helpers';
import {
  ConfirmDeleteDialog,
  getLanguageTitle,
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../shared';

import { SystemActionsEnum } from '../../../../../enums';
import { useTitle } from '../../../../../hooks';
import { UpdateSetupsPositionNameSettings } from '../../../../../services/SetupsPositionNameSettings.Services';
import { Button } from 'reactstrap';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import { GetAllSetupsPositions } from '../../../../../services';
import i18next from 'i18next';

import { ButtonBase } from '@mui/material';
import { JobAliasManagementDialog } from './JobAliasManagementDialog';
import { useSelector } from 'react-redux';

const translationPath = 'SettingsPositionName.';
const parentTranslationPath = 'SetupsPage';
const PositionsAliases = ({ positionName }) => {
  const userReducer = useSelector((state) => state?.userReducer);
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [aliasToDelete, setAliasToDelete] = useState(null);
  const [languages, setLanguages] = useState([]);
  useTitle(t(`${translationPath}candidates-settings`));
  const [filter, setFilters] = useState({
    limit: 10,
    page: 1,
    use_for: 'dropdown',
    search: '',
    with_alias: true,
  });
  const stateInitRef = useRef({});

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else showError(t('Shared:failed-to-get-languages'));
  }, [t, userReducer]);

  const handleAliasChanges = useCallback(({ lang, val }) => {
    setActiveItem((item) => ({ ...item, alias: { ...item?.alias, [lang]: val } }));
  }, []);

  const getPositions = useCallback(async () => {
    setIsLoading((item) => ({ ...item, position: true }));
    const res = await GetAllSetupsPositions(filter);
    setIsLoading((item) => ({ ...item, position: false }));
    if (res.status === 200) {
      onStateChanged({ id: 'results', value: res.data?.results });
      onStateChanged({ id: 'totalCount', value: res.data?.paginate?.total || 0 });
    } else showError('Failed to get cases!');
  }, [filter]);

  const onPageIndexChanged = (newIndex) => {
    setFilters((items) => ({ ...items, page: newIndex + 1 }));
    // onStateChanged({ id: 'page', value: newIndex + 1 });
  };
  const onPageSizeChanged = (newPageSize) => {
    setFilters((items) => ({ ...items, limit: newPageSize }));
  };

  const onActionClicked = (action, row) => {
    setAliasToDelete(row);
    if (action.key === SystemActionsEnum.delete.key) setIsOpenDeleteDialog(true);
  };

  const updateHandler = useCallback(
    async (alias = null) => {
      if (
        !activeItem
        || !positionName
        || (!alias && Object.keys(activeItem?.alias || {})?.length === 0)
      )
        return;
      setIsLoading((item) => ({ ...item, alias: true }));
      const response = await UpdateSetupsPositionNameSettings({
        position_name: positionName,
        position_names_alias: [
          { uuid: activeItem?.uuid, alias: alias || activeItem?.alias },
        ],
      });
      setIsLoading((item) => ({ ...item, alias: false }));
      if (response && response.status === 202) {
        setFilters((items) => ({ ...items, page: items.page }));
        setActiveItem(null);
        setIsOpenManagementDialog((item) => (item ? false : item));
        showSuccess(t(`${translationPath}posititon-alias-changed-successfully`));
      } else
        showError(t(`${translationPath}posititon-alias-change-failed`), response);
    },
    [activeItem, positionName, t],
  );

  const deleteAliasHandler = useCallback(async () => {
    if (!aliasToDelete || !positionName) return;
    setIsLoading((item) => ({ ...item, alias: true }));
    const response = await UpdateSetupsPositionNameSettings({
      position_name: positionName,
      position_names_alias: [{ uuid: aliasToDelete?.uuid, alias: null }],
    });
    setIsLoading((item) => ({ ...item, alias: false }));
    if (response && response.status === 202) {
      setFilters((items) => ({ ...items, page: items.page }));
      showSuccess(t(`${translationPath}posititon-alias-delete-successfully`));
    } else showError(t(`${translationPath}posititon-alias-delete-failed`), response);
  }, [aliasToDelete, positionName, t]);

  useEffect(() => {
    getPositions();
  }, [getPositions, filter]);

  const tableColumns = [
    {
      id: 1,
      label: t(`name`),
      component: (item) => (
        <span>{item?.name?.[i18next.language] || item?.name?.en}</span>
      ),
    },
    {
      id: 2,
      label: t(`${translationPath}alias`),
      component: (item) => (
        <>
          {activeItem?.uuid === item?.uuid ? (
            <div className="d-flex-v-center">
              <SharedInputControl
                isHalfWidth
                wrapperClasses="pl-0-reversed mb-0"
                // errors={errors}
                parentId={i18next.language}
                stateKey="alias"
                editValue={activeItem?.alias?.[i18next.language] || ''}
                // isSubmitted={isSubmitted}
                onValueChanged={(newValue) => {
                  handleAliasChanges({
                    val: newValue.value,
                    lang: i18next.language,
                  });
                }}
                placeholder={`${t(`${translationPath}alias`)} (${getLanguageTitle(
                  languages,
                  i18next.language,
                )})`}
                parentTranslationPath={parentTranslationPath}
              />
              <Button
                type="button"
                color="primary"
                onClick={() => {
                  updateHandler();
                }}
                className="p-1 mx-1-reversed"
                disabled={isLoading?.alias}
              >
                {isLoading?.alias && (
                  <i className="fas fa-circle-notch fa-spin mr-2" />
                )}
                {`${isLoading?.alias ? t(`Shared:saving`) : t(`Shared:save`)}`}
              </Button>
              <ButtonBase
                className="btns theme-transparent mx-1  "
                onClick={() => setIsOpenManagementDialog(true)}
                disabled={isLoading?.alias}
              >
                <span className="fas fa-plus" />
                <span className="px-1">{t('add-language')}</span>
              </ButtonBase>
              <ButtonBase
                onClick={() => {
                  setActiveItem(null);
                }}
                className="btns-icon theme-transparent ml-1-reversed"
              >
                <span className="fas fa-times" />
              </ButtonBase>
            </div>
          ) : (
            <>
              <span>
                {item?.alias?.[i18next.language] || item?.alias?.en || ''}
                <ButtonBase
                  onClick={() => {
                    setActiveItem(item);
                  }}
                  className="btns-icon theme-transparent ml-2-reversed"
                >
                  {Object.values(item?.alias || {}).filter((item) => Boolean(item))
                    .length > 0 ? (
                      <span className="fas fa-edit" />
                    ) : (
                      <span className="fas fa-plus" />
                    )}
                </ButtonBase>
              </span>
            </>
          )}{' '}
        </>
      ),
    },
  ];

  return (
    <>
      <div className="body-item-wrapper mb-3">
        <span className="description-text">
          {t(`${translationPath}position-name-alias-description`)}
        </span>
      </div>

      <div className="body-item-wrapper">
        <div className=" d-flex">
          <SharedInputControl
            isQuarterWidth
            idRef="searchRef"
            title="search-by-name"
            placeholder="search-by-name"
            themeClass="theme-filled"
            stateKey="search"
            endAdornment={
              <span className="end-adornment-wrapper">
                <span className="fas fa-search" />
              </span>
            }
            onValueChanged={(newValue) => {
              setFilters({
                ...filter,
                page: 1,
                search: newValue.value,
              });
            }}
            translationPath={translationPath}
            parentTranslationPath={parentTranslationPath}
            editValue={filter.search}
          />
        </div>
        <TablesComponent
          headerData={tableColumns}
          data={state.results || []}
          isLoading={isLoading?.position}
          pageIndex={filter.page - 1}
          pageSize={filter.limit}
          totalItems={state.totalCount}
          getIsDisabledRow={(row) => row.can_delete === false}
          onPageIndexChanged={onPageIndexChanged}
          onPageSizeChanged={onPageSizeChanged}
          isWithTableActions
          onActionClicked={onActionClicked}
          tableActions={[SystemActionsEnum.delete]}
          tableActionsOptions={{
            getDisabledAction: (item, rowIndex, actionEnum) =>
              actionEnum.key === SystemActionsEnum.delete.key
              && (!item.alias
                || Object.values(item?.alias || {}).filter((item) => Boolean(item))
                  .length === 0),
          }}
        />
      </div>
      {isOpenManagementDialog && (
        <JobAliasManagementDialog
          activeItem={activeItem}
          onSave={(val) => {
            updateHandler(val?.alias);
          }}
          languages={languages}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenManagementDialog}
          isLoading={isLoading?.alias}
          handleCloseDialog={() => setIsOpenManagementDialog(false)}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          isConfirmOnly
          onSave={() => {
            deleteAliasHandler();
          }}
          saveType="button"
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
            setAliasToDelete(null);
            setActiveItem(null);
          }}
          extraDescription={`${t(`${translationPath}delete-aliase-for`)} (${
            aliasToDelete?.name?.[i18next.language] || aliasToDelete?.name?.en
          }) ?`}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenDeleteDialog}
        />
      )}
    </>
  );
};

export default PositionsAliases;
