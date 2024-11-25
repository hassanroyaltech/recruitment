/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prop-types */
/**
 * ----------------------------------------------------------------------------------
 * @title InviteCandidate.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the top card in the final step of the EvassessStepper.
 *
 * This is where we invite a candidate manually, or by csv, and where
 * we can select a deadline for the assessment.
 * ----------------------------------------------------------------------------------
 */
import React, { useState, useCallback, useEffect, useRef } from 'react';
import CandidateCard from '../../../pages/evassess/create/CandidateCard';
import { preferencesAPI } from '../../../api/preferences';
import { commonAPI } from '../../../api/common';
import TextField from '@mui/material/TextField';
import Helpers from '../../../utils/Helpers';
import Loader from '../../../components/Elevatus/Loader';
// Import the candidate card
import csvExample from '../../../assets/files/invite-candidates-template.csv';
import { Button, Card, Col, Row } from 'reactstrap';
import { ButtonBase, Collapse, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import moment from 'moment';
import Alert from '@mui/material/Alert';
import CloseIcon from '@mui/icons-material/Close';
import { UploaderPageEnum } from '../../../enums/Pages/UploaderPage.Enum';
import {
  LoaderComponent,
  TextEditorComponent,
  UploaderComponent,
} from '../../../components';
import {
  getIsAllowedPermissionV2,
  getIsAllowedSubscription,
  GlobalDateFormat,
  GlobalSavingDateFormat,
} from '../../../helpers';
import { SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import { ManageAssessmentsPermissions } from '../../../permissions';
import DatePickerComponent from '../../../components/Datepicker/DatePicker.Component';
import i18next from 'i18next';

/**
 * InviteCandidate class component
 */
const translationPath = 'InviteCandidateComponent.';
const InviteCandidate = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const editorRef = useRef(null);
  // Encapsulated state in constructor because ESLINT does not like it otherwise.
  const [state, setState] = useState(() => ({
    type: 'manual',
    email_loader: false,
    uploaded: false,
    show_datepicker: false,
    dateError: false,
    privacy: props.privacy,
    emailSubject: props.emailSubject,
    emailBody: props.emailBody,
    user: JSON.parse(localStorage.getItem('user'))?.results,
    file: props.candidatesFromCSV,
  }));
  const [isDeletedLoading, setIsDeletingLoading] = useState(true);
  const emailBodyRef = useRef(null);
  const [dateWarningOpen, setDateWarningOpen] = useState(false);
  const [datePlaceHolder, setDatePlaceHolder] = useState(null);
  // Return JSX
  const { emailVariables } = props;
  // Get template via Axios
  const getTemplate = useCallback(async () => {
    setState((items) => ({
      ...items,
      email_loader: true,
    }));
    preferencesAPI
      .getTemplateBySlug('candidate_invite', props.language)
      .then((res) => {
        setState((items) => ({
          ...items,
          email_loader: false,
        }));
        setState((items) => ({
          ...items,
          emailSubject: res.data.results.translation.subject,
          emailBody: res.data.results.translation.body,
        }));
        props.setEmailSubject(res.data.results.translation.subject);
        props.onEmailBodyChanged(res.data.results.translation.body);

        // res.data.results.translation.map((element) => {
        //   if (element.language.id === props.language) {
        //     if (!props.emailSubject) props.setEmailSubject(element.subject);
        //     if (!props.emailBody) props.onEmailBodyChanged(element.body);

        //     if (!props.emailSubject)
        //       setState((items) => ({ ...items, emailSubject: element.subject }));

        //     if (!props.emailBody)
        //       setState((items) => ({ ...items, emailBody: element.body }));
        //   }
        //   return undefined;
        // });
      })
      .catch((err) => {
        setState((items) => ({
          ...items,
          error: err?.errors,
        }));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.language]);
  // After component mounting
  useEffect(() => {
    if (!props.uuid) getTemplate();
  }, [getTemplate, props.uuid]);

  // handler to change a date
  const handleDateChange = (date) => {
    props.setDate(date);
  };

  // handler to change privacy settings
  const handlePrivacyChange = (value) => {
    props.setPrivacy(value);
  };

  // handler to set candidates
  const handleSetCandidates = (newValue, index) => {
    props.setCandidates(newValue, index);
  };

  // Handler to remove a CSV file
  const handleRemoveCSV = (uuid) => {
    setState((items) => ({
      ...items,
      deleted: true,
      uploaded: false,
    }));
    commonAPI
      .deleteMedia({
        uuid,
      })
      .then(({ data }) => {
        setState((items) => ({
          ...items,
          deleted: false,
          file: '',
        }));
        props.setCandidatesFromCSV(null);
        props.setSelectedCSV_file([]);
      });
  };

  // Handler to add annotations
  const handleAddAnnotation = (annotation) => {
    // if (!window.tinymce || !annotation) return;
    // window.tinymce.get('editor-1').insertContent(annotation);
    if (!editorRef.current || !annotation) return;
    {
      editorRef.current.html.insert(annotation, true);
      editorRef.current.undo.saveStep();
    }
  };

  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );

  useEffect(() => {
    if (
      !getIsAllowedPermissionV2({
        permissions,
        permissionId: ManageAssessmentsPermissions.ExtendDeadline.key,
      })
    ) {
      const date = new Date();
      handleDateChange(moment(date).add(7, 'd').format('YYYY-MM-DD'));
    }
  }, [handleDateChange, permissions]);

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  const listOfCards = (props.candidates || []).map((option, index) => (
    <React.Fragment key={`cardNumberKey${index + 1}`}>
      {index > 0 && <hr className="my-4" />}
      <CandidateCard
        number={index}
        setCandidates={handleSetCandidates}
        candidateValue={props.candidates[index]}
        parentTranslationPath={props.parentTranslationPath}
        translationPath={translationPath}
        candidates={props.candidates}
        addCandidate={props.addCandidate}
        removeCandidate={() => {
          props.removeCandidate(index);
          setIsDeletingLoading(false);
          setTimeout(() => {
            setIsDeletingLoading(true);
          }, 400);
        }}
      />
    </React.Fragment>
  ));

  useEffect(() => {
    const date = new Date();
    const deadline = new Date(props.date);

    if (deadline < date) {
      setDateWarningOpen(true);
      setDatePlaceHolder(props.date);
      handleDateChange('');
    }
  }, []);

  return (
    <>
      <Card className="step-card">
        <div>
          <h6 className="h6 font-weight-500">
            {t(`${translationPath}add-Applicant`)}
          </h6>
        </div>
        <div className="mt-3">
          <div className="h6 font-weight-normal" style={{ color: '#899298' }}>
            {t(`${translationPath}add-applicant-description`)}
            <a
              className="text-primary px-1"
              href={csvExample}
              target="_blank"
              rel="noreferrer"
            >
              {t(`${translationPath}download`)}
            </a>
            <span className="px-1">
              {t(`${translationPath}download-description`)}
            </span>
          </div>
        </div>
        <UploaderComponent
          idRef="inviteCandidateUploader"
          uploaderPage={UploaderPageEnum.EvaSSESSInviteCandidate}
          dropHereText={`${t('Shared:drop-here-max')} ${
            UploaderPageEnum.EvaSSESSInviteCandidate.maxFileNumber
          } ${t('Shared:file-bracket')}`}
          isDisabled={
            !getIsAllowedPermissionV2({
              permissions,
              permissionId: ManageAssessmentsPermissions.ManageAttachments.key,
            })
          }
          uploadedFiles={props.selectedCSV_file}
          labelValue="upload-CSV-file"
          parentTranslationPath={props.parentTranslationPath}
          translationPath={translationPath}
          uploadedFileChanged={(newFiles) => {
            props.setSelectedCSV_file(newFiles);
            props.setCandidatesFromCSV(
              (newFiles && newFiles.length > 0 && newFiles[0]) || null,
            );
          }}
        />
        <div className="mt-3">
          {(state.uploaded || props.candidatesFromCSV) && (
            <Col className="col-xl-5">
              <p className="text-success">
                <span>
                  {t(`${translationPath}file-upload-successfully-description`)}
                </span>
                <a
                  className="text-primary px-1"
                  href={`${Helpers.DOWNLOAD}?file=${props.candidatesFromCSV?.url}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-download fa-xs" />
                </a>
                <span className="px-1">|</span>
                <ButtonBase
                  className="btns-icon c-danger"
                  onClick={() => handleRemoveCSV(props.candidatesFromCSV?.uuid)}
                >
                  <i className="fas fa-trash fa-xs text-danger" />
                </ButtonBase>
              </p>
            </Col>
          )}
        </div>
        <div className="mt-4">
          <h6 className="h6 font-weight-500 pb-2">{t(`${translationPath}or`)}</h6>
          <p className="h6 font-weight-normal" style={{ color: '#899298' }}>
            {t(`${translationPath}you-can-add-applicants-manually`)}
          </p>
        </div>
        <div className="mt-3">
          {isDeletedLoading ? (
            listOfCards
          ) : (
            <LoaderComponent
              isLoading={!isDeletedLoading}
              isSkeleton
              skeletonItems={[
                { variant: 'rectangular' },
                { variant: 'rectangular' },
                { variant: 'rectangular' },
              ]}
            />
          )}
        </div>
        <hr />
        <Row className="my-2">
          <Col xs="6" lg="3" xl="3" onMouseEnter={onPopperOpen}>
            {!state.show_datepicker && (
              <Button
                color="secondary"
                id="deadline-selector"
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.ExtendDeadline.key,
                  })
                }
                className="text-gray form-control-alternative font-weight-normal w-100"
                onClick={() =>
                  setState((items) => ({
                    ...items,
                    show_datepicker: !state.show_datepicker,
                  }))
                }
              >
                <div className="d-flex flex-row justify-content-between align-items-center w-100">
                  {datePlaceHolder
                    || props.date
                    || t(`${translationPath}select-deadline`)}
                  <i className="fa fa-chevron-down" />
                </div>
              </Button>
            )}
            {state.show_datepicker && (
              <DatePickerComponent
                datePickerWrapperClasses="px-0"
                inputPlaceholder={`${t('Shared:eg')} ${moment()
                  .locale(i18next.language)
                  .format(GlobalSavingDateFormat)}`}
                isDisabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageAssessmentsPermissions.ExtendDeadline.key,
                  })
                }
                value={props.date || ''}
                maxDate={undefined}
                minDate={moment().toDate()}
                onDelayedChange={(date) => {
                  handleDateChange(date.value);
                  setDateWarningOpen(false);
                  setDatePlaceHolder(null);
                  setState((items) => ({
                    ...items,
                    show_datepicker: false,
                    value: date.value,
                  }));
                }}
                parentTranslationPath={props.parentTranslationPath}
                translationPath={translationPath}
                displayFormat={GlobalSavingDateFormat}
              />
            )}
          </Col>
        </Row>
        <Row className="my-3 ml-2-reversed">
          <Collapse in={dateWarningOpen}>
            <Alert
              action={
                <IconButton
                  size="small"
                  color="inherit"
                  aria-label="close"
                  onClick={() => setDateWarningOpen(false)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
              severity="warning"
            >
              {t(`${translationPath}the-deadline-is-past-due`)}
            </Alert>
          </Collapse>
        </Row>
      </Card>

      <Card className="step-card">
        <h6 className="h6 font-weight-500">
          {t(`${translationPath}privacy-setup`)}
        </h6>
        <div className="mt-3 h6 font-weight-normal" style={{ color: '#899298' }}>
          {t(`${translationPath}can-view-description`)}
        </div>
        <div className="mt-4 mb-2">
          {/* PIPELINE DROPDOWN */}
          <TextField
            id="select-evaluation"
            label={t(`${translationPath}privacy-setting`)}
            variant="outlined"
            select
            className="form-control-alternative w-100"
            name="selectPipeline"
            onChange={(e) => {
              const {
                target: { value },
              } = e;
              setState((items) => ({ ...items, privacy: value }));
              handlePrivacyChange(value);
            }}
            value={state.privacy}
            SelectProps={{
              native: true,
              displayEmpty: true,
            }}
          >
            <option value="private">
              {t(`${translationPath}only-people-description`)}
            </option>
            <option value="public">
              {t(`${translationPath}anyone-description`)}
            </option>
          </TextField>
        </div>
      </Card>

      <Card className="step-card">
        {state.email_loader ? (
          <Loader />
        ) : (
          <>
            <h6 className="h6 font-weight-500">{t(`${translationPath}email`)}</h6>
            <div>
              <div className="d-inline-flex w-50 w-ps-100 pr-2-reversed mb-2 mt-3">
                <TextField
                  id="email-annotations-editor-1"
                  label={t(`${translationPath}email-subject`)}
                  className="form-control-alternative w-100"
                  variant="outlined"
                  type="text"
                  placeholder={t(`${translationPath}email-subject-description`)}
                  onChange={(e) => {
                    const { value } = e.target;
                    props.setEmailSubject(value);
                    setState((items) => ({
                      ...items,
                      emailSubject: value,
                    }));
                  }}
                  value={state.emailSubject}
                  SelectProps={{
                    native: true,
                    displayEmpty: true,
                  }}
                >
                  {/* This enables reset of field */}
                  <option>{t(`${translationPath}email-annotations`)}</option>
                  {emailVariables.map((v, index) => (
                    <option
                      value={v}
                      key={`emailAnnotationsVariablesKeys${index + 1}`}
                    >
                      {v}
                    </option>
                  ))}
                </TextField>
              </div>
              <div className="d-inline-flex w-50 w-ps-100 pl-2-reversed mb-2">
                <TextField
                  id="email-annotations-editor-1"
                  className="form-control-alternative w-100"
                  variant="outlined"
                  select
                  onChange={(e) => handleAddAnnotation(e.currentTarget.value)}
                  defaultValue={
                    props.evaluation
                      ? props.evaluation
                      : t(`${translationPath}please-select-an-evaluation`)
                  }
                  SelectProps={{
                    native: true,
                    displayEmpty: true,
                  }}
                >
                  {/* This enables reset of field */}
                  <option>{t(`${translationPath}email-annotations`)}</option>
                  {emailVariables.map((v, index) => (
                    <option value={v} key={`emailVariablesKeys${index + 1}`}>
                      {v}
                    </option>
                  ))}
                </TextField>
              </div>
            </div>
            <div className="mt-4">
              <h6 className="h6 font-weight-500">
                {t(`${translationPath}email-body`) + '*'}
              </h6>
            </div>
            <div className="mt-3">
              <TextEditorComponent
                idRef="editor-1"
                key="editor-1"
                editorValue={state.emailBody || ''}
                onInit={(current) => (editorRef.current = current)}
                onEditorChange={(content) => {
                  setState((items) => ({
                    ...items,
                    emailBody: content,
                  }));
                  if (emailBodyRef.current) clearTimeout(emailBodyRef.current);
                  // reduce the cpu useage if user type fast
                  emailBodyRef.current = setTimeout(() => {
                    props.onEmailBodyChanged(content);
                  }, 300);
                }}
                height={500}
              />
              {/*<Editor*/}
              {/*  id="editor-1"*/}
              {/*  key="editor-1"*/}
              {/*  value={state.emailBody || ''}*/}
              {/*  init={{*/}
              {/*    height: 500,*/}
              {/*    plugins: [*/}
              {/*      'advlist autolink lists link image preview anchor',*/}
              {/*      'searchreplace code',*/}
              {/*      'insertdatetime media paste code wordcount',*/}
              {/*    ],*/}
              {/*    toolbar:*/}
              {/*      // Fixed format because multiline comments only work*/}
              {/*      // on ES5-supported browsers.*/}
              {/*      'formatselect '*/}
              {/*      + '| bold italic backcolor '*/}
              {/*      + '| alignleft aligncenter alignright alignjustify '*/}
              {/*      + '| bullist numlist outdent indent '*/}
              {/*      + '| removeformat',*/}
              {/*    branding: false,*/}
              {/*  }}*/}
              {/*  onEditorChange={(content) => {*/}
              {/*    setState((items) => ({*/}
              {/*      ...items,*/}
              {/*      emailBody: content,*/}
              {/*    }));*/}
              {/*    if (emailBodyRef.current) clearTimeout(emailBodyRef.current);*/}
              {/*    // reduce the cpu useage if user type fast*/}
              {/*    emailBodyRef.current = setTimeout(() => {*/}
              {/*      props.onEmailBodyChanged(content);*/}
              {/*    }, 300);*/}
              {/*  }}*/}
              {/*/>*/}
            </div>
            <div className="form-item mt-3">
              <UploaderComponent
                uploaderPage={UploaderPageEnum.AssessmentAttachment}
                uploadedFiles={props.emailAttachments}
                labelValue="upload-attachments"
                parentTranslationPath="Shared"
                uploadedFileChanged={(newFiles) => {
                  props.onEmailAttachmentsChanged(newFiles);
                }}
              />
            </div>
          </>
        )}
      </Card>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};
export default InviteCandidate;
