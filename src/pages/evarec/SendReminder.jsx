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

// Axios

// API url

// UI component
import { useTranslation } from 'react-i18next';
import { ThreeDots } from '../recruiter-preference/components/Loaders';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * A function to return the SendReminder component
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const SendReminder = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  // Set state for the reminder and list of reminders
  const [listOfReminders, setListOfReminders] = useState();
  const [reminder, setReminder] = useState(null);

  // IMPORTANT: EXPLANATION REQUIRED
  const [firstTime, setFirstTime] = useState(true);

  useEffect(() => {
    if (!props.isOpen || !firstTime) return;
    setFirstTime(false);

    /**
     * Get the list of reminders
     * @returns {Promise<void>}
     */
    const getReminders = async () => {
      setListOfReminders([]);
    };
    getReminders();
  }, [props.isOpen]);

  const onSend = async () => {};

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
          {t(`${translationPath}send-a-reminder`)}
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
        {!listOfReminders && <ThreeDots />}
        {listOfReminders && (
          <div>
            <Row>
              <Col xs={12}>
                <FormGroup>
                  <Label className="form-control-label text-gray" for="reminder">
                    {t(`${translationPath}select-the-reminder-you-want-to-send`)}:
                  </Label>
                  <Input
                    className="form-control-alternative mt-4"
                    type="select"
                    name="select"
                    value={reminder}
                    onChange={(e) => {
                      setReminder(
                        [...e.currentTarget.options].filter(
                          (option) => option.selected === true,
                        )[0].value,
                      );
                    }}
                    id="reminder"
                  >
                    <option selected disabled>
                      {t(`${translationPath}select-a-reminder`)}
                    </option>
                    {listOfReminders.map((reminder, i) => (
                      <option value={reminder.uuid} key={i}>
                        {reminder.title}
                      </option>
                    ))}
                  </Input>
                </FormGroup>
              </Col>
            </Row>
          </div>
        )}
        <div className="my-5 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={onSend}
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

export default SendReminder;
