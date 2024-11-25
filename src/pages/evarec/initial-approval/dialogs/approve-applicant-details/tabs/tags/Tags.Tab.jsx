import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from 'pages/setups/shared';
import { ProfileManagementFeaturesEnum } from 'enums';
import { CustomCandidatesFilterTagsEnum } from 'enums/Pages/CandidateFilterTags.Enum';
import { ButtonBase } from '@mui/material';
import { TagsSection } from 'components/ProfileManagement/sections/Tags.Section';
import { useSelector } from 'react-redux';
import { UpdateCandidatesProfile, GetCandidatesProfileById } from 'services';
import * as yup from 'yup';

export const TagsTab = ({
  parentTranslationPath,
  // translationPath,
  onProfileSaved,
  candidate,
  profile_uuid, // check
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState([]);
  const userReducer = useSelector((state) => state?.userReducer);

  const stateInitRef = useRef({
    tagsList: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (
      !profile_uuid
      && (!userReducer
        || !userReducer.results
        || !userReducer.results.language
        || !userReducer.results.language.length)
    )
      showError(t('Shared:failed-to-get-languages'));

    setIsLoading(true);
    const stateClone = { ...state };
    delete stateClone['tags'];
    delete stateClone['custom_tags'];

    const response = await UpdateCandidatesProfile(
      {
        candidate_uuid: candidate?.identity?.uuid,
        candidate_data: {
          ...stateClone,
          tag: [...state.tags, ...state.custom_tags].filter(
            (item) => item?.key && item?.value?.length,
          ),
        },
      },
      candidate.identity.company_uuid,
    );
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      if (profile_uuid) showSuccess(t('profile-saved-successfully'));
      else showSuccess(t('candidate-created-successfully'));
      onProfileSaved();
    } else if (profile_uuid) showError(t('profile-save-failed'), response);
    else showError(t('candidate-create-failed'), response);
  };

  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetCandidatesProfileById({
      candidate_uuid: candidate?.identity?.uuid,
      profile_uuid,
      from_feature: ProfileManagementFeaturesEnum.DrApproval.key,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      const localResult = response.data.results;
      const tags = [];
      const custom_tags = [];
      localResult?.tag?.forEach((item) => {
        if (
          Object.values(CustomCandidatesFilterTagsEnum).some(
            (element) => element.key === item.key,
          )
        )
          custom_tags.push(item);
        else tags.push(item);
      });

      setState({
        id: 'edit',
        value: {
          ...localResult,
          tags,
          custom_tags,
        },
      });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [profile_uuid, candidate, t]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup
          .object()
          .shape({
            tags: yup
              .array()
              .of(
                yup
                  .object()
                  .nullable()
                  .shape({
                    key: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                    value: yup
                      .string()
                      .nullable()
                      .required(t('this-field-is-required')),
                  }),
              )
              .nullable(),
            candidate_property: yup
              .array()
              .of(
                yup
                  .object()
                  .nullable()
                  .shape({
                    uuid: yup
                      .string()
                      .nullable()
                      .required(t('Shared:this-field-is-required')),
                    value: yup
                      .string()
                      .nullable()
                      .required(t('Shared:this-field-is-required')),
                  }),
              )
              .nullable(),
          })
          .nullable(),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (profile_uuid) getEditInit();
  }, [profile_uuid, getEditInit]);

  return (
    <div className="tags-tab tab-wrapper p-4">
      <TagsSection
        state={state}
        isSubmitted={isSubmitted}
        isLoading={isLoading}
        errors={errors}
        onStateChanged={onStateChanged}
        parentTranslationPath={parentTranslationPath}
        company_uuid={candidate?.identity?.company_uuid}
        isEdit
        isFullWidth
      />
      <div className="d-flex-v-center-h-end">
        <ButtonBase
          onClick={saveHandler}
          disabled={isLoading}
          className="btns theme-solid"
        >
          {t('save')}
        </ButtonBase>
      </div>
    </div>
  );
};

TagsTab.propTypes = {
  approval_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  // translationPath: PropTypes.string,
  candidate: PropTypes.shape({
    identity: PropTypes.shape({
      uuid: PropTypes.string,
      company_uuid: PropTypes.string,
    }),
  }),
  onProfileSaved: PropTypes.func.isRequired,
  profile_uuid: PropTypes.string.isRequired,
};
TagsTab.defaultProps = {
  // translationPath: '',
  candidate: undefined,
};
