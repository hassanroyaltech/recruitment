/* eslint-disable react/prop-types */
/**
 * -----------------------------------------------------------------------------------
 * @title ShareProfileModal.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the ShareProfileModal component which we use in the EVA-SSESS, ATS, RMS.
 * -----------------------------------------------------------------------------------
 */
import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody } from 'reactstrap';
import CopyToClipboardInput from '../../components/Elevatus/CopyToClipboardInput';
import Loader from '../../components/Elevatus/Loader';
import { useToasts } from 'react-toast-notifications';
import { evarecAPI } from '../../api/evarec';
import { evassessAPI } from '../../api/evassess';
import { useTranslation } from 'react-i18next';
import RecruiterSearch from '../../pages/RecruiterSearch';
import { showError, showSuccess } from '../../helpers';
import { VitallyTrack } from '../../utils/Vitally';

const translationPath = 'ShareProfileModalComponent.';
const ShareProfileModal = ({
  isOpen,
  onClose,
  uuid,
  type,
  job_uuid,
  assessment_uuid,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [emails, setEmails] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    loading: false,
    shared_url: '',
  });
  const [sharedRecruiters, setSharedRecruiters] = useState({
    users: [],
    employees: [],
  });
  const { addToast } = useToasts(); // Toasts

  useEffect(() => {
    navigator.clipboard.writeText(state.shared_url);
  }, [state.shared_url]);

  /**
   * Share handler
   * @returns {Promise<void>}
   */

  const handleShare = async () => {
    setLoading(true);
    setIsSubmitted(true);
    const data = emails.map((expected) => expected.value);
    if (type === 'evarec') {
      if (!state.message) {
        setLoading(false);
        return;
      }
      evarecAPI
        .shareATSProfile({
          job_candidates: uuid,
          job_uuid,
          recruiters_emails: data,
          message: state.message,
        })
        .then((response) => {
          setState((prevState) => ({
            ...prevState,
            shared_url: response?.data?.results?.url,
          }));
          setLoading(false);
          addToast(t(`${translationPath}candidate-profile-shared-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC - Share applicants profiles',
            'EVA-REC Share applicants profiles',
            1,
            {},
          ]);
          VitallyTrack('EVA-REC - Share Candidate');
        })
        .catch((error) => {
          addToast(error?.response?.data?.message, {
            appearance: 'error',
            autoDismiss: true,
          });

          setState((prevState) => ({
            ...prevState,
            message: error?.response?.data?.message,
            errors: error?.response?.data?.errors,
          }));
          setLoading(false);
        });
    } else if (type === 'evassess')
      evassessAPI
        .shareCandidateProfile(uuid, assessment_uuid, [
          ...sharedRecruiters.users,
          ...sharedRecruiters.employees.map((item) => item.user_uuid),
        ])
        .then((res) => {
          setState((prevState) => ({
            ...prevState,
            shared_url: res.data.results.url,
          }));
          setLoading(false);
          addToast(res.data.message, {
            appearance: 'success',
            autoDismiss: true,
          });
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-SESS - Share applicants profiles',
            'EVA-SESS Share applicants profiles',
            1,
            {},
          ]);
        })
        .catch((error) => {
          addToast(error?.response?.message, {
            appearance: 'error',
            autoDismiss: true,
          });

          setState((prevState) => ({
            ...prevState,
            message: error.message,
            errors: error.errors,
          }));
          setLoading(false);
        });
    else if (type === 'search')
      evarecAPI
        .shareCandidateProfile(uuid, [
          ...sharedRecruiters.users,
          ...sharedRecruiters.employees.map((item) => item.user_uuid),
        ])
        .then((response) => {
          if (response.data.errors) {
            addToast(response.data.message, {
              appearance: 'error',
              autoDismiss: true,
            });

            setState((prevState) => ({
              ...prevState,
              message: response.data.message,
              errors: response.data.errors,
            }));
            setLoading(false);
          } else {
            setState((prevState) => ({
              ...prevState,
              shared_url: response.data.results.url,
            }));
            setLoading(false);
            addToast(response.data.message, {
              appearance: 'success',
              autoDismiss: true,
            });
            window?.ChurnZero?.push([
              'trackEvent',
              'EVA-REC (search DB) - Share applicants profiles',
              'EVA-REC (search DB) Share applicants profiles',
              1,
              {},
            ]);
            VitallyTrack('EVA-REC - Share Candidate');
          }
        });
    else
      evarecAPI
        .shareRMSProfile(uuid, [
          ...sharedRecruiters.users,
          ...sharedRecruiters.employees.map((item) => item.user_uuid),
        ])
        .then((response) => {
          setState((prevState) => ({
            ...prevState,
            shared_url: response.data.results.url,
          }));
          setLoading(false);
          showSuccess(response.data.message);
          window?.ChurnZero?.push([
            'trackEvent',
            'EVA-REC (RMS) - Share applicants profiles',
            'EVA-REC (RMS) Share applicants profiles',
            1,
            {},
          ]);
          VitallyTrack('EVA-REC - Share Candidate');
        })
        .catch((error) => {
          showError(t('Shared:failed-to-get-saved-data'), error);
          setState((prevState) => ({
            ...prevState,
            message: error?.message,
            errors: error?.errors,
          }));
          setLoading(false);
        });
  };

  return (
    <Modal
      className="modal-dialog-centered copy-link-modal"
      isOpen={isOpen}
      toggle={onClose}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">
          {t(`${translationPath}applicants-profile-description`)}
        </h3>
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
        style={{ overflow: 'auto', maxHeight: '100%' }}
      >
        {!loading ? (
          <>
            <div className="px-5 pb-3">
              {state.shared_url ? (
                <div className="mt-4">
                  <div
                    className="h6 font-weight-normal"
                    style={{ color: '#899298' }}
                  >
                    {t(`${translationPath}link-applicants-description`)}
                  </div>
                  <CopyToClipboardInput link={state.shared_url} />
                </div>
              ) : (
                <RecruiterSearch
                  create
                  setNumberOfDeleted={(value) => {
                    setState((prevState) => ({
                      ...prevState,
                      NumberOfDeleted: value,
                    }));
                  }}
                  messageValue={state.message}
                  isMessageError={!state.message}
                  isSubmitted={isSubmitted}
                  helperText="message-is-required"
                  onMessageChanged={(newValue) => {
                    setState((prevState) => ({
                      ...prevState,
                      message: newValue,
                    }));
                  }}
                  parentTranslationPath={parentTranslationPath}
                  setEmailsData={(data) => setEmails(data)}
                  sharedRecruiters={sharedRecruiters}
                  setSharedRecruiters={setSharedRecruiters}
                />
              )}
            </div>
            {!state.shared_url && (
              <div className="my-4 d-flex justify-content-center">
                <Button
                  type="button"
                  color="primary"
                  style={{ width: '220px' }}
                  onClick={handleShare}
                  disabled={
                    !(
                      sharedRecruiters?.users?.length
                      || sharedRecruiters?.employees?.length
                    )
                  }
                >
                  {state.loading && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    state.loading
                      ? t(`${translationPath}sharing`)
                      : t(`${translationPath}share`)
                  }`}
                </Button>
              </div>
            )}
          </>
        ) : (
          <Loader speed={1} color="primary" />
        )}
      </ModalBody>
    </Modal>
  );
};

export default ShareProfileModal;
