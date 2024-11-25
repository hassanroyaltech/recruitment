import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import '../Preference.scss';

// react component for creating dynamic tables
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
// react component used to create sweet alerts
import ReactBSAlert from 'react-bootstrap-sweetalert';
// reactstrap components
import { Button, UncontrolledTooltip, Row } from 'reactstrap';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { useTranslation } from 'react-i18next';
import Empty from '../components/Empty';
import { Actions } from '../PreferenceStyles';
// import { Can } from '../../../utils/functions/permissions';
import { getIsAllowedPermissionV2 } from 'helpers';
import { ManageTeamsPermissions } from 'permissions';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

// core components

const StyledDelete = styled(Button)`
  &:hover i {
    color: var(--danger);
  }
`;

const EditTeamTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [deleteAlert, setDeleteAlert] = useState(null);

  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => {
          props.handleDelete(row.uuid);
          setDeleteAlert(null);
        }}
        onCancel={() => setDeleteAlert(null)}
        showCancel
        confirmBtnBsStyle="success"
        cancelBtnText="Cancel"
        cancelBtnBsStyle="danger"
        confirmBtnText="Yes, Delete User "
        btnSize=""
      >
        {t(`${translationPath}are-you-sure-you-want-to-remove-this-user`)}
      </ReactBSAlert>,
    );
  };
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  return (
    <Row>
      <div className="col overflow-visible">
        {deleteAlert}
        <ToolkitProvider
          data={props.data.users}
          keyField="uuid"
          columns={[
            {
              dataField: 'first_name',
              hidden: true,
            },
            {
              dataField: 'last_name',
              hidden: true,
            },

            {
              dataField: 'Team Member',
              text: t(`${translationPath}team-members`),
              sort: true,
              editable: false,
              isDummyField: true,
              formatter: (cellContent, row) => (
                <span>
                  <LetterAvatar name={`${row.first_name} ${row.last_name}`} />
                  {'  '}
                  {row.first_name} {row.last_name}
                </span>
              ),
            },
            // {
            //   dataField: 'Team Member',
            //   text: 'Title',
            //   sort: true,
            //   editable: false,
            //   isDummyField: true,
            //   formatter: (cellContent, row) => {
            //     return (
            //       <span>{row.job_title}</span>
            //     );
            //   },
            // },
            {
              dataField: 'email',
              text: t(`${translationPath}email`),
              sort: true,
              editable: false,
            },

            {
              dataField: 'actions',
              text: (
                <span className="d-block text-right">
                  {t(`${translationPath}actions`)}
                </span>
              ),
              isDummyField: true,
              editable: false,
              formatter: (cellContent, row) => (
                <Actions className="d-flex justify-content-end mr-2">
                  <StyledDelete
                    disabled={
                      // !Can('delete', 'sub-user')
                      (props.data
                        && props.data.users
                        && props.data.users.length === 1)
                      || !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: ManageTeamsPermissions.DeleteTeams.key,
                      })
                    }
                    id="delete"
                    className="btn-icon btn bg-transparent"
                    size="sm"
                    color="transparent"
                    type="button"
                    onClick={(e) => confirmDelete(e, row)}
                  >
                    <span className="btn-inner--icon ">
                      <i className="fas fa-trash" />
                    </span>
                  </StyledDelete>
                  <UncontrolledTooltip target="delete">
                    {t(`${translationPath}delete-user`)}
                  </UncontrolledTooltip>
                </Actions>
              ),
            },
          ]}
          search
        >
          {(tableProps) => (
            <div className="table-responsive overflow-visible">
              {props.data && !props.data.users.length ? (
                <Empty />
              ) : (
                <BootstrapTable
                  {...tableProps.baseProps}
                  bootstrap4
                  bordered={false}
                  striped
                  hover
                  condensed
                />
              )}
            </div>
          )}
        </ToolkitProvider>
      </div>
    </Row>
  );
};

export default EditTeamTable;
