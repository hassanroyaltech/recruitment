import React, {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { DialogComponent, LoadableImageComponant } from '../../../../components';
import image_url from '../../../../assets/img/logo/elevatus-dark-blue.png';
import ButtonBase from '@mui/material/ButtonBase';
import { useTranslation } from 'react-i18next';
import {
  copyTextToClipboard,
  showError,
  showSuccess,
} from '../../../../helpers';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../setups/shared';
import {
  GetElevatusSDKDetails,
  GenerateElevatusSDK,
  RevokeElevatusSDK,
} from '../../../../services/ElevatusSDK.Services';
import { SyncIcon } from '../../../../assets/icons';

const ElevatusSDKCard = ({
  isLoading,
  isOpenDialog,
  onIsOpenDialogsChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const stateInitRef = useRef({
    username: undefined,
    password: undefined,
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getElevatusSDKDetailsHandler = useCallback(async () => {
    setIsLocalLoading(true);
    const response = await GetElevatusSDKDetails();
    setIsLocalLoading(false);
    if (response && response.status === 200) {
      if (response.data.application)
        onStateChanged({
          id: 'edit',
          value: response.data.application,
        });
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  const generateElevatusSDKHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLocalLoading(true);
      const response = await GenerateElevatusSDK(state);
      setIsLocalLoading(false);
      if (response && response.status === 201) {
        if (response.data.application)
          onStateChanged({
            id: 'edit',
            value: response.data.application,
          });
        showSuccess(
          response.data.message
            || showSuccess(t(`${translationPath}elevatus-sdk-generated-successfully`)),
        );
        onIsOpenDialogsChanged('elevatusSDK', false, true)();
      } else
        showError(t(`${translationPath}elevatus-sdk-generate-failed`), response);
    },
    [state, t, translationPath, onIsOpenDialogsChanged],
  );

  const revokeElevatusSDKHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLocalLoading(true);
      const response = await RevokeElevatusSDK();
      setIsLocalLoading(false);
      if (response && response.status === 200) {
        onStateChanged({ id: 'edit', value: { ...stateInitRef.current } });
        showSuccess(t(`${translationPath}elevatus-sdk-revoked-successfully`));
        onIsOpenDialogsChanged('elevatusSDK', false, true)();
      } else showError(t(`${translationPath}elevatus-sdk-revoke-failed`), response);
    },
    [onIsOpenDialogsChanged, t, translationPath],
  );

  useEffect(() => {
    void getElevatusSDKDetailsHandler();
    if (isOpenDialog) setIsShowPassword(false);
  }, [getElevatusSDKDetailsHandler, isOpenDialog]);

  return (
    <div className="integrations-card-wrapper card-wrapper">
      <div className="integrations-card-body">
        <div className="integrations-card-row image-wrapper mb-3">
          <LoadableImageComponant
            src={image_url}
            defaultImage={SyncIcon()}
            classes="integration-image"
            alt={t(`${translationPath}elevatus-sdk`)}
          />
        </div>
        <div className="integrations-card-row header-text">
          <span>{t(`${translationPath}elevatus-sdk`)}</span>
        </div>
        <div className="integrations-card-row">
          <span>{t(`${translationPath}elevatus-sdk-description`)}</span>
        </div>
      </div>
      <div className="integrations-card-footer with-switch">
        {state.uuid && (
          <ButtonBase
            className="btns theme-transparent"
            onClick={onIsOpenDialogsChanged('elevatusSDK', true, false)}
            disabled={isLocalLoading || isLoading}
          >
            <span>{t(`${translationPath}configure`)}</span>
          </ButtonBase>
        )}
        {!state.uuid && (
          <ButtonBase
            className="btns theme-transparent"
            onClick={generateElevatusSDKHandler}
            disabled={isLocalLoading || isLoading}
          >
            <span>{t(`${translationPath}generate`)}</span>
          </ButtonBase>
        )}
      </div>
      {isOpenDialog && (
        <DialogComponent
          titleText="elevatus-sdk-title"
          wrapperClasses="integrations-management-dialog-wrapper"
          dialogContent={
            <div className="integrations-management-content-dialog-wrapper">
              <SharedInputControl
                isFullWidth
                isRequired
                stateKey="username"
                isDisabled
                editValue={state.username}
                inlineLabel="user-name-key"
                onValueChanged={onStateChanged}
                placeholder="user-name-key"
                endAdornment={
                  <>
                    <ButtonBase
                      className="btns-icon mx-2 theme-transparent"
                      onClick={() => copyTextToClipboard(state.username)}
                    >
                      <span className={`c-gray-secondary-before far fa-copy px-2`} />
                    </ButtonBase>
                  </>
                }
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
              />
              <SharedInputControl
                type={(isShowPassword && 'text') || 'password'}
                isFullWidth
                isRequired
                stateKey="password"
                isDisabled
                editValue={state.password}
                inlineLabel="password"
                onValueChanged={onStateChanged}
                placeholder="password"
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                autoComplete="new-password"
                startAdornment={
                  <span className="ni ni-lock-circle-open c-gray-before mx-2p85" />
                }
                endAdornment={
                  <>
                    <ButtonBase
                      className="btns-icon mx-2 theme-transparent"
                      onClick={() => setIsShowPassword((items) => !items)}
                    >
                      <span
                        className={`c-gray-secondary-before far fa-${
                          (isShowPassword && 'eye-slash') || 'eye'
                        } px-2`}
                      />
                    </ButtonBase>
                    <ButtonBase
                      className="btns-icon mx-2 theme-transparent"
                      onClick={() => copyTextToClipboard(state.password)}
                    >
                      <span className={`c-gray-secondary-before far fa-copy px-2`} />
                    </ButtonBase>
                  </>
                }
              />
            </div>
          }
          isOpen={isOpenDialog}
          onSubmit={
            state.uuid ? revokeElevatusSDKHandler : generateElevatusSDKHandler
          }
          saveText={state.uuid ? 'revoke' : 'generate'}
          isSaving={isLoading || isLocalLoading}
          maxWidth="sm"
          saveClasses={`btns theme-solid ${state.uuid ? 'bg-danger' : 'bg-primary'}`}
          onCloseClicked={onIsOpenDialogsChanged('elevatusSDK', false, true)}
          onCancelClicked={onIsOpenDialogsChanged('elevatusSDK', false, true)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
      )}
    </div>
  );
};

ElevatusSDKCard.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  isOpenDialog: PropTypes.bool.isRequired,
  onIsOpenDialogsChanged: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default memo(ElevatusSDKCard);
