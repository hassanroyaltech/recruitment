import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  UpdateEvaRecPipeline,
  UpdateEvaRecPipelineStage,
} from '../../../../../../../../../services';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../../../helpers';
import * as yup from 'yup';
import '../../PipelineDrawer.Style.scss';
import ButtonBase from '@mui/material/ButtonBase';
import { PipelineIcon } from '../../../../../../../../../assets/icons';
import { TabsComponent } from '../../../../../../../../../components';
import { PipelineInfoTabsData } from '../../data';
import { PipelineTemplatesManagementDialog } from '../../../../../../dialogs';

export const PipelineInfoSection = ({
  jobUUID,
  parentTranslationPath,
  translationPath,
  activeJob,
  activePipeline,
  activeStage,
  onActivePipelineDetailsChanged,
  onActiveStageDetailsChanged,
  onOpenedDetailsSectionChanged,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [errors, setErrors] = useState(() => ({}));
  const [editMode, setEditMode] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pipelineInfoTabsData] = useState(
    Object.values(PipelineInfoTabsData).map((item) => ({
      ...item,
    })),
  );
  const [activeTab, setActiveTab] = useState(0);
  const [isOpenManagementDialog, setIsOpenManagementDialog] = useState(false);

  const changeEditValue = ({ id, value }) => {
    setEditMode((items) => ({ ...items, [id]: value }));
  };

  const doubleClickHandler = useCallback(
    (keys, activeItemJSON) => () => {
      if (keys.some((item) => !Object.hasOwn(editMode, item)))
        keys.map((key) => {
          changeEditValue({
            id: key,
            value: activeItemJSON[key] !== undefined ? activeItemJSON[key] : null,
          });
          return undefined;
        });
    },
    [editMode],
  );

  const onCloseEditModeHandler = (keys) => () => {
    setEditMode((items) => {
      keys.map((key) => {
        delete items[key];
        return undefined;
      });
      return { ...items };
    });
  };

  const submitValueHandler = useCallback(
    async ({ directSaveJson }) => {
      setIsSubmitted(true);
      if (Object.keys(errors).length > 0 && !directSaveJson) return;
      setIsLoading(true);
      if (activeStage) {
        const response = await UpdateEvaRecPipelineStage({
          // send body here
          job_uuid: jobUUID,
          pipeline_uuid: activePipeline.uuid,
          stage_uuid: activeStage.uuid,
          ...activeStage,
          ...editMode,
          ...(directSaveJson || {}),
        });
        setIsLoading(false);

        if (response && response.status === 202) {
          setIsSubmitted(true);
          const localStages = [...activePipeline.stages];
          const changedStageIndex = localStages.findIndex(
            (item) => item.uuid === activeStage.uuid,
          );
          if (changedStageIndex !== -1 && onActivePipelineDetailsChanged) {
            localStages[changedStageIndex] = {
              ...localStages[changedStageIndex],
              ...editMode,
              ...(directSaveJson || {}),
            };
            if (onActiveStageDetailsChanged)
              onActiveStageDetailsChanged({
                ...activeStage,
                ...editMode,
                ...(directSaveJson || {}),
              });
            if (onActivePipelineDetailsChanged)
              onActivePipelineDetailsChanged({
                ...activePipeline,
                stages: localStages,
              });
          }
          setEditMode({});
          showSuccess(t(`${translationPath}data-updated-successfully`));
        } else showError(t(`${translationPath}data-update-failed`), response);
      } else {
        const response = await UpdateEvaRecPipeline({
          ...activePipeline,
          ...editMode,
          ...(directSaveJson || {}),
        });
        setIsLoading(false);

        if (response && response.status === 202) {
          setIsSubmitted(true);
          if (onActivePipelineDetailsChanged)
            onActivePipelineDetailsChanged({
              ...activePipeline,
              ...editMode,
              ...(directSaveJson || {}),
            });
          setEditMode({});
          showSuccess(t(`${translationPath}data-updated-successfully`));
        } else showError(t(`${translationPath}data-update-failed`), response);
      }
    },
    [
      activePipeline,
      activeStage,
      editMode,
      errors,
      jobUUID,
      onActivePipelineDetailsChanged,
      onActiveStageDetailsChanged,
      t,
      translationPath,
    ],
  );

  const onKeyDownHandler = (event) => {
    if (event.key === 'Enter') submitValueHandler({});
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get state errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          title: yup
            .string()
            .nullable()
            .default('-')
            .required(t('Shared:this-field-is-required')),
          description: yup
            .string()
            .nullable()
            .default('-')
            .required(t('Shared:this-field-is-required')),
          is_with_timeframe: yup
            .boolean()
            .nullable()
            .default(false)
            .required(t('Shared:this-field-is-required')),
          timeframe_duration: yup
            .number()
            .nullable()
            .default(1)
            .when(
              'is_with_timeframe',
              (value, field) =>
                (value
                  && field
                    .required(t('Shared:this-field-is-required'))
                    .min(1, `${t('Shared:this-field-must-be-more-than')} ${1}`))
                || field,
            ),
          timeframe_duration_type: yup
            .number()
            .nullable()
            .default(0)
            .when(
              'is_with_timeframe',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
        }),
      },
      editMode,
    ).then((result) => {
      setErrors(result);
    });
  }, [editMode, t]);

  useEffect(() => {
    getErrors();
  }, [getErrors, editMode]);

  // to make sure that the edit mode is off on change the activePipeline or activeStage
  useEffect(() => {
    setEditMode({});
  }, [activePipeline, activeStage]);

  return (
    <>
      <div className="details-header-wrapper">
        <div className="px-2">
          <ButtonBase
            className="btns theme-transparent miw-0 mx-0"
            id="detailsCloserIdRef"
            onClick={() => onOpenedDetailsSectionChanged(null)}
          >
            <span className="fas fa-angle-double-right" />
          </ButtonBase>
          <label htmlFor="detailsCloserIdRef" className="px-2">
            {t(`${translationPath}details`)}
          </label>
        </div>
      </div>
      <div className="details-body-wrapper">
        <div className="d-flex-column">
          <div>
            <div className="px-4 pb-4 d-flex">
              <div>
                <ButtonBase className="btns theme-transparent miw-0 bg-gray-lighter p-3">
                  <PipelineIcon />
                </ButtonBase>
              </div>
              <div className="mx-3">
                <div className="fz-20px fw-bold">{activePipeline.title}</div>
                <div className="fz-12px c-gray-dark">
                  {t(`${translationPath}pipeline`)}
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 mb-4">
            <ButtonBase
              className="btns theme-outline"
              onClick={() => setIsOpenManagementDialog(true)}
            >
              <span>{t(`${translationPath}edit-pipeline`)}</span>
            </ButtonBase>
          </div>
          <TabsComponent
            itemClasses="fz-14px mb-2"
            isPrimary
            isWithLine
            labelInput="label"
            idRef="pipelineTagsRef"
            tabsContentClasses="pt-3"
            data={pipelineInfoTabsData}
            currentTab={activeTab}
            translationPath={translationPath}
            onTabChanged={(event, currentTab) => {
              setActiveTab(currentTab);
            }}
            parentTranslationPath={parentTranslationPath}
            dynamicComponentProps={{
              jobUUID,
              activeJob,
              onCloseEditModeHandler,
              submitValueHandler,
              onKeyDownHandler,
              changeEditValue,
              isLoading,
              isSubmitted,
              errors,
              editMode,
              activePipeline,
              doubleClickHandler,
              translationPath,
              parentTranslationPath,
              onOpenedDetailsSectionChanged,
            }}
          />
        </div>
      </div>
      {isOpenManagementDialog && (
        <PipelineTemplatesManagementDialog
          activeItem={
            activePipeline && {
              ...activePipeline,
              uuid: activePipeline.origin_pipeline_uuid,
            }
          }
          onSave={() => {
            // setFilter((items) => ({ ...items, page: 1 }));
          }}
          isOpenChanged={() => setIsOpenManagementDialog(false)}
          parentTranslationPath="EvaRecPipelines"
          translationPath=""
          isOpen={isOpenManagementDialog}
        />
      )}
    </>
  );
};

PipelineInfoSection.propTypes = {
  jobUUID: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  activePipeline: PropTypes.shape({
    uuid: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.instanceOf(Array),
    stages: PropTypes.instanceOf(Array),
    team: PropTypes.instanceOf(Array),
    status: PropTypes.bool,
    language_id: PropTypes.string,
    position: PropTypes.instanceOf(Object),
    title: PropTypes.string,
    stages_count: PropTypes.number,
    origin_pipeline_uuid: PropTypes.string,
  }),
  activeStage: PropTypes.instanceOf(Object),
  activeJob: PropTypes.instanceOf(Object),
  onActivePipelineDetailsChanged: PropTypes.func,
  onActiveStageDetailsChanged: PropTypes.func,
  onOpenedDetailsSectionChanged: PropTypes.func,
  view: PropTypes.shape({
    key: PropTypes.number,
    data: PropTypes.shape({}),
  }),
  setView: PropTypes.func,
};

PipelineInfoSection.defaultProps = {
  jobUUID: undefined,
  activeJob: undefined,
  parentTranslationPath: undefined,
  translationPath: undefined,
  activePipeline: undefined,
  activeStage: undefined,
  onActivePipelineDetailsChanged: undefined,
  onActiveStageDetailsChanged: undefined,
};
