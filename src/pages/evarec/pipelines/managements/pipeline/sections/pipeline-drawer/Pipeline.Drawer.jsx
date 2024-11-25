import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import Drawer from '@mui/material/Drawer';
import ButtonBase from '@mui/material/ButtonBase';
// import { useTranslation } from 'react-i18next';
import { PipelineDetailsSectionEnum } from '../../../../../../../enums';
import './PipelineDrawer.Style.scss';
import { PipelineInfoSection } from './sections/pipeline-info/PipelineInfo.Section';
// import { useOnClickOutside } from '../../../../../../../hooks';
import { getIsAllowedPermissionV2 } from 'helpers';
import { useSelector } from 'react-redux';
import { LogsSection } from './sections/Logs.Section';
import { NotesSection } from './sections/Notes.Section';
import { StageInfoSection } from './sections/stage-info/StageInfo.Section';
import i18next from 'i18next';

export const PipelineDrawer = ({
  jobUUID,
  openedDetailsSection,
  onOpenedDetailsSectionChanged,
  onActivePipelineDetailsChanged,
  onActiveStageDetailsChanged,
  activeJob,
  activePipeline,
  onActivePipelineChanged,
  activeStage,
  setActiveStage,
  parentTranslationPath,
  translationPath,
}) => {
  // const { t } = useTranslation(parentTranslationPath);
  const drawerRef = useRef(null);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  // useOnClickOutside(drawerRef, (event) => {
  //   if (
  //     event
  //     && event.target
  //     && event.target.classList
  //     && (event.target.classList.contains('MuiAutocomplete-option')
  //       || event.target.classList.contains('MuiAutocomplete-noOptions'))
  //   )
  //     return;
  //   onOpenedDetailsSectionChanged(null);
  // });

  return (
    <Drawer
      anchor={i18next.dir() === 'ltr' ? 'right' : 'left'}
      open={Boolean(openedDetailsSection)}
      onClose={() => onOpenedDetailsSectionChanged(null)}
      hideBackdrop
      PaperProps={{
        ref: drawerRef,
      }}
      className="pipeline-details-section-wrapper section-wrapper"
    >
      <div className="details-contents-wrapper">
        {openedDetailsSection === PipelineDetailsSectionEnum.Info.key
          && (activeStage ? (
            <StageInfoSection
              activeJob={activeJob}
              activePipeline={activePipeline}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onActivePipelineDetailsChanged={onActivePipelineDetailsChanged}
              onActiveStageDetailsChanged={onActiveStageDetailsChanged}
              onActivePipelineChanged={onActivePipelineChanged}
              activeStage={activeStage}
              setActiveStage={setActiveStage}
              onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
            />
          ) : (
            <PipelineInfoSection
              activeJob={activeJob}
              activePipeline={activePipeline}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              onActivePipelineDetailsChanged={onActivePipelineDetailsChanged}
              onActiveStageDetailsChanged={onActiveStageDetailsChanged}
              onActivePipelineChanged={onActivePipelineChanged}
              activeStage={activeStage}
              setActiveStage={setActiveStage}
              onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
            />
          ))}
        {openedDetailsSection === PipelineDetailsSectionEnum.Logs.key && (
          <LogsSection
            jobUUID={jobUUID}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
          />
        )}
        {openedDetailsSection === PipelineDetailsSectionEnum.Notes.key && (
          <NotesSection
            jobUUID={jobUUID}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            onOpenedDetailsSectionChanged={onOpenedDetailsSectionChanged}
          />
        )}
      </div>
      <div className="details-actions-wrapper">
        {Object.values(PipelineDetailsSectionEnum)
          .filter((it) => !it.is_hidden)
          .map((item) => (
            <ButtonBase
              className={`btns-icon theme-transparent${
                (item.key === openedDetailsSection && ' is-active') || ''
              }`}
              key={`pipelineDetailsSectionEnumKey${item.key}`}
              disabled={
                (item.isDisabled
                  || !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: item.permissionId,
                  }))
                && !item.always_enabled
              }
              onClick={() => {
                onOpenedDetailsSectionChanged(item.key);
              }}
            >
              <span className={item.icon} />
            </ButtonBase>
          ))}
      </div>
    </Drawer>
  );
};

PipelineDrawer.propTypes = {
  openedDetailsSection: PropTypes.oneOf(
    Object.values(PipelineDetailsSectionEnum).map((item) => item.key),
  ),
  jobUUID: PropTypes.string,
  onOpenedDetailsSectionChanged: PropTypes.func.isRequired,
  onActivePipelineDetailsChanged: PropTypes.func.isRequired,
  onActiveStageDetailsChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  activePipeline: PropTypes.shape({
    description: PropTypes.string,
    tags: PropTypes.instanceOf(Array),
    stages: PropTypes.instanceOf(Array),
    team: PropTypes.instanceOf(Array),
    status: PropTypes.bool,
    language_id: PropTypes.string,
    position: PropTypes.instanceOf(Object),
    title: PropTypes.string,
  }),
  onActivePipelineChanged: PropTypes.func,
  activeStage: PropTypes.instanceOf(Object),
  activeJob: PropTypes.instanceOf(Object),
  setActiveStage: PropTypes.func,
};
PipelineDrawer.defaultProps = {
  openedDetailsSection: undefined,
  jobUUID: undefined,
  activePipeline: undefined,
  activeJob: undefined,
  onActivePipelineChanged: undefined,
  activeStage: undefined,
  setActiveStage: undefined,
};
