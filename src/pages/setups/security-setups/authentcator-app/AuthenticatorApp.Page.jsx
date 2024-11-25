import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Grid } from '@mui/material';
import { SetupAuthenticatorAppDialog } from '../../shared/dialogs/authenticator-app/SetupAuthenticatorApp.Dialog';
import {
  DeleteAuthenticatorApp,
  GetAuthenticatorApp,
} from '../../../../services/SetupsAuthenticatorApp.Services';
import { showError } from '../../../../helpers';
import Avatar from '@mui/material/Avatar';
import { ConfirmDeleteDialog } from '../../shared';
import { Card, CardBody, CardHeader } from 'reactstrap';
import styled from 'styled-components';
import { ChangeAuthenticatorAppDialog } from '../../shared/dialogs/change-authenticator-app/ChangeAuthenticatorApp.Dialog';
import { RecoveryCodeDialog } from '../../shared/dialogs/recover-code/RecoveryCode.Dialog';
import moment from 'moment/moment';
import i18next from 'i18next';
import { MicrosoftAuthenticatorIcon } from '../../../../assets/icons/MicrosoftAuthenticator.Icon';
import { GoogleAuthenticatorIcon } from '../../../../assets/icons/GoogleAuthenticator.Icon';
import { AegisAuthenticatorIcon } from '../../../../assets/icons/AegisAuthenticator.Icon';

const GridRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  width: 100%;
`;

const parentTranslationPath = 'SetupsPage';
const translationPath = 'SecurityPages.';
const AuthenticatorAppPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenSetupAuthenticatorAppDialog, setIsOpenSetupAuthenticatorAppDialog]
    = useState(false);
  const [isOpenChangeAuthenticatorAppDialog, setIsOpenChangeAuthenticatorAppDialog]
    = useState(false);
  const [isOpenRecoverDialog, setIsOpenRecoveryDialog] = useState(false);
  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState(false);
  const [dialogType, setDialogType] = useState({
    change: false,
    remove: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [reLoad, setReLoad] = useState({});
  const [authenticatedAppData, setAuthenticatedAppData] = useState();

  const getAuthenticatedApp = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAuthenticatorApp();
    setIsLoading(false);
    if (response && response.status === 200)
      setAuthenticatedAppData(response.data.results);
    else showError(t('Shared:failed-to-get-saved-data'));
  }, [t]);

  useEffect(() => {
    getAuthenticatedApp();
  }, [getAuthenticatedApp, reLoad]);

  return (
    <>
      <div className="Authenticator-app-wrapper page-wrapper px-4 pb-3">
        <span className="header-text-x2 d-flex mb-1">
          {t(`${translationPath}authenticator-app`)}
        </span>
        <div className="body-item-wrapper">
          <div className="description-text">
            {t(`${translationPath}authenticator-app-description`)}
          </div>
          <br />
          <div className="description-text py-1">
            {t(`${translationPath}authenticator-app-description-text`)}
            <p className="px-1 py-1">
              <a
                href="https://go.microsoft.com/fwlink/p/?LinkID=2168850&clcid=0x409&culture=en-us&country=US"
                target="_blank"
                rel="noreferrer"
              >
                <MicrosoftAuthenticatorIcon />{' '}
                {t(`${translationPath}microsoft-authenticator`)}
              </a>
            </p>
            <p className="px-1 py-1">
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1"
                target="_blank"
                rel="noreferrer"
              >
                <GoogleAuthenticatorIcon />{' '}
                {t(`${translationPath}google-authenticator`)}
              </a>
            </p>
            <p className="px-1 py-1">
              <a
                href="https://play.google.com/store/apps/details?id=com.beemdevelopment.aegis"
                target="_blank"
                rel="noreferrer"
              >
                <AegisAuthenticatorIcon />
                {t(`${translationPath}aegis-authenticator`)}
              </a>
            </p>
          </div>
          {!authenticatedAppData && (
            <div className="body-item-wrapper mt-3">
              <ButtonBase
                className="btns theme-solid"
                onClick={() => setIsOpenSetupAuthenticatorAppDialog(true)}
              >
                <i className="fas fa-plus" />
                <span className="pl-1-reversed">
                  {' '}
                  {t(`${translationPath}setup-authenticator-app`)}
                </span>
              </ButtonBase>
            </div>
          )}
          {authenticatedAppData && (
            <div className="d-flex-h-center">
              {!isLoading && (
                <Card className="card-contents-wrapper authenticator-item-wrapper card h-100 mt-5">
                  <CardHeader>
                    <p className="d-flex-h-center text-bold-700">
                      {t(`${translationPath}your-authenticator-app`)}
                    </p>
                  </CardHeader>
                  <CardBody>
                    <Grid>
                      <GridRow className="bd-highlight d-flex-h-center">
                        <Avatar />
                        <ButtonBase
                          className="ml-2 text-blue text-bold-700"
                          onClick={() => {
                            setDialogType({
                              change: true,
                              remove: false,
                            });
                            setIsOpenChangeAuthenticatorAppDialog(true);
                          }}
                        >
                          {t(`${translationPath}change-authenticator-app`)}
                        </ButtonBase>
                        <ButtonBase
                          className="ml-3"
                          onClick={() => {
                            setDialogType({
                              change: false,
                              remove: true,
                            });
                            setIsOpenChangeAuthenticatorAppDialog(true);
                          }}
                        >
                          <span className="fas fa-trash fa-xs text-danger fa-1x" />
                        </ButtonBase>
                      </GridRow>
                    </Grid>
                    <div className="d-flex-h-center">
                      <p className="text-sm">
                        {t(`${translationPath}added`)}{' '}
                        {moment(Date.parse(authenticatedAppData?.created_at))
                          .locale(i18next.language)
                          .fromNow()}{' '}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>
      {isOpenSetupAuthenticatorAppDialog && (
        <SetupAuthenticatorAppDialog
          isOpen={isOpenSetupAuthenticatorAppDialog}
          isOpenChanged={() => setIsOpenSetupAuthenticatorAppDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setReLoad={setReLoad}
          onSave={() => {
            setIsOpenSetupAuthenticatorAppDialog(false);
            setIsOpenRecoveryDialog(true);
          }}
        />
      )}
      {isOpenRecoverDialog && (
        <RecoveryCodeDialog
          isOpen={isOpenRecoverDialog}
          isOpenChanged={() => setIsOpenRecoveryDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          authenticatedAppDataEmail={authenticatedAppData?.email}
        />
      )}
      {isOpenChangeAuthenticatorAppDialog && (
        <ChangeAuthenticatorAppDialog
          isOpen={isOpenChangeAuthenticatorAppDialog}
          isOpenChanged={() => setIsOpenChangeAuthenticatorAppDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          setReLoad={setReLoad}
          authenticatedAppDataEmail={authenticatedAppData?.email}
          dialogType={dialogType}
          onSave={() => {
            setIsOpenChangeAuthenticatorAppDialog(false);
            setIsOpenSetupAuthenticatorAppDialog(true);
          }}
          onSaveDelete={() => {
            setIsOpenChangeAuthenticatorAppDialog(false);
            setIsOpenDeleteDialog(true);
          }}
        />
      )}
      {isOpenDeleteDialog && (
        <ConfirmDeleteDialog
          onSave={() => {
            setReLoad((prev) => ({ ...prev }));
          }}
          isOpenChanged={() => {
            setIsOpenDeleteDialog(false);
          }}
          deleteApi={DeleteAuthenticatorApp}
          successMessage="authenticator-app-deleted-successfully"
          descriptionMessage="authenticator-app-delete-description"
          apiProps={{
            app_uuid: authenticatedAppData?.uuid,
          }}
          apiDeleteKey="app_uuid"
          isOpen={isOpenDeleteDialog}
          errorMessage="authenticator-app-delete-failed"
          parentTranslationPath={parentTranslationPath}
        />
      )}
    </>
  );
};
export default AuthenticatorAppPage;
