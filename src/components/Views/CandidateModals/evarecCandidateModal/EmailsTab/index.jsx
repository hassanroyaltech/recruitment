// Import React Components
import React, { useCallback, useEffect, useState } from 'react';
// Import Reactstrap components
import { Col, Row } from 'reactstrap';
import './EmailTab.scss';
// Import Loader
import Loader from 'components/Elevatus/Loader';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AuthenticateUser } from '../../../../../services';
import EmailThread from './EmailThread';
import EmailComposer from './EmailComposer';
import { showError } from '../../../../../helpers';

const parentTranslationPath = 'EmailIntegrationPage';
const translationPath = 'EvarecCandidateModal.';

const EmailsTab = ({ candidate_uuid, job_uuid, candidate }) => {
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
    <Row>
      {loading && <Loader width="730px" height="49vh" speed={1} color="primary" />}
      {!loading && (
        <Col className="d-flex flex-column pb-2">
          {composerView && (
            <EmailComposer
              backHandler={backHandler}
              candidate_uuid={candidate_uuid}
              scope="candidate_modal"
              job_uuid={job_uuid}
              candidate_email={candidate.basic_information.email}
            />
          )}
          {!composerView && (
            <>
              <div className="">
                <EmailThread
                  backHandler={backHandler}
                  candidate_uuid={candidate_uuid}
                  scope="candidate_modal"
                  job_uuid={job_uuid}
                  // setLoading={setLoading}
                  candidate={candidate}
                  openComposer={openComposer}
                />
              </div>
              <div className="pagination" />
            </>
          )}
        </Col>
      )}
    </Row>
  );
};

export default EmailsTab;
