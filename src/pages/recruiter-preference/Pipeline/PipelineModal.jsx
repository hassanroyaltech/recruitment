import React, { useState, useEffect } from 'react';
import axios from 'api/middleware';
import RecuiterPreference from 'utils/RecuiterPreference';

// reactstrap components
import { Button, Row, Col } from 'reactstrap';

// Forms Validation
import { Formik, Form, ErrorMessage } from 'formik';
import { ErrorWrapper } from 'shared/FormValidations';

// Toasts
import { useToasts } from 'react-toast-notifications';

import { generateHeaders } from 'api/headers';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';
import i18next from 'i18next';
import { StyledModal } from '../PreferenceStyles';
import { showError } from '../../../helpers';

const translationPath = 'Pipeline.';
const parentTranslationPath = 'RecruiterPreferences';

const PipelineModal = (props) => {
  const { t } = useTranslation(parentTranslationPath);
  const { addToast } = useToasts(); // Toasts
  const user = JSON.parse(localStorage.getItem('user'))?.results;

  const [pipelineTitle, setPipelineTitle] = useState('');
  const [pipelineLanguage, setPipelineLanguage] = useState(user?.language[0].id);
  useEffect(() => {}, [pipelineLanguage]);

  const addPipeline = async () => {
    setIsWorking(true);
    await axios
      .post(
        RecuiterPreference.pipelines_WRITE,
        {
          title: pipelineTitle,
          language_id: pipelineLanguage,
        },
        {
          headers: generateHeaders(),
        },
      )
      .then((res) => {
        window?.ChurnZero?.push([
          'trackEvent',
          'Create a new pipeline',
          'Creating a new pipeline from add pipeline in recruiter preferences',
          1,
          {},
        ]);
        setIsWorking(false);
        props.view(res?.data?.results?.uuid);
        addToast(t(`${translationPath}pipeline-added-successfully`), {
          appearance: 'success',
          autoDismiss: true,
        });
        props.getPipeline();
      })
      .catch((error) => {
        setIsWorking(false);

        showError(t(`${translationPath}error-in-adding-pipeline`), error);
      });
  };

  // Spinner
  const [isWorking, setIsWorking] = useState(false);
  return (
    <>
      <StyledModal
        className="modal-dialog-centered"
        size="md"
        isOpen={props.isOpen}
        toggle={() => props.closeModal()}
      >
        <div className="modal-header border-0">
          <h3 className="modal-title">{t(`${translationPath}new-pipeline`)}</h3>
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
        <Formik
          enableReinitialize
          initialValues={{
            pipelineName: pipelineTitle,
          }}
          validationSchema={Yup.object().shape({
            pipelineName: Yup.string()
              .min(3, t(`${translationPath}pipeline-name-min-description`))
              .max(50, t(`${translationPath}pipeline-name-max-description`))
              .required(),
          })}
          onSubmit={() => {
            addPipeline();
          }}
        >
          {({ errors }) => (
            <Form>
              <div className="modal-body pb-0">
                {!props.data && (
                  <>
                    <Row>
                      <Col xl={6} lg={6} md={6} xs={12} className="mb-3">
                        {/* PIPELINE NAME */}
                        <TextField
                          id="pipelineName"
                          label={t(`${translationPath}pipeline-name`)}
                          variant="outlined"
                          className="form-control-alternative w-100"
                          name="pipelineName"
                          type="text"
                          onChange={(e) => {
                            setPipelineTitle(e.currentTarget.value);
                          }}
                          value={pipelineTitle}
                          required
                        />
                        <ErrorMessage component={ErrorWrapper} name="pipelineName" />
                      </Col>

                      <Col xl={6} lg={6} md={6} xs={12} className="mb-3">
                        {/* LANGUAGE DROPDOWN */}
                        <TextField
                          id="select-pipeline"
                          label={t(`${translationPath}select-a-language`)}
                          variant="outlined"
                          select
                          className="form-control-alternative w-100"
                          name="selectPipeline"
                          placeholder={t(
                            `${translationPath}input-language-stage-names`,
                          )}
                          value={pipelineLanguage}
                          onChange={(e) => {
                            setPipelineLanguage(e.currentTarget.value);
                          }}
                          SelectProps={{
                            native: true,
                            displayEmpty: true,
                            // defaultValue: 'Select a pipeline',
                          }}
                        >
                          {/* This enables reset of field */}
                          <option value="" />
                          {user?.language.map((language, i) => (
                            <option key={`${i + 1}-languages`} value={language.id}>
                              {language.translation[i18next.language]}
                            </option>
                          ))}
                        </TextField>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
              <div className="modal-footer justify-content-center border-0">
                <Button
                  className="btn btn-primary btn-icon float-right"
                  color="primary"
                  type="submit"
                  disabled={isWorking}
                >
                  {isWorking && (
                    <i className="fas fa-circle-notch fa-spin mr-2-reversed" />
                  )}
                  {`${
                    isWorking
                      ? t(`${translationPath}adding-new-pipeline`)
                      : t(`${translationPath}save-and-continue`)
                  }`}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </StyledModal>
    </>
  );
};

export default PipelineModal;
