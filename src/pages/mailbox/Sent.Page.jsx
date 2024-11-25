import React, { useCallback, useEffect, useState } from 'react';
import { Col } from 'reactstrap';
import '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailTab.scss';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import EmailThread from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailThread';
import EmailComposer from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailComposer';
import { GetAllFolders } from '../../services';
import { showError } from '../../helpers';
import { useSelector } from 'react-redux';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'MailBoxPage.';

const SentMailbox = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [composerView, setComposerView] = useState(false);
  const [loading, setLoading] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const [folderId, setFolderId] = useState(null);
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
    if (getFolders?.status === 200) {
      // console.log(getFolders.data.body.folders.filter(folder => folder.id === "INBOX"));
      const folder = getFolders.data.body.folders.find(
        (folder) => folder.id === 'INBOX',
      );

      if (folder) {
        const { id } = folder;
        setFolderId(id);
      } else console.error("Folder with id 'INBOX' not found");
    } else showError(t('failed-to-get-saved-data'));
    setLoading(false);
  }, [userReducer, t]);

  useEffect(() => {
    getMailBoxFolders();
  }, [getMailBoxFolders]);
  return (
    <div className="email-integration-settings-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}sent`)}
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
                    filterValue="SENT"
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

export default SentMailbox;
