import React, { useCallback, useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailTab.scss';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import EmailThread from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailThread';
import EmailComposer from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailComposer';
import { GetAllEmails, GetAllFolders, GetNylasUserDetails } from '../../services';
import { useSelector } from 'react-redux';
import { showError } from '../../helpers';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'MailBoxPage.';

const AllMailMailbox = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [composerView, setComposerView] = useState(false);
  const [loading, setLoading] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);

  const openComposer = useCallback((type) => {
    setComposerView(true);
  }, []);

  const backHandler = useCallback(() => {
    setComposerView(false);
  }, []);
  const getMailBoxFolders = useCallback(async () => {
    setLoading(true);
    const getFolders = await GetAllFolders({
      user_uuid: userReducer.results.user.uuid, // limit: 30,
    });
    if (getFolders?.status === 200) 
      console.log(getFolders);
    else showError(t('failed-to-get-saved-data'));
    setLoading(false);
  }, [userReducer, t]);

  useEffect(() => {
    getMailBoxFolders()
  }, [getMailBoxFolders]);
  return (
    <div className="email-integration-settings-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}all-mail`)}
        </span>
      </div>
      <div className="page-body-wrapper d-flex-center">
        {loading && <Loader width="730px" height="49vh" speed={1} color="primary" />}

        {!loading && (
          <Col className="d-flex flex-column pb-2">
            {composerView && (
              <EmailComposer backHandler={backHandler} scope="external" />
            )}
            {!composerView && (
              <>
                <div className="">
                  <EmailThread
                    backHandler={backHandler}
                    scope="external"
                    openComposer={openComposer}
                    filterValue="all"
                    nylasUserDetails
                  />
                </div>
                <div className="pagination" />
              </>
            )}
          </Col>
        )}
      </div>
    </div>
  );
};

export default AllMailMailbox;
