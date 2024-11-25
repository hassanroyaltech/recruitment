import React, { useState, useCallback, useEffect } from 'react';
import { Modal, Button, FormGroup, ModalBody } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment';
import TinyMCE from '../../Elevatus/TinyMCE';
import RecuiterPreference from '../../../utils/RecuiterPreference';
import { generateHeaders } from '../../../api/headers';
import { Inputs } from '../../Inputs/Inputs.Component';
import TablesComponent from '../../Tables/Tables.Component';
import { GetReminderEmailTemplate, SendAssessmentReminder } from '../../../services';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import './SendReminderModal.scss';

const translationPath = 'SendReminderModalComponent.';

const SendReminderModal = ({
  isOpen,
  onClose,
  unselectAll,
  selectedColumn,
  assessment_uuid,
  currentAssessment,
  selectedTaskItems,
  selectedStageTitle,
  parentTranslationPath,
  totalNumberOfCandidates,
}) => {
  const defaultState = {
    assessment_candidate_uuid: [],
    assessment_uuid: '',
    stage_uuid: [],
    email_subject: '',
    email_body: '',
    deadline: '',
  };

  const { addToast } = useToasts();
  const { t } = useTranslation(parentTranslationPath);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBodyChanged, setIsBodyChanged] = useState(false);
  const [filteredSelectedData, setFilteredSelectedData] = useState([]);
  const [variables, setVariables] = useState();
  const [state, setState] = useState(defaultState);
  const [expanded, setExpanded] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [candidatesTableData, setCandidatesTableData] = useState([]);
  const [numberOfCandidates, setNumberOfCandidates] = useState(0);
  const [stagesData, setStagesData] = useState([]);

  const handleExpandChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleDateChange = (date) => {
    setState((items) => ({ ...items, deadline: moment(date).format('YYYY-MM-DD') }));
  };

  const getVariables = useCallback(async () => {
    setLoading(true);
    await axios
      .get(RecuiterPreference.TEMPLATES_COLLECTION, {
        headers: generateHeaders(),
      })
      .then((res) => {
        if (res.data && res.data.results && res.data.results.video_assessment)
          setVariables(res.data.results.video_assessment);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const getEmailTemplate = useCallback(async () => {
    setLoading(true);
    const res = await GetReminderEmailTemplate({
      slug: 'reminder_invitation',
      language_id: JSON.parse(localStorage.getItem('user'))?.results?.language?.[0]
        .id,
    });

    if (res && res.status === 200) {
      const { results } = res.data;

      setState((items) => ({
        ...items,
        email_subject: results.subject,
        email_body: results.body,
      }));
    }
    setLoading(false);
  }, []);

  const sendReminderHandler = useCallback(async () => {
    setIsSubmitted(true);

    const newStageArray
      = state.stage_uuid.filter((item) => item.uuid).map((item) => item.uuid) || [];

    if (
      (newStageArray.length === 0 && candidatesTableData.length === 0)
      || (state.assessment_candidate_uuid.length === 0 && numberOfCandidates === 0)
    ) {
      setExpanded('panel2');
      return;
    }

    if (newStageArray.length === 0 && candidatesTableData.length === 0) {
      setExpanded('panel1');
      return;
    }

    if (!state.deadline) {
      setExpanded('panel3');
      return;
    }

    if (!state.email_subject || !state.email_body) {
      setExpanded('panel4');
      return;
    }

    const newState = {
      ...state,
      stage_uuid:
        state.stage_uuid && state.stage_uuid.length > 0
          ? state.stage_uuid.filter((item) => item.uuid).map((item) => item.uuid)
          : [],
    };

    setSaving(true);
    const result = await SendAssessmentReminder(newState);
    if (result && result.status === 200) {
      addToast(result?.data?.message, {
        appearance: 'success',
        autoDismiss: true,
      });
      unselectAll();
      onClose();
      setExpanded('');
      setState(defaultState);
      setCandidatesTableData([]);
      setIsBodyChanged(false);
      setIsSubmitted(false);
      setSaving(false);
    } else if (result && result.data && result.data.errors) {
      addToast(
        Object.values(result.data.errors).map((item, index) => (
          <div className="d-flex" key={`${index + 1}-error`}>
            <span>{`- ${item}`}</span>
          </div>
        )),
        {
          appearance: 'error',
          autoDismiss: true,
        },
      );
      setSaving(false);
    }
  }, [
    addToast,
    candidatesTableData.length,
    defaultState,
    numberOfCandidates,
    onClose,
    state,
  ]);

  useEffect(() => {
    if (isOpen) getVariables();
  }, [getVariables, isOpen]);

  useEffect(() => {
    if (isOpen) getEmailTemplate();
  }, [getEmailTemplate, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const newArray = JSON.parse(
        JSON.stringify(
          selectedTaskItems.filter((item) => item.stage_uuid !== selectedColumn),
        ),
      );

      setCandidatesTableData(newArray);

      if (totalNumberOfCandidates)
        setNumberOfCandidates(totalNumberOfCandidates + newArray.length);
      else setNumberOfCandidates(newArray.length);
    }
  }, [
    setCandidatesTableData,
    selectedTaskItems,
    isOpen,
    totalNumberOfCandidates,
    selectedColumn,
  ]);

  useEffect(() => {
    if (isOpen) {
      const selectedStages = JSON.parse(JSON.stringify([selectedColumn]));

      setTimeout(() => {
        setState((items) => ({
          ...items,
          assessment_uuid,
          stage_uuid: selectedStages.map((item) => ({
            name: selectedStageTitle,
            uuid: item,
          })),
        }));
      }, 1000);
    }
  }, [assessment_uuid, isOpen, selectedColumn, selectedStageTitle]);

  useEffect(() => {
    if (isOpen)
      setState((items) => ({
        ...items,
        assessment_candidate_uuid: candidatesTableData.map((item) => item.id),
      }));
  }, [candidatesTableData, isOpen]);

  useEffect(() => {
    if (isOpen) setStagesData([{ name: selectedStageTitle, uuid: selectedColumn }]);
  }, [isOpen, selectedColumn, selectedStageTitle]);

  useEffect(() => {
    if (!isOpen && isSubmitted) setIsSubmitted(false);
  }, [isOpen, isSubmitted]);

  useEffect(() => {
    setFilteredSelectedData(
      selectedTaskItems.filter((item) => item.stage_uuid !== selectedColumn),
    );
  }, [selectedTaskItems, selectedColumn]);

  return (
    <Modal
      size="md"
      isOpen={isOpen}
      toggle={onClose}
      className="modal-dialog-centered send-reminder-modal-wrapper"
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}send-reminder`)}</h3>
        <button
          type="button"
          onClick={onClose}
          className="close"
          aria-hidden="true"
          data-dismiss="modal"
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <ModalBody className="modal-body pt-0">
        <div className="total-number-wrapper">
          {`${t(
            `${translationPath}total-number-of-candidates`,
          )} : ${numberOfCandidates}`}
        </div>
        {selectedColumn && (
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleExpandChange('panel1')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="accordion-title">
                {t(`${translationPath}selected-stage`)}
              </div>
            </AccordionSummary>
            <AccordionDetails className="d-flex flex-column align-items-start">
              <TablesComponent
                headerData={[
                  {
                    id: 1,
                    isSortable: true,
                    label: t(`${translationPath}stage-name`),
                    input: 'name',
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: t(`${translationPath}total-of-candidates`),
                    component: () => <span>{totalNumberOfCandidates}</span>,
                  },
                ]}
                isWithCheck
                pageIndex={0}
                isWithCheckAll
                uniqueKeyInput="uuid"
                data={stagesData || []}
                selectedRows={state.stage_uuid}
                isSelectAll={state.stage_uuid.length === 1}
                parentTranslationPath={parentTranslationPath}
                onSelectAllCheckboxChanged={() => {
                  if (state.stage_uuid && state.stage_uuid.length > 0) {
                    setState((items) => ({ ...items, stage_uuid: [] }));
                    setNumberOfCandidates(
                      (items) => items - totalNumberOfCandidates,
                    );
                  } else {
                    setState((items) => ({ ...items, stage_uuid: stagesData }));
                    setNumberOfCandidates(
                      (items) => items + totalNumberOfCandidates,
                    );
                  }
                }}
                totalItems={stagesData.length}
                onSelectCheckboxChanged={({ selectedRow }) => {
                  const rowIndex = state.stage_uuid.findIndex(
                    (item) => item.uuid === selectedRow.uuid,
                  );

                  const stageValue = [...state.stage_uuid];

                  if (rowIndex !== -1) {
                    stageValue.splice(rowIndex, 1);
                    setNumberOfCandidates(
                      (items) => items - totalNumberOfCandidates,
                    );
                  } else {
                    stageValue.push(selectedRow);
                    setNumberOfCandidates(
                      (items) => items + totalNumberOfCandidates,
                    );
                  }

                  setState((items) => ({ ...items, stage_uuid: stageValue }));
                }}
              />
              {(!state.stage_uuid || state.stage_uuid.length === 0)
                && (!candidatesTableData || candidatesTableData.length === 0)
                && isSubmitted && (
                <span className="text-danger pt-2 pl-1-reversed">
                  {t(`${translationPath}required`)}
                </span>
              )}
            </AccordionDetails>
          </Accordion>
        )}
        {filteredSelectedData && filteredSelectedData.length !== 0 && (
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleExpandChange('panel2')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="accordion-title">
                {t(`${translationPath}selected-candidates`)}
              </div>
            </AccordionSummary>
            <AccordionDetails className="d-flex flex-column align-items-start">
              <TablesComponent
                headerData={[
                  {
                    id: 1,
                    isSortable: true,
                    label: t(`${translationPath}name`),
                    input: 'name',
                  },
                  {
                    id: 2,
                    isSortable: true,
                    label: t(`${translationPath}email`),
                    input: 'email',
                  },
                ]}
                isWithCheck
                pageIndex={0}
                isWithCheckAll
                uniqueKeyInput="id"
                data={filteredSelectedData || []}
                selectedRows={candidatesTableData}
                pageSize={filteredSelectedData.length || 0}
                totalItems={filteredSelectedData.length || 0}
                parentTranslationPath={parentTranslationPath}
                onSelectAllCheckboxChanged={() => {
                  if (candidatesTableData && candidatesTableData.length > 0) {
                    setCandidatesTableData([]);
                    setNumberOfCandidates(
                      (items) => items - candidatesTableData.length,
                    );
                  } else {
                    setCandidatesTableData([...filteredSelectedData]);
                    setNumberOfCandidates(
                      (items) => items + filteredSelectedData.length,
                    );
                  }
                }}
                onSelectCheckboxChanged={(newValues) => {
                  setCandidatesTableData((items) => {
                    const index = items.findIndex(
                      (item) => item.id === newValues.selectedRow.id,
                    );
                    if (index !== -1) {
                      items.splice(index, 1);
                      setNumberOfCandidates((el) => el - 1);
                    } else {
                      items.push(newValues.selectedRow);
                      setNumberOfCandidates((el) => el + 1);
                    }
                    return [...items];
                  });
                }}
              />
              {(!candidatesTableData || candidatesTableData.length === 0)
                && isSubmitted && (
                <span className="text-danger pt-2 pl-1-reversed">
                  {t(`${translationPath}required`)}
                </span>
              )}
            </AccordionDetails>
          </Accordion>
        )}
        {currentAssessment && !currentAssessment.is_expired && (
          <Accordion
            expanded={expanded === 'panel3'}
            onChange={handleExpandChange('panel3')}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <div className="accordion-title">
                {t(`${translationPath}deadline`)}
              </div>
            </AccordionSummary>
            <AccordionDetails>
              <div className="deadline-wrapper d-flex flex-column">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    fullWidth
                    margin="normal"
                    variant="inline"
                    inputFormat="yyyy-MM-dd"
                    minDate={new Date()}
                    id="date-picker-dialog"
                    inputVariant="outlined"
                    onChange={handleDateChange}
                    value={state.deadline || null}
                    error={!state.deadline && isSubmitted}
                    label={t(`${translationPath}deadline`)}
                    renderInput={(pickerProps) => <TextField {...pickerProps} />}
                  />
                </LocalizationProvider>
                {!state.deadline && isSubmitted && (
                  <span className="text-danger pt-1 pl-1-reversed">
                    {t(`${translationPath}required`)}
                  </span>
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        )}
        <Accordion
          expanded={expanded === 'panel4'}
          onChange={handleExpandChange('panel4')}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div className="accordion-title">{t(`${translationPath}email`)}</div>
          </AccordionSummary>
          <AccordionDetails>
            <div className="w-100 d-flex flex-column">
              <TinyMCE
                className="mb-2"
                variables={variables}
                id="send-reminder-ref"
                value={state.email_body || ''}
                onChange={(value) => {
                  setIsBodyChanged(true);
                  setState((items) => ({
                    ...items,
                    email_body: value,
                  }));
                }}
              >
                <FormGroup>
                  <label htmlFor="emailSubject" className="form-control-label mt-3">
                    {t(`${translationPath}email-subject`)}
                  </label>
                  <Inputs
                    idRef="emailSubject"
                    themeClass="theme-solid"
                    error={!state.email_subject}
                    value={state.email_subject || ''}
                    placeholder={t(`${translationPath}email-subject`)}
                    helperText={t(`${translationPath}email-subject-is-required`)}
                    onInputChanged={(e) => {
                      const { value } = e.target;
                      setState((items) => ({
                        ...items,
                        email_subject: value,
                      }));
                    }}
                  />
                </FormGroup>
              </TinyMCE>
              {!state.email_body && isBodyChanged && (
                <span className="text-danger pt-2 pl-1-reversed">
                  {t(`${translationPath}email-body-is-required`)}
                </span>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
        <div className="pt-3 d-flex justify-content-center align-items-center modal-actions">
          <Button
            style={{ width: '220px' }}
            disabled={saving || loading}
            onClick={() => sendReminderHandler()}
            color={saving || loading ? 'secondary' : 'primary'}
          >
            {saving && <i className="fas fa-circle-notch fa-spin mr-2-reversed" />}
            {`${
              saving ? t(`${translationPath}saving`) : t(`${translationPath}save`)
            }`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SendReminderModal;
