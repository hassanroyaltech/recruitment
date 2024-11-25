import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import { DialogComponent } from '../../../../components';
import {
  GetEvaBrandSocialMediaByLanguageId,
  UpdateEvaBrandSocialMedia,
} from '../../../../services';
import {
  facebookExpression,
  instagramExpression,
  linkedinExpression,
  snapchatExpression,
  twitterExpression,
  urlExpression,
  youtubeProfileOrVideoExpression,
} from '../../../../utils';
import { SocialMediaShared } from '../shared/social-media';

// dialog to management the section of type team members
export const SocialMediaManagementDialog = ({
  language_uuid,
  language,
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation([parentTranslationPath]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  // ref for errors schema for form errors
  const schema = useRef(
    yup.object().shape({
      social_media: yup
        .object()
        .nullable()
        .shape({
          linkedin: yup
            .string()
            .nullable()
            .matches(linkedinExpression, {
              message: t('invalid-linkedin-url'),
              excludeEmptyString: true,
            }),
          facebook: yup
            .string()
            .nullable()
            .matches(facebookExpression, {
              message: t('invalid-facebook-url'),
              excludeEmptyString: true,
            }),
          youtube: yup
            .string()
            .nullable()
            .matches(youtubeProfileOrVideoExpression, {
              message: t('invalid-youtube-url'),
              excludeEmptyString: true,
            }),
          twitter: yup
            .string()
            .nullable()
            .matches(twitterExpression, {
              message: t('invalid-twitter-url'),
              excludeEmptyString: true,
            }),
          snapchat: yup
            .string()
            .nullable()
            .matches(snapchatExpression, {
              message: t('invalid-snapchat-url'),
              excludeEmptyString: true,
            }),
          instagram: yup
            .string()
            .nullable()
            .matches(instagramExpression, {
              message: t('invalid-instagram-url'),
              excludeEmptyString: true,
            }),
          website: yup
            .string()
            .nullable()
            .matches(urlExpression, {
              message: t('invalid-website-url'),
              excludeEmptyString: true,
            }),
        }),
    }),
  );
  // method to reset all state values (with lazy load)
  const reset = (values) => ({
    ...values,
  });
  // reducer to update the state on edit or rest or only single item
  const reducer = useCallback((state, action) => {
    if (action.index || action.index === 0) {
      const localState = { ...state };
      if (action.subParentId)
        if (action.id)
          localState[action.parentId][action.subParentId][action.index][action.id]
            = action.value;
        else
          localState[action.parentId][action.subParentId][action.index]
            = action.value;
      else if (action.parentId)
        localState[action.parentId][action.index][action.id] = action.value;
      else localState[action.id][action.index] = action.value;
      return localState;
    }
    if (action.subParentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.subParentId]: {
            ...state[action.parentId][action.subParentId],
            [action.id]: action.value,
          },
        },
      };
    if (action.parentId)
      return {
        ...state,
        [action.parentId]: {
          ...state[action.parentId],
          [action.id]: action.value,
        },
      };
    if (action.id === 'reset') return reset(action.value);
    if (action.id !== 'edit') return { ...state, [action.id]: action.value };
    return { ...action.value };
  }, []);
  // state with useReducer react hook
  const [state, setState] = useReducer(
    reducer,
    {
      social_media: {
        linkedin: null,
        facebook: null,
        youtube: null,
        twitter: null,
        snapchat: null,
        instagram: null,
        website: null,
      },
    },
    reset,
  );
  // a method to update errors for form on state changed
  const getErrors = useCallback(() => {
    getErrorByName(schema, state).then((result) => {
      setErrors(result);
    });
  }, [state]);
  // method to update state on child update it
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
  // submit savingHandler method to save object to backend
  // if all errors are valid
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      Object.values(errors).map((item) => showError(item.message));
      return;
    }
    setIsLoading(true);
    const saveDto = {
      language_uuid,
      ...state.social_media,
    };
    const response = await UpdateEvaBrandSocialMedia(saveDto);
    setIsLoading(false);
    if (response && (response.status === 201 || response.status === 200)) {
      showSuccess(t(`${translationPath}social-media-updated-successfully`));
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}social-media-update-failed`), response);
  };
  // method to handle edit init to get saved data
  const editInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetEvaBrandSocialMediaByLanguageId({ language_uuid });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({ id: 'edit', value: response.data.results });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      if (isOpenChanged) isOpenChanged();
    }
  }, [isOpenChanged, language_uuid, t]);
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);
  useEffect(() => {
    editInit();
  }, [editInit]);

  return (
    <DialogComponent
      titleText={`${t(`${translationPath}edit-social-media`)} (${t(
        `Shared:${language.code}`,
      )})`}
      saveText="update"
      maxWidth="md"
      dialogContent={
        <div className="social-media-management-dialog-wrapper section-wrapper">
          <SocialMediaShared
            errors={errors}
            subParentItem={state}
            isSubmitted={isSubmitted}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            isWithFacebook
            isWithLinkedin
            isWithYoutube
            isWithTwitter
            isWithSnapchat
            isWithInstagram
            isWithWebsite
          />
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      isEdit
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
    />
  );
};

SocialMediaManagementDialog.propTypes = {
  language_uuid: PropTypes.string.isRequired,
  language: PropTypes.instanceOf(Object).isRequired,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
SocialMediaManagementDialog.defaultProps = {
  translationPath: 'SocialMediaManagementDialog.',
};
