import React, { useCallback, useEffect, useState } from 'react';
import { CardBody, Col, Row, Container } from 'reactstrap';
import TimelineHeader from '../../../components/Elevatus/TimelineHeader';
import { evarecAPI } from '../../../api/evarec';
import Loader from '../../../components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import ManageJobPipeline from './ManageJobPipeline';
import { useTitle } from '../../../hooks';
import { showError } from '../../../helpers';

const translationPath = '';
const parentTranslationPath = 'EvarecRecManage';
/**
 * This is a wrapper for the pipeline component to dispatch and get the current job
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const ManageJobDetail = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [load, setLoad] = useState(true);
  const [currentJob, setCurrentJob] = useState();
  const getPipelineData = useCallback(() => {
    evarecAPI
      .viewJob(props.match.params.id)
      .then((res) => {
        setCurrentJob(res.data.results);
        setLoad(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setLoad(false);
      });
  }, [props.match.params.id, t]);

  useEffect(() => {
    getPipelineData();
    // dispatch(getJobDetail(props.match.params.id));
  }, [getPipelineData]);

  useTitle(t(`${translationPath}manage-applications`));

  return (
    <>
      {load ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <>
          <TimelineHeader
            parentName="Manage Applications"
            name="Pipeline"
            child_name={currentJob?.job?.title || ''}
          />
          <div className="content-page bg-white mt--8">
            <div className="content">
              <Container
                fluid
                className="py-4"
                style={{ minHeight: 'calc(100vh - 78px)' }}
              >
                <ManageJobPipeline
                  {...props}
                  currentJob={currentJob}
                  stages={currentJob?.stages || []}
                />
              </Container>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ManageJobDetail;
