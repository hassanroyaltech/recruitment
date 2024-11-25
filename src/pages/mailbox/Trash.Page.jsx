import React, { useCallback, useState } from 'react';
import { Col } from 'reactstrap';
import '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailTab.scss';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import EmailThread from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailThread';
import EmailComposer from '../../components/Views/CandidateModals/evarecCandidateModal/EmailsTab/EmailComposer';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'MailBoxPage.';

const TrashMailbox = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [composerView, setComposerView] = useState(false);
  const [loading, setLoading] = useState(false);

  const openComposer = useCallback((type) => {
    setComposerView(true);
  }, []);

  const backHandler = useCallback(() => {
    setComposerView(false);
  }, []);

  return (
    <div className="email-integration-settings-page page-wrapper">
      <div className="page-header-wrapper px-3 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}trash`)}
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
                    filterValue="TRASH"
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

export default TrashMailbox;
