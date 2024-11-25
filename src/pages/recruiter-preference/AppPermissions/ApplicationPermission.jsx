/* eslint-disable no-shadow */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { getUniqueID } from '../../../shared/utils';
// Share Components
import {
  Input,
  Button,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  CardBody,
  Modal,
} from 'reactstrap';
// import QuestionCard from 'shared/components/QuestionCard';
import { useToasts } from 'react-toast-notifications';
import Loader from '../../../components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { commonAPI } from '../../../api/common';
import { preferencesAPI } from '../../../api/preferences';
import QuestionCard from '../Questionnaire/QuestionCard';
import Require from '../../evabrand/Require';
import { getErrorByName, showError } from '../../../helpers';
import {
  GetAllEvaRecPipelines,
  GetAllEvaRecPipelineStages,
} from '../../../services';
import { SharedAPIAutocompleteControl } from '../../setups/shared';
import * as yup from 'yup';

const translationPath = 'AppPermissions.';
const parentTranslationPath = 'RecruiterPreferences';

const AddCol = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  transition: 0.3s ease;
  &:hover {
    background: #e9ecef;
  }
`;
const I = styled.i`
  align-items: center;
  background-color: var(--bg-primary, #051274);
  border-radius: 999px;
  color: #fff;
  display: flex;
  height: 40px;
  justify-content: center;
  margin-right: 1rem;
  padding: 0.5rem;
  width: 40px;
`;

const ApplicationPermission = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts

  // Required Data
  // const user = JSON.parse(localStorage.getItem('user'))?.results;
  const [isWorking, setIsWorking] = useState(false);
  const [profileBuilder, setProfileBuilder] = useState(null);

  // Get Data
  const [data, setData] = useState();

  // Tabs
  const [currentTab, setCurrentTab] = useState('tab-1');

  const [title, setTitle] = useState(null);

  const [options, setOptions] = useState([]);
  const [response, setResponse] = useState(null);
  const [newResponse, setNewResponse] = useState(false);
  const [pipeline, setPipeline] = useState(null);
  const [stages, setStages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [fileTypes, setFileTypes] = useState([]);
  const [fileSizes, setFileSizes] = useState([]);
  const [errors, setErrors] = useState();
  const [requirementsErrors, setRequirementsErrors] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = useRef(
    yup.object().shape({
      dynamic_properties: yup
        .array()
        .of(
          yup.object().shape({
            uuid: yup
              .string()
              .nullable()
              .when('value', (value, field) =>
                value ? field.required(t('Shared:this-field-is-required')) : field,
              ),
          }),
        )
        .nullable(),
    }),
  );
  /**
   * Mapping Function => question ID with corresponding Type
   * @param {*} questions
   * @note Application permission API acceept type as string
   */
  const questionID = (questions) => {
    if (questions.length === 0) return questions;

    for (let i = 0; i <= questions.length; i += 1)
      if (questions[i] && questions[i].type === 1) questions[i].type = 'text';

    return questions;
  };

  const getActivePipelineByUUID = useCallback(
    async (uuid) => {
      const response = await GetAllEvaRecPipelineStages({ uuid });
      if (response && response.status === 200)
        setStages(response.data.results.stages);
      else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t],
  );

  /**
   * Get Specific Permission Data
   * @return {Object}
   * @note Get Specific Permission Data from permissions list instead of using another API
   * @param uuid
   */
  // const getPermissionData = (uuid) => {
  //   for (let i = 0; i < props.permission.length; i++)
  //     if (props.permission[i].uuid === uuid) return props.permission[i];
  // };

  useEffect(() => {
    if (data) return;
    setIsWorking(true);
    const getData = async () => {
      preferencesAPI
        .getPermissionOptions()
        .then((res) => {
          setResponse(res.data?.results);
          setOptions(Object.keys(res.data?.results));
          setData(Object.values(res.data?.results));
          setIsWorking(false);
        })
        .catch((error) => {
          setIsWorking(false);

          showError(t(`${translationPath}error-in-getting-data`), error);
        });
    };
    if (props.uuid)
      preferencesAPI
        .FindPermission(props.uuid)
        .then((res) => {
          setProfileBuilder(res.data?.results);
          setResponse(res.data?.results?.profile);
          setOptions(Object.keys(res.data?.results?.profile));
          setData(Object.values(res.data?.results?.profile));
          setTitle(res.data?.results?.title);
          setQuestions(res.data?.results?.questions || []);
          setPipeline(res.data?.results?.pipeline_uuid);
          setIsWorking(false);
        })
        .catch((error) => {
          setIsWorking(false);

          showError(t(`${translationPath}error-in-getting-data`), error);
        });
    else {
      setTitle(null);
      setPipeline(null);
      getData();
    }
  }, []);

  /**
   *  This will retrieve the list of pipelines, evaluations and templates
   *  from their respective APIs during the Effect hook.
   */
  useEffect(() => {
    // eslint-disable-next-line no-shadow
    commonAPI.getFileTypes().then((response) => {
      setFileTypes(response.data.results);
      // eslint-disable-next-line no-shadow
      commonAPI.getFileSizes().then((response) => {
        setFileSizes(response.data.results);
      });
    });
  }, []);

  /**
   * Effect to get the list of stages from API, after select a pipeline
   */
  useEffect(() => {
    if (pipeline) getActivePipelineByUUID(pipeline);
  }, [pipeline, getActivePipelineByUUID]);

  /**
   * Function to handle file and yes_no questions
   * @note transform questions data to match the response structure in create application permission API
   */
  const transformQuestions = () => {
    for (let i = 0; i < questions.length; i += 1) {
      if (questions[i].type === 'file') {
        questions[i].file_data = {
          file_size: questions[i].fileAnswer?.file_size || '1',
          file_type: questions[i].fileAnswer?.file_type || '2',
        };
        delete questions[i].fileAnswer;
      }
      delete questions[i].uuid;
    }
    return questions;
  };
  // Update || Create Application Permission
  const updateData = async () => {
    setIsSubmitted(true);
    if (Object.keys(requirementsErrors || {}).length > 0) return;
    const copy = questions.map((object) => ({ ...object }));
    setIsWorking(true);
    questionID(questions);
    const questionsData = transformQuestions();
    // If action is create new Permission
    if (props.uuid === null) {
      let params = {
        title,
        pipeline_uuid: pipeline,
        ...newResponse,
        questions: questionsData,
      };
      // If there is no change in fields => take the default value
      if (!newResponse)
        params = {
          title,
          pipeline_uuid: pipeline,
          ...response,
          questions: questionsData,
        };

      preferencesAPI
        .CreatePermission(params)
        .then(() => {
          window?.ChurnZero?.push([
            'trackEvent',
            'Create application requirements',
            'Create application requirements from recruiter preferences',
            1,
            {},
          ]);

          addToast(t(`${translationPath}created-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setIsWorking(false);
          if (props.onSave) props.onSave();
          props.closeModal();
        })
        .catch((error) => {
          setQuestions(copy);

          showError(t(`${translationPath}creating-requirement-failed`), error);
          setIsWorking(false);
          setErrors(error?.response?.data?.errors);
        });
      // If action is Update Permission
    } else {
      let params = {
        title,
        uuid: props.uuid,
        pipeline_uuid: pipeline,
        ...newResponse,
        questions: questionsData,
      };
      if (!newResponse)
        params = {
          title,
          uuid: props.uuid,
          pipeline_uuid: pipeline,
          ...response,
          questions: questionsData,
        };

      preferencesAPI
        .UpdatePermission({
          ...params,
          language_uuid: null,
        })
        .then(() => {
          addToast(t(`${translationPath}updated-successfully`), {
            appearance: 'success',
            autoDismiss: true,
          });
          setIsWorking(false);
          if (props.onSave) props.onSave();
          props.closeModal();
        })
        .catch((error) => {
          setQuestions(copy);

          showError(t(`${translationPath}error-in-updating-data`), error);

          setIsWorking(false);
          setErrors(error?.response?.data?.errors);
        });
    }
  };
  const getErrors = useCallback(() => {
    newResponse
      && getErrorByName(schema, newResponse || {}).then((result) => {
        setRequirementsErrors(result);
      });
  }, [newResponse]);
  // Questionnaire Tab
  const addQuestion = () => {
    setQuestions((items) => [
      ...items,
      {
        description: '',
        title: '',
        type: 1,
        order: questions.length,
        is_required: false,
        is_other: false,
        uuid: getUniqueID(),
      },
    ]);
  };

  const updateQuestion = (idToUpdate, newQuestion) => {
    setQuestions((items) => [
      ...items.map((q) => {
        if (q.uuid === idToUpdate) return newQuestion;
        return q;
      }),
    ]);
  };

  /**
   * Remove question
   * @param {*} questionToRemove
   */
  const removeQuestion = (questionToRemove) => {
    setQuestions((questions) => [
      ...questions.filter((q) => q.uuid !== questionToRemove.uuid),
    ]);
  };

  const duplicateQuestion = (questionToDuplicate) => {
    setQuestions((questions) => [
      ...questions,
      { ...questionToDuplicate, uuid: getUniqueID() },
    ]);
  };
  useEffect(() => {
    getErrors();
  }, [getErrors, newResponse]);
  return (
    <>
      <Modal
        style={{ maxWidth: '1000px' }}
        className="modal-dialog-centered sticky-modal"
        isOpen
        toggle={() => props.closeModal()}
      >
        {/* Header */}
        <div className="modal-header border-0 pb-0 mb-2">
          <div className="ml-4-reversed w-100">
            <div className="d-flex align-items-center">
              <h1 className="mb-0 mr-2-reversed">
                {props.uuid
                  ? t(`${translationPath}edit-new-application-requirement`)
                  : t(`${translationPath}add-new-application-requirement`)}
              </h1>
            </div>
          </div>

          <button
            aria-label="Close"
            className="close"
            data-dismiss="modal"
            type="button"
            onClick={() => props.closeModal()}
          >
            <span aria-hidden>×</span>
          </button>
        </div>

        {/* Body */}

        <div className="modal-body px-5 pb-0">
          <Row className="mb-4">
            <Col xs="6">
              <Input
                className="form-control-alternative"
                type="text"
                value={title || ''}
                placeholder={t(`${translationPath}requirement-title`)}
                required
                onChange={(e) => {
                  const { value } = e.currentTarget;
                  setTitle(value);
                }}
              />
              {errors && errors.title && !title ? (
                errors.title.length > 1 ? (
                  errors.title.map((error, key) => (
                    <p
                      key={`errorsTitlesKey${key + 1}`}
                      className="mb-0 mt-1 text-xs text-danger"
                    >
                      {error}
                    </p>
                  ))
                ) : (
                  <p className="mb-0 mt-1 text-xs text-danger">{errors.title}</p>
                )
              ) : (
                ''
              )}
            </Col>
            {(!props.uuid || (profileBuilder && !profileBuilder.is_default)) && (
              <SharedAPIAutocompleteControl
                isHalfWidth
                title="select-a-pipeline"
                stateKey="pipeline"
                errorPath="pipeline"
                searchKey="search"
                placeholder="select-a-pipeline"
                editValue={pipeline}
                // isSubmitted={isSubmitted}
                isDisabled={isWorking}
                // errors={stateErrors}
                onValueChanged={({ value }) => {
                  setPipeline(value);
                  setQuestions((items) => {
                    let newItems = [];

                    if (items && items.length > 0)
                      newItems = items.map((item) => ({
                        ...item,
                        answers:
                          typeof item.answers !== 'undefined' && item.answers
                            ? item.answers?.map((el) => ({
                              ...el,
                              stage_uuid: null,
                            }))
                            : [],
                      }));

                    return [...newItems];
                  });
                }}
                getDataAPI={GetAllEvaRecPipelines}
                extraProps={{
                  ...(pipeline && { with_than: [pipeline] }),
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              // <Col xs="6">
              //   {/* PIPELINE DROPDOWN */}
              //   <AutocompleteComponent
              //     data={pipelineList || []}
              //     themeClass="theme-solid"
              //     inputLabel={t(`${translationPath}`)}
              //     inputPlaceholder={t(`${translationPath}select-a-pipeline`)}
              //     value={
              //       pipelineList?.find((item) => item.uuid === pipeline) || null
              //     }
              //     getOptionLabel={(option) => option.title || ''}
              //     isOptionEqualToValue={(option, value) => option.uuid === value.uuid}
              //     onChange={(event, newValue) => {
              //       setPipeline((newValue && newValue.uuid) || null);
              //
              //     }}
              //   />
              // </Col>
            )}
          </Row>

          <Nav tabs className="tabs-with-actions">
            <NavItem>
              <NavLink
                className="py-2"
                active={currentTab === 'tab-1'}
                onClick={() => setCurrentTab('tab-1')}
              >
                {t(`${translationPath}general`)}
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink
                className="py-2"
                active={currentTab === 'tab-2'}
                onClick={() => setCurrentTab('tab-2')}
              >
                {t(`${translationPath}special-requirements`)}
              </NavLink>
            </NavItem>
          </Nav>

          {isWorking ? (
            <CardBody className="text-center">
              <Row>
                <Col xl="12">
                  <Loader width="730px" height="49vh" speed={1} color="primary" />
                </Col>
              </Row>
            </CardBody>
          ) : (
            <TabContent activeTab={currentTab}>
              <TabPane className="pt-4" key="tab-1" tabId="tab-1">
                {data
                  && options.map((o, i) => (
                    <Require
                      title={title}
                      response={response}
                      setNewResponse={(value) => {
                        setNewResponse(value);
                      }}
                      ProfileUUID={props.uuid}
                      options={o}
                      label={data[i]}
                      key={`currentTabRequire${i + 1}`}
                      isSubmitted={isSubmitted}
                      errors={requirementsErrors}
                      isForJobs={true}
                    />
                  ))}
              </TabPane>
              <TabPane className="py-4" key="tab-2" tabId="tab-2">
                {questions
                  && questions.length > 0
                  && questions.map((q, i) => (
                    <QuestionCard
                      question={q}
                      key={q.uuid}
                      index={i + 1}
                      updateQuestion={updateQuestion}
                      removeQuestion={removeQuestion}
                      duplicateQuestion={duplicateQuestion}
                      setNewQuestions={(value) => {
                        setQuestions(value);
                      }}
                      isEdit={(props.uuid && true) || false}
                      profileBuilder={profileBuilder}
                      stages={stages.filter((a) => a.type !== 1)}
                      fileTypes={fileTypes}
                      fileSizes={fileSizes}
                    />
                  ))}
                <AddCol onClick={addQuestion}>
                  <I className="fas fa-plus mr-3-reversed" />
                  <span>{t(`${translationPath}add-new-question`)}</span>
                </AddCol>
              </TabPane>
            </TabContent>
          )}

          <div className="modal-footer border-0 d-flex justify-content-center">
            <Button
              className="btn btn-icon mr-2-reversed"
              color="secondary"
              data-dismiss="modal"
              type="button"
              onClick={() => props.closeModal()}
            >
              {t(`${translationPath}cancel`)}
            </Button>
            <Button
              className="btn btn-primary btn-icon"
              color="primary"
              type="submit"
              disabled={isWorking}
              onClick={updateData}
            >
              {isWorking && (
                <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
              )}
              {`${
                isWorking
                  ? t(`${translationPath}saving`)
                  : t(`${translationPath}save-changes`)
              }`}
            </Button>
          </div>
        </div>
        {/* )} */}
      </Modal>
    </>
  );
};

export default ApplicationPermission;
