import React, { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Select,
  Button,
  MenuItem,
  Accordion,
  TextField,
  InputLabel,
  // IconButton,
  FormControl,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  ButtonBase,
  Divider,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Skeleton from '@mui/material/Skeleton';
import Autocomplete from '@mui/material/Autocomplete';
import { evarecAPI } from '../../api/evarec';
import pdfIcon from '../../assets/images/FileTypes/icon_pdf.svg';
import {
  AssessmentTestCategoriesEnums,
  AssessmentTestMembersTypeEnum,
  AssessmentTestStatusesEnums,
  DynamicFormTypesEnum,
  SystemActionsEnum,
} from '../../enums';
import { GlobalDisplayDateTimeFormat, showError, showSuccess } from '../../helpers';
import './CandidateAssessment.Style.scss';
import { SendAssessmentTestReminder, DeleteAssessmentTest } from 'services';
import {
  ConfirmDeleteDialog,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from 'pages/setups/shared';
import { AssessmentTestTypesEnum } from '../../enums/Shared/AssessmentTestTypes.Enum';
import {
  CreateTestifyAssessment,
  DeleteTestifyAssessment,
  GetAllTestifyAssessments,
  GetAllTestifyCandidateAssessments,
  SendReminderTestifyAssessment,
} from '../../services/Testify.Services';
import moment from 'moment';

const translationPath = '';
const parentTranslationPath = 'EvarecCandidateModel';

export const CandidateAssessmentComponent = ({
  candidate_profile_uuid,
  isDisabledTestlify,
  candidateUuid,
  type,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const assessmentTestTypesEnum = useMemo(
    () =>
      Object.values(AssessmentTestTypesEnum)
        .filter((item) => item !== AssessmentTestTypesEnum.ElevatueTestlify)
        .map((item) => ({
          ...item,
          title: t(`${translationPath}${item.value}`),
        })),
    [t],
  );

  const defaultState = {
    relation: '',
    relation_uuid: '',
    relation_candidate_uuid: '',
    detail_id: null,
    detail_level_id: null,
    assessment_test_type: AssessmentTestTypesEnum.AutomationTest.key,
    // start for the Testify
    assessment_test_uuid: '',
    invited_members: [
      {
        type: AssessmentTestMembersTypeEnum.JobCandidate.key,
        uuid: candidateUuid,
      },
    ],
  };
  const reducer = useCallback((state, action) => {
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  const [state, setState] = useReducer(reducer, defaultState);
  const [assessments, setAssessments] = useState([]);
  const [candidateAssessments, setCandidateAssessments] = useState([]);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [detailLevels, setDetailLevels] = useState([]);
  const [detailLevel, setDetailLevel] = useState(null);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [detailLevelId, setDetailLevelId] = useState(null);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [assessmentsVideo, setAssessmentsVideo] = useState(null);
  const [assessmentsLanguage, setAssessmentsLanguage] = useState(null);
  const [assessmentsCategory, setAssessmentsCategory] = useState(null);
  const [candidateResponse, setCandidatesResponse] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [sendExamLoading, setSendExamLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showConfirmTestifyDialog, setShowConfirmTestifyDialog] = useState(false);
  const [activeItem, setActiveItem] = useState(null);

  /**
   * Function to get assessment categories
   */
  const getAllAssessmentCategories = useCallback(async () => {
    setCategoriesLoading(true);

    await evarecAPI
      .GetAllCategories()
      .then((res) => {
        const { results } = res.data;

        if (results && results[0]) setCategories(results[0] || []);
        setCategoriesLoading(false);
      })
      .catch(() => setCategoriesLoading(false));
  }, []);

  /**
   * Function to get assessment tests data
   */
  const getAllAssessmentTests = useCallback(async (category) => {
    setAssessmentsLoading(true);

    await evarecAPI
      .GetAllAssessmentTests((category && category.category_id) || 0)
      .then((response) => {
        const { results } = response.data;

        if (results && results[0]) setAssessments(results[0] || []);
        setAssessmentsLoading(false);
      })
      .catch(() => setAssessmentsLoading(false));
  }, []);

  /**
   * Function to get candidate assessments data
   */
  const getAllCandidateResponse = useCallback(() => {
    setLoading(true);
    if (candidateUuid)
      evarecAPI
        .GetAllCandidateResponse({
          relation: type,
          relation_candidate_uuid: candidateUuid,
        })
        .then((res) => {
          setCandidatesResponse(res?.data?.results);
          setLoading(false);
        });
  }, [candidateUuid, type]);

  const statusHandler = (status) => {
    const statuses = {
      [AssessmentTestStatusesEnums.created.key]: () =>
        t(`${translationPath}${AssessmentTestStatusesEnums.created.value}`),
      [AssessmentTestStatusesEnums.sent.key]: () =>
        t(`${translationPath}${AssessmentTestStatusesEnums.sent.value}`),
      [AssessmentTestStatusesEnums.completed.key]: () =>
        t(`${translationPath}${AssessmentTestStatusesEnums.completed.value}`),
      [AssessmentTestStatusesEnums.failed.key]: () =>
        t(`${translationPath}${AssessmentTestStatusesEnums.failed.value}`),
      [AssessmentTestStatusesEnums.deleted.key]: () =>
        t(`${translationPath}${AssessmentTestStatusesEnums.deleted.value}`),
      default: () => t(`${translationPath}other`),
    };
    return (statuses[status] || statuses.default)();
  };

  const getAllCandidateAssessments = useCallback(async () => {
    const response = await GetAllTestifyCandidateAssessments({
      candidate_uuid: candidateUuid,
      candidate_profile_uuid,
    });
    if (response && response.status === 200) setCandidateAssessments(response.data);
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [candidate_profile_uuid, candidateUuid, t]);

  const sendAssessment = async () => {
    setSendExamLoading(true);
    const response = await CreateTestifyAssessment(state);
    setSendExamLoading(false);
    if (response && response.status === 200) {
      setState({ id: 'edit', value: defaultState });
      void getAllCandidateAssessments();
      showSuccess(
        t(
          `${translationPath}the-candidate-has-been-invited-to-the-assessment-test-successfully`,
        ),
      );
    } else
      showError(
        t(
          `${translationPath}the-assessment-test-was-been-sent-already-to-this-candidate`,
        ),
        response,
      );
  };

  const sendExamHandler = () => {
    setSendExamLoading(true);
    evarecAPI
      .PostAssessmentTests(state)
      .then(() => {
        window?.ChurnZero?.push([
          'trackEvent',
          `Assessment Test - Central Test Assessment`,
          `Central Test Assessment`,
          1,
          {},
        ]);
        getAllCandidateResponse();
        setSendExamLoading(false);
        setAssessmentsCategory(null);
        setAssessments([]);
        setAssessmentsVideo(null);
        setLanguages([]);
        setDetailLevels([]);
        setDetailLevel(null);
        setDetailLevelId(null);
        setAssessmentsLanguage(null);
        setState({ id: 'edit', value: defaultState });
        showSuccess(
          t(
            `${translationPath}the-candidate-has-been-invited-to-the-assessment-test-successfully`,
          ),
        );
      })
      .catch((error) => {
        setSendExamLoading(false);
        showError(
          t(
            `${translationPath}the-assessment-test-was-been-sent-already-to-this-candidate`,
          ),
          error,
        );
      });
  };

  const sendReminderAssessment = async (assessment_id) => {
    setSendExamLoading(true);
    const response = await SendReminderTestifyAssessment({
      assessment_id,
      candidate_uuid: candidateUuid,
      candidate_profile_uuid,
    });
    setSendExamLoading(false);
    if (response && response.status === 200) {
      setState({ id: 'edit', value: defaultState });
      void getAllCandidateAssessments();
      showSuccess(
        t(
          `${translationPath}assessment-reminder-successfully-sent-to-the-candidate`,
        ),
      );
    } else
      showError(
        t(`${translationPath}assessment-reminder-failed-to-send-to-the-candidate`),
        response,
      );
  };
  const onActionClicked = useCallback(
    async (item, action) => {
      setActiveItem(item);
      if (action === 'remind') {
        setLoading(true);
        const res = await SendAssessmentTestReminder({ assessment_ids: [item] });
        setLoading(false);
        if (res && (res.status === 200 || res.status === 201)) {
          window?.ChurnZero?.push([
            'trackEvent',
            `Assessment Test - Central Test Assessment Reminder`,
            `Central Test Assessment Reminder`,
            1,
            {},
          ]);
          showSuccess('Reminder sent successfully!');
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } else if (action === 'delete') setShowConfirmDialog(true);
      else if (action === 'testify-reminder') sendReminderAssessment(item);
      else if (action === 'testify-delete') setShowConfirmTestifyDialog(true);
    },
    [t, setShowConfirmDialog],
  );

  useEffect(() => {
    setState({
      id: 'edit',
      value: {
        relation: type,
        relation_uuid: id,
        relation_candidate_uuid: candidateUuid,
        test_language_id: '',
        assessment_test_type: AssessmentTestTypesEnum.AutomationTest.key,
        assessment_test_uuid: '',
        invited_members: [
          {
            type: AssessmentTestMembersTypeEnum.JobCandidate.key,
            uuid: candidateUuid,
          },
        ],
      },
    });
  }, [candidateUuid, id, type]);

  useEffect(() => {
    void getAllAssessmentCategories();
  }, [getAllAssessmentCategories]);

  useEffect(() => {
    void getAllCandidateResponse();
  }, [getAllCandidateResponse]);

  useEffect(() => {
    if (!isDisabledTestlify) void getAllCandidateAssessments();
  }, [isDisabledTestlify, getAllCandidateAssessments]);

  return (
    <div className="candidate-assessment-tab-wrapper questionnaires-tab-wrapper">
      <div className="candidate-assessment-tab-content">
        <Accordion>
          <AccordionSummary expandIcon={<AddIcon />}>
            {t(`${translationPath}send-new-assessment`)}
          </AccordionSummary>
          <AccordionDetails>
            <div className="questionnaires-tab-add-wrapper">
              <div className="pr-2-reversed">
                {!isDisabledTestlify && (
                  <SharedAutocompleteControl
                    isFullWidth
                    initValuesKey="key"
                    initValuesTitle="title"
                    initValues={assessmentTestTypesEnum}
                    stateKey="assessment_test_type"
                    onValueChanged={({ value }) => {
                      setState({
                        id: 'assessment_test_type',
                        value,
                      });
                    }}
                    title="assessment-test-type"
                    editValue={state.assessment_test_type}
                    placeholder="assessment-test-type"
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    getOptionLabel={(option) => option.title}
                    disableClearable
                  />
                )}
                {state.assessment_test_type
                  === AssessmentTestTypesEnum.AutomationTest.key && (
                  <>
                    <div className="select-exam-wrapper">
                      <Autocomplete
                        options={categories || []}
                        value={assessmentsCategory}
                        getOptionLabel={(option) => option.title}
                        onChange={(e, newValue) => {
                          void getAllAssessmentTests(newValue);
                          setAssessmentsCategory(newValue);
                          setState({ id: 'test_language_id', value: '' });
                          setState({ id: 'assessment_test_uuid', value: '' });
                          setLanguages([]);
                          setAssessments([]);
                          setAssessmentsVideo(null);
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            variant="outlined"
                            label={t(`${translationPath}select-assessment-category`)}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment:
                                (categoriesLoading && (
                                  <div className="input-loading-wrapper">
                                    <CircularProgress color="inherit" size={20} />
                                  </div>
                                ))
                                || (params.InputProps
                                  && params.InputProps.endAdornment),
                            }}
                          />
                        )}
                      />
                    </div>
                    <div className="select-exam-wrapper pt-3">
                      <Autocomplete
                        value={assessmentsVideo}
                        options={assessments || []}
                        getOptionLabel={(option) => option?.data?.label}
                        disabled={!assessmentsCategory || assessmentsLoading}
                        getOptionDisabled={(option) => option.is_available === false}
                        onChange={(e, newValue) => {
                          setState({ id: 'test_language_id', value: '' });
                          setState({
                            id: 'assessment_test_uuid',
                            value: newValue?.uuid,
                          });
                          setLanguages(newValue?.data?.languages);
                          setAssessmentsVideo(newValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            fullWidth
                            {...params}
                            variant="outlined"
                            label={t(`${translationPath}select-assessment`)}
                            InputProps={{
                              ...params.InputProps,
                              endAdornment:
                                (assessmentsLoading && (
                                  <div className="input-loading-wrapper">
                                    <CircularProgress color="inherit" size={20} />
                                  </div>
                                ))
                                || (params.InputProps
                                  && params.InputProps.endAdornment),
                            }}
                          />
                        )}
                      />
                    </div>
                    {languages && languages.length > 0 && (
                      <div className="select-exam-wrapper pt-3">
                        <FormControl
                          className="w-100"
                          variant="outlined"
                          disabled={languages.length === 0}
                        >
                          <InputLabel>
                            {t(`${translationPath}select-assessment-language`)}
                          </InputLabel>
                          <Select
                            fullWidth
                            value={assessmentsLanguage}
                            label={t(`${translationPath}select-assessment-language`)}
                            onChange={(e) => {
                              const { value } = e.target;
                              setAssessmentsLanguage(value);
                              setState({
                                id: 'test_language_id',
                                value: value && value.id,
                              });
                              setDetailLevels((value && value.details) || []);
                            }}
                          >
                            {languages?.map((item, index) => (
                              <MenuItem key={`${index + 1}-lang`} value={item}>
                                {item.name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>
                    )}
                    {assessmentsCategory
                      && assessmentsCategory.category_id
                        === AssessmentTestCategoriesEnums.it.key && (
                      <div className="pt-3 d-flex align-items-center">
                        <div className="select-exam-wrapper pr-2-reversed w-50">
                          <Autocomplete
                            value={detailLevel}
                            options={detailLevels || []}
                            getOptionLabel={(option) => option.name}
                            disabled={!detailLevels || !state.test_language_id}
                            onChange={(e, newValue) => {
                              setState({
                                id: 'detail_id',
                                value: newValue && newValue.id,
                              });
                              setDetailLevel(newValue);
                            }}
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                variant="outlined"
                                label={t(
                                  `${translationPath}select-level-category`,
                                )}
                              />
                            )}
                          />
                        </div>
                        <div className="select-exam-wrapper w-50">
                          <Autocomplete
                            value={detailLevelId}
                            getOptionLabel={(option) =>
                              option.name && option.name[0]
                            }
                            disabled={
                              (detailLevel && !detailLevel.levels)
                                || !state.test_language_id
                            }
                            onChange={(e, newValue) => {
                              setState({
                                id: 'detail_level_id',
                                value:
                                    newValue && newValue.value && newValue.value[0],
                              });
                              setDetailLevelId(newValue);
                            }}
                            options={
                              (detailLevel
                                  && detailLevel.levels.map((item) => ({
                                    name: Object.keys(item),
                                    value: Object.values(item),
                                  })))
                                || []
                            }
                            renderInput={(params) => (
                              <TextField
                                fullWidth
                                {...params}
                                variant="outlined"
                                label={t(
                                  `${translationPath}select-assessment-level`,
                                )}
                              />
                            )}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
                {state.assessment_test_type
                  === AssessmentTestTypesEnum.Elevatus.key && (
                  <SharedAPIAutocompleteControl
                    isFullWidth
                    title="assessment"
                    placeholder="select-assessment"
                    stateKey="assessment_test_uuid"
                    uniqueKey="assessmentId"
                    editValue={state.assessment_test_uuid}
                    onValueChanged={({ value }) => {
                      setState({ id: 'assessment_test_uuid', value });
                    }}
                    getOptionLabel={(option) => option.assessmentTitle}
                    getDataAPI={GetAllTestifyAssessments}
                    getDisabledOptions={(option) => option.is_invited}
                    parentTranslationPath={parentTranslationPath}
                    translationPath={translationPath}
                    searchKey="query"
                    type={DynamicFormTypesEnum.select.key}
                    extraProps={{
                      candidate_uuid: candidateUuid,
                      candidate_profile_uuid,
                      // with_than:
                      //   (state.assessment_test_uuid && [state.assessment_test_uuid])
                      //   || undefined,
                    }}
                  />
                )}
              </div>
              <div className="select-question-wrapper">
                <div className="send-button">
                  <Button
                    onClick={() =>
                      state.assessment_test_type
                      === AssessmentTestTypesEnum.AutomationTest.key
                        ? sendExamHandler()
                        : sendAssessment()
                    }
                    disabled={
                      sendExamLoading
                      || (state.assessment_test_type
                        === AssessmentTestTypesEnum.AutomationTest.key
                        && (!state.test_language_id
                          || !state.assessment_test_uuid
                          || (assessmentsCategory
                            && assessmentsCategory.category_id
                              === AssessmentTestCategoriesEnums.it.key
                            && !state.detail_level_id
                            && !state.detail_id)))
                      || (state.assessment_test_type
                        === AssessmentTestTypesEnum.Elevatus.key
                        && !state.assessment_test_uuid)
                    }
                  >
                    {`${
                      sendExamLoading
                        ? t(`${translationPath}sending`)
                        : t(`${translationPath}send`)
                    }`}
                    {sendExamLoading && (
                      <i className="fas fa-circle-notch fa-spin ml-2-reversed" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="candidate-assessment-exam-item-wrapper mt-3">
        {!loading
          && candidateResponse
          && candidateResponse.length > 0
          && candidateResponse.map((item, index) => (
            <div
              key={`${index + 1}-response`}
              className="candidate-assessment-exam-item"
            >
              <div className="exam-image-info-wrapper">
                <div className="exam-image">
                  <img alt={item.assessment_test?.title} src={pdfIcon} />
                </div>
                <div className="exam-info">
                  <div className="exam-title">{item.assessment_test?.title}</div>
                  <div className="exam-description">
                    <div className="exam-description-status">
                      {t(`${translationPath}status`)}:
                      {`  ${statusHandler(item.status)}`}
                    </div>
                  </div>
                </div>
              </div>
              <div className="exam-actions">
                <ButtonBase
                  disabled={
                    !item.media
                    || item.status === AssessmentTestStatusesEnums.deleted.key
                  }
                  onClick={() => {
                    const link = document.createElement('a');
                    link.setAttribute('target', '_blank');
                    link.download = item.assessment_test?.title || 'Assessment Test';
                    link.href = item.media.url;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.download.icon} />
                </ButtonBase>
                <ButtonBase
                  onClick={() => onActionClicked(item.uuid, 'remind')}
                  disabled={
                    item.status === AssessmentTestStatusesEnums.deleted.key
                    || item.status === AssessmentTestStatusesEnums.completed.key
                  }
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.remind.icon} />
                </ButtonBase>
                <ButtonBase
                  onClick={() => onActionClicked(item.uuid, 'delete')}
                  disabled={
                    item.status === AssessmentTestStatusesEnums.deleted.key
                    || item.status === AssessmentTestStatusesEnums.completed.key
                  }
                  className="btns-icon theme-transparent mx-1"
                >
                  <span className={SystemActionsEnum.delete.icon} />
                </ButtonBase>
              </div>
            </div>
          ))}
        {loading
          && Array.from({ length: 5 }).map((item, index) => (
            <Skeleton
              width={400}
              height={90}
              variant="rectangular"
              key={`${index + 1}-skeleton`}
            />
          ))}
        {candidateAssessments
          && candidateAssessments.map((item, itemIdx) => (
            <div
              key={`item-key-${item.assessmentId}`}
              className="d-flex-column w-100"
            >
              <div style={{ backgroundColor: '#fff' }} className="pt-3 w-100">
                <div className="d-flex-h-between full-width px-2">
                  <div className="d-flex">
                    <div className="mx-2">
                      <span className="fa-2x fas fa-file" />
                    </div>
                    <div className="mx-2">
                      <div className="item-title">{item.title}</div>
                      <div className="item-details">
                        <span className="fz-12px">
                          {`${t(`${translationPath}created-by`)} ${item.firstName} ${
                            item.lastName
                          }`}
                        </span>
                      </div>
                      <div className="item-details">
                        <span className="fz-12px">{item.email}</span>
                      </div>
                      <div className="item-steps">
                        <span className="fz-12px">
                          {t(`${translationPath}created`)}
                        </span>
                        <span className="fas fa-long-arrow-alt-right mx-2" />
                        <span className="fz-12px">{item.candidateStatus}</span>
                        <div className="form-status">
                          <span
                            className="fz-12px p-1"
                            style={{ backgroundColor: '#24253314' }}
                          >
                            {item.candidateStage}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex fj-end">
                      <div className="d-flex fa-start fj-end max-width-fit">
                        <ButtonBase
                          className="btns theme-outline sm-btn"
                          disabled={!item.candidateSharableUrl}
                          onClick={() => {
                            window.open(item.candidateSharableUrl, '_blank');
                          }}
                        >
                          <span className="px-1">{t(`${translationPath}view`)}</span>
                        </ButtonBase>

                        {item?.assessment_type
                          && item?.assessment_type
                            === AssessmentTestTypesEnum.ElevatueTestlify.value && (
                          <>
                            <ButtonBase
                              onClick={() =>
                                onActionClicked(
                                  item?.assessmentId,
                                  'testify-reminder',
                                )
                              }
                              className="btns-icon theme-transparent mx-1"
                              disabled={
                                item?.candidateStatus?.toLowerCase()
                                  === AssessmentTestStatusesEnums.completed.value
                              }
                            >
                              <span className={SystemActionsEnum.remind.icon} />
                            </ButtonBase>
                            <ButtonBase
                              onClick={() =>
                                onActionClicked(
                                  item?.assessmentId,
                                  'testify-delete',
                                )
                              }
                              disabled={
                                item?.candidateStatus?.toLowerCase()
                                === AssessmentTestStatusesEnums.completed.value
                              }
                              className="btns-icon theme-transparent mx-1"
                            >
                              <span className={SystemActionsEnum.delete.icon} />
                            </ButtonBase>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <Accordion
                    key={`item-${itemIdx}`}
                    expanded={expandedAccordions.includes(itemIdx)}
                    onChange={(e, ex) => {
                      setExpandedAccordions((items) => {
                        if (ex) return [...items, itemIdx];
                        else return items.filter((it) => it !== itemIdx);
                      });
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<span className="fas fa-chevron-down" />}
                    >
                      <span className="fw-bold fz-12px">
                        {t(`${translationPath}history`)}
                      </span>
                    </AccordionSummary>
                    <AccordionDetails>
                      {item.statusHistory
                        && item.statusHistory.map((historyItem, historyIdx) => (
                          <div
                            key={`status-${itemIdx}-history-item-${historyIdx}`}
                            className="my-2"
                          >
                            <div className="d-flex-h-between">
                              <div className="fz-12px">{historyItem.status}</div>
                              {historyItem.statusDate && (
                                <div className="fz-12px">
                                  {moment(historyItem.statusDate).format(
                                    GlobalDisplayDateTimeFormat,
                                  )}
                                </div>
                              )}
                            </div>
                            <div className="mt-1 full-width">
                              <Divider />
                            </div>
                          </div>
                        ))}
                    </AccordionDetails>
                  </Accordion>
                </div>
              </div>
              <div className="my-3 full-width">
                <Divider />
              </div>
            </div>
          ))}
      </div>
      {showConfirmDialog && (
        <ConfirmDeleteDialog
          successMessage="deleted-successfully"
          onSave={() => getAllCandidateResponse()}
          isOpenChanged={() => {
            setShowConfirmDialog((item) => !item);
          }}
          descriptionMessage="delete-assessment-test-desc"
          errorMessage="failed-to-delete"
          parentTranslationPath={parentTranslationPath}
          isOpen={showConfirmDialog}
          deleteApi={DeleteAssessmentTest}
          apiProps={{
            assessment_id: activeItem,
          }}
        />
      )}
      {showConfirmTestifyDialog && (
        <ConfirmDeleteDialog
          successMessage="deleted-successfully"
          onSave={() => getAllCandidateAssessments()}
          isOpenChanged={() => {
            setShowConfirmTestifyDialog((item) => !item);
          }}
          descriptionMessage="delete-assessment-test-desc"
          errorMessage="failed-to-delete"
          parentTranslationPath={parentTranslationPath}
          isOpen={showConfirmTestifyDialog}
          deleteApi={DeleteTestifyAssessment}
          apiProps={{
            assessment_id: activeItem,
            candidate_uuid: candidateUuid,
            candidate_profile_uuid: candidate_profile_uuid,
          }}
        />
      )}
    </div>
  );
};

CandidateAssessmentComponent.propTypes = {
  type: PropTypes.string.isRequired,
  candidate_profile_uuid: PropTypes.string,
  isDisabledTestlify: PropTypes.bool,
  candidateUuid: PropTypes.string.isRequired,
};
