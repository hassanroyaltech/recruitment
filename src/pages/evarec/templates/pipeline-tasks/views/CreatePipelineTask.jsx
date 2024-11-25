import React, { useCallback, useEffect, useRef, useReducer, useState } from 'react';
import ButtonBase from '@mui/material/ButtonBase';
import { PipelineTasksViewsEnum } from '../../../../../enums';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../../setups/shared';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { CreatePipelineTaskFunc } from '../../../../../services';
import * as yup from 'yup';
import { PipelineQueryItem } from '../components/pipeline-task-query/PipelineTaskQueryItem.Component';

export const CreatePipelineTask = ({
  parentTranslationPath,
  translationPath,
  // onOpenedDetailsSectionChanged,
  setView,
  activePipeline,
  setListingFilter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    title: '',
    pipeline_uuid: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const CreatePipelineTaskHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (Object.keys(errors).length) return;
    setIsLoading(true);
    const response = await CreatePipelineTaskFunc({
      title: state.title,
      pipeline_uuid: state.pipeline_uuid,
    });
    setIsLoading(false);
    if (response && response.status === 202) {
      showSuccess(t(`${translationPath}pipeline-task-created-successfully`));
      setView({
        key: PipelineTasksViewsEnum.VIEW_DETAILS.key,
        data: { pipeline_task_uuid: response.data.results.uuid },
      });
      if (setListingFilter) setListingFilter((i) => ({ ...i }));
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    errors,
    state.title,
    state.pipeline_uuid,
    t,
    translationPath,
    setView,
    setListingFilter,
  ]);

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          title: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
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
    if (activePipeline?.origin_pipeline_uuid || activePipeline?.uuid)
      onStateChanged({
        id: 'pipeline_uuid',
        value: activePipeline.origin_pipeline_uuid || activePipeline?.uuid,
      });
  }, [activePipeline]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => {}}
          >
            <span className="fas fa-arrow-left" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {t(`${translationPath}new-triggered-task`)}
          </label>
        </div>
        <div>
          <ButtonBase
            className="btns theme-transparent"
            onClick={() =>
              setView({
                key: PipelineTasksViewsEnum.LIBRARY.key,
                date: {},
              })
            }
            disabled={isLoading}
          >
            <span className="mx-2">{t(`${translationPath}cancel`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-solid"
            onClick={() => CreatePipelineTaskHandler()}
            disabled={isLoading}
          >
            <span className="mx-2">{t(`${translationPath}create`)}</span>
            <span className="fas fa-check" />
          </ButtonBase>
        </div>
      </div>
      <div className="details-body-wrapper mx-3 px-2">
        <SharedInputControl
          isFullWidth
          stateKey="title"
          placeholder="untitled-dots"
          errorPath="title"
          isSubmitted={isSubmitted}
          errors={errors}
          editValue={state.title}
          isDisabled={isLoading}
          onValueChanged={onStateChanged}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          themeClass="theme-transparent"
          textFieldWrapperClasses="w-100 pt-3"
          fieldClasses="w-100"
        />
        {/*TODO: Add this note on a tooltip*/}
        {/*<div className="c-gray fz-14px">*/}
        {/*  {t(`${translationPath}create-task-then-start-adding-queries`)}*/}
        {/*</div>*/}
        <div className="c-gray fz-14px">
          {t(`${translationPath}write-your-query`)}
        </div>
        <PipelineQueryItem
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          activePipeline={activePipeline}
          index={0}
          // queryData={queryData}
          actions_list={state.actions_list}
          viewMode
          isTransparent
        />
      </div>
    </>
  );
};

CreatePipelineTask.propTypes = {
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  // onOpenedDetailsSectionChanged: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    origin_pipeline_uuid: PropTypes.string,
  }),
  setListingFilter: PropTypes.func,
};
