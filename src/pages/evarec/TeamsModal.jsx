// React and reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  Col,
  Input,
  Modal,
  ModalBody,
  Row,
} from 'reactstrap';

// formik for validation
import { useFormik } from 'formik';

// Alert
import ReactBSAlert from 'react-bootstrap-sweetalert';

// Toast for Alert
import { ToastProvider } from 'react-toast-notifications';

// Loader
import Loader from '../../components/Elevatus/Loader';

// Chips
import ChipsInput from '../../components/Elevatus/ChipsInput';

// API functions
import { evarecAPI } from '../../api/evarec';
import { useTranslation } from 'react-i18next';
import { showError } from '../../helpers';
import { GetAllEvaRecPipelineTeams } from '../../services';

const translationPath = '';
const parentTranslationPath = 'EvarecRecModals';

/**
 * Function that returns a TeamsModal object
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export default function TeamsModal(props) {
  const { t } = useTranslation(parentTranslationPath);
  // Define props
  const { uuid, isOpen, onClose } = props;

  // Define loading state
  const [loading, setLoading] = useState(false);

  // Define initial validation schema for formik
  const formik = useFormik({
    initialValues: {
      team: [],
    },
    onSubmit: () => {},
  });

  // Set values
  const { values } = formik;

  // Set state for multiple items
  const [state, setState] = useState({
    data: [],
    alert: null,
    options: [],
    openSureModal: false,
    openDoneModal: false,
    loadingInvite: false,
    dropdownoptions: [],
  });

  useEffect(() => {
    /**
     * Get data of all team members and teams that have already
     * been invited to the job.
     * @returns {Promise<void>}
     */
    const getData = async () => {
      setLoading(true);
      try {
        await evarecAPI.getInvitedTeamsOnJob(uuid).then((response) => {
          const members = response.data.results.map((team) => team.uuid);
          setState((prevState) => ({
            ...prevState,
            options: members,
          }));
        });
        const response = await GetAllEvaRecPipelineTeams({
          ...((state.options && state.options.length > 0 && state.options[0]) || {}),
        });
        setLoading(false);
        if (response && response.status === 200)
          setState((prevState) => ({
            ...prevState,
            dropdownoptions: response.data.results,
          }));
        else showError(t('Shared:failed-to-get-saved-data'), response);
      } catch (error) {
        setLoading(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    };
    getData();
  }, [state.options, t, uuid]);

  // Set the state to hide an alert
  const hideAlert = () => {
    setState((prevState) => ({
      ...prevState,
      openDoneModal: false,
      openSureModal: false,
    }));
    onClose();
  };

  /**
   * Handler to add a team member
   * @type {function(*): void}
   */
  const handleAddTeamMember = useCallback(
    (e) => {
      const { value } = e.currentTarget;
      setState((prevState) => ({
        ...prevState,
        options: [...prevState.options, value],
      }));
    },
    [setState],
  );

  /**
   * Handler to remove a team member
   * @param index
   */
  const handleRemove = (index) => {
    const opt_data = state.options;
    opt_data.splice(index, 1);
    setState((prevState) => ({ ...prevState, options: opt_data }));
  };

  /**
   * A function to invite a team
   * @returns {Promise<void>}
   */
  const inviteTeams = async () => {
    const data = state.options ? state.options.map((team) => team) : [];
    setState((prevState) => ({ ...prevState, loadingInvite: true }));
    evarecAPI
      .inviteTeamMembers(uuid, data)
      .then(() => {
        setState((prevState) => ({
          ...prevState,
          openDoneModal: true,
          loadingInvite: false,
        }));
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);

        setState((prevState) => ({
          ...prevState,
          message: error?.response?.data?.message,
          errors: error?.response?.data?.errors,
          loadingInvite: false,
        }));
      });
  };

  /**
   * Return JSX
   */
  return (
    <>
      <ToastProvider placement="top-center">
        {state.openDoneModal && (
          <ReactBSAlert
            success="success"
            style={{
              display: 'block',
            }}
            title={t(`${translationPath}invited`)}
            onConfirm={() => hideAlert()}
            onCancel={() => hideAlert()}
            confirmBtnBsStyle="primary"
            confirmBtnText={t(`${translationPath}ok`)}
            btnSize=""
          >
            {t(`${translationPath}invited-successfully`)}
          </ReactBSAlert>
        )}
        <Modal
          className="modal-dialog-centered choose-assessment-type"
          size="md"
          isOpen={isOpen}
          toggle={onClose}
        >
          <div className="modal-header border-0">
            <h3 className="h3 mb-0 ml-4">{t(`${translationPath}team-members`)}</h3>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-hidden="true"
              onClick={onClose}
            >
              <i className="fas fa-times" />
            </button>
          </div>
          <ModalBody
            className="modal-body pt-0"
            style={{ overflow: 'inherit', maxHeight: '100%' }}
          >
            {loading ? (
              <CardBody className="text-center">
                <Row>
                  <Col xl="12">
                    <Loader width="730px" height="49vh" speed={1} color="primary" />
                  </Col>
                </Row>
              </CardBody>
            ) : (
              <div className="pl-4 pr-4 pb-3">
                <div className="h6 font-weight-normal text-gray">
                  {t(`${translationPath}team-members-description`)}:
                </div>
                <Card className="p-3 pb-4 mb-0 mt-4" style={{ minHeight: '220px' }}>
                  <ChipsInput
                    onSelect={handleAddTeamMember}
                    onDelete={handleRemove}
                    chips={
                      state.options
                        ? state.options
                          .filter((opt) =>
                            state.dropdownoptions?.find((d) => d.value === opt),
                          )
                          .map(
                            (opt) =>
                              state.dropdownoptions?.find((d) => d.value === opt)
                                ?.label,
                          )
                        : []
                    }
                    InputComp={(props) => (
                      <Input
                        type="select"
                        placeholder="Search"
                        className="form-control-alternative"
                        {...props}
                      >
                        <option default>{t(`${translationPath}search`)}</option>
                        {state.dropdownoptions
                          ? state.dropdownoptions.map((opt, index) => (
                            <option key={index} value={opt.value}>
                              {opt.label}
                            </option>
                          ))
                          : []}
                      </Input>
                    )}
                  />
                </Card>
                <div className="mt-4 d-flex justify-content-center">
                  <Button
                    type="button"
                    color="primary"
                    className="btn"
                    style={{ width: 200 }}
                    disabled={
                      state.loadingInvite
                      || !values.team
                      || (state.options && state.options.length === 0)
                    }
                    onClick={inviteTeams}
                  >
                    {state.loadingInvite && (
                      <i className="fas fa-circle-notch fa-spin mr-2" />
                    )}
                    {`${
                      state.loadingInvite
                        ? t(`${translationPath}saving`)
                        : t(`${translationPath}save`)
                    }`}
                  </Button>
                </div>
              </div>
            )}
          </ModalBody>
        </Modal>
      </ToastProvider>
    </>
  );
}
