import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { DialogComponent, TextEditorComponent } from '../../../../components';
import { SystemLanguagesConfig } from '../../../../configs';
import { ButtonBase } from '@mui/material';
import { ChatGPTIcon } from '../../../../assets/icons';
import PopoverComponent from '../../../../components/Popover/Popover.Component';
import {
  GPTGenerateJobDescription,
  GPTGenerateJobRequirements,
  GPTOptimizeJobDescription,
  GPTOptimizeJobRequirements,
} from '../../../../services';

const parentTranslationPath = 'CreateJob';
const translationPath = 'TranslationsDialog.';

export const TranslationsDialog = ({
  isOpen,
  isOpenChanged,
  activeField,
  saveTranslations,
  translations,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const schema = useRef(null);
  const [isGPTLoading, setIsGPTLoading] = useState(false);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
  const stateInitRef = useRef({
    languages: Object.values(SystemLanguagesConfig)
      .filter((it) => it.key !== SystemLanguagesConfig.en.key)
      .map((item) => ({
        value: item.key,
        label: t(`Shared:LanguageChangeComponent.${item.value}`),
      })),
    current_language: 'ar',
    // pass init translation
    local_translations: translations || {},
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

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

  const saveHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    if (saveTranslations) saveTranslations(state.local_translations);
    if (isOpenChanged) isOpenChanged();
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    schema.current = yup.object().shape({
      current_language: yup
        .string()
        .nullable()
        .required(t(`${translationPath}this-field-is-required`)),
    });
  }, [t]);

  useEffect(() => {
    if (translations)
      onStateChanged({ id: 'local_translations', value: translations });
  }, [translations]);

  const gptGenerateJobDescriptionOrRequirements = useCallback(
    async (canRegenerate = true) => {
      if (!activeField?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsGPTLoading(true);
        const res = await (activeField?.title === 'description'
          ? GPTGenerateJobDescription
          : GPTGenerateJobRequirements)({
          ...activeField?.gptDetails,
          language: state.current_language,
        });
        setIsGPTLoading(false);
        setPopoverAttachedWith(null);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptGenerateJobDescriptionOrRequirements(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          onStateChanged({
            parentId: 'local_translations',
            subParentId: activeField?.title,
            id: state.current_language,
            value:
              activeField?.title === 'description'
                ? results?.job_description || ''
                : (results || []).join('<br/>'),
          });
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [activeField?.gptDetails, activeField?.title, state.current_language, t],
  );

  const gptOptimizeJobDescriptionOrRequirements = useCallback(
    async (canRegenerate = true) => {
      if (!activeField?.title) return;
      setPopoverAttachedWith(null);
      try {
        setIsGPTLoading(true);
        const res = await (activeField?.title === 'description'
          ? GPTOptimizeJobDescription
          : GPTOptimizeJobRequirements)({
          ...activeField?.gptDetails,
          language: state.current_language,
          [activeField.title]: [
            (state.current_language
              && state.local_translations?.[activeField?.title]?.[
                state.current_language
              ])
              || '',
          ],
        });
        setIsGPTLoading(false);
        setPopoverAttachedWith(null);
        if (res && res.status === 200) {
          const results = res?.data?.result;
          if (!results)
            if (canRegenerate) return gptOptimizeJobDescriptionOrRequirements(false);
            else {
              showError(t('Shared:failed-to-get-saved-data'), res);
              return;
            }
          showSuccess(t(`Shared:success-get-gpt-help`));
          onStateChanged({
            parentId: 'local_translations',
            subParentId: activeField?.title,
            id: state.current_language,
            value: (results || []).join('<br/>'),
          });
        } else showError(t('Shared:failed-to-get-saved-data'), res);
      } catch (error) {
        showError(t('Shared:failed-to-get-saved-data'), error);
      }
    },
    [
      activeField?.gptDetails,
      activeField?.title,
      state.current_language,
      state.local_translations,
      t,
    ],
  );

  return (
    <DialogComponent
      maxWidth={activeField?.type === 'textarea' ? 'md' : 'sm'}
      titleText="translation-dialog"
      contentClasses="px-0"
      dialogContent={
        <div>
          <div className="d-flex-v-center-h-between">
            {' '}
            <SharedAutocompleteControl
              isFullWidth={!activeField?.is_with_chatGPT}
              isTwoThirdsWidth={!!activeField?.is_with_chatGPT}
              sharedClassesWrapper={!!activeField?.is_with_chatGPT && 'px-0'}
              errors={errors}
              title="language"
              stateKey="current_language"
              isSubmitted={isSubmitted}
              placeholder="select-language"
              onValueChanged={onStateChanged}
              initValues={state.languages}
              editValue={state.current_language}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              errorPath="current_language"
              initValuesKey="value"
              initValuesTitle="label"
            />
            {activeField?.is_with_chatGPT && (
              <ButtonBase
                onClick={(e) => {
                  setPopoverAttachedWith(e.target);
                }}
                className="btns-icon theme-solid mx-2 mb-3"
                disabled={isGPTLoading}
              >
                {isGPTLoading ? (
                  <span className="fas fa-circle-notch fa-spin m-1" />
                ) : (
                  <ChatGPTIcon />
                )}
              </ButtonBase>
            )}
          </div>
          {activeField?.type === 'text' && (
            <SharedInputControl
              errors={errors}
              isFullWidth
              title="translation"
              isSubmitted={isSubmitted}
              parentId="local_translations"
              subParentId={activeField.title}
              stateKey={state.current_language}
              errorPath={state.current_language}
              onValueChanged={onStateChanged}
              editValue={
                (state.current_language
                  && state.local_translations?.[activeField.title]?.[
                    state.current_language
                  ])
                || ''
              }
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
          )}
          {activeField?.type === 'textarea' && (
            <TextEditorComponent
              key={state.current_language}
              // menubar
              // plugins={[
              //   'advlist autolink lists link preview anchor',
              //   'searchreplace code',
              //   'insertdatetime paste code wordcount',
              // ]}
              editorValue={
                (state.current_language
                  && state.local_translations?.[activeField.title]?.[
                    state.current_language
                  ])
                || ''
              }
              isSubmitted={isSubmitted}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              height={250}
              onEditorDelayedChange={(content) =>
                onStateChanged({
                  parentId: 'local_translations',
                  subParentId: activeField.title,
                  id: state.current_language,
                  value: content,
                })
              }
              idRef={`editor-translation-dialog${state.current_language}`}
              hideFonts
            />
          )}
          {popoverAttachedWith && (
            <PopoverComponent
              idRef={`jobTemplateFormGPTHelp`}
              attachedWith={popoverAttachedWith}
              handleClose={() => {
                setPopoverAttachedWith(null);
              }}
              component={
                <div className="d-inline-flex-column gap-1 py-1">
                  <ButtonBase
                    className="btns theme-transparent"
                    onClick={() => gptGenerateJobDescriptionOrRequirements()}
                    disabled={!activeField.title || isGPTLoading}
                  >
                    {t(`${translationPath}generate-${activeField?.title}`)}
                  </ButtonBase>
                  <ButtonBase
                    className="btns theme-transparent"
                    onClick={() => gptOptimizeJobDescriptionOrRequirements()}
                    disabled={
                      !(
                        state.current_language
                        && state.local_translations?.[activeField.title]?.[
                          state.current_language
                        ]
                      ) || isGPTLoading
                    }
                  >
                    {t(`${translationPath}optimize-${activeField?.title}`)}
                  </ButtonBase>
                </div>
              }
            />
          )}
        </div>
      }
      wrapperClasses="translations-dialog-wrapper"
      isOpen={isOpen}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

TranslationsDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  activeField: PropTypes.shape({
    type: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  saveTranslations: PropTypes.func,
  translations: PropTypes.shape({}),
};
TranslationsDialog.defaultProps = {
  saveTranslations: undefined,
  isOpenChanged: undefined,
  translations: {},
};
