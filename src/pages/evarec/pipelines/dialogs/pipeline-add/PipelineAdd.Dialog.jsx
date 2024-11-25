import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
// import { useSelector } from 'react-redux';
import { useSelector } from 'react-redux';
import { CreateEvaRecPipelines, GetAllFormsTypes } from '../../../../../services';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent } from '../../../../../components';
import {
  SetupsReducer,
  SharedAutocompleteControl,
  // SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';

export const PipelineAddDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const userReducer = useSelector((state) => state?.userReducer);
  const [languages, setLanguages] = useState([]);
  const [errors, setErrors] = useState({});

  const [state, setState] = useReducer(SetupsReducer, {
    title: '',
    language_id: null,
    is_same_position: false,
    ability_to_move_form_builder: true,
    form_builder_types: [],
    description: null,
    tags: [],
    is_visible_on_candidate: false,
  });

  const schema = useRef(
    yup.object().shape({
      title: yup
        .string()
        .nullable()
        .min(
          3,
          `${t('Shared:this-field-must-be-more-than')} ${3} ${t('characters')}`,
        )
        .max(
          255,
          `${t('Shared:this-field-must-be-less-than')} ${255} ${t('characters')}`,
        )
        .required(t('this-field-is-required')),
      language_id: yup.string().nullable().required(t('this-field-is-required')),
      ability_to_move_form_builder: yup.boolean().nullable(),
      form_builder_types: yup
        .array()
        .of(yup.string())
        .nullable()
        .when(
          'ability_to_move_form_builder',
          (value, field) =>
            (value
              && field.min(
                1,
                `${t('Shared:please-add-at-least')} ${1} ${t('form-type')}`,
              ))
            || field,
        ),
      description: yup
        .string()
        .nullable()
        .min(
          3,
          `${t('Shared:this-field-must-be-more-than')} ${3} ${t('characters')}`,
        )
        .required(t('this-field-is-required')),
    }),
  );

  // /**
  //  * @param id
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to change the status of lookups
  //  */
  // const onSwitchChangedHandler = (id) => (event, newValue) => {
  //   setState({ id, value: newValue });
  // };

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, state);
    setErrors(result);
  }, [state]);

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    // showError(t('Shared:please-fix-all-errors'));

    setIsLoading(true);
    const response = await CreateEvaRecPipelines(state);
    setIsLoading(false);
    if (response && response.status === 201) {
      window?.ChurnZero?.push([
        'trackEvent',
        'Create a new pipeline',
        'Create a new pipeline from EVA REC',
        1,
        {},
      ]);
      showSuccess(t(`${translationPath}pipeline-created-successfully`));
      if (onSave) onSave(response.data.results, state);
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}pipeline-create-failed`), response);
  };

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get languages
  useEffect(() => {
    if (userReducer && userReducer.results && userReducer.results.language)
      setLanguages(userReducer.results.language);
    else {
      showError(t('Shared:failed-to-get-languages'));
      isOpenChanged();
    }
  }, [isOpenChanged, t, userReducer]);

  useEffect(() => {
    const localEnLanguage = languages.find((item) => item.code === 'en');
    if (localEnLanguage)
      setState({
        id: 'language_id',
        value: localEnLanguage.id,
      });
  }, [languages]);
  /**
   * @author Hassan Ahmed (h.ahmed@elevatus.io)
   * @description Retrieves initial form builder types and sets the state accordingly.
   * If the API call is successful (200 status), it sets the state with the uuid values.
   * Otherwise, it sets the state with an empty array.
   */
  const getInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllFormsTypes({});
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'form_builder_types',
        value: response.data.results.map((item) => item.uuid),
      });
    else {
      setState({
        id: 'form_builder_types',
        value: [],
      });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, []);
  useEffect(() => {
    void getInit();
  }, [getInit]);
  return (
    <DialogComponent
      titleText="new-pipeline-template"
      maxWidth="xs"
      dialogContent={
        <div className="pipeline-add-dialog-wrapper px-2">
          <div className="mb-3">
            <SharedInputControl
              labelValue="template-name"
              placeholder="template-name-ex"
              errors={errors}
              stateKey="title"
              errorPath="title"
              editValue={state.title}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isFullWidth
            />
          </div>
          <div className="mb-3">
            <SharedInputControl
              labelValue="description"
              placeholder="description-placeholder"
              errors={errors}
              stateKey="description"
              errorPath="description"
              editValue={state.description}
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isFullWidth
              multiline
              rows={4}
            />
          </div>
          {/*<div className="mb-3">*/}
          {/*  <div className="d-inline-flex">*/}
          {/*    <SwitchComponent*/}
          {/*      idRef="isSamePositionSwitchRef"*/}
          {/*      label="same-position"*/}
          {/*      isChecked={state.is_same_position}*/}
          {/*      isReversedLabel*/}
          {/*      isFlexEnd*/}
          {/*      onChange={onSwitchChangedHandler('is_same_position')}*/}
          {/*      parentTranslationPath={parentTranslationPath}*/}
          {/*      translationPath={translationPath}*/}
          {/*    />*/}
          {/*  </div>*/}
          {/*</div>*/}
          <div className="mb-3">
            <SharedAutocompleteControl
              editValue={state.language_id}
              placeholder="select-language"
              title="language"
              stateKey="language_id"
              errors={errors}
              errorPath="language_id"
              isSubmitted={isSubmitted}
              onValueChanged={onStateChanged}
              initValues={languages}
              isFullWidth
              initValuesKey="id"
              initValuesTitle="title"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      // dialogActions={(
      //   <div className="w-100 px-3 pb-3">
      //     <ButtonBase
      //       className="btns theme-solid w-100 mx-0"
      //       disabled={isLoading}
      //       type="submit"
      //     >
      //       <LoaderComponent
      //         isLoading={isLoading}
      //         isSkeleton
      //         wrapperClasses="position-absolute w-100 h-100"
      //         skeletonStyle={{ width: '100%', height: '100%' }}
      //       />
      //       <span>{t(`${translationPath}save-and-continue`)}</span>
      //     </ButtonBase>
      //   </div>
      // )}
      saveText={t(`${translationPath}continue`)}
      saveAfterIcon="fas fa-arrow-right"
      saveClasses="btns theme-transparent"
      cancelClasses="btns theme-transparent"
      onSubmit={saveHandler}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

PipelineAddDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
PipelineAddDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  translationPath: 'PipelineAddDialog.',
};
