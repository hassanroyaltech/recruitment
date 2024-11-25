import React, { Component } from 'react';
import { evarecAPI } from '../../../../../api/evarec';
import { evassessAPI } from '../../../../../api/evassess';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import AddIcon from '@mui/icons-material/Add';
import Tooltip from '@mui/material/Tooltip';
import { Button, Popover, Tab, Tabs } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import QuestionItemCard from './QuestionItemCard';
import { SendQuestionnaireJob } from '../../../../../shared/APIs/VideoAssessment/Questionnaires';
import { Can } from '../../../../../utils/functions/permissions';

import DatePickerComponent from '../../../../Datepicker/DatePicker.Component';
import { GlobalSavingDateFormat } from '../../../../../helpers';
const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

// import evarec API
class CandidateQuestionnaireTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      questionnaires: this.props.questionnaires,
      questionnaire: [],
      newDeadline: '',
      anchorEl: null,
      selectedQuestionnaire: null,
      isLoadingQustion: false,
      isLoadingQuestionnaire: true,
      isLoadingReminder: false,
      tabValue: 0,
      questionnaireOptions: [],
      isExpanded: false,
      anchorE2: null,
      selectedReminder: null,
    };
  }

  // Will uncomment this function once the Questionnaire Details API is ready to use

  componentDidMount() {
    // Get Questionnaire List From API => then set the result to the drop down menu Questionnaire
    if (this.props.type === 'ats')
      evarecAPI.getCandidateQuestionnaire(this.props.candidate).then((res) => {
        this.setState({
          questionnaires: res.data.results,
        });
        this.setState({ isLoadingQuestionnaire: false });
        if (res?.data?.results && res?.data?.results.length > 0) {
          const e = res?.data?.results[0];
          const isSignUpQuestionnaire = res?.data?.results[0]
            ?.is_sing_up_questionnaire
            ? 1
            : 0;
          evarecAPI
            .getQuestionnaireDetails(
              isSignUpQuestionnaire
                ? this.props.candidate_uuid
                : this.props.candidate,
              e.uuid,
              isSignUpQuestionnaire,
            )
            .then((response) => {
              this.setState(
                {
                  questionnaire: response.data.results,
                },
                () => {},
              );
              this.setState({ isLoadingQuestionnaire: false });
            });
        }
      });
    // this.handleViewQuestionnaire();

    if (this.props?.questionnaires && this.props?.questionnaires[0])
      this.handleViewQuestionnaire(this.props?.questionnaires[0]);
  }

  /**
   * Function to view questions in selected questionnaire
   * @returns {Promise}
   * @param e
   */
  handleViewQuestionnaire = (e) => {
    this.setState({ isLoadingQuestionnaire: true });
    if (this.props?.type === 'prep_assessment')
      evassessAPI
        .getCandidatesQuestionnairesDetails(this.props.candidate_uuid, e.uuid)
        .then((response) => {
          this.setState(
            {
              questionnaire: response.data.results,
            },
            () => {},
          );
          this.setState({ isLoadingQuestionnaire: false });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ isLoadingQuestionnaire: false });
        });
    else {
      const isSignUpQuestionnaire = e.is_sing_up_questionnaire ? 1 : 0;

      // if (this.state?.questionnaires?.is_answered === true) {
      evarecAPI
        .getQuestionnaireDetails(
          isSignUpQuestionnaire ? this.props.candidate_uuid : this.props.candidate,
          e.uuid,
          isSignUpQuestionnaire,
        )
        .then((response) => {
          this.setState(
            {
              questionnaire: response.data.results,
            },
            () => {},
          );
          this.setState({ isLoadingQuestionnaire: false });
        });
    }
  };

  handleClick = (event) => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorEl: null });
  };

  handleSendQuestionnaire = async () => {
    this.setState({ isLoadingQustion: true });
    await SendQuestionnaireJob(
      this.props.job_uuid,
      this.state.selectedQuestionnaire,
      [this.props.candidate],
      this.state.newDeadline,
      this.props.pipeline_uuid,
    )
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          'Send questionnaire',
          'Send questionnaire',
          1,
          {},
        ]);

        evarecAPI.getCandidateQuestionnaire(this.props.candidate).then((res) => {
          this.setState({
            questionnaires: res.data.results,
          });
        });
        this.setState({ selectedQuestionnaire: null });
        this.setState({ newDeadline: '' });
        this.setState({ questionnaireOptions: null });
        this.setState({ isLoadingQustion: false });
      })
      .catch(() => {
        this.setState({ isLoadingQustion: false });
      });
  };

  handleTabPopClose = () => {
    this.setState((prevState) => ({ ...prevState, anchorE2: null }));
    this.setState((prevState) => ({ ...prevState, selectedReminder: null }));
  };

  handleTabPopMuseEnter = (event, selectedItemUuid) => {
    this.setState((prevState) => ({ ...prevState, anchorE2: event.currentTarget }));
    this.setState((prevState) => ({
      ...prevState,
      selectedReminder: selectedItemUuid?.uuid,
    }));
  };

  handleSendReminder = async () => {
    this.setState({ isLoadingReminder: true });
    const deadLine = moment(new Date()).add(7, 'd').format('YYYY-MM-DD');
    await SendQuestionnaireJob(
      this.props.job_uuid,
      this.state.selectedReminder,
      [this.props.candidate],
      deadLine,
      this.props.pipeline_uuid,
    )
      .then(() => {
        this.setState({ isLoadingReminder: false });
        this.handleTabPopClose();
      })
      .catch(() => {
        this.setState({ isLoadingReminder: false });
      });
  };

  render() {
    const { t } = this.props;
    return (
      <>
        <div className="questionnaires-tab-wrapper">
          <Accordion expanded={this.state.isExpanded}>
            <AccordionSummary
              disabled={!Can('create', 'questionnaires')}
              onClick={() =>
                this.setState((prevState) => ({
                  isExpanded: !prevState.isExpanded,
                }))
              }
              expandIcon={
                <Tooltip
                  title={
                    this.state.isExpanded
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
                  value={this.state.questionnaireOptions}
                  label={t(`${translationPath}select-questionnaire`)}
                  disabled={this.props.listOfQuestionnaires?.length === 0}
                  onChange={(e) => {
                    this.setState({ selectedQuestionnaire: e.target.value.uuid });
                    this.setState({ questionnaireOptions: e.target.value });
                  }}
                >
                  {this.props.listOfQuestionnaires?.map((questionnaire, i) => (
                    <MenuItem key={i} value={questionnaire}>
                      {questionnaire.title}
                    </MenuItem>
                  ))}
                </TextField>
                {this.props.listOfQuestionnaires?.length === 0 && (
                  <span className="no-questionnaires-available">
                    {t(`${translationPath}no-questionnaires-available`)}
                  </span>
                )}
                <div className="select-question-wrapper">
                  <div className="date-picker-button-wrapper">
                    <DatePickerComponent
                      idRef="date"
                      minDate={moment().toDate()}
                      inputPlaceholder="YYYY-MM-DD"
                      value={this.state.newDeadline || ''}
                      onChange={(date) => {
                        this.setState({ newDeadline: date?.value });
                      }}
                      themeClass="theme-outline"
                      displayFormat={GlobalSavingDateFormat}
                      datePickerWrapperClasses="px-0 gray-outline"
                    />
                  </div>
                  <div className="send-button">
                    <Button
                      onClick={this.handleSendQuestionnaire}
                      disabled={
                        !this.state.selectedQuestionnaire
                        || !this.state.newDeadline
                        || this.state.isLoadingQustion
                      }
                    >
                      {`${
                        this.state.isLoadingQustion
                          ? t(`${translationPath}sending`)
                          : t(`${translationPath}send`)
                      }`}
                      {this.state.isLoadingQustion && (
                        <i className="fas fa-circle-notch fa-spin ml-2" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </AccordionDetails>
          </Accordion>
          {this.state.questionnaires && this.state.questionnaires.length > 0 && (
            <div className="select-questionnaire-tab-wrapper questionnaire-popover-wrapper">
              <Tabs
                scrollButtons="auto"
                variant="scrollable"
                value={this.state.tabValue || 0}
                onChange={(event, newValue) => this.setState({ tabValue: newValue })}
              >
                {this.state.questionnaires?.map((item, index) => {
                  const selectedItemUuid
                    = this.props.listOfQuestionnaires.find(
                      (el) => el.title === item.title,
                    ) || '';

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
                              this.handleTabPopMuseEnter(event, selectedItemUuid);
                            }}
                          />
                        )
                      }
                      key={`${index + 1}-q-tab`}
                      className="questionnaire-tab-wrapper"
                      onClick={() => this.handleViewQuestionnaire(item)}
                    />
                  );
                })}
                <Popover
                  anchorEl={this.state.anchorE2}
                  onClose={this.handleTabPopClose}
                  open={Boolean(this.state.anchorE2)}
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
                    onClick={this.handleSendReminder}
                    disabled={
                      !this.state.selectedReminder || this.state.isLoadingReminder
                    }
                  >
                    {`${
                      this.state.isLoadingReminder
                        ? t(`${translationPath}sending`)
                        : t(`${translationPath}send`)
                    }`}
                    {this.state.isLoadingReminder && (
                      <i className="fas fa-circle-notch fa-spin ml-2" />
                    )}
                  </Button>
                </Popover>
              </Tabs>
            </div>
          )}
          {this.state.isLoadingQuestionnaire ? (
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
              {this.state?.questionnaire && this.state?.questionnaire?.length > 0 ? (
                this.state.questionnaire?.map((item, index) => (
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
  }
}
export default withTranslation(parentTranslationPath)(CandidateQuestionnaireTab);
