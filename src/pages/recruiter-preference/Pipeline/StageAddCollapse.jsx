import React, { useState } from 'react';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';
import { generateHeaders } from 'api/headers';

// reactstrap components
import { Button, Col, FormGroup, Input, Row } from 'reactstrap';

// Forms Validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ErrorWrapper } from 'shared/FormValidations';
import { Can } from 'utils/functions/permissions';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import StageAction from './StageAction';
import { ActionWrapper } from '../PreferenceStyles';
import { showError, showSuccess } from '../../../helpers';
// Permissions

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const StageAddCollapse = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [stageTitle, setStageTitle] = useState('');
  const [isSmsEnabled] = useState(true);
  const [delayList] = useState(props.delayList);
  const [templates] = useState(props.templates);
  const [videoAssessments] = useState(props.videoAssessments);
  const [questionnaires] = useState(props.questionnaires);
  const [variables] = useState(props.variables);
  const [defaultEmail] = useState(props.defaultEmail);
  const [emailAttachments, setEmailAttachments] = useState([]);
  // Actions
  const [showAction, setShowAction] = useState(false);
  const [action, setAction] = useState({});
  // Spinner
  const [isWorking, setIsWorking] = useState(false);

  // This validation for both Add/Edit Stage
  const StageModalSchema = Yup.object().shape({
    stageName: Yup.string()
      .min(3, t(`${translationPath}stage-name-must-be-at-least-3-characters`))
      .max(50, t(`${translationPath}stage-name-must-be-at-most-50-characters`))
      .required(t('Shared:required')),
    videoAssessment: Yup.string()
      .nullable()
      .test(
        'isRequired',
        t('Shared:required'),
        () =>
          action
          || (action && action.type && action.type !== 'video_assessment')
          || (action
            && action.type
            && action.uuid
            && action.uuid !== t(`${translationPath}choose-video-assessment`)),
      ),
    questionnaire: Yup.string()
      .nullable()
      .test(
        'isRequired',
        t('Shared:required'),
        () =>
          action
          || (action && action.type && action.type !== 'questionnaires')
          || (action
            && action.type
            && action.uuid
            && action.uuid !== t(`${translationPath}choose-questionnaire`)),
      ),
  });

  const addAction = () => {
    setShowAction(true);
  };
  const removeAction = () => {
    setShowAction(false);
  };

  const addStageAction = (newAction) => {
    setAction(newAction);
  };

  const addStage = async () => {
    setIsWorking(true);
    await axios
      .post(
        RecuiterPreference.stages_WRITE,
        {
          pipeline_uuid: props.pipeline.uuid,
          title: stageTitle,
          language_id: props.pipeline.language.id,
          sms: isSmsEnabled,
          type: 1,
          attachment: emailAttachments.map((item) => item.uuid),
          order_view: props.pipeline.stages.length,
          ...(showAction ? { action_type: action.type } : { action_type: null }),
          ...(!showAction
            ? { relation_uuid: null }
            : action.type === 'email'
              ? ''
              : action.type === 'video_assessment' || action.type === 'questionnaires'
                ? { relation_uuid: action.uuid }
                : ''),
          ...(showAction
            ? { email_subject: action.subject }
            : { email_subject: null }),
          ...(showAction ? { email_body: action.body } : { email_body: null }),
          ...(showAction && action.delay && { delay: action.delay }),
          ...(showAction
            && action.type === 'email' && { no_replay: action.no_replay || false }),
        },
        { headers: generateHeaders() },
      )
      .then(() => {
        // Update Pipeline Stages, after add new Stage.
        props.getStages(props.pipeline.uuid);
        // Close Add New Stage Form
        props.close();
        showSuccess(t(`${translationPath}stage-added`));
      })
      .catch((err) => {
        setIsWorking(false);
        showError(t(`${translationPath}error-in-adding-stage`), err);
      });
  };

  return (
    <>
      <div className="bg-blue-light-old">
        <Formik
          enableReinitialize
          initialValues={{
            stageName: stageTitle,
            videoAssessments,
            questionnaires,
            questionnaire: '',
            videoAssessment: '',
          }}
          validationSchema={StageModalSchema}
          onSubmit={addStage}
        >
          {({ errors }) => (
            <Form>
              <div className="modal-body">
                <Row>
                  <Col xl={6} lg={6} md={6} xs={12}>
                    <FormGroup>
                      <label className="form-control-label" htmlFor="stageName">
                        {t(`${translationPath}stage-title`)}
                      </label>
                      <Field
                        className="form-control-alternative"
                        as={Input}
                        id="stageName"
                        name="stageName"
                        placeholder={t(`${translationPath}stage-name`)}
                        type="text"
                        invalid={!!errors.stageName}
                        value={stageTitle}
                        onChange={(e) => {
                          setStageTitle(e.currentTarget.value);
                        }}
                      />
                      <ErrorMessage component={ErrorWrapper} name="stageName" />
                    </FormGroup>
                  </Col>
                  <Col xl={12} lg={12} md={12} xs={12}>
                    {showAction && (
                      <ActionWrapper className="mt-3">
                        <StageAction
                          defaultEmail={defaultEmail}
                          addStageAction={addStageAction}
                          language={props.pipeline.language.id}
                          delayList={delayList}
                          templates={templates}
                          errors={errors}
                          videoAssessments={videoAssessments}
                          questionnaires={questionnaires}
                          variables={variables}
                          user={props.user}
                          emailAttachments={emailAttachments}
                          onEmailAttachmentsChanged={(newValue) =>
                            setEmailAttachments(newValue)
                          }
                        />
                      </ActionWrapper>
                    )}
                  </Col>

                  <Col xl={12} lg={12} md={12} xs={12} className="mt-4">
                    {!showAction ? (
                      <Button
                        className="btn btn-sm btn-icon"
                        color="primary"
                        type="button"
                        onClick={addAction}
                      >
                        <i className="fas fa-plus" />{' '}
                        {t(`${translationPath}add-action`)}
                      </Button>
                    ) : (
                      <Button
                        className="btn btn-sm  btn-icon"
                        type="button"
                        color="danger"
                        onClick={removeAction}
                        disabled={!Can('delete', 'pipeline')}
                      >
                        <i className="fas fa-trash " />{' '}
                        {t(`${translationPath}remove-action`)}
                      </Button>
                    )}
                  </Col>
                </Row>
              </div>

              <div className="modal-footer pt-2 pb-2">
                <Button
                  className="btn btn-sm btn-primary float-right"
                  color="primary"
                  type="submit"
                  disabled={isWorking}
                >
                  {isWorking && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    isWorking
                      ? t(`${translationPath}adding-new-stage`)
                      : t(`${translationPath}add-stage`)
                  }`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export default StageAddCollapse;
