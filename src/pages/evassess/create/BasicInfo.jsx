/* eslint-disable react/prop-types,react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title BasicInfo.jsx
 * ----------------------------------------------------------------------------------
 * This component is the first step in the Video Assessment stepper where we fill out
 * the following:
 *  - Assessment Title
 *  - Pipeline
 *  - Template
 *  - Evaluation
 *  - Upload a video
 *  - Choose the assessment type (Open/Hidden)
 *
 *  When creating/editing a template rather than an assessment, we will have the
 *  following:
 *  - Template title
 *  - Category
 *  - Pipeline
 *  - Evaluation
 *  - Upload a video
 *  - Choose the assessment type
 * ----------------------------------------------------------------------------------
 */
import React, { useCallback, useEffect, useState } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';
import VideoCard from 'components/Elevatus/VideoCard';
import BarLoader from 'components/Elevatus/BarLoader';
import DropzoneWrapper from 'components/Elevatus/DropzoneWrapper';
import Radio from '@mui/material/Radio';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import { commonAPI } from 'api/common';

// Helpers
import UploadIcon from 'assets/images/shared/upload.png';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { evassessAPI } from '../../../api/evassess';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  showError,
} from '../../../helpers';
import { SubscriptionServicesEnum, SystemActionsEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import ButtonBase from '@mui/material/ButtonBase';
import { EvaSsessTemplatesPermissions } from 'permissions';
import i18next from 'i18next';
import { IconButton, InputAdornment } from '@mui/material';
import { TooltipsComponent } from '../../../components';
import { ChatGPTIcon } from '../../../assets/icons';
import { SystemLanguagesConfig } from '../../../configs';

/**
 * Basic Info Class Component (1st step in stepper)
 */
const translationPath = 'BasicInfoComponent.';
const BasicInfo = (props) => {
  const { t } = useTranslation(props.parentTranslationPath || 'EvaSSESS');
  const [languages] = useState(
    Object.values(SystemLanguagesConfig).map((item) => ({
      code: item.key,
      title: t(`Shared:LanguageChangeComponent.${item.value}`),
    })),
  );
  const [state, setState] = useState({
    pipelineList: props.pipelineList,
    evaluationList: props.evaluationList,
    templateList: props.templateList,
    template: props.selectedTemplatUuid,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    VideoSelect: props.video,
    title_loader: false,
    errors: null,
    videoLoader: false,
    deleted: false,
    categoriesList: [],
    /* Radio selector for [Open and Hidden] assessments */
    // 1 represents the open assessment type, 0 the hidden
    radioSelector: props.type,
    assessmentTitle: props.assessmentTitle,
  });
  const [isTooltipActive, setIsTooltipActive] = useState(false);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  /**
   * Load categories panel upon load
   */
  const getVideoAssessmentCategories = useCallback(async () => {
    await evassessAPI
      .getVideoAssessmentCategories()
      .then((response) => {
        setState((items) => ({
          ...items,
          categoriesList: response.data.results,
        }));
        props.setCatgeory(
          (response.data
            && response.data.results
            && response.data.results[0]
            && response.data.results[0].uuid)
            || null,
        );
      })
      .catch((error) => {
        showError(t('Shared:failed-to-get-saved-data'), error);
      });
  }, [t]);

  /**
   * When uploading a video
   * @param files
   */
  const onUploadVideo = (files) => {
    setState((items) => ({ ...items, videoLoader: true }));
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('type', 'video');
    formData.append('from_feature', 'prep_assessment'); // Replace the preset name with your own
    commonAPI
      .createMedia(formData)
      .then(({ data }) => {
        saveVideo(data);
        setState((items) => ({ ...items, errors: null }));
      })
      .catch((error) => {
        saveVideo([]);
        setState((items) => ({
          ...items,
          errors: error?.response?.data?.errors,
        }));
      });
  };

  /**
   * Save a video after upload (or load if edit)
   * @param data
   */
  const saveVideo = (data) => {
    if (data.results) {
      setState((items) => ({
        ...items,
        VideoSelect: data.results.original,
      }));

      props.setVideo(data.results?.original);
    }
    setState((items) => ({
      ...items,
      videoLoader: false,
    }));
  };

  /**
   * Handle radio button change (Open/Hidden)
   * @param event
   */
  const handleRadioBChange = (event) => {
    event.preventDefault();
    const assessmentType = event.target.value;
    setState((items) => ({ ...items, radioSelector: assessmentType }));
    props.setType(assessmentType);

    if (assessmentType === '1')
      // If the Open assessment type was selected
      setState((items) => ({
        ...items,
        openRadioSelectorClass: 'va-open-hidden-selected',
        hiddenRadioSelectorClass: 'va-open-hidden',
      }));
    else if (assessmentType === '0')
      // If the Hidden assessment type was selected
      setState((items) => ({
        ...items,
        openRadioSelectorClass: 'va-open-hidden',
        hiddenRadioSelectorClass: 'va-open-hidden-selected',
      }));
  };

  /**
   * Handler to change the title
   * @param event
   */
  const handleTitleChange = (event) => {
    event.preventDefault();
    setState((items) => ({
      ...items,
      title_loader: false,
    }));
    props.setTitle(event.target.value);
  };

  /**
   * Handler to select a pipeline
   * @param event
   */
  const handlePipelineSelect = (event) => {
    event.preventDefault();
    setState((items) => ({ ...items, pipelineList: props.pipelineList }));
    props.setPipeline(event.target.value);
    props.setLanguage(
      event.target[event.target.selectedIndex].getAttribute('data-uuid'),
    );
  };

  /**
   * Handler to select an evaluation
   * @param event
   */
  const handleEvaluationSelect = (event) => {
    event.preventDefault();
    setState((items) => ({ ...items, evaluationList: props.evaluationList }));
    props.setEvaluation(event.target.value);
  };

  const handleSelectLang = (event) => {
    event.preventDefault();
    props?.setGPTDetails((items) => ({ ...items, language: event?.target?.value }));
  };
  /**
   * handler to change a template
   * @param event
   */
  const handleTemplateChange = (event) => {
    event.preventDefault();

    const { value } = event.target;

    setState((items) => ({
      ...items,
      templateList: props.templateList,
      title_loader: true,
      template: value,
    }));
    props.setSelectedTemplate(value);
  };

  /**
   * Remove video
   * @param uuid
   * @param id
   */
  const removeVideo = (uuid) => {
    setState((items) => ({
      ...items,
      deleted: true,
    }));
    props.setVideo('');
    commonAPI
      .deleteMedia({
        uuid,
        from_feature: 'career_portal',
        company_uuid: state.user.company_id,
      })
      .then(() => {
        setState((items) => ({
          ...items,
          VideoSelect: [],
          deleted: false,
        }));
        document.getElementsByClassName('dz-video').innerHTML = '';
      })
      .catch(({ error }) => {
        setState((items) => ({
          ...items,
          deleted: false,
          errors: error?.response?.data?.errors,
        }));
      });
  };
  /**
   * Initialize props
   */
  const { panelType, pipelineList, templateList, evaluationList } = props;
  /**
   * Map the list of pipelines
   */
  const pipelines = pipelineList?.map((option, index) => (
    <option
      data-uuid={option.language_id}
      key={`pipelineListKey${index + 1}`}
      value={option.uuid}
    >
      {option.title}
    </option>
  ));
  /**
   * Map the list of evaluations
   */
  const evaluations = evaluationList?.map((option, index) => (
    <option key={`evaluationListKey${index + 1}`} value={option.uuid}>
      {option.title}
    </option>
  ));

  /**
   * Map the list of templates
   */
  const templates = templateList?.map((option) => (
    <option key={option.uuid} value={option.uuid}>
      {option.title}
    </option>
  ));
  useEffect(() => {
    if (props.panelType === 'template') getVideoAssessmentCategories();
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  /**
   * Get value for autocomplete
   * @param array
   * @param currentValue
   * @param key
   * @returns {*}
   */
  const getValue = (array, currentValue, key) =>
    array.find((item) => item[key] === currentValue) || null;

  // Main render function
  /**
   * Return the 'BasicInfo' component
   * @return {JSX.Element}
   */
  return (
    <>
      {panelType === 'template'
      || templateList?.length > 0
      || pipelineList?.length > 0 ? (
          <Card className="step-card">
            <Row>
              <Col xs="12">
                <h6 className="h6 text-bold-500">
                  {t(`${translationPath}basic-information`)}
                </h6>
              </Col>
            </Row>

            {/* First Row of Fields, contains:
             - Choose a Template
             - Select a Pipeline
             */}
            <Row className="mt-4">
              {/* TEMPLATE DROPDOWN */}
              {panelType !== 'template' && (
                <Col xs="12" md="6" sm="6" className="mb-3">
                  <TextField
                    id="select-template"
                    label={t(`${translationPath}choose-a-template`)}
                    variant="outlined"
                    select
                    className="form-control-alternative w-100"
                    name="selectTemplate"
                    placeholder={t(`${translationPath}choose-a-template`)}
                    onChange={handleTemplateChange}
                    value={props.selectedTemplatUuid || null}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId:
                        EvaSsessTemplatesPermissions.SuperEvaSsessTemplates.key,
                        permissions,
                      })
                    }
                    SelectProps={{
                      native: true,
                      displayEmpty: true,
                    // defaultValue: 'No template selected',
                    }}
                  >
                    {/* This enables reset of field */}
                    <option value="" />
                    {templates}
                  </TextField>
                </Col>
              )}

              {/* PIPELINE DROPDOWN */}
              {panelType !== 'template' && !props.uuid && (
                <Col xs="12" md="6" sm="6" className="mb-3">
                  <TextField
                    id="select-pipeline"
                    label={t(`${translationPath}select-a-pipeline`)}
                    variant="outlined"
                    select
                    className="form-control-alternative w-100"
                    name="selectPipeline"
                    placeholder={t(`${translationPath}select-a-pipeline`)}
                    disabled={!props.canEdit}
                    onChange={handlePipelineSelect}
                    // defaultValue={props.pipeline ? props.pipeline : 'No pipeline selected'}
                    value={props.pipeline ? props.pipeline : ''}
                    SelectProps={{
                      native: true,
                      displayEmpty: true,
                    // defaultValue: 'Select a pipeline',
                    }}
                  >
                    {/* This enables reset of field */}
                    <option value="" />
                    {pipelines}
                  </TextField>
                </Col>
              )}

              {/* Second Row of Fields, contains:
              - Assessment Title
              - Select an Evaluation
            */}
              {/* ASSESSMENT TITLE */}
              {panelType !== 'template' && (
                <Col xs="12" md="6" sm="6" className="mb-3">
                  <TextField
                    id="assessment-title"
                    label={t(`${translationPath}title-of-assessment`)}
                    variant="outlined"
                    className="form-control-alternative w-100"
                    name="assessmentTitle"
                    type="text"
                    onChange={handleTitleChange}
                    autoComplete=""
                    value={props.assessmentTitle || ''}
                    required
                  />
                </Col>
              )}
              {panelType === 'template' && (
                <>
                  <Col xs="12" md="6" sm="6" className="mb-3">
                    <TextField
                      id="template-title"
                      label={t(`${translationPath}title-of-template`)}
                      variant="outlined"
                      className="form-control-alternative w-100"
                      name="TemplateTitle"
                      type="text"
                      onChange={handleTitleChange}
                      autoComplete=""
                      value={props.assessmentTitle || ''}
                      required
                    />
                  </Col>
                </>
              )}
              {/* PIPELINE DROPDOWN */}
              {panelType !== 'template' && (
                <Col xs="12" md="6" sm="6" className="mb-3">
                  <TextField
                    id="select-evaluation"
                    label={t(`${translationPath}select-an-evaluation`)}
                    variant="outlined"
                    select
                    className="form-control-alternative w-100"
                    name="selectPipeline"
                    placeholder={t(`${translationPath}select-an-evaluation`)}
                    disabled={!props.canEdit}
                    onChange={handleEvaluationSelect}
                    // defaultValue={props.evaluation ? props.evaluation : 'Please select an evaluation'}
                    value={props.evaluation ? props.evaluation : ''}
                    SelectProps={{
                      native: true,
                      displayEmpty: true,
                    // defaultValue: 'Select an Evaluation',
                    }}
                  >
                    {/* This enables reset of field */}
                    <option value="" />
                    {evaluations}
                  </TextField>
                </Col>
              )}
            </Row>
            <Row className="mt-4">
              <Col xs="12">
                <h6 className="h6 text-bold-500">
                  {t(`${translationPath}video-introduction-optional`)}
                </h6>
                <p>{t(`${translationPath}welcome-message-description`)}</p>
              </Col>
            </Row>
            <Row className="mt-2">
              <Col
                xs="12"
                className="mb-2"
                style={{
                  display: state.videoLoader || !props.video?.url ? 'block' : 'none',
                }}
              >
                <CardBody
                  className="video-introduction-dz-zone"
                  style={{ position: 'relative' }}
                >
                  <DropzoneWrapper
                    multiple={false}
                    onUpload={onUploadVideo}
                    accept="video/*"
                    maxFileSize={500000000}
                    className="dropzone-wrapper"
                  >
                    {state.videoLoader ? (
                      <>
                        <div className="h3">
                          <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                        </div>
                        <h6 className="h6 text-gray mt-3 mb-0">
                          {t(`${translationPath}uploading`)}
                        </h6>
                      </>
                    ) : state.deleted ? (
                      <>
                        <div className="h3">
                          <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                        </div>
                        <h6 className="h6 text-gray mt-3 mb-0">
                          {t(`${translationPath}removing`)}
                        </h6>
                      </>
                    ) : (
                      <>
                        <div>
                          <img
                            src={UploadIcon}
                            className="upload-icon"
                            alt="upload-icon"
                          />
                        </div>
                        <h6 className="h6 mt-3 mb-0" style={{ color: '#959595' }}>
                          {t(`${translationPath}click-here`)}
                        </h6>
                        <h6 className="h7" style={{ color: '#959595' }}>
                          {t(`${translationPath}or-drop-your-video-here`)}
                        </h6>
                      </>
                    )}
                  </DropzoneWrapper>
                </CardBody>
              </Col>
              {!state.videoLoader && props.video?.url && (
                <Col
                  xs="12"
                  className="mb-2 video-card-wrapper"
                  style={{
                    position: 'relative',
                    display: !state.videoLoader && props.video?.url ? 'block' : 'none',
                  }}
                >
                  <VideoCard
                    className="w-100"
                    controls={false}
                    width={520}
                    height={300}
                    {...props}
                    src={props.video?.url}
                  />
                  <div className="video-card-buttons">
                    <ButtonBase
                      className="btns-icon theme-solid mx-2"
                      onClick={() => {
                        const uploader = document.querySelector(
                          '.dropzone-wrapper input[type="file"]',
                        );
                        if (uploader) uploader.click();
                      }}
                    >
                      <span className={SystemActionsEnum.upload.icon} />
                    </ButtonBase>
                    <ButtonBase
                      className="btns-icon theme-solid"
                      onClick={() => removeVideo(props.video?.uuid || '')}
                    >
                      <span className={SystemActionsEnum.delete.icon} />
                    </ButtonBase>
                  </div>
                </Col>
              )}
              {state.errors && state.errors.video_uuid ? (
                state.errors.video_uuid.length > 1 ? (
                  state.errors.video_uuid.map((error, index) => (
                    <p key={index} className="m-0 text-xs text-danger">
                      {error}
                    </p>
                  ))
                ) : (
                  <p className="m-o text-xs text-danger">{state.errors.video_uuid}</p>
                )
              ) : (
                ''
              )}
            </Row>
            {/* Bottom Section - OPEN or HIDDEN */}
            <Row className="mt-4">
              <Col xs="12">
                <h6 className="h6 text-bold-500">
                  {t(`${translationPath}question-type-description`)}
                </h6>
              </Col>
            </Row>
            <Row onMouseEnter={onPopperOpen}>
              <Col
                xs="12"
                sm="6"
                className="mb-3 p-3 border-l-4"
                styles={{ border: '1px' }}
              >
                <div
                  className={
                    props.type === '1' ? 'va-open-hidden-selected' : 'va-open-hidden'
                  }
                >
                  <Row className="p-3">
                    <Col>
                      <FormControlLabel
                        control={
                          <Radio
                            checked={props.type === '1'}
                            value="1"
                            onChange={handleRadioBChange}
                            name="checkedB"
                            color="primary"
                            disabled={
                              !props.canEdit
                            //   ||
                            // !getIsAllowedPermissionV2({
                            //   permissions,
                            //   permissionId:
                            //     CurrentFeatures.open_or_hidden.permissionsId,
                            // })
                            }
                          />
                        }
                        label={t(`${translationPath}open`)}
                      />
                      <p className="font-14">
                        {t(`${translationPath}applicant-open-note-description`)}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
              <Col xs="12" sm="6" className="mb-3 p-3">
                <div
                  className={
                    props.type === '0' ? 'va-open-hidden-selected' : 'va-open-hidden'
                  }
                >
                  <Row className="p-3">
                    <Col>
                      <FormControlLabel
                        control={
                          <Radio
                            value="0"
                            checked={props.type === '0'}
                            onChange={handleRadioBChange}
                            name="checkedB"
                            color="primary"
                            disabled={
                              !props.canEdit
                            //   ||
                            // !getIsAllowedPermissionV2({
                            //   permissions,
                            //   permissionId:
                            //     CurrentFeatures.open_or_hidden.permissionsId,
                            // })
                            }
                          />
                        }
                        label={t(`${translationPath}hidden`)}
                      />
                      <p className="font-14">
                        {t(`${translationPath}applicant-hidden-note-description`)}
                      </p>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </Card>
        ) : (
          <BarLoader />
        )}
      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};
export default BasicInfo;
