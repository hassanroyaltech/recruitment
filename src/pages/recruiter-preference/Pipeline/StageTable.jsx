import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ReactDragListView from 'react-drag-listview';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
import urls from 'api/urls';
import '../Preference.scss';
// react component for creating dynamic tables
import ToolkitProvider from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

// react component used to create sweet alerts
import ReactBSAlert from 'react-bootstrap-sweetalert';
// reactstrap components
import { Button, UncontrolledTooltip } from 'reactstrap';
import { kebabToTitle } from 'shared/utils';

// core components
import { useToasts } from 'react-toast-notifications';
import { DragIndicator } from 'shared/icons';
import { generateHeaders } from 'api/headers';
// Permissions
import { Can } from 'utils/functions/permissions';
import { useTranslation } from 'react-i18next';
import { Actions } from '../PreferenceStyles';
import StaticTable from '../components/StaticTable';
import StageEditCollapse from './StageEditCollapse.jsx';
import StageAddCollapse from './StageAddCollapse.jsx';
import Loader from '../components/Loader.jsx';
import { getIsAllowedPermissionV2, showError } from '../../../helpers';
import { PipelinesPermissions } from 'permissions';
import { useSelector } from 'react-redux';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const StyledDelete = styled(Button)`
  &:hover i {
    color: var(--danger);
  }
`;

const StageTable = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const [tableData, setTableData] = useState(props.data);
  const [deleteAlert, setDeleteAlert] = useState(null);
  useEffect(() => {
    setTableData(props.data);
  }, [props.data]);

  const confirmDelete = (e, row) => {
    setDeleteAlert(
      <ReactBSAlert
        danger
        showCancel
        title={t(`${translationPath}are-you-sure-you-want-to-remove-this-stage`)}
        confirmBtnText={t(`${translationPath}remove`)}
        cancelBtnText={t(`${translationPath}cancel`)}
        confirmBtnBsStyle="danger"
        cancelBtnCssClass="bg-light text-dark"
        onConfirm={() => {
          props.handleDelete(row.uuid);
          setDeleteAlert(null);
        }}
        onCancel={() => setDeleteAlert(null)}
        btnSize=""
      />,
    );
  };
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const dragProps = {
    onDragEnd(fromIndex, toIndex) {
      const tempData = Array.from(tableData || props.data);
      const item = tempData.splice(fromIndex, 1)[0];
      tempData.splice(toIndex, 0, item);
      setTableData([
        ...tempData.map((s, i) => ({
          ...s,
          order_view: i + 1,
        })),
      ]);

      // PUT to API
      axios
        .put(
          RecuiterPreference.STAGES_REORDER,
          {
            uuid: tempData.map((s) => s.uuid),
          },
          {
            headers: generateHeaders(),
          },
        )
        .then((res) => {
          addToast(t(`${translationPath}stage-moved`), {
            appearance: 'success',
            autoDismiss: true,
          });
        })
        .catch((error) => {
          showError(t(`${translationPath}error-in-moving-stage`), error);
        });
    },
    handleSelector: 'div.drag-handler',
    nodeSelector: '.table tr',
  };

  // Expand Action Logic
  const [isExpanded, setIsExpanded] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [isAddCollapseOpen, setIsAddCollapseOpen] = useState(false);

  // Get Delay List
  const [delayList, SetDelayList] = useState();
  useEffect(() => {
    if (delayList) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    const getDelaylist = async () => {
      await axios
        .get(
          `${RecuiterPreference.stages_GET}/delay-list`,

          {
            headers: generateHeaders(),
          },
        )
        .then((res) => {
          SetDelayList(res.data.results);
        })
        .catch((error) => {
          showError(t(`${translationPath}error-in-getting-delay-list`), error);
        });
    };

    getDelaylist();
  }, [t, isExpanded, isAddCollapseOpen]);

  // Get Templates
  const [templates, setTemplates] = useState();
  useEffect(() => {
    if (templates) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    const getTemplates = async () =>
      await axios
        .get(urls.preferences.EMAIL_TEMPLATES_DROPDOWN, {
          headers: generateHeaders(),
        })
        .then((res) => {
          setTemplates(res.data.results);
        })
        .catch((error) => {
          showError(t(`${translationPath}error-in-getting-templates`), error);
        });
    getTemplates();
  }, [t, isExpanded, isAddCollapseOpen]);

  // Get Video Assessment
  const [videoAssessments, setVideoAssessments] = useState();
  useEffect(() => {
    if (videoAssessments) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    const getVideoAssessments = async () =>
      await axios
        .get(urls.evassess.ASSESSMENT_LIST, {
          headers: generateHeaders(),
        })
        .then((res) => {
          setVideoAssessments(res.data.results);
        })
        .catch((error) => {
          showError(
            t(`${translationPath}error-in-getting-video-assessments`),
            error,
          );
        });
    getVideoAssessments();
  }, [t, isExpanded, isAddCollapseOpen]);

  const [questionnaires, setQuestionnaires] = useState();
  useEffect(() => {
    if (questionnaires) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    const getQuestionnaires = async () =>
      await axios
        .get(urls.questionnaire.LIST_BY_PIPELINE, {
          headers: generateHeaders(),
          params: {
            pipeline_uuid: props.currentPipeline.uuid,
          },
        })
        .then((res) => {
          setQuestionnaires(res.data.results);
          setIsWorking(false);
        })
        .catch((error) => {
          showError(
            t(`${translationPath}error-in-getting-video-questionnaires`),
            error,
          );

          setIsWorking(false);
        });
    getQuestionnaires();
  }, [t, isExpanded, isAddCollapseOpen]);

  // Default Email
  const [defaultEmail, setDefaultEmail] = useState();
  useEffect(() => {
    if (defaultEmail) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    const getDefaultEmail = async () =>
      await axios
        .get(RecuiterPreference.TEMPLATE_BY_SLUG, {
          params: {
            slug: 'move_stage',
            language_id: props.currentPipeline.language.id,
          },
          headers: generateHeaders(),
        })
        .then((res) => {
          setDefaultEmail(res.data.results);
          setIsWorking(false);
        })
        .catch((error) => {
          setIsWorking(false);
          showError(
            t(`${translationPath}error-in-getting-video-questionnaires`),
            error,
          );
        });
    getDefaultEmail();
  }, [t, isExpanded, isAddCollapseOpen]);

  const [variables, setVariables] = useState();
  useEffect(() => {
    if (variables) return;

    if (!isExpanded && !isAddCollapseOpen) return;

    // Get Variables
    const getVariables = async () => {
      await axios
        .get(RecuiterPreference.TEMPLATES_COLLECTION, {
          headers: generateHeaders(),
        })
        .then((res) => {
          setVariables(res.data.results.keys);
        })
        .catch((error) => {
          showError(t(`${translationPath}error-in-getting-video-variables`), error);
        });
    };
    getVariables();
  }, [t, isExpanded, isAddCollapseOpen]);
  return (
    <>
      {deleteAlert}
      <ReactDragListView {...dragProps}>
        <ToolkitProvider
          data={tableData}
          keyField="uuid"
          columns={[
            {
              dataField: 'can_delete',
              text: 'can_delete',
              hidden: true,
              type: 'bool',
            },
            {
              dataField: 'title',
              text: (
                <span className="ml-4-reversed">
                  {t(`${translationPath}stage-title`)}
                </span>
              ),
              editable: (cellContent, row, index) => !row.is_based,
              isDummyField: true,
              formatter: (cellContent, row, index) => (
                <div className="d-flex align-content-center">
                  <div
                    className="d-inline-block drag-handler mr-2-reversed"
                    id={`stage-move${row.uuid}`}
                  >
                    <DragIndicator />
                  </div>
                  <span className="d-flex align-items-center text-break">
                    {row.title}
                  </span>
                </div>
              ),
              // Footer
              footer: 'Footer 1',
              footerClasses: 'table-custom-footer',
              footerAttrs: {
                colspan: 3,
              },
              footerFormatter: (column, colIndex) => (
                <>
                  {/* eslint-disable-next-line react/button-has-type */}
                  <button
                    className="text-primary cursor-pointer pl-2-reversed unstyled-button"
                    disabled={
                      // !Can('create', 'pipeline')
                      !getIsAllowedPermissionV2({
                        permissions,
                        permissionId: PipelinesPermissions.UpdatePipelines.key,
                      })
                    }
                    onClick={() => {
                      setIsExpanded(false);
                      setIsAddCollapseOpen(
                        (isAddCollapseOpen) => !isAddCollapseOpen,
                      );
                    }}
                  >
                    <i
                      className={`fas fa-${
                        !isAddCollapseOpen ? 'plus' : 'times'
                      } mr-2-reversed`}
                    />
                    <strong>
                      {!isAddCollapseOpen
                        ? t(`${translationPath}add-new-stage`)
                        : t(`${translationPath}close`)}
                    </strong>
                  </button>
                  {isAddCollapseOpen && (
                    <>
                      {(!delayList
                        || !templates
                        || !videoAssessments
                        || !questionnaires
                        || !variables
                        || !defaultEmail) && <Loader />}
                      {delayList
                        && templates
                        && videoAssessments
                        && questionnaires
                        && variables
                        && defaultEmail && (
                        <StageAddCollapse
                          delayList={delayList}
                          templates={templates}
                          questionnaires={questionnaires}
                          videoAssessments={videoAssessments}
                          variables={variables}
                          defaultEmail={defaultEmail}
                          user={user}
                          pipeline={props.currentPipeline}
                          getStages={props.getStages}
                          close={() => {
                            setIsAddCollapseOpen(
                              (isAddCollapseOpen) => !isAddCollapseOpen,
                            );
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              ),
            },

            {
              dataField: 'action_type',
              text: t(`${translationPath}stage-action`),
              hidden: false,
              isDummyField: true,
              editable: false,
              formatter: (cellContent, row, index) => (
                <span className="action--type">
                  {row.action_type ? kebabToTitle(row.action_type) : 'N/A'}
                </span>
              ),
            },

            {
              dataField: 'actions',
              text: t(`${translationPath}delete`),
              isDummyField: true,
              headerClasses: 'text-right pr-4-reversed',
              editable: false,
              formatter: (cellContent, row) => (
                <Actions className="d-flex justify-content-end pr-4-reversed">
                  {row.can_delete && Can('delete', 'pipeline') && (
                    <>
                      <StyledDelete
                        id={`stage-delete${row.uuid}`}
                        className="btn-icon btn bg-transparent"
                        size="sm"
                        color="transparent"
                        type="button"
                        onClick={(e) => confirmDelete(e, row)}
                        disabled={
                          !getIsAllowedPermissionV2({
                            permissions,
                            permissionId: PipelinesPermissions.DeletePipelines.key,
                          })
                        }
                      >
                        <span className="btn-inner--icon ">
                          <i className="fas fa-trash" />
                        </span>
                      </StyledDelete>
                      <UncontrolledTooltip target={`stage-delete${row.uuid}`}>
                        {t(`${translationPath}delete-stage`)}
                      </UncontrolledTooltip>
                    </>
                  )}
                </Actions>
              ),
            },
          ]}
        >
          {(tableProps) => (
            <div className="table-responsive">
              <StaticTable
                classes="table-layout-fixed custom-stage-table border-bottom-0"
                rowClasses="cursor-pointer"
                totalSize={tableData.length}
                tableProps={tableProps}
                footerClasses="position-relative"
                expandRow={{
                  onlyOneExpanding: true,
                  className: 'border-primary bg-blue-light-old',
                  parentClassName: 'expanded-row',
                  renderer: (row) => {
                    if (!isExpanded) setIsExpanded(true);

                    return (
                      <>
                        {(!delayList
                          || !templates
                          || !videoAssessments
                          || !questionnaires
                          || !variables
                          || !defaultEmail) && <Loader />}
                        {delayList
                          && templates
                          && videoAssessments
                          && questionnaires
                          && variables
                          && defaultEmail && (
                          <StageEditCollapse
                            delayList={delayList}
                            templates={templates}
                            videoAssessments={videoAssessments}
                            questionnaires={questionnaires}
                            variables={variables}
                            defaultEmail={defaultEmail}
                            stageData={row}
                            user={user}
                            pipeline={props.currentPipeline}
                          />
                        )}
                      </>
                    );
                  },
                  onExpand: (row, isExpand, rowIndex, e) => {
                    if (isAddCollapseOpen) setIsAddCollapseOpen(false);
                  },
                }}
              />
            </div>
          )}
        </ToolkitProvider>
      </ReactDragListView>
    </>
  );
};

export default StageTable;
