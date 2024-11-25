import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { LoadableImageComponant, TooltipsComponent } from '../../../../components';
import { SyncIcon } from '../../../../assets/icons';
import { ButtonBase } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { IntegrationsPartnersEnum, SystemActionsEnum } from '../../../../enums';

const IntegrationsCard = ({
  partner,
  isDisabled,
  getActivePartnerEnum,
  image_url,
  title,
  description,
  is_connected,
  onActionClicked,
  onConnectClicked,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  return (
    <div className="integrations-card-wrapper card-wrapper">
      <div className="integrations-card-body">
        <div className="integrations-card-row image-wrapper mb-3">
          <LoadableImageComponant
            src={image_url}
            defaultImage={SyncIcon()}
            classes="integration-image"
            alt={title}
          />
        </div>
        <div className="integrations-card-row header-text">
          <span>{title}</span>
        </div>
        <div className="integrations-card-row">
          <span>{description}</span>
        </div>
      </div>
      <div className="integrations-card-footer">
        {(!getActivePartnerEnum(partner).connectAPI
          || getActivePartnerEnum(partner).createConnectAPI) && (
          <ButtonBase
            className={`btns theme-${is_connected ? 'transparent' : 'solid'} my-2`}
            disabled={isDisabled || getActivePartnerEnum(partner).disabled}
            onClick={onConnectClicked({
              partner,
              image_url,
              title,
              description,
              is_connected,
            })}
          >
            <span>
              {t(`${translationPath}${is_connected ? 'connected' : 'connect'}`)}
            </span>
          </ButtonBase>
        )}
        {is_connected
          && (getActivePartnerEnum(partner).syncConnectAPI
            || getActivePartnerEnum(partner).syncConnectAfterRedirectAPI) && (
          <TooltipsComponent
            title="synchronize-lookups"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            contentComponent={
              <span className="mx-2">
                <ButtonBase
                  className="btns-icon theme-transparent mx-0 my-2"
                  disabled={isDisabled || getActivePartnerEnum(partner).disabled}
                  onClick={onActionClicked({
                    key: SystemActionsEnum.sync.key,
                    activePartner: {
                      partner,
                      image_url,
                      title,
                      description,
                      is_connected,
                    },
                  })}
                >
                  <span className="fas fa-sync" />
                </ButtonBase>
              </span>
            }
          />
        )}
        {is_connected && getActivePartnerEnum(partner).syncUsersAPI && (
          <TooltipsComponent
            title="synchronize-users"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            contentComponent={
              <span className="mx-2">
                <ButtonBase
                  className="btns-icon theme-transparent mx-0 my-2"
                  disabled={isDisabled || getActivePartnerEnum(partner).disabled}
                  onClick={onActionClicked({
                    key: SystemActionsEnum.syncUsers.key,
                    activePartner: {
                      partner,
                      image_url,
                      title,
                      description,
                      is_connected,
                    },
                  })}
                >
                  <span className="fas fa-sync" />
                </ButtonBase>
              </span>
            }
          />
        )}
        {!is_connected
          && getActivePartnerEnum(partner).connectAPI
          && !(
            getActivePartnerEnum(partner).createConnectAPI
            || getActivePartnerEnum(partner).updateConnectAPI
          ) && (
          <ButtonBase
            className="btns theme-solid my-2"
            disabled={isDisabled || getActivePartnerEnum(partner).disabled}
            onClick={onActionClicked({
              key: SystemActionsEnum.connect.key,
              activePartner: {
                partner,
                image_url,
                title,
                description,
                is_connected,
              },
            })}
          >
            <span>{t(`${translationPath}connect`)}</span>
          </ButtonBase>
        )}
        {is_connected && getActivePartnerEnum(partner).disconnectAPI && (
          <ButtonBase
            className="btns theme-transparent my-2"
            disabled={isDisabled || getActivePartnerEnum(partner).disabled}
            onClick={onActionClicked({
              key: SystemActionsEnum.disconnect.key,
              activePartner: {
                partner,
                image_url,
                title,
                description,
                is_connected,
              },
            })}
          >
            <span>{t(`${translationPath}disconnect`)}</span>
          </ButtonBase>
        )}
        {is_connected && getActivePartnerEnum(partner).settingsManagementDialog && (
          <TooltipsComponent
            title="settings"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            contentComponent={
              <span className="mx-2">
                <ButtonBase
                  className="btns-icon theme-transparent mx-0 my-2"
                  disabled={isDisabled || getActivePartnerEnum(partner).disabled}
                  onClick={onActionClicked({
                    key: SystemActionsEnum.settings.key,
                    activePartner: {
                      partner,
                      image_url,
                      title,
                      description,
                      is_connected,
                    },
                  })}
                >
                  <span className={SystemActionsEnum.settings.icon} />
                </ButtonBase>
              </span>
            }
          />
        )}
      </div>
    </div>
  );
};

IntegrationsCard.propTypes = {
  getActivePartnerEnum: PropTypes.func.isRequired,
  partner: PropTypes.oneOf(
    Object.values(IntegrationsPartnersEnum).map((item) => item.key),
  ).isRequired,
  image_url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  is_connected: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onConnectClicked: PropTypes.func.isRequired,
  onActionClicked: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default memo(IntegrationsCard);
