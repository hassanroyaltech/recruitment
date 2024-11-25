/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Container } from 'reactstrap';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { useTitle } from 'hooks/Title.Hook';
import ManageAssessmentPipeline from '../pipeline/ManageAssessmentPipeline';
import { getFullURL } from '../../../utils/common';
import TimelineHeader from '../../../components/Elevatus/TimelineHeader';
import { Can } from '../../../utils/functions/permissions';
import { evassessAPI } from '../../../api/evassess';
import { showError } from '../../../helpers';

const parentTranslationPath = 'EvaSSESS';
const translationPath = 'AssessmentComponent.';
export const Assessment = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}manage-assessments`));
  const fullURL = getFullURL();
  const isOnActive = fullURL.includes('manage/active');
  const isOnArchived = fullURL.includes('manage/archived');
  const [assessmentTitle, setAssessmentTitle] = useState();
  const [assessment, setAssessment] = useState();
  const [loading, setLoading] = useState(true);
  const getAssessment = useCallback(async () => {
    await evassessAPI
      .getAssessment(props.match.params.id)
      .then((response) => {
        setAssessmentTitle(response.data.results.title);
        setAssessment(response.data.results);
        setLoading(false);
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
        setLoading(false);
      });
  }, [t, props.match.params.id]);

  useEffect(() => {
    if (props.match?.params?.id) getAssessment();
  }, [getAssessment, props.match?.params?.id]);

  return (
    <>
      {loading ? (
        <Loader speed={1} color="primary" />
      ) : (
        <>
          <TimelineHeader
            name={
              isOnActive
                ? t(`${translationPath}active-assessment`)
                : isOnArchived
                  ? t(`${translationPath}archived-assessment`)
                  : assessmentTitle || ''
            }
            parentName={
              isOnActive
                ? t(`${translationPath}manage-active-assessment`)
                : isOnArchived
                  ? t(`${translationPath}manage-archived-assessment`)
                  : t(`${translationPath}manage-assessments`)
            }
          >
            <Button
              className="btn-neutral"
              color="default"
              size="sm"
              disabled={!Can('create', 'video_assessment')}
              onClick={() => props.history.push('/recruiter/assessment/create')}
            >
              <i className="fas fa-plus" />
              <span className="px-1">
                {t(`${translationPath}add-new-assessment`)}
              </span>
            </Button>
          </TimelineHeader>

          <div className="content-page bg-white mt--8">
            <div className="content">
              <Container
                fluid
                className="py-4"
                style={{ minHeight: 'calc(100vh - 78px)' }}
              >
                <ManageAssessmentPipeline {...props} assessment={assessment} />
              </Container>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default Assessment;
