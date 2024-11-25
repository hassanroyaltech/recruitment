import React, { useState, useEffect, useCallback } from 'react';
import { connect, useSelector } from 'react-redux';
import SimpleHeader from 'components/Headers/SimpleHeader';
import { getLastURLSegment, kebabToTitle } from 'shared/utils';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';

import { useTitle } from '../../../hooks';
import { Inputs, SwitchComponent } from '../../../components';
import { getIsAllowedPermissionV2, showError, showSuccess } from '../../../helpers';
import { ScorecardPermissions } from '../../../permissions';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { Actions } from '../PreferenceStyles';
import ActionDropdown from '../../../shared/components/ActionDropdown';
import { DropdownItem } from 'reactstrap';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import {
  DeleteScorecardTemplate,
  GetAllScorecardTemplates,
  ToggleScorecardStatus,
} from '../../../services';
import i18next from 'i18next';
import moment from 'moment/moment';

const mainParentTranslationPath = 'Scorecard';

const Scorecard = (props) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [templates, setTemplates] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    search: '',
    use_for: 'list',
  });

  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  useTitle(t(`scorecard`));

  const getTemplates = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await GetAllScorecardTemplates(filter);
      setTemplates({
        results: res.data.results,
        totalCount: res.data.paginate.total,
      });
      setIsLoading(false);
    } catch (error) {
      showError(t('Shared:failed-to-get-saved-data'), error);
      setIsLoading(false);
    }
  }, [filter, t]);

  useEffect(() => {
    getTemplates();
  }, [getTemplates]);

  const handleChangeStatus = async (index, uuid) => {
    setIsLoading(true);
    ToggleScorecardStatus({ uuid })
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          showSuccess(t(`status-changed-successfully`));
          setFilter((items) => ({ ...items, page: items.page }));
        } else showError(t(`status-change-failed`), res);
      })
      .catch((error) => {
        showError(t(`status-change-failed`), error);
        setIsLoading(false);
      });
  };
  const handleDelete = async (index, uuid) => {
    setIsLoading(true);
    DeleteScorecardTemplate({ uuid: [uuid] })
      .then(() => {
        showSuccess(t(`scorecard-deleted-successfully`));
        setFilter((items) => ({ ...items, page: 1 }));
      })
      .catch((error) => {
        showError(t(`scorecard-delete-failed`), error);
        setIsLoading(false);
      });
  };

  const confirmDelete = (index, uuid) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`are-you-sure`)}
        onConfirm={() => {
          setDeleteAlert(null);
          handleDelete(index, uuid);
        }}
        onCancel={() => setDeleteAlert(null)}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`Shared:cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`Shared:delete`)}
        btnSize=""
      >
        {t(`you-wont-be-able-to-revert-this`)}
      </ReactBSAlert>,
    );
  };

  const [tableColumns] = useState(() => [
    {
      input: 'title',
      label: t(`title`),
      isSortable: true,
      component: (row) =>
        `${row?.title?.[i18next.language] || row.title?.en || 'Untitled'}`,
    },
    {
      input: 'created_at',
      label: t(`created-at`),
      isSortable: true,
      component: (row) => moment(row.created_at).locale(i18next.language).fromNow(),
    },
    {
      input: 'updated_at',
      label: t(`updated-at`),
      isSortable: true,
      component: (row) => moment(row.updated_at).locale(i18next.language).fromNow(),
    },
    {
      input: 'status',
      label: t(`status`),
      isSortable: true,
      component: (row, index) => (
        <span>
          <SwitchComponent
            isChecked={row.status || false}
            onChange={(event, newValue) => {
              handleChangeStatus(index, row.uuid);
            }}
            labelPlacement={'end'}
          />
        </span>
      ),
    },
    {
      input: 'actions',
      label: t(`Shared:actions`),
      component: (row, index) => (
        <Actions className="d-flex">
          <ActionDropdown>
            <DropdownItem
              disabled={
                isLoading
                || !getIsAllowedPermissionV2({
                  permissionId: ScorecardPermissions.UpdateScorecard.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                props.history.push(`/scorecard-builder?uuid=${row.uuid}`);
              }}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-edit" />
              </span>
              {t(`edit-template`)}
            </DropdownItem>

            <DropdownItem
              disabled={
                isLoading
                || !getIsAllowedPermissionV2({
                  permissionId: ScorecardPermissions.DeleteScorecard.key,
                  permissions: permissionsReducer,
                })
                || !row.can_delete
              }
              onClick={() => confirmDelete(index, row.uuid)}
            >
              <span className="btn-inner--icon text-danger mr-1-reversed">
                <i className="fas fa-trash" />
              </span>
              <span className="text-danger">{t(`delete-template`)}</span>
            </DropdownItem>
          </ActionDropdown>
        </Actions>
      ),
    },
  ]);

  return (
    <>
      {/* Header */}
      <SimpleHeader
        name={kebabToTitle(getLastURLSegment())}
        parentName="Preferences"
      />
      {/* Header */}
      <div className="px-4 mt--8 pt-4">
        <div className="pl-2-reversed d-flex align-items-center pb-2 justify-content-between">
          <div className="d-flex align-items-center">
            <div className="d-inline-flex px-2 mb-2">
              <Inputs
                idRef="searchRef"
                value={searchValue}
                themeClass="theme-solid"
                label="search"
                parentTranslationPath={mainParentTranslationPath}
                onInputChanged={(event) => {
                  const {
                    target: { value },
                  } = event;
                  setSearchValue(value);
                }}
                onKeyUp={(event) => {
                  if (event.key === 'Enter')
                    setFilter((elements) => ({
                      ...elements,
                      page: 1,
                      search: searchValue,
                    }));
                }}
                endAdornment={
                  <div className="end-adornment-wrapper">
                    <ButtonBase
                      className="btns-icon theme-transparent"
                      disabled={isLoading}
                      onClick={() => {
                        setFilter((elements) => ({
                          ...elements,
                          page: 1,
                          search: searchValue,
                        }));
                      }}
                    >
                      <span className="fas fa-search" />
                    </ButtonBase>
                  </div>
                }
              />
            </div>
          </div>

          <ButtonBase
            className="btns theme-solid px-4"
            disabled={
              isLoading
              || !getIsAllowedPermissionV2({
                permissionId: ScorecardPermissions.AddNewScorecard.key,
                permissions: permissionsReducer,
              })
            }
            onClick={() => props.history.push('/scorecard-builder')}
          >
            <i className="fas fa-plus px-2" />
            {t('add-scorecard')}
          </ButtonBase>
        </div>
        <TablesComponent
          data={templates.results}
          isLoading={isLoading}
          headerData={tableColumns}
          pageIndex={filter.page - 1}
          parentTranslationPath={mainParentTranslationPath}
          pageSize={filter.limit}
          isWithEmpty
          totalItems={templates.totalCount}
          onPageIndexChanged={(newValue) => {
            setFilter((items) => ({ ...items, page: newValue + 1 }));
          }}
          onPageSizeChanged={(newValue) => {
            setFilter((items) => ({ ...items, page: 1, limit: newValue }));
          }}
        />
      </div>
      {deleteAlert}
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
  configs: state.Configs,
});
export default connect(mapStateToProps)(Scorecard);
