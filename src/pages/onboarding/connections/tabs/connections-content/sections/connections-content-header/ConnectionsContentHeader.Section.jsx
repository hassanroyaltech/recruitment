import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import './ConnectionsContentHeader.Style.scss';
import { SharedInputControl } from '../../../../../../setups/shared';
import { PopoverComponent } from '../../../../../../../components';
import { OnboardingTypesEnum, SystemActionsEnum } from '../../../../../../../enums';

export const ConnectionsContentHeaderSection = ({
  activeConnections,
  isLoading,
  onConnectionsClicked,
  onFilterChanged,
  popoverAttachedWith,
  onPopoverAttachedWithChanged,
  onIsOpenDialogsChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);

  /**
   * @param popoverKey - the key of the popover
   * @param event - the event of attached item
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the popover
   */
  const popoverToggleHandler = useCallback(
    (popoverKey, event = undefined) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );
  return (
    <div className="connections-content-header-actions-wrapper actions-wrapper pt-3">
      <div className="actions-section-wrapper">
        <div className="d-inline-flex px-3 mb-3 mt-2">
          {activeConnections.folder && (
            <div className="header-text">{activeConnections.folder.title}</div>
          )}
        </div>
        <div className="d-inline-flex flex-wrap">
          <SharedInputControl
            parentTranslationPath="Shared"
            // editValue={candidatesFilters.search}
            isDisabled={isLoading}
            stateKey="search"
            themeClass="theme-transparent"
            placeholder="search"
            wrapperClasses="small-control px-2"
            onInputBlur={(newValue) => {
              onFilterChanged({ search: newValue.value });
            }}
            executeOnInputBlur
            onKeyDown={(event) => {
              if (event.key === 'Enter')
                onFilterChanged({ search: event.target.value });
            }}
            startAdornment={
              <div className="start-adornment-wrapper mx-2 mt-1 c-gray-primary">
                <span className="fas fa-search" />
              </div>
            }
          />
          <ButtonBase
            className="btns theme-transparent miw-0 mb-3 c-gray-primary"
            disabled
            onClick={() => onIsOpenDialogsChanged('filters', true)}
          >
            <span>{t(`Shared:filters`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns theme-transparent miw-0 mb-3 c-gray-primary"
            disabled
            onClick={onConnectionsClicked({
              key:
                (activeConnections.folder && OnboardingTypesEnum.Folders.key)
                || OnboardingTypesEnum.Spaces.key,
              selectedItem: activeConnections.folder || activeConnections.space,
              actionKey: SystemActionsEnum.edit.key,
            })}
          >
            <span>{t(`Shared:edit`)}</span>
          </ButtonBase>
          <ButtonBase
            className="btns-icon theme-transparent mb-3 c-gray-primary"
            onClick={(e) => popoverToggleHandler('more', e)}
          >
            <span className="fas fa-ellipsis-v" />
          </ButtonBase>
        </div>
      </div>

      <PopoverComponent
        idRef="morePopoverRef"
        attachedWith={popoverAttachedWith.more}
        handleClose={() => popoverToggleHandler('more')}
        popoverClasses="connections-actions-popover"
        component={
          <div className="d-flex-column actions-items-wrapper">
            <ButtonBase
              className="btns theme-transparent mx-0 miw-0 c-gray-primary"
              disabled={!activeConnections.folder}
              onClick={() => {
                popoverToggleHandler('more');
                onConnectionsClicked({
                  key: OnboardingTypesEnum.Folders.key,
                  selectedItem: activeConnections.folder,
                  actionKey: SystemActionsEnum.edit.key,
                })();
              }}
            >
              <span className={SystemActionsEnum.edit.icon} />
              <span className="px-2">{t(`${translationPath}edit-folder`)}</span>
            </ButtonBase>
            <ButtonBase
              className="btns theme-transparent mx-0 miw-0 c-gray-primary"
              onClick={() => {
                popoverToggleHandler('more');
                onConnectionsClicked({
                  key: OnboardingTypesEnum.Flows.key,
                })();
              }}
            >
              <span className={SystemActionsEnum.add.icon} />
              <span className="px-2">{t(`${translationPath}create-a-flow`)}</span>
            </ButtonBase>
            <ButtonBase
              className="btns theme-transparent mx-0 miw-0 c-gray-primary"
              onClick={() => {
                popoverToggleHandler('more');
                onConnectionsClicked({
                  inviteLocation: 'inner',
                })();
              }}
            >
              <span className="fas fa-user-plus" />
              <span className="px-2">{t(`${translationPath}invite-newcomers`)}</span>
            </ButtonBase>
            <div className="separator-h my-2" />
            <ButtonBase
              className="btns theme-transparent mx-0 miw-0 c-gray-primary"
              disabled={!activeConnections.folder}
              onClick={() => {
                popoverToggleHandler('more');
                onConnectionsClicked({
                  key: OnboardingTypesEnum.Folders.key,
                  selectedItem: activeConnections.folder,
                  actionKey: SystemActionsEnum.delete.key,
                })();
              }}
            >
              <span className={SystemActionsEnum.delete.icon} />
              <span className="px-2">{t(`${translationPath}delete-folder`)}</span>
            </ButtonBase>
          </div>
        }
      />
    </div>
  );
};

ConnectionsContentHeaderSection.propTypes = {
  activeConnections: PropTypes.shape({
    space: PropTypes.instanceOf(Object),
    folder: PropTypes.instanceOf(Object),
  }).isRequired,
  popoverAttachedWith: PropTypes.shape({
    more: PropTypes.instanceOf(Object),
  }).isRequired,
  isLoading: PropTypes.bool.isRequired,
  onFilterChanged: PropTypes.func.isRequired,
  onPopoverAttachedWithChanged: PropTypes.func.isRequired,
  onConnectionsClicked: PropTypes.func.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
