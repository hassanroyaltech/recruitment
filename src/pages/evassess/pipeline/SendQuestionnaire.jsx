/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useToasts } from 'react-toast-notifications';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  ListGroup,
  ListGroupItem as CoreListGroupItem,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { ThreeDots } from '../../recruiter-preference/components/Loaders';

import {
  getQuestionnairesListByPipeline,
  SendQuestionnaireToCandidate,
  SendQuestionnaireJob,
} from '../../../shared/APIs/VideoAssessment/Questionnaires';
import { GlobalSavingDateFormat, showError } from '../../../helpers';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';

// reactstrap components

const ListGroupItem = styled(CoreListGroupItem)`
  font-size: 0.9rem;
  padding: 0.725rem;
`;
const translationPath = 'SendQuestionnaireComponent.';
const SendQuestionnaire = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const { addToast } = useToasts(); // Toasts

  const [listOfQuestionnaires, setListOfQuestionnaires] = useState([]);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [newDeadline, setNewDeadline] = useState();

  const [firstTime, setFirstTime] = useState(true);
  useEffect(() => {
    if (!props.isOpen || !firstTime) return;
    setFirstTime(false);
    getQuestionnairesListByPipeline(props.pipeline)
      .then((res) => {
        setListOfQuestionnaires(res.data?.results);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-questionnaires`), error);
      });
  }, [t, firstTime, props.isOpen, props.pipeline]);

  const sendQ = async () => {
    setIsWorking(true);
    // if send questionnaire from manage job
    if (props.type === 'ats')
      SendQuestionnaireJob(
        props.jobUuid,
        questionnaire,
        props.selectedCandidates,
        newDeadline,
      )
        .then(() => {
          setIsWorking(false);
          props.closeModal();
          addToast(t(`${translationPath}questionnaire-sent-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
        })
        .catch((error) => {
          setIsWorking(false);

          showError(t(`${translationPath}questionnaire-send-failed`), error);
        });
    else
      SendQuestionnaireToCandidate(
        props.match.params.id,
        questionnaire,
        props.selectedCandidates,
        newDeadline,
      )
        .then(() => {
          setIsWorking(false);
          props.closeModal();
          addToast(t(`${translationPath}questionnaire-sent-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          window?.ChurnZero?.push([
            'trackEvent',
            'Send questionnaire',
            'Send questionnaire',
            1,
            {},
          ]);
        })
        .catch((error) => {
          setIsWorking(false);

          showError(t(`${translationPath}questionnaire-send-failed`), error);
        });
  };

  // Spinner
  const [isWorking, setIsWorking] = useState(false);
  return (
    <Modal
      className="modal-dialog-centered"
      size="md"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}send-questionnaire`)}</h3>
        <button
          type="button"
          className="close"
          data-dismiss="modal"
          aria-hidden="true"
          onClick={() => props.closeModal()}
        >
          <i className="fas fa-times" />
        </button>
      </div>
      <ModalBody className="modal-body pt-0" style={{ margin: '0px 42px' }}>
        {!listOfQuestionnaires && <ThreeDots />}
        {listOfQuestionnaires && (
          <div>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label
                    className="form-control-label text-gray"
                    for="questionnaire"
                  >
                    {t(`${translationPath}choose-questionnaire-description`)}
                  </Label>
                  <Input
                    className="form-control-alternative "
                    type="select"
                    name="select"
                    value={questionnaire || 'default'}
                    onChange={(e) => {
                      setQuestionnaire(e.currentTarget.value);
                    }}
                    id="questionnaire"
                  >
                    <option value="default" disabled>
                      {t(`${translationPath}select-a-questionnaire`)}
                    </option>
                    {listOfQuestionnaires.map((items, i) => (
                      <option
                        value={items.uuid}
                        key={`listOfQuestionnairesKeys${i + 1}`}
                      >
                        {items.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
              <Col xs="6">
                <Label className="form-control-label text-gray" for="questionnaire">
                  {t(`${translationPath}select-deadline`)}
                </Label>
                <DatePickerComponent
                  isFullWidth
                  disablePast
                  inputPlaceholder={t(`${translationPath}select-deadline`)}
                  value={newDeadline || ''}
                  onChange={(date) => {
                    setNewDeadline(date.value);
                  }}
                  displayFormat={GlobalSavingDateFormat}
                  datePickerWrapperClasses="px-0"
                />
              </Col>
            </Row>
            <Row>
              <Col xs={12}>
                <Label className="form-control-label mt-4">
                  {t(`${translationPath}send-questionnaire-description`)}
                </Label>
                <ListGroup>
                  {props.type === 'ats' ? (
                    props?.popup ? (
                      <ListGroupItem>
                        {`${props.candidates.first_name} ${props.candidates.last_name}`}
                      </ListGroupItem>
                    ) : (
                      props.candidates
                        .filter((c) => props.selectedCandidates.includes(c.uuid))
                        .map((candidate, i) => (
                          <ListGroupItem key={`candidatesKey${i + 1}`}>
                            {candidate.name}
                          </ListGroupItem>
                        ))
                    )
                  ) : (
                    props.candidates
                      .filter((c) => props.selectedCandidates.includes(c.uuid))
                      .map((candidate, i) => (
                        <ListGroupItem key={`candidatesKey${i + 1}`}>
                          {`${candidate.first_name} ${candidate.last_name}`}
                        </ListGroupItem>
                      ))
                  )}
                </ListGroup>
              </Col>
            </Row>
          </div>
        )}
        <div className="my-5 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={sendQ}
            disabled={
              isWorking
              || listOfQuestionnaires.length === 0
              || !questionnaire
              || !newDeadline
            }
          >
            {isWorking && (
              <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
            )}
            {`${
              isWorking
                ? t(`${translationPath}sending`)
                : t(`${translationPath}send`)
            }`}
          </Button>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default SendQuestionnaire;
