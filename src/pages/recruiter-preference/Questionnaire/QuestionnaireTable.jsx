import React, { useCallback, useState } from 'react';
import moment from 'moment';
import '../Preference.scss';
// react plugin that prints a given react component
import ReactBSAlert from 'react-bootstrap-sweetalert';
import urls from 'api/urls';
import axios from 'api/middleware';
import { connect, useSelector } from 'react-redux';
import { useToasts } from 'react-toast-notifications';
import ActionDropdown from 'shared/components/ActionDropdown';
import { DropdownItem } from 'reactstrap';
import { generateHeaders } from 'api/headers';
import { useTranslation } from 'react-i18next';
import { Actions } from '../PreferenceStyles';
import {
  getIsAllowedPermissionV2,
  GlobalDisplayDateTimeFormat,
  showError,
} from '../../../helpers';
import TablesComponent from '../../../components/Tables/Tables.Component';
import { QuestionnairesPermissions } from '../../../permissions/preferences/Questionnaires.Permissions';
import i18next from 'i18next';

const translationPath = 'Questionnaire.';
const mainParentTranslationPath = 'RecruiterPreferences';

const QuestionnaireTable = (props) => {
  const { t } = useTranslation(mainParentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const [deleteAlert, setDeleteAlert] = useState(null);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );

  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        danger
        showCancel
        title={t(
          `${translationPath}are-you-sure-you-want-to-remove-this-questionnaire`,
        )}
        confirmBtnText={t(`${translationPath}remove`)}
        cancelBtnText={t(`${translationPath}cancel`)}
        confirmBtnBsStyle="danger"
        cancelBtnCssClass="bg-light text-dark"
        onConfirm={() => {
          handleDelete(row);
          setDeleteAlert(null);
        }}
        onCancel={() => setDeleteAlert(null)}
      />,
    );
  };
  const handleDelete = async (row) => {
    await axios
      .delete(urls.questionnaire.questionnaire_WRITE, {
        params: {
          uuid: row.uuid,
        },
        headers: generateHeaders(),
      })
      .then(() => {
        addToast(t(`${translationPath}questionnaire-removed`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.removeQuestionnaire(row.uuid);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-removing-questionnaire`), error);
      });
  };
  const timeHandler = useCallback((val) => {
    const temp = moment(val, moment.ISO_8601);
    return temp.locale(i18next.language || 'en').format(GlobalDisplayDateTimeFormat);
  }, []);
  return (
    <>
      {deleteAlert}
      <TablesComponent
        headerData={[
          {
            id: 1,
            isSortable: true,
            label: 'questionnaire-title',
            input: 'title',
          },
          {
            id: 2,
            isSortable: true,
            label: 'pipeline',
            input: 'pipeline.title',
          },
          {
            id: 3,
            isSortable: true,
            label: 'created-on',
            component: (cellContent) => (
              <span>{timeHandler(cellContent?.created_at)}</span>
            ),
          },
          {
            id: 4,
            isSortable: true,
            label: 'modified-on',
            component: (cellContent) => (
              <span>{timeHandler(cellContent?.updated_at)}</span>
            ),
          },
          {
            id: 5,
            isSortable: false,
            label: 'actions',
            component: (row) => (
              <Actions className="pl-2-reversed">
                <ActionDropdown>
                  <DropdownItem
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId:
                          QuestionnairesPermissions.UpdateQuestionnaires.key,
                        permissions: permissionsReducer,
                      })
                    }
                    onClick={() => {
                      props.history.push(
                        `/recruiter/recruiter-preference/questionnaire/edit/${row.uuid}`,
                      );
                    }}
                  >
                    <span className="btn-inner--icon">
                      <i className="fas fa-pen" />
                    </span>
                    {t(`${translationPath}edit-questionnaire`)}
                  </DropdownItem>

                  <DropdownItem
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId:
                          QuestionnairesPermissions.DeleteQuestionnaires.key,
                        permissions: permissionsReducer,
                      })
                    }
                    onClick={(e) => confirmDelete(e, row)}
                  >
                    <span className="btn-inner--icon">
                      <i className="fas fa-trash" />
                    </span>

                    <span>{t(`${translationPath}delete-questionnaire`)}</span>
                  </DropdownItem>
                </ActionDropdown>
              </Actions>
            ),
          },
        ]}
        isLoading={props.isLoading}
        translationPath={translationPath}
        data={props?.data?.results || []}
        pageIndex={props.filter.page || 0}
        pageSize={props.filter.limit || 0}
        totalItems={props.data.totalCount || 0}
        onPageSizeChanged={props.onPageSizeChanged}
        onPageIndexChanged={props.onPageIndexChanged}
        parentTranslationPath={mainParentTranslationPath}
      />
    </>
  );
};

const mapStateToProps = (state) => ({
  account: state.Account,
});
export default connect(mapStateToProps)(QuestionnaireTable);
