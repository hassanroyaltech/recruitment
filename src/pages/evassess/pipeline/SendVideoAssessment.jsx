// Import React components
import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import { selectColors, customSelectStyles } from '../../../shared/styles';
import { useTranslation } from 'react-i18next';
// Import Toasts to show errors and success messages
import { useToasts } from 'react-toast-notifications';

// Import React-Strap components
import { Button, Col, FormGroup, Label, Modal, ModalBody, Row } from 'reactstrap';

// Import Loader
import { evarecAPI } from '../../../api/evarec';
import { ThreeDots } from '../../recruiter-preference/components/Loaders';

// import Date picker
import Datepicker from '../../../components/Elevatus/Datepicker';
import { showError } from '../../../helpers';

const parentTranslationPath = 'EvaSSESSPipeline';
const translationPath = 'SendVideoAssessment.';

// Send Video Assessment Functional Component
const SendVideoAssessment = (props) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const { addToast } = useToasts(); // Toasts

  // State to store list of video assessment from API
  const [listOfVideoAssessments, setListOfVideoAssessments] = useState([]);

  // State to store selected video assessment
  const [videoAssessment, setVideoAssessment] = useState(null);

  // State to store selected date
  const [newDeadline, setNewDeadline] = useState();

  const [firstTime, setFirstTime] = useState(true);
  useEffect(() => {
    if (!props.isOpen || !firstTime) return;
    setFirstTime(false);
    // Get video assessments data from API
    evarecAPI
      .getVideoAssessments()
      .then((res) => {
        setListOfVideoAssessments(res.data?.results);
      })
      .catch((error) => {
        showError(t(`${translationPath}error-in-getting-video-assessments`), error);
      });
  }, [props.isOpen]);

  // Function to send selected video assessment
  const sendVideoAssessment = async () => {
    // eslint-disable-next-line no-use-before-define
    setIsWorking(true);
    evarecAPI
      .SendVideoAssessment(
        props.jobUuid,
        videoAssessment,
        props.selectedCandidates,
        newDeadline,
        props.type,
      )
      .then((res) => {
        // eslint-disable-next-line no-use-before-define
        setIsWorking(false);
        props.closeModal();
        // Clear the fields after submit sending the assessment.
        setVideoAssessment(null);
        setNewDeadline(null);
        addToast(t(`${translationPath}video-assessment-sent`), {
          appearance: 'success',
          autoDismiss: true,
        });
      })
      .catch((error) => {
        setIsWorking(false);

        showError(t(`${translationPath}error-in-sending-video-assessments`), error);
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
        <h3 className="h3 mb-0" style={{ marginLeft: 42, marginTop: 20 }}>
          {t(`${translationPath}send-video-assessment`)}
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
      <ModalBody className="modal-body pt-0" style={{ margin: '0px 42px' }}>
        {!listOfVideoAssessments && <ThreeDots />}
        {listOfVideoAssessments && (
          <div>
            <Row>
              <Col xs={6}>
                <FormGroup>
                  <Label
                    className="form-control-label text-gray"
                    for="videoAssessment"
                  >
                    {t(`${translationPath}choose-a-pre-existing-video-assessment`)}
                  </Label>
                  <Select
                    isMulti
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        ...selectColors,
                      },
                    })}
                    styles={customSelectStyles}
                    onChange={(e) => {
                      setVideoAssessment(e);
                    }}
                    value={videoAssessment}
                    options={[
                      ...listOfVideoAssessments.map((assessment) => ({
                        value: assessment.uuid,
                        label: assessment.title,
                      })),
                    ]}
                  />
                  {/* <Input
                    className="form-control-alternative "
                    type="select"
                    name="select"
                    value={videoAssessment || 'default'}
                    onChange={(e) => {
                      setVideoAssessment(e.currentTarget.value);
                    }}
                    id="videoAssessment"
                  >
                    <option value="default" disabled> Select a Video Assessment</option>
                    {listOfVideoAssessments.map((videoAssessment, i) => (
                      <option value={videoAssessment.uuid} key={i}>
                        {videoAssessment.title}
                      </option>
                    ))}
                  </Input> */}

                  {/* <TextField */}
                  {/*  fullWidth */}
                  {/*  className="form-control-alternative" */}
                  {/*  id="videoAssessment" */}
                  {/*  name="select" */}
                  {/*  label="Video assessment" */}
                  {/*  variant="outlined" */}
                  {/*  SelectProps={{ */}
                  {/*    native: false, */}
                  {/*  }} */}
                  {/*  select */}
                  {/*  value={videoAssessment || ''} */}
                  {/*  onChange={(e) => { */}
                  {/*    setVideoAssessment(e.currentTarget.value); */}
                  {/*  }} */}
                  {/* > */}
                  {/*  {listOfVideoAssessments.map((videoAssessment, i) => ( */}
                  {/*    <MenuItem value={videoAssessment.uuid} key={i}> */}
                  {/*      {videoAssessment.title} */}
                  {/*    </MenuItem> */}
                  {/*  ))} */}
                  {/* </TextField> */}
                </FormGroup>
              </Col>
              <Col xs="6">
                <Label
                  className="form-control-label text-gray"
                  for="videoAssessment"
                >
                  {t(`${translationPath}select-deadline`)}
                </Label>
                <Datepicker
                  value={newDeadline || ''}
                  inputPlaceholder={t(`${translationPath}select-deadline`)}
                  onChange={(date) => {
                    setNewDeadline(date);
                  }}
                  className="w-100"
                />
              </Col>
            </Row>
            {/*<Row>*/}
            {/* <Col xs={12}>
                <Label className="form-control-label mt-4">
                  You're about to send the selected Video Assessment to:
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
              </Col> */}
            {/*</Row>*/}
          </div>
        )}
        <div className="mt-5 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={sendVideoAssessment}
            disabled={
              isWorking
              || listOfVideoAssessments.length === 0
              || !videoAssessment
              || !newDeadline
            }
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

export default SendVideoAssessment;
