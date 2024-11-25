import React, { useCallback, useEffect, useState } from 'react';
import { SystemLanguagesConfig } from '../../../../../../../../../../configs';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../../../../../../../setups/shared';
import { ButtonBase, Chip } from '@mui/material';
import { InvitedTeamsSection } from '../../../../pipeline-header/sections';
import { DynamicFormTypesEnum } from '../../../../../../../../../../enums';
import PropTypes from 'prop-types';

export const PipelineDetailsTab = ({
  // jobUUID,
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
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localLanguage, setLocalLanguage] = useState({});
  const userReducer = useSelector((state) => state?.userReducer);

  const getInvitedTeams = useCallback(
    () =>
      activeJob
      && activeJob.teams_invite
      && activeJob.teams_invite.map((item) => ({
        url: item.profile_image && item.profile_image.url,
        name: `${item.first_name}${(item.last_name && ` ${item.last_name}`) || ''}`,
      })),
    [activeJob],
  );

  useEffect(() => {
    if (activePipeline)
      setLocalLanguage(
        SystemLanguagesConfig[
          userReducer?.results?.language?.filter(
            (item) => item.id === activePipeline?.language_id,
          )?.[0]?.code
        ],
      );
  }, [activePipeline, userReducer]);

  return (
    <div className="pipeline-side-drawer-info p-4">
      <div className="info-cell">{t(`${translationPath}pipeline`)}</div>
      <div
        role="button"
        className="info-cell"
        onDoubleClick={doubleClickHandler(['title'], activePipeline)}
        tabIndex={-1}
      >
        {(Object.hasOwn(editMode, 'title') && (
          <div className="d-inline-flex">
            <SharedInputControl
              isFullWidth
              editValue={editMode.title}
              stateKey="title"
              title="title"
              errors={errors}
              errorPath="title"
              isSubmitted={isSubmitted}
              isDisabled={isLoading}
              onValueChanged={changeEditValue}
              onKeyDown={onKeyDownHandler}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <ButtonBase
              className="btns-icon theme-transparent mx-1 mt-1"
              onClick={submitValueHandler}
              disabled={isLoading}
            >
              <span className="fas fa-check"></span>
            </ButtonBase>
            <ButtonBase
              className="btns-icon theme-transparent c-danger mx-1 mt-1"
              onClick={onCloseEditModeHandler(['title'])}
            >
              <span className="fas fa-times"></span>
            </ButtonBase>
          </div>
        )) || <span>{activePipeline.title}</span>}
      </div>
      <div className="info-cell">{t(`${translationPath}description`)}</div>
      <div
        role="button"
        className="info-cell"
        onDoubleClick={doubleClickHandler(['description'], activePipeline)}
        tabIndex={-1}
      >
        {(Object.hasOwn(editMode, 'description') && (
          <div className="d-inline-flex">
            <SharedInputControl
              isFullWidth
              editValue={editMode.description}
              stateKey="description"
              title="description"
              errors={errors}
              errorPath="description"
              isSubmitted={isSubmitted}
              isDisabled={isLoading}
              onValueChanged={changeEditValue}
              onKeyDown={onKeyDownHandler}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            <ButtonBase
              className="btns-icon theme-transparent mx-1 mt-1"
              onClick={submitValueHandler}
              disabled={isLoading}
            >
              <span className="fas fa-check"></span>
            </ButtonBase>
            <ButtonBase
              className="btns-icon theme-transparent c-danger mx-1 mt-1"
              onClick={onCloseEditModeHandler(['description'])}
            >
              <span className="fas fa-times"></span>
            </ButtonBase>
          </div>
        )) || <span>{activePipeline.description}</span>}
      </div>
      <div className="info-cell">{t(`${translationPath}position`)}</div>
      <div className="info-cell">{activeJob?.position || 'N/A'}</div>
      <div className="info-cell">{t(`${translationPath}team`)}</div>
      <div className="info-cell">
        <InvitedTeamsSection
          invitedTeams={getInvitedTeams()}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      </div>
      <div className="info-cell">{t(`${translationPath}language`)}</div>
      <div className="info-cell">
        <Chip
          label={
            <>
              <img
                width="22"
                src={localLanguage?.icon}
                alt={t(`${translationPath}${localLanguage?.key}`)}
                className="language-img mx-1"
              />
              <span>{localLanguage?.key}</span>
            </>
          }
        />
      </div>
      <div className="info-cell">{t(`${translationPath}active-stages`)}</div>
      <div className="info-cell">{activePipeline?.stages_count}</div>
      <div className="info-cell">{t(`${translationPath}search-labels`)}</div>
      <div
        role="button"
        className="info-cell px-0"
        onDoubleClick={doubleClickHandler(['tags'], activePipeline)}
        tabIndex={-1}
      >
        {(Object.hasOwn(editMode, 'tags') && (
          <div className="d-inline-flex px-2">
            <SharedAutocompleteControl
              editValue={editMode.tags}
              placeholder="enter-search-labels"
              title="search-labels"
              // title="condition"
              isFreeSolo
              stateKey="tags"
              errorPath="tags"
              onValueChanged={changeEditValue}
              isSubmitted={isSubmitted}
              errors={errors}
              type={DynamicFormTypesEnum.array.key}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              isFullWidth
            />
            <ButtonBase
              className="btns-icon theme-transparent mx-1 mt-1"
              onClick={submitValueHandler}
              disabled={isLoading}
            >
              <span className="fas fa-check"></span>
            </ButtonBase>
            <ButtonBase
              className="btns-icon theme-transparent c-danger mx-1 mt-1"
              onClick={onCloseEditModeHandler(['tags'])}
            >
              <span className="fas fa-times"></span>
            </ButtonBase>
          </div>
        ))
          || activePipeline?.tags?.map((item) => (
            <Chip key={item} label={item} className="mx-2" />
          ))
          || 'N/A'}
      </div>
    </div>
  );
};

PipelineDetailsTab.propTypes = {
  // jobUUID: PropTypes.string,
  activeJob: PropTypes.shape({
    position: PropTypes.string,
    teams_invite: PropTypes.array,
  }),
  onCloseEditModeHandler: PropTypes.func.isRequired,
  submitValueHandler: PropTypes.func.isRequired,
  onKeyDownHandler: PropTypes.func.isRequired,
  changeEditValue: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  errors: PropTypes.shape({}),
  editMode: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    tags: PropTypes.array,
  }),
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
  }),
  doubleClickHandler: PropTypes.func.isRequired,
  translationPath: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
