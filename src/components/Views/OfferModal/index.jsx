/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title SendOffer.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the SendOffer component which allow us to send offer for candidate.
 * ----------------------------------------------------------------------------------
 */

// React components
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// React Strap components
import { Button, Modal, ModalBody, Row } from 'reactstrap';

// Notifications Toast
import { useToasts } from 'react-toast-notifications';

// import Material UI components
import { makeStyles } from '@mui/styles';
import { Step, Stepper } from '@mui/material';

// Common API Service
import { commonAPI } from '../../../api/common';

// Stepper Components
import { useTranslation } from 'react-i18next';
import {
  StepperConnector,
  StepperIcon,
  StepperLabel,
} from '../../../pages/evarec/Stepper';

// Steps Components
import Provider from './ProviderSetup';
import EmailSetup from './EmailSetup';
import OfferSetup from './OfferSetup';
import { showError } from '../../../helpers';
import { SystemLanguagesConfig } from '../../../configs';

// Steps Labels
const steps = ['Provider', 'Email Setup', 'Offer Setup'];

// Custom Style
const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  stepper: {
    background: 'none',
    width: '120%',
    position: 'relative',
    left: '-10%',
    padding: 0,
  },
}));

/**
 * Main Component
 * @param {*} props
 */
const translationPath = 'SendOfferComponent.';
const SendOffer = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  // Toast to display alert messages for the user
  const { addToast } = useToasts();
  const classes = useStyles();
  const [saving] = useState(false);
  const [, setDialog] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [isWorking] = useState(false);
  const [offerData, setOfferData] = useState({});
  const [emailData, setEmailData] = useState({});
  const [type, setType] = useState();
  const [annotationList, setAnnotationList] = useState();
  // Set a state for the offer and list of offers
  const [listOfOffers, setListOfOffers] = useState();
  const [emailAttachments, setEmailAttachments] = useState([]);
  const [offerEmailAttachments, setOfferEmailAttachments] = useState([]);
  /**
   * Effect to invoke APIs, and set States
   */
  const getAnnotation = useCallback(async () => {
    commonAPI.getAnnotationList().then((res) => {
      setAnnotationList(res.data.results.keys);
    });
  }, []);
  const getOffers = useCallback(async () => {
    commonAPI.getOffersList().then((res) => {
      setListOfOffers(res.data.results);
    });
  }, []);

  /**
   * @param languages - list of languages
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method to return the english language UUID by code
   */
  const getEnglishLanguageUUID = useMemo(
    () =>
      (languages = []) =>
        languages.find((item) => item.code === SystemLanguagesConfig.en.key)?.id,
    [],
  );

  const getOfferSlug = useCallback(async () => {
    commonAPI
      .getOfferSlug(
        'send_offer',
        getEnglishLanguageUUID(
          JSON.parse(localStorage.getItem('user'))?.results?.language,
        ),
      )
      .then((res) => {
        setEmailData({
          email_subject: res.data.results.subject,
          EmailBody: res.data.results.body,
        });
      });
  }, [getEnglishLanguageUUID]);

  useEffect(() => {
    getAnnotation();
  }, [getAnnotation]);
  useEffect(() => {
    getOffers();
  }, [getOffers]);
  useEffect(() => {
    getOfferSlug();
  }, [getOfferSlug]);

  // Handle stepper to move between forms
  const getStepContent = (stepIndex) => {
    switch (stepIndex) {
    case 0:
      return (
        <Provider
          type={type}
          setType={setType}
          parentTranslationPath={props.parentTranslationPath}
        />
      );
    case 1:
      return (
        <EmailSetup
          offer={emailData}
          setOffer={setEmailData}
          annotations={annotationList}
          emailAttachments={emailAttachments}
          parentTranslationPath={props.parentTranslationPath}
          onEmailAttachmentsChanged={(newValue) => setEmailAttachments(newValue)}
        />
      );
    case 2:
      return (
        <OfferSetup
          offer={offerData}
          setOffer={setOfferData}
          annotations={annotationList}
          offers={listOfOffers}
          emailAttachments={offerEmailAttachments}
          parentTranslationPath={props.parentTranslationPath}
          onEmailAttachmentsChanged={(newValue) =>
            setOfferEmailAttachments(newValue)
          }
        />
      );
    default:
      return null;
    }
  };

  const closeDialog = () => setDialog(null);

  /**
   * Function to handle Next button and check the validation
   */
  const handleNext = () => {
    const validations = [];
    if (!type) validations.push(t(`${translationPath}choose-the-provider`));

    if (validations?.length) {
      addToast(
        <ul className="m-0">
          {validations.map((e, i) => (
            <li key={`validationsKey${i + 1}`}>{e}</li>
          ))}
        </ul>,
        {
          appearance: 'error',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        },
      );
      return;
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  /**
   * Handler to go back a step
   */
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  /**
   * Function to transform offer data and send it to API
   */
  const handleSubmit = () => {
    let offer;
    if (props.rms) {
      offer = {
        rms_uuid: props.rms_uuid,
        candidate_email: props.candidate_email,
        first_name: props.firstname,
        last_name: props.lastname,
        body: offerData.offer_body,
        title: offerData.offer_title
          ? offerData.offer_title
          : offerData.offer_uuid?.title,
        email_body: emailData.EmailBody,
        email_subject: emailData.email_subject,
      };
      commonAPI
        .sendOfferRMS(offer)
        .then(() => {
          addToast(t(`${translationPath}offer-sent-successfully`), {
            appearance: 'success',
            autoDismissTimeout: 7000,
            autoDismiss: true,
          });
          props.closeModal();
        })
        .catch((error) => {
          showError(t(`${translationPath}offer-send-failed`), error);
        });
    } else {
      offer = {
        relation: props.relation === 1 ? 'ats' : 'video_assessment',
        relation_uuid: props.relation_uuid,
        relation_candidate_uuid: props.relation_candidate_uuid,
        title: offerData.offer_title
          ? offerData.offer_title
          : offerData.offer_uuid?.title,
        subject: offerData.subject,
        body: offerData.offer_body,
        email_body: emailData.EmailBody,
        email_subject: emailData.email_subject,
      };
      commonAPI
        .sendOffer(offer)
        .then(() => {
          addToast(t(`${translationPath}offer-sent-successfully`), {
            appearance: 'success',
            autoDismissTimeout: 7000,
            autoDismiss: true,
          });
          props.closeModal();
        })
        .catch((error) => {
          showError(t(`${translationPath}offer-send-failed`), error);
        });
    }
  };
  /**
   * @returns {JSX Element}
   */
  return (
    <Modal
      className="modal-dialog-centered-scrollable"
      style={{ maxWidth: 848 }}
      isOpen
      toggle={() => closeDialog()}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}send-an-offer`)}</h3>
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
        style={{
          maxHeight: '70vh',
          padding: '0px 62px',
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Row>
          <hr />
          <div className={classes.root}>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              connector={<StepperConnector />}
              className={classes.stepper}
            >
              {steps.map((label, index) => (
                <Step key={`stepsKey${index + 1}`} style={{ padding: 5 }}>
                  <StepperLabel
                    StepIconComponent={(items) => <StepperIcon {...items} />}
                  >
                    {label}
                  </StepperLabel>
                </Step>
              ))}
            </Stepper>
            <>
              {getStepContent(activeStep)}

              <div
                style={{
                  marginTop: 30,
                  textAlign: 'center',
                }}
                className="d-flex-center flex-wrap w-100"
              >
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  className="step-button back-button"
                >
                  {t(`${translationPath}back`)}
                </Button>
                {activeStep === steps.length - 1 ? (
                  <Button
                    color="primary"
                    className="step-button"
                    onClick={handleSubmit}
                    disabled={isWorking}
                  >
                    {isWorking && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reserved" />
                    )}
                    {`${
                      isWorking
                        ? t(`${translationPath}sending`)
                        : t(`${translationPath}send`)
                    }`}
                  </Button>
                ) : (
                  <Button
                    color="primary"
                    className="step-button"
                    onClick={handleNext}
                    disabled={saving}
                  >
                    {saving && (
                      <i className="fas fa-circle-notch fa-spin mr-2-reserved" />
                    )}
                    {`${
                      saving
                        ? t(`${translationPath}sending`)
                        : activeStep === 0
                          ? t(`${translationPath}next`)
                          : activeStep === steps.length - 1
                            ? t(`${translationPath}send`)
                            : t(`${translationPath}next`)
                    }`}
                  </Button>
                )}
              </div>
            </>
          </div>
        </Row>
      </ModalBody>
      <hr />
    </Modal>
  );
};
export default SendOffer;
