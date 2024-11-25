import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { Divider } from '@mui/material';
import {
  showError,
  showSuccess,
  globalSelectedRowsHandler,
} from '../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  GetEvaRecPipelineQuestionnaires,
  GetEvaRecPipelineQuestionnaireCandidate,
  UpdateCandidateQuestionnaireStatus,
} from '../../../../../../../../services';
import Datepicker from '../../../../../../../../components/Elevatus/Datepicker';
import Loader from '../../../../../../../../components/Elevatus/Loader';
import TablesComponent from '../../../../../../../../components/Tables/Tables.Component';
import { SystemActionsEnum } from '../../../../../../../../enums';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'QuestionnaireManagementDialog.';

const statusEnum = {
  pending: {
    key: 1,
    title: 'pending',
  },
  expired: {
    key: 2,
    title: 'expired',
  },
  completed: {
    key: 3,
    title: 'completed',
  },
};

export const ManageQuestionnairesDialog = ({ jobUUID, isOpen, isOpenChanged }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCandidate, setIsLoadingCandidate] = useState(false);
  const [selectedRows, setSelectedRows] = useState({});

  const stateInitRef = useRef({
    questionnairesIds: [],
    questionnairesData: [],
    activeQuestionnaireCandidates: [],
    candidatesData: [],
    selected_questionnaire: null,
    showFilteredCandidate: true,
    selectAllObj: {},
    selectedCandidates: [],
    newDeadline: null,
    filteredCandidate: { expired: [], pending: [], completed: [] },
    viewed: {},
    filter: { expired: 0, pending: 0, completed: 0 },
    page: 0,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const GetPipelineQuestionnairesHandler = useCallback(
    async (uuid) => {
      setIsLoading(true);
      const response = await GetEvaRecPipelineQuestionnaires({ job_uuid: uuid });
      if (response && response.status === 200) {
        const questionnairesIds = response.data?.results?.map((item) => item.uuid);
        onStateChanged({ id: 'questionnairesIds', value: questionnairesIds });
        onStateChanged({ id: 'questionnairesData', value: response.data?.results });
        setIsLoading(false);
      } else {
        onStateChanged({ id: 'questionnairesIds', value: [] });
        onStateChanged({ id: 'questionnairesData', value: [] });

        showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoading(false);
      }
    },
    [t],
  );
  const GetQuestionnaireCandidateHandler = useCallback(
    async (job_questionnaire_uuid, status, section) => {
      setIsLoadingCandidate(true);
      const response = await GetEvaRecPipelineQuestionnaireCandidate({
        job_questionnaire_uuid,
        status,
      });
      if (response && response.status === 200) {
        const data = response.data?.results;
        if (status && section) {
          onStateChanged({
            parentId: 'filteredCandidate',
            id: section,
            value: data,
          });
          if (data?.length)
            onStateChanged({ parentId: 'viewed', id: section, value: true });
          else showError('There are no candidates in this section');
        } else
          onStateChanged({
            id: 'activeQuestionnaireCandidates',
            value: response.data?.results,
          });

        setIsLoadingCandidate(false);
      } else {
        onStateChanged({ id: 'activeQuestionnaireCandidates', value: [] });

        showError(t('Shared:failed-to-get-saved-data'), response);
        setIsLoadingCandidate(false);
      }
    },
    [t],
  );

  const UpdateCandidateQuestionnaireStatusHandler = useCallback(
    async ({ candidate_uuid, newStatus, deadline }) => {
      setIsLoadingCandidate(true);
      const response = await UpdateCandidateQuestionnaireStatus({
        candidate_uuid,
        status: newStatus,
        deadline,
      });
      if (response && response.status === 200) {
        if (deadline) {
          showSuccess('Extended Successfully');
          GetQuestionnaireCandidateHandler(state.selected_questionnaire);
          const data = { ...state.candidatesData };
          delete data[candidate_uuid];
          onStateChanged({ id: 'candidatesData', value: data });
        } else showSuccess('Reminder Sent Successfully');
        setIsLoadingCandidate(false);
      } else {
        showError('failed to change status');
        showError(t('Shared:failed-to-get-saved-data'), response); // test
        setIsLoadingCandidate(false);
      }
    },
    [
      GetQuestionnaireCandidateHandler,
      state.candidatesData,
      state.selected_questionnaire,
      t,
    ],
  );

  useEffect(() => {
    if (jobUUID && isOpen) GetPipelineQuestionnairesHandler(jobUUID);
  }, [jobUUID, GetPipelineQuestionnairesHandler, isOpen]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="manage-questionnaires"
      contentClasses="px-0"
      dialogContent={
        <div className="shared-control-wrapper">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <SharedAutocompleteControl
                isFullWidth
                searchKey="search"
                initValuesKey="job_questionnaire_uuid"
                isDisabled={isLoading}
                initValuesTitle="title"
                initValues={state.questionnairesData}
                stateKey="selected_questionnaire"
                errorPath="selected_questionnaire"
                onValueChanged={(e) => {
                  onStateChanged(e);
                  onStateChanged({
                    id: 'filteredCandidate',
                    value: { expired: [], pending: [], completed: [] },
                  });
                  onStateChanged({ id: 'showFilteredCandidate', value: true });
                  onStateChanged({ id: 'viewed', value: {} });
                  if (!e.value)
                    onStateChanged({
                      id: 'activeQuestionnaireCandidates',
                      value: [],
                    });
                }}
                title="questionnaire"
                editValue={state.selected_questionnaire}
                placeholder="select-questionnaire"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              {isLoadingCandidate ? (
                <Loader />
              ) : (
                <div>
                  {state.selected_questionnaire ? (
                    <div className="mb-3">
                      <ButtonBase
                        className="btns-icon theme-transparent mr-1-reversed c-primary"
                        onClick={() => {
                          onStateChanged({
                            id: 'showFilteredCandidate',
                            value: !state.showFilteredCandidate,
                          });
                          if (state.showFilteredCandidate)
                            GetQuestionnaireCandidateHandler(
                              state.selected_questionnaire,
                            );
                        }}
                      >
                        <div>
                          <span className={SystemActionsEnum.filter.icon} />
                        </div>
                      </ButtonBase>
                      <span>
                        {state.showFilteredCandidate
                          ? t(`${translationPath}show-all-candidates`)
                          : t(`${translationPath}sort-by-status-for-bulk-actions`)}
                      </span>
                      <Divider />
                    </div>
                  ) : null}
                  {state.showFilteredCandidate && state.selected_questionnaire && (
                    <div>
                      {Object.keys(state?.filteredCandidate).map((section) =>
                        state?.filteredCandidate?.[section] ? (
                          <div key={section}>
                            <div className="d-flex-h-between mb-2 mx-2">
                              <div className="d-flex-v-center">
                                <span className="c-black-light fw-bold">
                                  {t(`${translationPath}${section}`)}
                                </span>
                              </div>
                              {!state.viewed?.[section] && (
                                <div>
                                  <ButtonBase
                                    className="btns theme-solid px-3 w-100 m-0"
                                    onClick={() => {
                                      GetQuestionnaireCandidateHandler(
                                        state.selected_questionnaire,
                                        statusEnum?.[section]?.key,
                                        section,
                                      ); // change later
                                    }}
                                  >
                                    <span className="px-1">
                                      {t(`${translationPath}view-candidates`)}
                                    </span>
                                  </ButtonBase>
                                </div>
                              )}
                              {section !== 'completed'
                                && state.viewed?.[section] && (
                                <div className="d-flex-v-center-h-end">
                                  {section === 'expired' && (
                                    <div className="px-2">
                                      <Datepicker
                                        minDate={new Date()}
                                        inputPlaceholder="YYYY-MM-DD"
                                        value={state.newDeadline || ''}
                                        label={t(`${translationPath}deadline`)}
                                        onChange={(date) => {
                                          onStateChanged({
                                            id: 'newDeadline',
                                            value: date,
                                          });
                                        }}
                                      />
                                    </div>
                                  )}
                                  <div>
                                    <ButtonBase
                                      className="btns theme-solid px-3 w-100 m-0"
                                      disabled={
                                        (section === 'expired'
                                            && !state.newDeadline)
                                          || !selectedRows?.[section]?.length
                                      }
                                      onClick={() => {
                                        if (section === 'expired')
                                          UpdateCandidateQuestionnaireStatusHandler(
                                            {
                                              candidate_uuid: selectedRows?.[
                                                section
                                              ]?.map(
                                                (row) =>
                                                  row.questionnaire_candidate_uuid,
                                              ),
                                              deadline: state.newDeadline,
                                              newStatus: 1, // use enum later
                                            },
                                          );
                                        if (section === 'pending')
                                          UpdateCandidateQuestionnaireStatusHandler(
                                            {
                                              candidate_uuid: selectedRows?.[
                                                section
                                              ]?.map(
                                                (row) =>
                                                  row.questionnaire_candidate_uuid,
                                              ),
                                              newStatus: 2, // use enum later
                                            },
                                          );
                                      }}
                                    >
                                      <span className="px-1">
                                        {section !== 'completed'
                                            && (section === 'expired'
                                              ? t(`${translationPath}extend`)
                                              : t(
                                                `${translationPath}send-reminder`,
                                              ))}
                                      </span>
                                    </ButtonBase>
                                  </div>
                                </div>
                              )}
                            </div>
                            <Divider className="mb-4" />
                            <TablesComponent
                              wrapperClasses="p-0 mb-4"
                              tableActionsOptions={false}
                              isWithTableActions={false}
                              data={state?.filteredCandidate?.[section]}
                              // isLoading={isLoading || isLoadingColumns}
                              headerData={[
                                {
                                  id: 'candidate.name',
                                  label: 'Candidate Name',
                                  input: 'candidate.name',
                                },
                                {
                                  id: 'deadline',
                                  label: 'Deadline',
                                  input: 'deadline',
                                },
                              ]}
                              // pageIndex={0}
                              pageIndex={state.filter?.[section]}
                              onPageIndexChanged={(value) => {
                                onStateChanged({
                                  parentId: 'filter',
                                  id: section,
                                  value,
                                });
                              }}
                              pageSize={10}
                              totalItems={
                                state?.filteredCandidate?.[section]?.length
                              }
                              isWithCheckAll={section !== 'completed'}
                              isWithCheck={section !== 'completed'}
                              uniqueKeyInput="questionnaire_candidate_uuid"
                              selectedRows={
                                section === 'completed'
                                  ? undefined
                                  : selectedRows?.[section] || []
                              }
                              onSelectAllCheckboxChanged={() => {
                                setSelectedRows((items) => ({
                                  ...items,
                                  [section]: globalSelectedRowsHandler(
                                    items[section],
                                    state?.filteredCandidate?.[section],
                                  ),
                                }));
                              }}
                              onSelectCheckboxChanged={
                                section === 'completed'
                                  ? undefined
                                  : ({ selectedRow }) => {
                                    if (!selectedRow) return;
                                    if (
                                      !selectedRows?.[section]?.includes(
                                        selectedRow,
                                      )
                                    )
                                      setSelectedRows((items) => ({
                                        ...items,
                                        [section]: items?.[section]
                                          ? [...items[section], selectedRow]
                                          : [selectedRow],
                                      }));
                                    else
                                      setSelectedRows((items) => ({
                                        ...items,
                                        [section]: items[section]?.filter(
                                          (row) =>
                                            row.questionnaire_candidate_uuid
                                              !== selectedRow.questionnaire_candidate_uuid,
                                        ),
                                      }));
                                  }
                              }
                            />
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                  {!state.showFilteredCandidate
                    && state.activeQuestionnaireCandidates && (
                    <TablesComponent
                      wrapperClasses="p-0 mb-4"
                      tableActionsOptions={false}
                      isWithTableActions={false}
                      data={state.activeQuestionnaireCandidates}
                      // isLoading={isLoading || isLoadingColumns}
                      headerData={[
                        {
                          id: 'candidate.name',
                          label: 'Candidate Name',
                          input: 'candidate.name',
                        },
                        {
                          id: 'status',
                          label: 'Status',
                          input: 'status',
                        },
                        {
                          id: 'deadline',
                          label: 'Deadline',
                          // input: 'deadline',
                          component: (row) => (
                            <div className="px-2">
                              <Datepicker
                                isDisabled={row.status !== 'expired'}
                                minDate={new Date()}
                                inputPlaceholder="YYYY-MM-DD"
                                value={row.deadline || ''}
                                // label={t(`${translationPath}deadline`)}
                                onChange={(date) => {
                                  onStateChanged({
                                    id: 'candidatesData',
                                    value: {
                                      ...state.candidatesData,
                                      [row?.questionnaire_candidate_uuid]: date,
                                    },
                                  });
                                }}
                              />
                            </div>
                          ),
                        },
                        {
                          id: 'actions',
                          label: 'Actions',
                          // input: 'actions',
                          component: (row) => (
                            <>
                              {row.status === 'expired' && (
                                <ButtonBase
                                  className="btns theme-solid px-3 mx-2 w-100"
                                  disabled={
                                    isLoading
                                      || !state.candidatesData?.[
                                        row?.questionnaire_candidate_uuid
                                      ]
                                  }
                                  onClick={() => {
                                    if (
                                      state.candidatesData?.[
                                        row?.questionnaire_candidate_uuid
                                      ]
                                    )
                                      UpdateCandidateQuestionnaireStatusHandler({
                                        candidate_uuid: [
                                          row?.questionnaire_candidate_uuid,
                                        ],
                                        deadline:
                                            state.candidatesData[
                                              row.questionnaire_candidate_uuid
                                            ],
                                        newStatus: 1, // use enum later
                                      });
                                  }}
                                >
                                  <span className="px-1">
                                    {t(`${translationPath}extend`)}
                                  </span>
                                </ButtonBase>
                              )}
                              {row.status === 'pending' && (
                                <ButtonBase
                                  className="btns theme-solid px-3 mx-2 w-100"
                                  disabled={isLoading || row?.status !== 'pending'} // use enum later
                                  onClick={() => {
                                    if (row?.questionnaire_candidate_uuid)
                                      UpdateCandidateQuestionnaireStatusHandler({
                                        candidate_uuid: [
                                          row?.questionnaire_candidate_uuid,
                                        ],
                                        newStatus: 2, // use enum later
                                      });
                                  }}
                                >
                                  <span className="px-1">
                                    {t(`${translationPath}send-reminder`)}
                                  </span>
                                </ButtonBase>
                              )}
                            </>
                          ),
                        },
                      ]}
                      pageIndex={state.page}
                      onPageIndexChanged={(value) => {
                        onStateChanged({ id: 'page', value });
                      }}
                      pageSize={10}
                      totalItems={state.activeQuestionnaireCandidates?.length}
                      uniqueKeyInput="questionnaire_candidate_uuid"
                    />
                  )}
                </div>
              )}
            </>
          )}
        </div>
      }
      isOpen={isOpen}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ManageQuestionnairesDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
};
ManageQuestionnairesDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
};
