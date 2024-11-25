// React and reactstrap
import React, { useEffect, useState } from 'react';
import {
  Button,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';

// Style components

// API urls

// Toasts
import { useToasts } from 'react-toast-notifications';

// UI components
import { evarecAPI } from '../../api/evarec';
import { useTranslation } from 'react-i18next';
import { showError } from '../../helpers';
import { ThreeDots } from '../recruiter-preference/components/Loaders';

// Custom modal

// API functions
import { sendQuestionnaire } from './services/endpoints';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * Function that returns the SendQuestionnaire component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SendQuestionnaire = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Initialize toasts
  const { addToast } = useToasts();

  // Set the state for questionnaire and list of questionnaires
  const [listOfQuestionnaires, setListOfQuestionnaires] = useState([]);
  const [questionnaire, setQuestionnaire] = useState('Choose Questionnaire');

  useEffect(() => {
    setQuestionnaire(t(`${translationPath}choose-questionnaire`));
  }, []);

  // Again: What is this?
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (!props.isOpen || !firstTime) return;
    setFirstTime(false);

    /**
     * Get the list of questionnaires depending on the pipeline
     */
    evarecAPI
      .getQuestionnaireByPipeline(props.pipeline)
      .then((res) => {
        // console.log(res)
        setListOfQuestionnaires(res.data.results);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t, props.isOpen]);

  /**
   * Handler to send a questionnaire
   */
  const sendQ = async () => {
    setIsWorking(true);

    try {
      const res = sendQuestionnaire({
        prep_assessment_uuid: props.match.params.id,
        questionnaire_uuid: questionnaire,
        prep_assessment_candidate_uuid: props.selectedCandidates,
      });
      setIsWorking(false);
      props.closeModal();
      addToast(t(`${translationPath}questionnaire-sent`), {
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
    } catch (error) {
      setIsWorking(false);
      showError(t('Shared:failed-to-get-saved-data'), error);
    }
  };

  // Spinner
  const [isWorking, setIsWorking] = useState(false);

  /**
   * Return JSX
   */
  return (
    <Modal
      className="modal-dialog-centered"
      size="md"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0" style={{ marginLeft: 42, marginTop: 20 }}>
          {t(`${translationPath}send-a-questionnaire`)}
        </h3>
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
      <ModalBody
        className="modal-body pt-0"
        style={{ maxHeight: '70vh', margin: '0px 42px' }}
      >
        {!listOfQuestionnaires && <ThreeDots />}
        {listOfQuestionnaires && (
          <div>
            <Row>
              <Col xs={12}>
                <FormGroup>
                  <Label
                    className="form-control-label text-gray"
                    for="questionnaire"
                  >
                    {t(
                      `${translationPath}select-the-questionnaire-you-want-to-send`,
                    )}
                    :
                  </Label>
                  <Input
                    className="form-control-alternative mt-4"
                    type="select"
                    name="select"
                    value={questionnaire}
                    onChange={(e) => {
                      setQuestionnaire(
                        [...e.currentTarget.options].filter(
                          (option) => option.selected === true,
                        )[0].value,
                      );
                    }}
                    id="questionnaire"
                  >
                    <option selected disabled>
                      {t(`${translationPath}select-a-questionnaire`)}
                    </option>
                    {listOfQuestionnaires.map((questionnaire, i) => (
                      <option value={questionnaire.uuid} key={i}>
                        {questionnaire.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
            {/* <Row>
              <Col xs={12}>
                <Label className='form-control-label'>
                  You're about to send the selected Questionnaire to:
                </Label>

                <ListGroup>
                  {props.candidates
                    .filter((c) => props.selectedCandidates.includes(c.uuid))
                    .map((candidate, i) => (
                      <ListGroupItem key={i}>
                        {`${candidate.first_name} ${candidate.last_name}`}
                      </ListGroupItem>
                    ))}
                </ListGroup>
              </Col>
            </Row> */}
          </div>
        )}
        <div className="my-5 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={sendQ}
            disabled={isWorking}
          >
            {isWorking && <i className="fas fa-circle-notch fa-spin mr-2" />}
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
