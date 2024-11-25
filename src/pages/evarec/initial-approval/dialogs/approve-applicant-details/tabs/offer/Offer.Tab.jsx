import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useToasts } from 'react-toast-notifications';
import { useParams } from 'react-router-dom';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Skeleton from '@mui/material/Skeleton';
import { evarecAPI } from '../../../../../../../api/evarec';
import { commonAPI } from '../../../../../../../api/common';
import Provider from '../../../../../../../components/Views/OfferModal/ProviderSetup';
import EmailSetup from '../../../../../../../components/Views/OfferModal/EmailSetup';
import OfferSetup from '../../../../../../../components/Views/OfferModal/OfferSetup';
import docxIcon from '../../../../../../../assets/images/FileTypes/icon_docx.svg';
import { showError } from '../../../../../../../helpers';

export const OfferTab = ({
  job_candidate_uuid,
  type,
  job_uuid,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [candidateResponse, setCandidatesResponse] = useState([]);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [offerData, setOfferData] = useState({});
  const [emailData, setEmailData] = useState({});
  const [annotationList, setAnnotationList] = useState();
  const [offerLoading, setOfferLoading] = useState(false);
  const [listOfOffers, setListOfOffers] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [types, setTypes] = useState('');
  const { addToast } = useToasts(); // Toasts
  const { id } = useParams();
  // const [emailAttachments, setEmailAttachments] = useState([]);
  // const [offerEmailAttachments, setOfferEmailAttachments] = useState([]);
  /**
   * Function to get candidate assessments data
   */
  const getAllCandidateResponse = useCallback(() => {
    setLoading(true);
    evarecAPI
      .GetAllCandidateOffers({
        relation: type,
        relation_uuid: id || job_uuid,
        relation_candidate_uuid: job_candidate_uuid,
      })
      .then((res) => {
        setCandidatesResponse(res?.data?.results);
        setLoading(false);
      })
      .catch(() => {});
  }, [job_uuid, job_candidate_uuid, id, type]);

  useEffect(() => {
    getAllCandidateResponse();
  }, [getAllCandidateResponse]);

  const getAnnotation = useCallback(async () => {
    commonAPI
      .getAnnotationList()
      .then((res) => {
        setAnnotationList(res.data.results.keys);
      })
      .catch(() => {});
  }, []);

  const getOffers = useCallback(async () => {
    commonAPI
      .getOffersList()
      .then((res) => {
        setListOfOffers(res.data.results);
      })
      .catch(() => {});
  }, []);

  const getOfferSlug = useCallback(async () => {
    commonAPI
      .getOfferSlug('send_offer', user?.language[0].id)
      .then((res) => {
        setEmailData({
          email_subject: res.data.results.subject,
          EmailBody: res.data.results.body,
        });
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Effect to invoke APIs, and set States
   */
  useEffect(() => {
    getAnnotation();
  }, [getAnnotation]);
  useEffect(() => {
    getOffers();
  }, [getOffers]);
  useEffect(() => {
    getOfferSlug();
  }, [getOfferSlug]);

  /**
   * Function to transform offer data and send it to API
   */
  const handleSubmit = () => {
    setOfferLoading(true);
    let offer = null;
    offer = {
      relation: type,
      relation_uuid: id || job_uuid,
      relation_candidate_uuid: job_candidate_uuid,
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
        getAllCandidateResponse();
        addToast(t(`${translationPath}offer-sent-successfully`), {
          appearance: 'success',
          autoDismissTimeout: 7000,
          autoDismiss: true,
        });
        setIsExpanded(false);
        setOfferData({});
        setEmailData({});
        setOfferLoading(false);
      })
      .catch((error) => {
        showError(t(`${translationPath}sending-offer-failed`), error);

        setOfferLoading(false);
      });
  };

  return (
    <div className="candidate-offer-tab-wrapper questionnaires-tab-wrapper">
      <div className="candidate-assessment-tab-content">
        <Accordion expanded={isExpanded}>
          <AccordionSummary
            expandIcon={<AddIcon />}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {t(`${translationPath}send-new-offer`)}
          </AccordionSummary>
          <AccordionDetails>
            <div className="offer-tab-add-wrapper">
              <Provider type={types} setType={setTypes} />
              {types && (
                <>
                  <EmailSetup
                    offer={emailData}
                    setOffer={setEmailData}
                    annotations={annotationList}
                    // emailAttachments={emailAttachments}
                    // onEmailAttachmentsChanged={(newValue) => setEmailAttachments(newValue)}
                  />
                  <OfferSetup
                    offer={offerData}
                    setOffer={setOfferData}
                    annotations={annotationList}
                    offers={listOfOffers}
                    // emailAttachments={offerEmailAttachments}
                    // onEmailAttachmentsChanged={(newValue) => setOfferEmailAttachments(newValue)}
                  />
                </>
              )}
              {types && (
                <div
                  className={`send-offer-button-wrapper ${
                    !emailData || !offerData || offerLoading ? 'is-disabled' : ''
                  }`}
                >
                  <Button
                    disabled={!emailData || !offerData || offerLoading}
                    onClick={handleSubmit}
                  >
                    {t(`${translationPath}send`)}
                    {offerLoading && (
                      <span className="pl-2 text-white text-sm">
                        <i className="fas fa-circle-notch fa-spin" />
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </AccordionDetails>
        </Accordion>
      </div>
      <div className="candidate-assessment-exam-item-wrapper">
        {candidateResponse
          && candidateResponse.length > 0
          && !loading
          && candidateResponse.map((item, index) => (
            <div
              key={`${index + 1}-response`}
              className="candidate-assessment-exam-item"
            >
              <div className="exam-image-info-wrapper">
                <div className="exam-image">
                  <img alt={item?.title} src={docxIcon} />
                </div>
                <div className="exam-info">
                  <div className="exam-title">{item?.title}</div>
                  <div className="exam-description">
                    <div className="exam-description-status">
                      {t(`${translationPath}status`)}:{item.status}
                    </div>
                  </div>
                </div>
              </div>
              <div className="exam-actions">
                {/* <IconButton disabled onClick={() => {}}>
                  <i className="fas fa-trash-alt" />
                </IconButton> */}
                {item.media?.url ? (
                  <>
                    <a href={item.media?.url} target="_blank" rel="noreferrer">
                      <IconButton onClick={() => {}}>
                        <Tooltip title={t(`${translationPath}view`)}>
                          <i className="fas fa-eye is-dark" />
                        </Tooltip>
                      </IconButton>
                    </a>
                    <a href={item.media?.url} target="_blank" rel="noreferrer">
                      <IconButton onClick={() => {}}>
                        <Tooltip title={t(`${translationPath}download`)}>
                          <i className="fas fa-download is-dark" />
                        </Tooltip>
                      </IconButton>
                    </a>
                  </>
                ) : (
                  <>
                    <IconButton disabled onClick={() => {}}>
                      <Tooltip title={t(`${translationPath}view`)}>
                        <i className="fas fa-eye" />
                      </Tooltip>
                    </IconButton>
                    <IconButton disabled onClick={() => {}}>
                      <Tooltip title={t(`${translationPath}download`)}>
                        <i className="fas fa-download" />
                      </Tooltip>
                    </IconButton>
                  </>
                )}
              </div>
            </div>
          ))}
        {loading && (
          <>
            <Skeleton variant="rectangular" width={400} height={90} />
            <Skeleton variant="rectangular" width={400} height={90} />
            <Skeleton variant="rectangular" width={400} height={90} />
            <Skeleton variant="rectangular" width={400} height={90} />
            <Skeleton variant="rectangular" width={400} height={90} />
          </>
        )}
      </div>
    </div>
  );
};

OfferTab.propTypes = {
  type: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  job_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

OfferTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: '',
};
