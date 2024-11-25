/* eslint-disable react/display-name */
// import React Components
import React, { useState, useEffect, useCallback } from 'react';

// import React bootstrap Components
// import ReactBSAlert from 'react-bootstrap-sweetalert';
import { DropdownItem } from 'reactstrap';

// import Style Components
import '../Preference.scss';
import { ActionDropdown } from 'shared/components/ActionDropdown';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { Actions } from '../PreferenceStyles';

// Permissions

// import shared Components
// eslint-disable-next-line import/extensions
import ApplicationPermission from './ApplicationPermission';

// import Preferences API
import { preferencesAPI } from '../../../api/preferences';
import { useTitle } from '../../../hooks';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import { Inputs } from '../../../components';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { RequirementsPermissions } from '../../../permissions/preferences/Requirements.Permissions';

const translationPath = 'AppPermissions.';
const parentTranslationPath = 'RecruiterPreferences';

const AppPermissionsTable = () => {
  // Modal States
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}application-requirements`));
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [requirements, setRequirements] = useState({
    results: [],
    totalCount: 0,
  });
  const [tableColumns] = useState(() => [
    {
      input: 'title',
      label: t(`${translationPath}requirements-title`),
      isSortable: true,
    },
    {
      input: 'actions',
      label: t(`${translationPath}actions`),
      component: (row) => (
        <Actions className="d-flex">
          <ActionDropdown>
            <DropdownItem
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: RequirementsPermissions.UpdateRequirements.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => OpenModal(row.uuid)}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-edit" />
              </span>
              {t(`${translationPath}edit-requirement`)}
            </DropdownItem>
          </ActionDropdown>
        </Actions>
      ),
    },
  ]);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    query: '',
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [uuid, setUUID] = useState(null);

  const closeModal = () => {
    setIsAddModalOpen(false);
  };
  const OpenModal = (id) => {
    if (id) setUUID(id);

    setIsAddModalOpen(true);
  };
  // setDeleteAlert
  const [deleteAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  /**
   * Delete application permission
   * @param {*} index
   * @param {*} uuid
   */
  // function handleDelete(e, permission) {
  //   setIsLoading(true);
  //   preferencesAPI
  //     .DeletePermission(permission.uuid)
  //     .then(() => {
  //       setIsLoading(false);
  //       // Update Permission Data
  //       setData((data) => data.filter((p) => p.uuid !== permission.uuid));
  //     })
  //     .catch(() => {
  //       setIsLoading(false);
  //     });
  // }

  // const confirmDelete = (e, row) => {
  //   setDeleteAlert(
  //     <ReactBSAlert
  //       warning
  //       style={{ display: 'block' }}
  //       title="Are you sure?"
  //       onConfirm={() => {
  //         setDeleteAlert(null);
  //         handleDelete(e, row);
  //       }}
  //       onCancel={() => setDeleteAlert(null)}
  //       showCancel
  //       confirmBtnBsStyle="danger"
  //       cancelBtnText="Cancel"
  //       cancelBtnBsStyle="success"
  //       confirmBtnText="Yes, delete it!"
  //       btnSize=""
  //     >
  //       You won't be able to revert this!
  //     </ReactBSAlert>,
  //   );
  // };

  const getRequirements = useCallback(() => {
    setIsLoading(true);
    preferencesAPI
      .getPermissionData(filter)
      .then((res) => {
        setRequirements({
          results: res.data.results.data,
          totalCount: res.data.results.total,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        showError(t('Shared:failed-to-get-saved-data'), err);
        setIsLoading(false);
      });
  }, [filter, t]);

  const onSaveHandler = useCallback(() => {
    setFilter((items) => ({ ...items, page: 1 }));
  }, []);

  useEffect(() => {
    getRequirements();
  }, [getRequirements, filter]);

  return (
    <div className="page-wrapper pt-4 px-4">
      {deleteAlert}
      {isAddModalOpen && requirements.results && (
        <ApplicationPermission
          uuid={uuid}
          isOpen={isAddModalOpen}
          closeModal={closeModal}
          permission={requirements.results}
          onSave={onSaveHandler}
        />
      )}
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap px-2">
          <div className="h5 px-2">
            <span>
              {t(`${translationPath}list-of-users-with-application-requirements`)}
            </span>
          </div>
          <div className="d-inline-flex px-2 mb-2">
            <Inputs
              idRef="searchRef"
              value={searchValue}
              themeClass="theme-solid"
              label="search"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
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
                    query: searchValue,
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
                        query: searchValue,
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
        <div className="inline-flex px-2">
          <ButtonBase
            className="btns theme-solid mx-2 mb-3"
            disabled={
              !getIsAllowedPermissionV2({
                permissionId: RequirementsPermissions.AddRequirements.key,
                permissions: permissionsReducer,
              })
            }
            onClick={() => {
              setUUID(null);
              OpenModal();
            }}
          >
            <i className="fas fa-plus" />
            <span className="px-1">
              {t(`${translationPath}add-new-requirements`)}
            </span>
          </ButtonBase>
        </div>
      </div>
      <p className="text-muted px-3">
        <span>{t(`${translationPath}add-new-requirements-description`)}</span>
      </p>
      <TablesComponent
        data={requirements.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        isWithEmpty
        totalItems={requirements.totalCount}
        onPageIndexChanged={(newValue) => {
          setFilter((elements) => ({ ...elements, page: newValue + 1 }));
        }}
        onPageSizeChanged={(newValue) => {
          setFilter((elements) => ({ ...elements, page: 1, limit: newValue }));
        }}
      />
    </div>
  );
};
export default AppPermissionsTable;
