import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ConnectionsCardSection } from './sections';
import { LoaderComponent } from '../../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import { OnboardingTypesEnum } from '../../../../../enums';
import { getIsAllowedPermissionV2 } from '../../../../../helpers';
import {
  ManageFlowPermissions,
  ManageFolderPermissions,
} from '../../../../../permissions';
import { useSelector } from 'react-redux';

export const ConnectionsContentTab = ({
  activeConnections,
  isLoading,
  // onIsOpenDialogsChanged,
  // popoverAttachedWith,
  // onPopoverAttachedWithChanged,
  onConnectionsClicked,
  // onFilterChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  return (
    <div className="connections-content-tab-wrapper tab-content-wrapper pt-4">
      {/*<ConnectionsContentHeaderSection*/}
      {/*  isLoading={isLoading}*/}
      {/*  onFilterChanged={onFilterChanged}*/}
      {/*  onIsOpenDialogsChanged={onIsOpenDialogsChanged}*/}
      {/*  translationPath={translationPath}*/}
      {/*  activeConnections={activeConnections}*/}
      {/*  popoverAttachedWith={popoverAttachedWith}*/}
      {/*  parentTranslationPath={parentTranslationPath}*/}
      {/*  onPopoverAttachedWithChanged={onPopoverAttachedWithChanged}*/}
      {/*  onConnectionsClicked={onConnectionsClicked}*/}
      {/*/>*/}
      {(!isLoading
        && ((activeConnections.folder && (
          <>
            <ConnectionsCardSection
              items={activeConnections.folder.flows}
              onConnectionsClicked={onConnectionsClicked}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
            {activeConnections.folder.flows && (
              <>
                <ButtonBase
                  className="connections-card-wrapper bg-transparent"
                  onClick={onConnectionsClicked({
                    key: OnboardingTypesEnum.Flows.key,
                  })}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: ManageFlowPermissions.CreateFlow.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <div className="connections-card-body">
                    <div className="connections-card-row mb-3">
                      <span
                        className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`}
                      />
                    </div>
                    <div className="connections-card-row title-wrapper">
                      <span className="header-text">
                        {t(`${translationPath}create-a-flow`)}
                      </span>
                    </div>
                    <div className="connections-card-row">
                      <span className="description-text fz-14px">
                        {t(`${translationPath}create-flow-description`)}
                      </span>
                    </div>
                  </div>
                </ButtonBase>

                <ButtonBase
                  className="connections-card-wrapper bg-transparent"
                  onClick={onConnectionsClicked({
                    key: OnboardingTypesEnum.Flows.key,
                    isSurvey: true,
                  })}
                  disabled={
                    !getIsAllowedPermissionV2({
                      permissionId: ManageFlowPermissions.CreateFlow.key,
                      permissions: permissionsReducer,
                    })
                  }
                >
                  <div className="connections-card-body">
                    <div className="connections-card-row mb-3">
                      <span
                        className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`}
                      />
                    </div>
                    <div className="connections-card-row title-wrapper">
                      <span className="header-text">
                        {t(`${translationPath}create-a-survey`)}
                      </span>
                    </div>
                    <div className="connections-card-row">
                      <span className="description-text fz-14px">
                        {t(`${translationPath}create-survey-description`)}
                      </span>
                    </div>
                  </div>
                </ButtonBase>
              </>
            )}
          </>
        ))
          || (activeConnections.space && (
            <>
              <ConnectionsCardSection
                items={activeConnections.space.folders}
                isFolder
                onConnectionsClicked={onConnectionsClicked}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              <ConnectionsCardSection
                items={activeConnections.space.flows}
                onConnectionsClicked={onConnectionsClicked}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              {activeConnections.space.folders.length === 0
                && activeConnections.space.flows.length === 0 && (
                <>
                  <ButtonBase
                    className="connections-card-wrapper bg-transparent"
                    onClick={onConnectionsClicked({
                      key: OnboardingTypesEnum.Folders.key,
                    })}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: ManageFolderPermissions.CreateFolder.key,
                        permissions: permissionsReducer,
                      })
                    }
                  >
                    <div className="connections-card-body">
                      <div className="connections-card-row mb-3">
                        <span
                          className={`fz-before-18px ${OnboardingTypesEnum.Folders.icon}`}
                        />
                      </div>
                      <div className="connections-card-row title-wrapper">
                        <span className="header-text">
                          {t(`${translationPath}create-a-folder`)}
                        </span>
                      </div>
                      <div className="connections-card-row">
                        <span className="description-text fz-14px">
                          {t(`${translationPath}create-folder-description`)}
                        </span>
                      </div>
                    </div>
                  </ButtonBase>
                  <ButtonBase
                    className="connections-card-wrapper bg-transparent"
                    onClick={onConnectionsClicked({
                      key: OnboardingTypesEnum.Flows.key,
                    })}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: ManageFlowPermissions.CreateFlow.key,
                        permissions: permissionsReducer,
                      })
                    }
                  >
                    <div className="connections-card-body">
                      <div className="connections-card-row mb-3">
                        <span
                          className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`}
                        />
                      </div>
                      <div className="connections-card-row title-wrapper">
                        <span className="header-text">
                          {t(`${translationPath}create-a-flow`)}
                        </span>
                      </div>
                      <div className="connections-card-row">
                        <span className="description-text fz-14px">
                          {t(`${translationPath}create-flow-description`)}
                        </span>
                      </div>
                    </div>
                  </ButtonBase>
                  <ButtonBase
                    className="connections-card-wrapper bg-transparent"
                    onClick={onConnectionsClicked({
                      key: OnboardingTypesEnum.Flows.key,
                      isSurvey: true,
                    })}
                    disabled={
                      !getIsAllowedPermissionV2({
                        permissionId: ManageFlowPermissions.CreateFlow.key,
                        permissions: permissionsReducer,
                      })
                    }
                  >
                    <div className="connections-card-body">
                      <div className="connections-card-row mb-3">
                        <span
                          className={`fz-before-18px ${OnboardingTypesEnum.Flows.icon}`}
                        />
                      </div>
                      <div className="connections-card-row title-wrapper">
                        <span className="header-text">
                          {t(`${translationPath}create-a-survey`)}
                        </span>
                      </div>
                      <div className="connections-card-row">
                        <span className="description-text fz-14px">
                          {t(`${translationPath}create-survey-description`)}
                        </span>
                      </div>
                    </div>
                  </ButtonBase>
                </>
              )}
            </>
          )))) || (
        <LoaderComponent
          isLoading={isLoading}
          isSkeleton
          skeletonItems={[
            {
              variant: 'rectangular',
              style: { minHeight: 10, marginTop: 5, marginBottom: 5 },
            },
          ]}
          numberOfRepeat={4}
        />
      )}
    </div>
  );
};

ConnectionsContentTab.propTypes = {
  activeConnections: PropTypes.shape({
    space: PropTypes.instanceOf(Object),
    folder: PropTypes.instanceOf(Object),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  popoverAttachedWith: PropTypes.shape({
    more: PropTypes.instanceOf(Object),
  }).isRequired,
  onPopoverAttachedWithChanged: PropTypes.func.isRequired,
  onConnectionsClicked: PropTypes.func.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
