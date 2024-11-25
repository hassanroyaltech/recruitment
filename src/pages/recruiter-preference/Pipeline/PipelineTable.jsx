/* eslint-disable react/display-name,react/prop-types */
import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import '../Preference.scss';
import ReactBSAlert from 'react-bootstrap-sweetalert';
import RecuiterPreference from 'utils/RecuiterPreference';
import { DropdownItem } from 'reactstrap';
import ActionDropdown from 'shared/components/ActionDropdown';

// Permissions
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { PipelinesPermissions } from '../../../permissions';
import ViewPipeline from './ViewPipeline';
import PipelineModal from './PipelineModal';
import { Actions } from '../PreferenceStyles';
import { useSeparatedAvatarStyles } from '../../../utils/constants/colorMaps';
import { Inputs } from '../../../components';
import TablesComponent from '../../../components/Tables/Tables.Component';
import {
  HttpServices,
  showError,
  showSuccess,
  getIsAllowedPermissionV2,
} from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const PipelineTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const classes = useSeparatedAvatarStyles();
  const [deleteAlert, setDeleteAlert] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [pipelines, setPipelines] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    query: '',
  });
  const [tableColumns] = useState(() => [
    {
      input: 'can_delete',
      label: 'can_delete',
      isHidden: true,
    },
    {
      input: 'title',
      label: t(`${translationPath}pipeline-title`),
      isSortable: true,
    },
    {
      input: 'language_code',
      label: t(`${translationPath}language`),
      component: ({ language: { code } }) => (
        <div className={classes.root}>
          <LetterAvatar alt="user-profile" name={code} langCode />
        </div>
      ),
    },
    {
      input: 'created_at',
      label: t(`${translationPath}created-on`),
      isSortable: true,
    },
    {
      input: 'updated_at',
      label: t(`${translationPath}modified-on`),
      isSortable: true,
    },
    {
      input: 'Actions',
      label: t(`${translationPath}actions`),
      component: ({ can_delete, uuid }) => (
        <Actions className="d-flex">
          <ActionDropdown>
            <DropdownItem onClick={() => handleView(uuid)}>
              <span className="btn-inner--icon">
                <i className="fas fa-eye" />
              </span>
              {t(`${translationPath}view-pipeline`)}
            </DropdownItem>
            {can_delete
              && !getIsAllowedPermissionV2({
                permissionId: PipelinesPermissions.DeletePipelines.key,
                permissions: permissionsReducer,
              }) && (
              <DropdownItem onClick={(e) => confirmDelete(e, uuid)}>
                <span className="btn-inner--icon">
                  <i className="fas fa-trash">{can_delete}</i>
                </span>
                <span>{t(`${translationPath}delete-pipeline`)}</span>
              </DropdownItem>
            )}
          </ActionDropdown>
        </Actions>
      ),
    },
  ]);

  const confirmDelete = (e, uuid) => {
    setDeleteAlert(
      <ReactBSAlert
        danger
        showCancel
        title={t(`${translationPath}are-you-sure-you-want-to-remove-this-pipeline`)}
        confirmBtnText={t(`${translationPath}remove`)}
        cancelBtnText={t(`${translationPath}cancel`)}
        confirmBtnBsStyle="danger"
        cancelBtnCssClass="bg-light text-dark"
        onConfirm={() => {
          setDeleteAlert(null);
          handleDelete(e, uuid);
        }}
        onCancel={() => setDeleteAlert(null)}
        btnSize=""
      />,
    );
  };

  const getPipeline = useCallback(() => {
    setIsLoading(true);
    HttpServices.get(RecuiterPreference.pipelines_GET, { params: filter })
      .then((res) => {
        setPipelines({
          results: res.data.results.data || [],
          totalCount: res.data.results.total,
        });
        setIsLoading(false);
      })
      .catch((err) => {
        showError(t('Shared:failed-to-get-saved-data'), err);
        setIsLoading(false);
      });
  }, [filter, t]);
  useEffect(() => {
    getPipeline();
  }, [getPipeline, filter]);

  const handleDelete = (e, uuid) => {
    setIsLoading(true);
    HttpServices.delete(RecuiterPreference.pipelines_WRITE, {
      params: {
        uuid,
      },
    })
      .then((response) => {
        showSuccess(response?.data?.message);
        // States
        setFilter((items) => ({ ...items, page: 1 }));
        setIsLoading(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-delete'), error);
        setIsLoading(false);
      });
  };

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(true);
  const [currentUUID, setCurrentUUID] = useState();
  const handleAdd = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsViewModalOpen(false);
  };
  const handleView = (uuid) => {
    setCurrentUUID(uuid);
    setIsViewModalOpen(true);
  };
  return (
    <div>
      {deleteAlert}
      {isModalOpen && (
        <PipelineModal
          isOpen={isModalOpen}
          closeModal={closeModal}
          {...props}
          view={(uuid) => handleView(uuid)}
          getPipeline={getPipeline}
        />
      )}
      {isViewModalOpen && currentUUID && (
        <ViewPipeline
          isOpen={isViewModalOpen}
          closeModal={closeModal}
          currentUUID={currentUUID}
        />
      )}
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap px-2">
          <div className="h5 px-2">
            <span>{t(`${translationPath}hiring-pipelines`)}</span>
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
                permissionId: PipelinesPermissions.AddPipelines.key,
                permissions: permissionsReducer,
              })
            }
            onClick={handleAdd}
          >
            <i className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-new-pipeline`)}</span>
          </ButtonBase>
        </div>
      </div>
      <p className="text-muted px-3">
        <span>{t(`${translationPath}add-new-pipeline-description`)}</span>
      </p>
      <TablesComponent
        data={pipelines.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        isWithEmpty
        totalItems={pipelines.totalCount}
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

export default PipelineTable;
