import {
  Avatar,
  ButtonBase,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from '@mui/material';
import { DialogComponent } from 'components';
import { showError, SetGlobalFullAccess, SetGlobalCompanyId } from 'helpers';
import i18next from 'i18next';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  GetAllSetupsUserBranches,
  AcceptProviderInvitation,
  GetProviderInvitationDetails,
  GetAllProviderInvitations,
} from 'services';
import { updateAccount } from 'stores/actions/accountActions';
import { updateBranches } from 'stores/actions/branchesActions';
import { updatePermissions } from 'stores/actions/permissionsActions';
import { updateSelectedBranch } from 'stores/actions/selectedBranchActions';
// import ElevatusImage from '../../assets/images/shared/Elevatus-blu.png';
import { UserTypes } from 'stores/types/userTypes';
import { ProfileSourcesTypesEnum } from '../../enums';

const parentTranslationPath = 'ProviderPage';
const translationPath = '';

const ProviderPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const dispatch = useDispatch();
  const bodyRef = useRef();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState();
  const [invitationsList, setInvitationsList] = useState({
    results: [],
    // totalCount: 0
  });
  const [selectedInvitation, setSelectedInvitation] = useState(null);
  const [isTermsDialogOpen, setIsTermsDialogOpen] = useState(false);
  const [invitationDetails, setInvitationDetails] = useState(null);
  const [source, setSource] = useState(null);

  const userReducer = useSelector((state) => state?.userReducer);

  const GetAllInvitationsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllProviderInvitations({});
    if (response && response.status === 200) {
      setInvitationsList({ results: response.data?.results });
      if (response.data?.results?.[0])
        setSelectedInvitation(response.data.results[0]);
    } else {
      setInvitationsList({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
    setIsLoading(false);
  }, [t]);

  const SelectInvitationHandler = useCallback((invitation) => {
    setSelectedInvitation(invitation);
  }, []);

  const GetInvitationDetailsHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetProviderInvitationDetails({
      uuid: selectedInvitation?.uuid,
      account_uuid: selectedInvitation?.account_uuid,
    });
    if (response && response.status === 200) {
      setInvitationDetails(response.data?.results);
      setIsTermsDialogOpen(true);
    } else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      setInvitationDetails(null);
    }

    setIsLoading(false);
  }, [selectedInvitation, t]);

  const AcceptInvitationHandler = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoading(true);
      const response = await AcceptProviderInvitation({
        user_uuid: userReducer?.results?.user?.uuid,
        account_uuid: selectedInvitation?.account_uuid,
        uuid: selectedInvitation?.uuid,
        invitation_status: 'confirmed',
      });
      if (response && response.status === 200) {
        if (
          response?.data?.results?.type === ProfileSourcesTypesEnum.Agency.userType
        ) {
          window?.ChurnZero?.push([
            'setAppKey',
            process.env.REACT_APP_CHURNZERO_KEY,
          ]);
          window?.ChurnZero?.push([
            'setContact',
            selectedInvitation?.account_uuid,
            userReducer?.results?.user?.uuid,
          ]);
          window?.ChurnZero?.push([
            'setAttribute',
            'contact',
            {
              'First Name': userReducer?.results?.user?.first_name?.en,
              'Last Name': userReducer?.results?.user?.last_name?.en,
              Email: userReducer?.results?.user?.email,
              'Is Employee': userReducer?.results?.user?.is_employee,
            },
          ]);
          window?.ChurnZero?.push([
            'trackEvent',
            `EVA-Agency - Agency accepted and activated`,
            `Agency accepted and activated`,
            1,
            {},
          ]);
        }

        const res = await GetAllSetupsUserBranches();
        if (res && (res.status === 200 || res.status === 202)) {
          if (res.data.results.is_provider) setSource(res.data.results.source_uuid);
          dispatch(
            updateAccount({
              account_uuid: selectedInvitation?.account_uuid,
              accountsList: res?.data?.results?.list,
            }),
          );
          const branches = res.data.results?.list
            ?.find((item) => item.account.uuid === selectedInvitation?.account_uuid)
            ?.access?.map((item) => item.branch);
          const firstAccessibleBranch = branches?.find((item) => item?.can_access);
          if (firstAccessibleBranch)
            dispatch(
              updateSelectedBranch(
                firstAccessibleBranch,
                userReducer?.results?.user,
              ),
            );
          if (firstAccessibleBranch?.uuid)
            SetGlobalCompanyId(firstAccessibleBranch?.uuid);
          dispatch(
            updateBranches({
              results: branches,
              totalCount: branches?.length,
              excluded_countries: res?.data?.results?.excluded_countries,
            }),
          );
          dispatch(
            updatePermissions({
              permissions: firstAccessibleBranch?.permission || [],
              full_access: firstAccessibleBranch?.full_access,
            }),
          );
          SetGlobalCompanyId(firstAccessibleBranch?.uuid);
          SetGlobalFullAccess(firstAccessibleBranch?.full_access);
          history.push('/provider/profile'); //make sure to select account and save it after redirecting
        } else showError(t('failed-to-get-saved-data'), res);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
      setIsLoading(false);
    },
    [userReducer, selectedInvitation, t, history, dispatch],
  );

  useEffect(() => {
    GetAllInvitationsHandler();
  }, [GetAllInvitationsHandler]);

  useEffect(() => {
    if (source)
      dispatch({
        type: UserTypes.UPDATE_SOURCE_UUID,
        payload: source,
      });
  }, [source]);

  return (
    <div className="m-4 d-flex-column-center">
      {selectedInvitation && (
        <Card sx={{ width: '50vw', marginBottom: '1rem' }}>
          <div className="d-flex-column-center m-4">
            <Avatar
              alt="company logo"
              src={selectedInvitation?.account_logo_url}
              sx={{
                bgcolor: '#DCDCF8',
                color: '#484964',
                width: '6rem!important',
                height: '6rem!important',
              }}
              variant="rounded"
            />
            <div className="my-2">
              <span className="my-2 fw-bold fz-22px">
                {`${
                  selectedInvitation?.name?.[i18next.language]
                  || selectedInvitation?.name?.en
                } ${t(`${translationPath}invites-you-to-space`)}`}
              </span>
            </div>
            <div className="my-2">{t(`${translationPath}invitation-note`)}</div>
            <ButtonBase
              disabled={isLoading}
              onClick={GetInvitationDetailsHandler}
              className="btns theme-solid mx-3 mt-2 px-6"
            >
              <span className="px-1">{t(`${translationPath}continue`)}</span>
              <span className="fas fa-long-arrow-alt-right" />
            </ButtonBase>
          </div>
        </Card>
      )}
      <Card sx={{ width: '50vw' }}>
        <CardHeader
          disableTypography
          title={<div>{t(`${translationPath}other-pending`)}</div>}
        />
        <Divider />
        <CardContent>
          <div className="d-flex-center">
            <div
              className=""
              ref={bodyRef}
              style={{ width: '100%', maxHeight: '50vh', overflow: 'auto' }}
            >
              {invitationsList
                && invitationsList.results
                && invitationsList.results.map((invitation) => (
                  <div key={invitation.uuid} className="d-flex-h-between py-2">
                    <div className="d-flex">
                      <div className="mx-2">
                        <Avatar
                          sx={{ bgcolor: '#DCDCF8', color: '#484964' }}
                          variant="rounded"
                          src={invitation?.account_logo_url}
                        />
                      </div>
                      <div className="mx-2">
                        <div className="invitation-title">
                          {invitation.name[i18next.language] || invitation.name.en}
                        </div>
                        <div className="invitation-details">
                          <span className="fz-12px">
                            {`${t(`${translationPath}you-are-invited-by`)} ${
                              invitation.invite_by_email
                            }`}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex fa-start fj-end max-width-fit">
                      <ButtonBase
                        className="btns theme-outline sm-btn"
                        onClick={() => SelectInvitationHandler(invitation)}
                        disabled={selectedInvitation?.uuid === invitation.uuid}
                      >
                        <span className="px-1">{t(`${translationPath}view`)}</span>
                      </ButtonBase>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
      {isTermsDialogOpen && invitationDetails && (
        <DialogComponent
          maxWidth={invitationDetails?.terms_conditions_content ? 'md' : 'sm'}
          titleText="terms-and-conditions"
          dialogContent={
            <div className="px-4">
              {invitationDetails?.terms_conditions_content ? (
                <p
                  dangerouslySetInnerHTML={{
                    __html: invitationDetails.terms_conditions_content,
                  }}
                />
              ) : (
                <p style={{ textAlign: 'center' }}>
                  {t(`${translationPath}no-terms`)}
                </p>
              )}
            </div>
          }
          isOpen={isTermsDialogOpen}
          isSaving={isLoading}
          onSubmit={AcceptInvitationHandler}
          onCloseClicked={() => {
            setIsTermsDialogOpen(false);
          }}
          onCancelClicked={() => {
            setIsTermsDialogOpen(false);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          saveText="accept-and-join"
        />
        //add attachment
      )}
    </div>
  );
};

export default ProviderPage;
