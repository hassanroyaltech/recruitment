import React, { useState } from 'react';
import axios from 'api/middleware';
import '../Preference.scss';
import RecuiterPreference from 'utils/RecuiterPreference';

import { useToasts } from 'react-toast-notifications';

// react plugin that prints a given react component
import ReactBSAlert from 'react-bootstrap-sweetalert';

// react component for creating dynamic tables
import ToolkitProvider, {
  Search,
} from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import ActionDropdown from 'shared/components/ActionDropdown';
import { Button, DropdownItem, Row } from 'reactstrap';
import { generateHeaders } from 'api/headers';
import LetterAvatar from 'components/Elevatus/LetterAvatar';
import { Can } from 'utils/functions/permissions';
import { useTranslation } from 'react-i18next';
import RemoteTable from '../components/RemoteTable';
import ViewTeamModal from './ViewTeamModal';

// react component used to create sweet alerts
// reactstrap components
// core components
// Permissions
import Loader from '../components/Loader';
import Empty from '../components/Empty';
import { Actions, BarContainer, HeaderContainer } from '../PreferenceStyles';
import { useOverlayedAvatarStyles } from '../../../utils/constants/colorMaps';
import { useSelector } from 'react-redux';
import { getIsAllowedPermissionV2 } from 'helpers';
import { ManageTeamsPermissions } from 'permissions';

const translationPath = 'TeamMember.';
const parentTranslationPath = 'RecruiterPreferences';

const { SearchBar } = Search;

const TeamsTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const classes = useOverlayedAvatarStyles();
  const { addToast } = useToasts(); // Toasts
  const [deleteAlert, setDeleteAlert] = useState(null);
  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        warning
        style={{ display: 'block' }}
        title={t(`${translationPath}are-you-sure`)}
        onConfirm={() => {
          handleDelete(row);
          setDeleteAlert(null);
        }}
        onCancel={() => setDeleteAlert(null)}
        showCancel
        confirmBtnBsStyle="success"
        cancelBtnText={t(`${translationPath}cancel`)}
        cancelBtnBsStyle="danger"
        confirmBtnText={t(`${translationPath}yes-delete-the-team`)}
        btnSize=""
      >
        {t(`${translationPath}are-you-sure-you-want-to-remove-this-team`)}
      </ReactBSAlert>,
    );
  };
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [isWorking, setIsWorking] = useState(false);
  const handleDelete = async (row) => {
    setIsWorking(true);
    return await axios
      .delete(RecuiterPreference.TEAM_WRITE, {
        params: {
          uuid: row.uuid,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        addToast(t(`${translationPath}team-removed`), {
          appearance: 'success',
          autoDismiss: true,
        });
        setIsWorking(false);
        props.removeTeam(row.uuid);
        closeModal();
      })
      .catch((err) => {
        addToast(t(`${translationPath}error-in-removing-team`), {
          appearance: 'error',
          autoDismiss: true,
        });
        setIsWorking(false);
        props.removeTeam(row.uuid);
      });
  };

  // View Modal
  const [currentUUID, setCurrentUUID] = useState();
  // Modal
  const [isViewTeamModalOpen, setIsViewTeamModalOpen] = useState(true);

  const openModal = () => {
    setIsViewTeamModalOpen(true);
  };
  const closeModal = () => {
    setIsViewTeamModalOpen(false);
  };

  return (
    <>
      {deleteAlert}
      <Row>
        {isViewTeamModalOpen && currentUUID && (
          <ViewTeamModal
            isOpen={isViewTeamModalOpen}
            closeModal={closeModal}
            currentUUID={currentUUID}
            getTeams={props.getTeams}
          />
        )}
        <div className="col">
          {isWorking && <Loader />}
          {!isWorking && (
            <ToolkitProvider
              data={props.teams}
              keyField="uuid"
              columns={[
                {
                  dataField: 'title',
                  text: t(`${translationPath}team-name`),
                  sort: true,
                  editable: false,
                },
                {
                  dataField: 'users',
                  text: t(`${translationPath}users`),
                  isDummyField: true,
                  editable: false,
                  formatter: (cellContent, row) => (
                    <div className={classes.root}>
                      {row
                        && row.users?.length > 0
                        && row.users.map((user, i) => (
                          <LetterAvatar
                            key={i}
                            name={`${user?.first_name} ${user?.last_name}`}
                          />
                        ))}
                    </div>
                  ),
                  // return <AvatarList data={row.users} max={7} />;
                },

                {
                  editable: false,
                  dataField: 'actions',
                  text: t(`${translationPath}actions`),
                  isDummyField: true,
                  formatter: (cellContent, row) => (
                    <Actions>
                      <ActionDropdown>
                        <DropdownItem
                          onClick={() => {
                            setCurrentUUID(row.uuid);
                            openModal();
                          }}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-eye" />
                          </span>
                          {t(`${translationPath}view-team`)}
                        </DropdownItem>

                        <DropdownItem
                          disabled={
                            // !Can('edit', 'team')
                            !getIsAllowedPermissionV2({
                              permissions,
                              permissionId: ManageTeamsPermissions.UpdateTeams.key,
                            })
                          }
                          onClick={(e) => props.handleView(e, row)}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-pen" />
                          </span>
                          {t(`${translationPath}edit-team`)}
                        </DropdownItem>

                        <DropdownItem
                          disabled={
                            // !Can('delete', 'team')
                            !getIsAllowedPermissionV2({
                              permissions,
                              permissionId: ManageTeamsPermissions.DeleteTeams.key,
                            })
                          }
                          onClick={(e) => confirmDelete(e, row)}
                        >
                          <span className="btn-inner--icon">
                            <i className="fas fa-trash" />
                          </span>
                          <span>{t(`${translationPath}delete-team`)}</span>
                        </DropdownItem>
                      </ActionDropdown>
                    </Actions>
                  ),
                },
              ]}
              search
            >
              {(tableProps) => (
                <>
                  <HeaderContainer className="d-flex flex-column">
                    <BarContainer className="ml-auto-reversed ml--3">
                      <SearchBar
                        className="form-control-sm mb-3 search-input"
                        placeholder={t(`${translationPath}search`)}
                        {...tableProps.searchProps}
                      />
                      <Button
                        className="mr-3"
                        disabled={
                          // !Can('create', 'team')
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId: ManageTeamsPermissions.AddTeams.key,
                          })
                        }
                        onClick={() => {
                          props.openAddTeamModal();
                        }}
                        color="primary"
                        size="sm"
                      >
                        <i className="fas fa-plus" />{' '}
                        {t(`${translationPath}add-new-team`)}
                      </Button>
                    </BarContainer>
                    <div className="float-left mb-4">
                      <h2 className="mb-0">
                        {t(`${translationPath}list-of-teams`)}
                      </h2>
                      <p className="text-muted font-12">
                        {t(`${translationPath}add-new-team-description`)}
                      </p>
                    </div>
                  </HeaderContainer>
                  <div className="table-responsive overflow-visible">
                    {!props.teams.length ? (
                      <Empty />
                    ) : (
                      <RemoteTable
                        totalSize={props.teams.length}
                        tableProps={tableProps}
                      />
                    )}
                  </div>
                </>
              )}
            </ToolkitProvider>
          )}
        </div>
      </Row>
    </>
  );
};

export default TeamsTable;
