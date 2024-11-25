import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Card from '@mui/material/Card';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../setups/shared';
import { DialogComponent } from '../../../../../../../../components';
import {
  GetAllEvaRecPipelineTeams,
  ShareEvaRecCandidateProfile,
} from '../../../../../../../../services';
import { DynamicFormTypesEnum } from '../../../../../../../../enums';
import { VitallyTrack } from '../../../../../../../../utils/Vitally';

const parentTranslationPath = 'EvaRecPipelines';
const translationPath = 'ShareProfileDialog.';

export const ShareProfileDialog = ({
  jobUUID,
  isOpen,
  isOpenChanged,
  selectedCandidates,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const [copyMode] = useState(false);

  const stateInitRef = useRef({
    recruiters: [],
    job_candidates: [],
    message: '',
    link: '',
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    let response;
    if (jobUUID && selectedCandidates?.length)
      response = await ShareEvaRecCandidateProfile({
        ...state,
        recruiters: state.recruiters,
        job_uuid: jobUUID,
      });
    else response = await ShareEvaRecCandidateProfile({ state });
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 202)) {
      // if (response.data?.results?.url) {
      //   setCopyMode(true);
      //   onStateChanged({ id: 'link', value: response.data.results.url });
      // }
      VitallyTrack('EVA-REC - Share Candidate');
      window?.ChurnZero?.push([
        'trackEvent',
        'EVA-REC - Share candidate profile',
        'Share candidate profile from EVA-REC',
        1,
        {},
      ]);
      isOpenChanged();
      showSuccess(t(`${translationPath}candidates-shared-successfully`));
    } else showError(t(`${translationPath}candidates-share-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      recruiters: yup
        .array()
        .nullable()
        .min(
          1,
          `${t(`${translationPath}please-select-at-least`)} ${1} ${t(
            `${translationPath}recruiter`,
          )}`,
        ),
      message: yup
        .string()
        .nullable()
        .required(t(`${translationPath}this-field-is-required`)),
    });
  }, [jobUUID, t]);

  useEffect(() => {
    if (selectedCandidates)
      onStateChanged({
        id: 'job_candidates',
        value: selectedCandidates,
      });
  }, [selectedCandidates]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="share-profile"
      contentClasses="px-0"
      dialogContent={
        <div>
          {copyMode ? (
            <CopyToClipboard
              text={state.link}
              onCopy={() => showSuccess('link-successfully-copied')}
            >
              <Card className="d-flex flex-row align-items-center justify-content-between mb-2 p-2">
                <div className="flex-grow-1 d-flex flex-row overflow-hidden">
                  <div className="text-gray">{t(`${translationPath}link`)}</div>
                  <div
                    className="ml-2-reversed text-black w-100"
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {state.link}
                  </div>
                </div>
                <div
                  className="text-gray mx-3 btn-clip"
                  data-clipboard-demo=""
                  data-clipboard-target="#foo"
                >
                  <i className="far fa-clone" style={{ cursor: 'pointer' }} />
                </div>
              </Card>
            </CopyToClipboard>
          ) : (
            <>
              <SharedAPIAutocompleteControl
                isFullWidth
                title="recruiters"
                stateKey="recruiters"
                placeholder="select-recruiters"
                isDisabled={isLoading}
                onValueChanged={(newValue) =>
                  onStateChanged({
                    id: 'recruiters',
                    value: newValue?.value || [],
                  })
                }
                // searchKey="search"
                uniqueKey="value"
                errorPath="recruiters"
                getDataAPI={GetAllEvaRecPipelineTeams}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                getOptionLabel={(option) => option.label || 'N/A'}
                editValue={state.recruiters}
                extraProps={{
                  ...(state.recruiters && {
                    with_than: state.recruiters,
                  }),
                }}
                type={DynamicFormTypesEnum.array.key}
                errors={errors}
                isSubmitted={isSubmitted}
              />
              <SharedInputControl
                errors={errors}
                isFullWidth
                title="message"
                isSubmitted={isSubmitted}
                stateKey="message"
                errorPath="message"
                onValueChanged={onStateChanged}
                editValue={state.message}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
            </>
          )}
        </div>
      }
      wrapperClasses="setups-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(jobUUID && true) || undefined}
      onSubmit={copyMode ? null : saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={copyMode ? null : isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ShareProfileDialog.propTypes = {
  jobUUID: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  selectedCandidates: PropTypes.arrayOf(
    PropTypes.shape({
      stage: PropTypes.instanceOf(Object),
      candidate: PropTypes.instanceOf(Object),
      bulkSelectType: PropTypes.number,
    }),
  ),
};
ShareProfileDialog.defaultProps = {
  isOpenChanged: undefined,
  jobUUID: undefined,
  selectedCandidates: undefined,
};
