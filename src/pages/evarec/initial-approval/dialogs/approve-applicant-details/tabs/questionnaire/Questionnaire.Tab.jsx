import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import AccordionDetails from '@mui/material/AccordionDetails';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button, Popover, Tab, Tabs } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import QuestionItemCard from '../../../../../../../components/Views/CandidateModals/evarecCandidateModal/CandidateQuestionnaireTab/QuestionItemCard';
import {
  getQuestionnairesListByPipeline,
  SendQuestionnaireJob,
} from '../../../../../../../shared/APIs/VideoAssessment/Questionnaires';
import { showError } from '../../../../../../../helpers';
import { evarecAPI } from '../../../../../../../api/evarec';

export const QuestionnaireTab = ({
  questionnaires,
  candidate_uuid,
  pipeline_uuid,
  job_uuid,
  job_candidate_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useState({
    questionnaires,
    questionnaire: [],
    newDeadline: '',
    anchorEl: null,
    selectedQuestionnaire: null,
    listOfQuestionnaires: [],
    isLoadingQuestion: false,
    isLoadingQuestionnaire: true,
    isLoadingReminder: false,
    tabValue: 0,
    questionnaireOptions: [],
    isExpanded: false,
    anchorE2: null,
    selectedReminder: null,
  });
  /**
   * Function to view questions in selected questionnaire
   * @returns {Promise}
   * @param e
   */
  const handleViewQuestionnaire = useCallback(
    (e) => {
      setState((items) => ({ ...items, isLoadingQuestionnaire: true }));
      const isSignUpQuestionnaire = e.is_sing_up_questionnaire ? 1 : 0;
      evarecAPI
        .getQuestionnaireDetails(
          isSignUpQuestionnaire ? candidate_uuid : job_candidate_uuid,
          e.uuid,
          isSignUpQuestionnaire,
        )
        .then((response) => {
          setState((items) => ({
            ...items,
            questionnaire: response.data.results,
            isLoadingQuestionnaire: false,
          }));
        })
        .catch(() => {});
    },
    [candidate_uuid, job_candidate_uuid],
  );

  const handleClick = (event) => {
    setState((items) => ({ ...items, anchorEl: event.currentTarget }));
  };

  const handleClose = () => {
    setState((items) => ({ ...items, anchorEl: null }));
  };

  const handleSendQuestionnaire = async () => {
    setState((items) => ({ ...items, isLoadingQuestion: true }));
    await SendQuestionnaireJob(
      job_uuid,
      state.selectedQuestionnaire,
      [job_candidate_uuid],
      state.newDeadline,
    )
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          'Send questionnaire',
          'Send questionnaire',
          1,
          {},
        ]);

        evarecAPI
          .getCandidateQuestionnaire(job_candidate_uuid)
          .then((res) => {
            setState((items) => ({
              ...items,
              questionnaires: res.data.results,
            }));
          })
          .catch(() => {});
        setState((items) => ({
          ...items,
          selectedQuestionnaire: null,
          newDeadline: '',
          questionnaireOptions: null,
          isLoadingQuestion: false,
        }));
      })
      .catch(() => {
        setState((items) => ({ ...items, isLoadingQuestion: false }));
      });
  };

  const handleTabPopClose = () => {
    setState((prevState) => ({
      ...prevState,
      anchorE2: null,
      selectedReminder: null,
    }));
  };

  const handleTabPopMuseEnter = (event, selectedItemUuid) => {
    setState((prevState) => ({
      ...prevState,
      anchorE2: event.currentTarget,
      selectedReminder: selectedItemUuid?.uuid,
    }));
  };

  const handleSendReminder = async () => {
    setState((items) => ({ ...items, isLoadingReminder: true }));
    const deadLine = moment().add(7, 'd').format('YYYY-MM-DD');
    await SendQuestionnaireJob(
      job_uuid,
      state.selectedReminder,
      [job_candidate_uuid],
      deadLine,
    )
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          'Send questionnaire',
          'Send questionnaire',
          1,
          {},
        ]);

        setState((items) => ({ ...items, isLoadingReminder: false }));
        handleTabPopClose();
      })
      .catch(() => {
        setState((items) => ({ ...items, isLoadingReminder: false }));
      });
  };

  const initHandler = useCallback(() => {
    evarecAPI
      .getCandidateQuestionnaire(job_candidate_uuid)
      .then((res) => {
        setState((items) => ({
          ...items,
          questionnaires: res.data.results,
          isLoadingQuestionnaire: false,
        }));
        if (res?.data?.results && res?.data?.results.length > 0) {
          const e = res?.data?.results[0];
          const isSignUpQuestionnaire = res?.data?.results[0]
            ?.is_sing_up_questionnaire
            ? 1
            : 0;
          evarecAPI
            .getQuestionnaireDetails(
              isSignUpQuestionnaire ? candidate_uuid : job_candidate_uuid,
              e.uuid,
              isSignUpQuestionnaire,
            )
            .then((response) => {
              setState((items) => ({
                ...items,
                questionnaire: response.data.results,
                isLoadingQuestionnaire: false,
              }));
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
    getQuestionnairesListByPipeline(pipeline_uuid)
      .then((res) => {
        setState((items) => ({ ...items, listOfQuestionnaires: res.data?.results }));
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-questionnaires`), error);
      });
    if (questionnaires && questionnaires[0])
      handleViewQuestionnaire(questionnaires[0]);
  }, [
    candidate_uuid,
    handleViewQuestionnaire,
    job_candidate_uuid,
    pipeline_uuid,
    questionnaires,
    t,
    translationPath,
  ]);

  useEffect(() => {
    initHandler();
  }, [initHandler]);

  return (
    <>
      <div className="questionnaires-tab-wrapper">
        <Accordion expanded={state.isExpanded}>
          <AccordionSummary
            onClick={() =>
              setState((prevState) => ({
                ...prevState,
                isExpanded: !prevState.isExpanded,
              }))
            }
            expandIcon={
              <Tooltip
                title={
                  state.isExpanded
                    ? t(`${translationPath}close`)
                    : t(`${translationPath}add`)
                }
              >
                <AddIcon />
              </Tooltip>
            }
          >
            {t(`${translationPath}send-new-questionnaire`)}
          </AccordionSummary>
          <AccordionDetails>
            <div className="questionnaires-tab-add-wrapper">
              <TextField
                select
                fullWidth
                variant="outlined"
                value={state.questionnaireOptions}
                label={t(`${translationPath}select-questionnaire`)}
                disabled={state.listOfQuestionnaires?.length === 0}
                onChange={(e) => {
                  setState((items) => ({
                    ...items,
                    selectedQuestionnaire: e.target.value.uuid,
                    questionnaireOptions: e.target.value,
                  }));
                }}
              >
                {state.listOfQuestionnaires?.map((questionnaire, i) => (
                  <MenuItem key={i} value={questionnaire}>
                    {questionnaire.title}
                  </MenuItem>
                ))}
              </TextField>
              {state.listOfQuestionnaires?.length === 0 && (
                <span className="no-questionnaires-available">
                  {t(`${translationPath}no-questionnaires-available`)}
                </span>
              )}
              <div className="select-question-wrapper">
                <div className="date-picker-button-wrapper">
                  <Button onClick={handleClick}>
                    <div className="">
                      <i className="fa fa-calendar-alt pr-2" />
                      {state.newDeadline || t(`${translationPath}set-deadline`)}
                    </div>
                  </Button>
                </div>
                <Popover
                  open={Boolean(state.anchorEl)}
                  anchorEl={state.anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                  }}
                >
                  <TextField
                    id="date"
                    type="date"
                    variant="standard"
                    value={state.newDeadline || ''}
                    defaultValue={state.newDeadline || ''}
                    onChange={(event) => {
                      const { value } = event.target;
                      setState((items) => ({ ...items, newDeadline: value }));
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Popover>
                <div className="send-button">
                  <Button
                    onClick={handleSendQuestionnaire}
                    disabled={
                      !state.selectedQuestionnaire
                      || !state.newDeadline
                      || state.isLoadingQuestion
                    }
                  >
                    {`${
                      state.isLoadingQuestion
                        ? t(`${translationPath}sending`)
                        : t(`${translationPath}send`)
                    }`}
                    {state.isLoadingQuestion && (
                      <i className="fas fa-circle-notch fa-spin ml-2" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
        {state.questionnaires && state.questionnaires.length > 0 && (
          <div className="select-questionnaire-tab-wrapper questionnaire-popover-wrapper">
            <Tabs
              scrollButtons="auto"
              variant="scrollable"
              value={state.tabValue || 0}
              onChange={(event, newValue) =>
                setState((items) => ({ ...items, tabValue: newValue }))
              }
            >
              {state.questionnaires?.map((item, index) => {
                const selectedItemUuid
                  = state.listOfQuestionnaires.find((el) => el.title === item.title)
                  || '';

                return (
                  <Tab
                    label={item.title}
                    icon={
                      selectedItemUuid
                      && selectedItemUuid.uuid && (
                        <i
                          className="fas fa-stopwatch"
                          onMouseEnter={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            handleTabPopMuseEnter(event, selectedItemUuid);
                          }}
                        />
                      )
                    }
                    key={`${index + 1}-q-tab`}
                    className="questionnaire-tab-wrapper"
                    onClick={() => handleViewQuestionnaire(item)}
                  />
                );
              })}
              <Popover
                anchorEl={state.anchorE2}
                onClose={handleTabPopClose}
                open={Boolean(state.anchorE2)}
                className="questionnaire-popover-wrapper"
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'center',
                }}
              >
                {t(`${translationPath}send-reminder`)}
                <Button
                  onClick={handleSendReminder}
                  disabled={!state.selectedReminder || state.isLoadingReminder}
                >
                  {`${
                    state.isLoadingReminder
                      ? t(`${translationPath}sending`)
                      : t(`${translationPath}send`)
                  }`}
                  {state.isLoadingReminder && (
                    <i className="fas fa-circle-notch fa-spin ml-2" />
                  )}
                </Button>
              </Popover>
            </Tabs>
          </div>
        )}
        {state.isLoadingQuestionnaire ? (
          <div className="mt-3">
            <Skeleton
              className="mb-3"
              variant="rectangular"
              width={320}
              height={180}
            />
            <Skeleton
              className="mb-3"
              variant="rectangular"
              width={320}
              height={120}
            />
          </div>
        ) : (
          <div className="question-card-wrapper">
            {state?.questionnaire && state?.questionnaire?.length > 0 ? (
              state.questionnaire?.map((item, index) => (
                <React.Fragment key={index}>
                  <QuestionItemCard
                    index={index + 1}
                    question={item}
                    answer={item}
                  />
                </React.Fragment>
              ))
            ) : (
              <div className="no-questions-title has-background">
                {t(`${translationPath}no-questions-available`)}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

QuestionnaireTab.propTypes = {
  questionnaires: PropTypes.instanceOf(Array),
  candidate_uuid: PropTypes.string.isRequired,
  pipeline_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

QuestionnaireTab.defaultProps = {
  questionnaires: undefined,
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
