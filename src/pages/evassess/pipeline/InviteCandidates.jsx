/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

import { Button, Col, Modal, Row, ModalBody } from 'reactstrap';
import { useToasts } from 'react-toast-notifications';
import { getUniqueID } from '../../../shared/utils';
import DropzoneWrapper from '../../../components/Elevatus/DropzoneWrapper';
import Helpers from '../../../utils/Helpers';
import { InviteCandidatesToAssessment } from '../../../shared/APIs/VideoAssessment/Candidates';
import { commonAPI } from '../../../api/common';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { ThreeDots } from '../../recruiter-preference/components/Loaders';
import CandidateCard from '../create/CandidateCard';
import csvExample from '../../../assets/files/invite-candidates-template.csv';
import { GlobalSavingDateFormat, showError } from '../../../helpers';
import moment from 'moment/moment';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import { VitallyTrack } from '../../../utils/Vitally';

const translationPath = 'InviteCandidateComponent.';
const InviteCandidates = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESSPipeline');
  const { addToast } = useToasts(); // Toasts

  const [isWorking, setIsWorking] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [, setUploaded] = useState(false);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState([]);
  const [flag, setFlag] = useState(true);
  const [newDeadline, setNewDeadline] = useState();
  const [isDeleteWorking, setIsDeleteWorking] = useState(false);
  const [candidates, setCandidates] = useState([
    {
      first_name: '',
      last_name: '',
      email: '',
      phone_number: '',
      id: getUniqueID(),
    },
  ]);

  // Add new Candidate
  const addCandidate = () => {
    setCandidates((items) => [
      ...items,
      {
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        id: getUniqueID(),
      },
    ]);
  };
  const removeCandidate = (idToRemove) => {
    if (candidates.length === 1) return;

    setIsDeleteWorking(true);

    setCandidates((items) => {
      items.splice(idToRemove, 1);
      return [...items];
    });

    setTimeout(() => {
      setIsDeleteWorking(false);
    }, 1000);
  };

  const setCandidateInfo = (newValues, index) => {
    const arr = [...candidates];
    if (!arr[index]) arr[index] = {};

    arr[index] = newValues;
    setCandidates(arr);
  };

  const sendInvites = async () => {
    setIsWorking(true);
    candidates.map((candidate, index) => {
      if (!candidate.first_name && !candidate.last_name && !candidate.email)
        candidates.splice(index, 1);

      return candidates;
    });
    InviteCandidatesToAssessment(
      props.match.params.id,
      candidates,
      newDeadline,
      file?.uuid,
      props.language_id,
    )
      .then(() => {
        VitallyTrack('EVA-SSESS - Invite candidate to the assessment');
        window?.ChurnZero?.push([
          'trackEvent',
          'EVA-SSESS - Add candidate to the assessment',
          'Add candidate to the assessment',
          1,
          {},
        ]);
        addToast(t(`${translationPath}candidate-invited-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.closeModal();
        setIsWorking(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}candidate-invite-failed`), error);
        setIsWorking(false);
        setFlag(true);
      });
  };

  const handleFileChange = async (files) => {
    if (files.length) {
      setUploading(true);
      setUploaded(false);
      const formData = new FormData();
      formData.append('file', files[0]);
      formData.append('type', 'docs');
      formData.append('from_feature', 'prep_assessment'); // Replace the preset name with your own

      commonAPI
        .createMedia(formData)
        .then(({ data }) => {
          setUploading(false);
          setUploaded(true);
          setFile(data.results.original);
          setFlag(false);
        })
        .catch((error) => {
          setErrors(error?.response?.data?.errors);
          showError(t('Shared:failed-to-get-saved-data'), error);
        });
    }
  };

  const removeCSV = async (uuid) => {
    setDeleting(true);
    setUploaded(false);
    commonAPI
      .deleteMedia({
        uuid,
      })
      .then(() => {
        setDeleting(false);
        setFile(null);
      })
      .catch((error) => {
        setDeleting(false);
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  };

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={props.isOpen}
      toggle={() => props.closeModal()}
      style={{ maxWidth: 928 }}
    >
      <div className="modal-header border-0">
        <h3 className="h3 mb-0">{t(`${translationPath}add-candidate`)}</h3>
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
      <ModalBody className="modal-body pt-0" style={{ margin: '0px 18px' }}>
        {isWorking && <ThreeDots />}
        {!isWorking && (
          <div className="mx-4">
            <Row className="mt-3">
              <Col xs="12">
                <div className="h6 font-weight-normal" style={{ color: '#899298' }}>
                  <span>{t(`${translationPath}add-candidate-description`)}</span>
                  <a
                    className="text-primary px-2"
                    href={csvExample}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t(`${translationPath}download`)}
                  </a>
                </div>
              </Col>
            </Row>

            <Row className="mt-2">
              <Col xs={12}>
                <DropzoneWrapper
                  multiple={false}
                  onUpload={handleFileChange}
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                  className="custom-file-input csv-custom-file-input py-5"
                >
                  {uploading ? (
                    <p>{t(`${translationPath}uploading`)}</p>
                  ) : (
                    <div className="d-flex flex-row align-items-center">
                      {file ? (
                        <>
                          <p className="text-success d-inline-flex-v-center">
                            {t(
                              `${translationPath}file-upload-successfully-description`,
                            )}
                            <ButtonBase
                              className="btns-icon theme-transparent mx-2"
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                window.open(
                                  `${Helpers.DOWNLOAD}?file=${file?.url}`,
                                  '_blank',
                                  'noreferrer',
                                );
                              }}
                            >
                              <i className="fas fa-download fa-xs" />
                            </ButtonBase>
                            <span>|</span>
                            <ButtonBase
                              className="btns-icon theme-transparent mx-2 c-danger"
                              disabled={deleting}
                              onClick={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                removeCSV(file?.uuid);
                              }}
                            >
                              <i className="fas fa-trash fa-xs text-danger px-2" />
                            </ButtonBase>
                          </p>
                        </>
                      ) : (
                        <>
                          {uploading ? (
                            <>
                              <i
                                className="fas fa-circle-notch fa-spin"
                                style={{ fontSize: '2rem' }}
                              />
                              <span className="h6 text-gray px-2 mb-0">
                                {t(`${translationPath}uploading`)}
                              </span>
                            </>
                          ) : deleting ? (
                            <>
                              <i
                                className="fas fa-circle-notch fa-spin"
                                style={{ fontSize: '2rem' }}
                              />
                              <span className="h6 text-gray ml-2 mb-0">
                                {t(`${translationPath}deleting`)}
                              </span>
                            </>
                          ) : (
                            <>
                              <i
                                className="fas fa-cloud-upload-alt"
                                style={{ fontSize: '2rem' }}
                              />
                              <span className="h6 text-gray px-2 mb-0">
                                {t(`${translationPath}upload-CSV-file`)}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  )}
                  {errors && errors.file ? (
                    errors.file?.length > 1 ? (
                      errors.file?.map((error, index) => (
                        <p
                          key={`fileKey${index + 1}`}
                          className="mb-0 mt-1 text-xs text-danger"
                        >
                          {error}
                        </p>
                      ))
                    ) : (
                      <p className="mb-0 mt-1 text-xs text-danger">{errors.file}</p>
                    )
                  ) : (
                    ''
                  )}
                </DropzoneWrapper>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs="12">
                <div className="h6 font-weight-normal" style={{ color: '#899298' }}>
                  <span>{t(`${translationPath}or`)}</span>
                  <span className="px-1">
                    {t(`${translationPath}you-can-add-applicants-manually`)}
                  </span>
                </div>
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs="12">
                {isDeleteWorking && <ThreeDots />}
                {!isDeleteWorking
                  && candidates.map((candidate, i) => (
                    <React.Fragment key={`candidatesKey${i + 1}`}>
                      {i > 0 && <hr className="my-4" />}
                      <CandidateCard
                        index={i}
                        number={i}
                        candidates={candidates}
                        setCandidates={setCandidateInfo}
                        candidateValue={candidate}
                        removeCandidate={() => removeCandidate(i)}
                        addCandidate={() => addCandidate()}
                        parentTranslationPath={props.parentTranslationPath}
                        translationPath={translationPath}
                        setFlag={setFlag}
                        errors={errors}
                        invite
                      />
                    </React.Fragment>
                  ))}
              </Col>
            </Row>
            <Row className="mt-4">
              <Col xs="6">
                <DatePickerComponent
                  datePickerWrapperClasses="px-0"
                  inputPlaceholder={t(`${translationPath}select-deadline`)}
                  value={newDeadline || ''}
                  maxDate={undefined}
                  minDate={moment().toDate()}
                  onDelayedChange={(date) => {
                    setNewDeadline(date?.value);
                  }}
                  parentTranslationPath={props.parentTranslationPath}
                  translationPath={translationPath}
                  displayFormat={GlobalSavingDateFormat}
                />
              </Col>
            </Row>
          </div>
        )}
        <Row className="mt-5 mb-4 d-flex justify-content-center">
          <Button
            color="primary"
            style={{ width: '220px' }}
            onClick={sendInvites}
            disabled={isWorking || flag}
          >
            {isWorking && <i className="fas fa-circle-notch fa-spin mr-2" />}
            {`${
              isWorking
                ? t(`${translationPath}sending`)
                : t(`${translationPath}invite-candidate`)
            }`}
          </Button>
        </Row>
      </ModalBody>
    </Modal>
  );
};

export default InviteCandidates;
