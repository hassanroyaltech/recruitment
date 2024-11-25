import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';

import RecuiterPreference from 'utils/RecuiterPreference';
// reactstrap components
import { Button, Col, FormGroup, Input, Row } from 'reactstrap';

// Forms Validation
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ErrorWrapper } from 'shared/FormValidations';
import { generateHeaders } from 'api/headers';
import { Can } from 'utils/functions/permissions';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import StageEditAction from './StageEditAction';
import { ActionWrapper } from '../PreferenceStyles';
import { showError, showSuccess } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const StageEditModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const [stageTitle, setStageTitle] = useState(props.stageData.title);
  const [, setStageType] = useState(props.stageData.type);
  const [isSmsEnabled] = useState(true);
  const [delayList] = useState(props.delayList);
  const [templates] = useState(props.templates);
  const [videoAssessments] = useState(props.videoAssessments);
  const [questionnaires] = useState(props.questionnaires);
  const [variables] = useState(props.variables);
  const [defaultEmail] = useState(props.defaultEmail);
  const [emailAttachments, setEmailAttachments] = useState(
    (props.stageData
      && props.stageData.attachment
      && props.stageData.attachment.map((item) => item.original))
      || [],
  );
  // Actions
  const [showAction, setShowAction] = useState(false);
  const addAction = () => {
    setShowAction(true);
  };

  // Spinner
  const [isWorking, setIsWorking] = useState(false);

  const [action, setAction] = useState({});

  const removeAction = () => {
    setShowAction(false);
    setAction({});
  };

  // This validation for both Add/Edit Stage
  const StageModalSchema = Yup.object().shape({
    stageName: Yup.string()
      .min(3, t(`${translationPath}stage-name-must-be-at-least-3-characters`))
      .max(50, t(`${translationPath}stage-name-must-be-at-most-50-characters`))
      .required(t('Shared:required')),
    ...(action
      && Object.keys(action)?.length && {
      videoAssessment: Yup.string()
        .nullable()
        .test(
          'isRequired',
          t('Shared:required'),
          () =>
            (action && action.type && action.type !== 'video_assessment')
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
            (action && action.type && action.type !== 'questionnaires')
              || (action
                && action.type
                && action.uuid
                && action.uuid !== t(`${translationPath}choose-questionnaire`)),
        ),
    }),
  });

  const addStageAction = (newAction) => {
    setAction(newAction);
  };

  const [orderView, setOrderView] = useState(props.stageData.order_view);
  // Get Stage Data from Props on Every Change
  useEffect(() => {
    setStageTitle(props.stageData.title);
    setStageType(props.stageData.type);
    setShowAction(!!props.stageData.action_type);
    setOrderView(props.stageData.order_view);
    console.log({ stageData: props.stageData });
    setAction(
      props.stageData.relation_uuid
        ? {
          type: props.stageData.action_type,
          uuid: props.stageData.relation_uuid,
          subject:
              props?.stageData?.type === 1
                ? props?.defaultEmail?.subject
                : props?.stageData?.email_subject,
          body:
              props?.stageData?.type === 1
                ? props?.defaultEmail?.body
                : props?.stageData?.email_body,
          no_replay: props.stageData.no_replay,
          delay: props.stageData.delay,
        }
        : {},
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.stageData]);

  const addStage = () => {
    setIsWorking(true);
    const sendStage = async () => {
      await axios
        .put(
          RecuiterPreference.stages_WRITE,
          {
            pipeline_uuid: props.pipeline.uuid,
            uuid: props.stageData.uuid,
            title: stageTitle,
            language_id: props.pipeline.language.id,
            type: props.stageData.type,
            order_view: orderView,
            sms: isSmsEnabled,
            attachment: emailAttachments.map((item) => item.uuid),
            ...(showAction ? { action_type: action.type } : { action_type: null }),
            ...(!showAction
              ? { relation_uuid: null }
              : action.type === 'email'
                ? ''
                : action.type === 'video_assessment'
                || action.type === 'questionnaires'
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
          {
            headers: generateHeaders(),
          },
        )
        .then(() => {
          // window.location.reload();
          // props.updateStage(res.data.results);
          // props.closeEditModal();
          setIsWorking(false);
          showSuccess(t(`${translationPath}stage-updated`));
        })

        .catch((err) => {
          setIsWorking(false);
          showError(t(`${translationPath}error-in-updating-stage`), err);
        });
    };
    sendStage();
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
          onSubmit={(values) => {
            addStage();
          }}
        >
          {({ errors }) => (
            <Form>
              {console.log({ errors })}
              <div className="modal-body">
                <Row>
                  <Col xl={6} lg={6} md={6} xs={12}>
                    <FormGroup>
                      <label className="form-control-label" htmlFor="stage-name">
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
                        <StageEditAction
                          action={action}
                          uuid={props.stageData.uuid}
                          stageData={props.stageData}
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
                      ? t(`${translationPath}updating-stage`)
                      : t(`${translationPath}save-changes`)
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

export default StageEditModal;
