/* eslint-disable react/display-name,react/prop-types */
// import React components
import React, { useCallback, useEffect, useState } from 'react';

// import Reactstrap components
import { DropdownItem } from 'reactstrap';

// import bootstrap components
import ReactBSAlert from 'react-bootstrap-sweetalert';

// import styled Components
import { preferencesAPI } from 'api/preferences';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { useSelector } from 'react-redux';
import { Actions } from '../PreferenceStyles';

// import Shared Components
import ActionDropdown from '../../../shared/components/ActionDropdown';
import { useTitle } from '../../../hooks';
import { getIsAllowedPermissionV2, showError, showSuccess } from '../../../helpers';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { Inputs } from '../../../components';
import { EvaluationsPermissions } from '../../../permissions/preferences/Evaluations.Permissions';

const translationPath = 'Evaluations.';
const parentTranslationPath = 'RecruiterPreferences';

const Evaluations = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}list-of-evaluations`));
  const [searchValue, setSearchValue] = useState('');
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [tableColumns] = useState(() => [
    {
      input: 'title',
      label: t(`${translationPath}evaluations-title`),
      isSortable: true,
    },
    {
      input: 'created_by',
      label: t(`${translationPath}created-on`),
      isSortable: true,
    },
    {
      input: 'updated_at',
      label: t(`${translationPath}modified-on`),
      isSortable: true,
    },

    {
      input: 'actions',
      label: t(`${translationPath}actions`),
      component: (row, index) => (
        <Actions className="d-flex">
          <ActionDropdown>
            <DropdownItem
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: EvaluationsPermissions.UpdateEvaluationForms.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => {
                props.history.push(
                  `/recruiter/recruiter-preference/evaluation/${row.uuid}`,
                );
              }}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-edit" />
              </span>
              {t(`${translationPath}edit-evaluation`)}
            </DropdownItem>

            <DropdownItem
              disabled={
                !getIsAllowedPermissionV2({
                  permissionId: EvaluationsPermissions.DeleteEvaluationForms.key,
                  permissions: permissionsReducer,
                })
              }
              onClick={() => confirmDelete(index, row.uuid)}
            >
              <span className="btn-inner--icon text-danger mr-2-reversed">
                <i className="fas fa-trash" />
              </span>
              <span className="text-danger">
                {t(`${translationPath}delete-evaluation`)}
              </span>
            </DropdownItem>
          </ActionDropdown>
        </Actions>
      ),
    },
  ]);
  const [evaluations, setEvaluations] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    query: '',
  });

  const confirmDelete = (index, uuid) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => {
          setDeleteAlert(null);
          handleDelete(index, uuid);
        }}
        onCancel={() => setDeleteAlert(null)}
        showCancel
        confirmBtnBsStyle="danger"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="success"
        confirmBtnText={t(`${translationPath}yes-delete-it`)}
        btnSize=""
      >
        {t(`${translationPath}you-wont-be-able-to-revert-this`)}
      </ReactBSAlert>,
    );
  };

  /**
   * Delete Evaluation Function
   * @param {*} index
   * @param {*} uuid
   * @returns {Promise}
   */
  const handleDelete = async (index, uuid) => {
    setIsLoading(true);
    preferencesAPI
      .DeleteEvaluation(uuid)
      .then(() => {
        showSuccess(t(`${translationPath}evaluation-deleted-successfully`));
        setFilter((items) => ({ ...items, page: 1 }));
      })
      .catch((error) => {
        showError(t(`${translationPath}evaluation-delete-failed`), error);
        setIsLoading(false);
      });
  };

  /**
   * Get Evaluation List Data
   * @param {page, limit, query}
   * @returns {Promise}
   */
  const getEvaluations = useCallback(() => {
    setIsLoading(true);
    preferencesAPI
      .getEvaluationData(filter)
      .then((res) => {
        setEvaluations({
          results: res.data.results.data,
          totalCount: res.data.results.total,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setIsLoading(false);
      });
  }, [filter, t]);

  useEffect(() => {
    getEvaluations();
  }, [getEvaluations, filter]);

  return (
    <div className="page-wrapper pt-4 px-4">
      {deleteAlert}
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap px-2">
          <div className="h5 px-2">
            <span>{t(`${translationPath}list-of-evaluations`)}</span>
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
                permissionId: EvaluationsPermissions.AddNewEvaluationForms.key,
                permissions: permissionsReducer,
              })
            }
            onClick={() => {
              props.history.push('/recruiter/recruiter-preference/evaluation/add');
            }}
          >
            <i className="fas fa-plus" />
            <span className="px-1">
              {t(`${translationPath}add-a-new-evaluation`)}
            </span>
          </ButtonBase>
        </div>
      </div>
      <p className="text-muted px-3">
        <span>{t(`${translationPath}add-a-new-evaluation-description`)}</span>
      </p>
      <TablesComponent
        data={evaluations.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        isWithEmpty
        totalItems={evaluations.totalCount}
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
export default Evaluations;
