import React, { useEffect, useState, useCallback } from 'react';
import axios from 'api/middleware';
import { connect, useSelector } from 'react-redux';
import RecuiterPreference from 'utils/RecuiterPreference';
import { DropdownItem } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';

import '../Preference.scss';
// react plugin that prints a given react component
import ReactBSAlert from 'react-bootstrap-sweetalert';
// react component for creating dynamic tables
import ActionDropdown from 'shared/components/ActionDropdown';

// Permissions
import { generateHeaders } from 'api/headers';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { EmailTemplatesPermissions } from '../../../permissions/preferences';
import { showError, showSuccess, getIsAllowedPermissionV2 } from '../../../helpers';
import { Actions, AvatarGroup } from '../PreferenceStyles';
import { useSeparatedAvatarStyles } from '../../../utils/constants/colorMaps';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { Inputs } from '../../../components';
import { useHistory } from 'react-router-dom';

const translationPath = 'EmailTemplates.';
const parentTranslationPath = 'RecruiterPreferences';

const EmailTemplateTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const history = useHistory();
  const [searchValue, setSearchValue] = useState('');
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [tableColumns] = useState(() => [
    {
      input: 'title',
      label: t(`${translationPath}template-name`),
      isSortable: true,
    },

    {
      input: 'language',
      label: t(`${translationPath}languages`),
      component: (row) => (
        <AvatarGroup>
          {row
            && row.translation
            && row.translation?.map((translation, i) => (
              <div key={`${i + 1}-translation-key`} className={classes.root}>
                <LetterAvatar
                  alt="user-profile"
                  name={translation.language.code}
                  langCode
                />
              </div>
            ))}
        </AvatarGroup>
      ),
    },

    {
      label: t(`${translationPath}actions`),
      component: (row) => (
        <Actions className="d-flex">
          <ActionDropdown>
            <DropdownItem
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: EmailTemplatesPermissions.UpdateEmail.key,
                })
              }
              onClick={() => props.openEditModal(row)}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-pen" />
              </span>
              {t(`${translationPath}edit-template`)}
            </DropdownItem>

            <DropdownItem
              disabled={
                !getIsAllowedPermissionV2({
                  permissions,
                  permissionId: EmailTemplatesPermissions.DeleteEmail.key,
                })
              }
              onClick={(e) => confirmDelete(e, row)}
            >
              <span className="btn-inner--icon">
                <i className="fas fa-trash" />
              </span>
              <span>{t(`${translationPath}delete-template`)}</span>
            </DropdownItem>
          </ActionDropdown>
        </Actions>
      ),
    },
  ]);
  const classes = useSeparatedAvatarStyles();
  const { addToast } = useToasts(); // Toasts
  const [templates, setTemplates] = useState({
    results: [],
    totalCount: 0,
  });
  const [filter, setFilter] = useState({
    page: 1,
    limit: 10,
    query: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deleteAlert, setDeleteAlert] = useState(null);

  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        danger
        showCancel
        title={t(
          `${translationPath}are-you-sure-you-want-to-remove-this-email-template`,
        )}
        confirmBtnText={t(`${translationPath}remove`)}
        cancelBtnText={t(`${translationPath}cancel`)}
        confirmBtnBsStyle="danger"
        cancelBtnCssClass="bg-light text-dark"
        onConfirm={() => {
          handleDelete(e, row);
          setFilter((elements) => ({ ...elements, page: 1 }));
          setDeleteAlert(null);
          showSuccess(t(`${translationPath}email-template-deleted-successfully`));
        }}
        onCancel={() => setDeleteAlert(null)}
        btnSize=""
      />,
    );
  };

  const handleDelete = async (e, template) => {
    await axios
      .delete(RecuiterPreference.emailtemplates_WRITE, {
        params: {
          id: template.id,
        },
        headers: generateHeaders(),
      })
      .then(() => {
        setFilter((items) => ({ ...items, page: 1 }));
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  const getTemplates = useCallback(async () => {
    await axios
      .get(RecuiterPreference.emailtemplates_GET, {
        params: filter,
        headers: generateHeaders(),
      })
      .then((res) => {
        setIsLoading(false);
        setTemplates({
          results: res.data.results.data,
          totalCount: res.data.results.total,
        });
      })
      .catch((err) => {
        // setIsLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), err);
        setTemplates({
          results: [],
          totalCount: 0,
        });
      });
  }, [filter, t]);
  useEffect(() => {
    setIsLoading(true);
    getTemplates();
  }, [getTemplates, filter]);
  useEffect(() => {
    setFilter((items) => ({ ...items, page: 1 }));
  }, [props.reloadData]);

  return (
    <div className="pt-3">
      {deleteAlert}
      {/* {isLoading && <Loader />} */}
      <div className="d-flex-v-center-h-between flex-wrap">
        <div className="d-inline-flex-v-center flex-wrap">
          <div className="h5 px-2">
            <span>{t(`${translationPath}list-of-email-template`)}</span>
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
                permissions,
                permissionId: EmailTemplatesPermissions.AddNewEmail.key,
              })
            }
            onClick={() => props.openModal()}
          >
            <i className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}add-new-template`)}</span>
          </ButtonBase>
          {props.match.params.pathParam !== 'root' && (
            <ButtonBase
              className="btns theme-solid mx-2 mb-3"
              onClick={() => {
                history.push('/recruiter/recruiter-preference/email-templates/root');
                props.setSelectedTab('system');
              }}
            >
              <span className="px-1">{t(`${translationPath}system-emails`)}</span>
            </ButtonBase>
          )}
        </div>
      </div>
      <p className="text-muted px-2">
        <span>{t(`${translationPath}add-new-template-description`)}</span>
      </p>
      <TablesComponent
        data={templates.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={filter.page - 1}
        pageSize={filter.limit}
        isWithEmpty
        totalItems={templates.totalCount}
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

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(EmailTemplateTable);
