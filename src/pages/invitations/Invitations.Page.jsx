import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OnboardingMenuSection } from '../onboarding/sections';
import {
  FormsAssistRoleTypesEnum,
  FormsFollowOrderTypes,
  FormsForTypesEnum,
  FormsRolesEnum,
  NavigationSourcesEnum,
  OnboardingMenuForSourceEnum,
  OnboardingTypesEnum,
} from '../../enums';
import PageMessagesStatic from '../static/page-messages/PageMessages.Static';
import './Invitations.Style.scss';
import { LoaderComponent } from '../../components';
import InvitationsCardSection from './sections/invitations-card/InvitationsCard.Section';
import { useTranslation } from 'react-i18next';
import { useQuery, useTitle } from '../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { GetOnboardingFlowURL, GetOnboardingFlowURLRecipient } from '../../services';
import { useSelector } from 'react-redux';
import { GlobalHistory, showError } from '../../helpers';
import i18next from 'i18next';
import Logo from '../../assets/img/logo/elevatus-dark-blue.png';

const parentTranslationPath = 'InvitationsPage';
const translationPath = '';
const InvitationsPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}invitations`));
  const [isNoData, setIsNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingLink, setIsLoadingLink] = useState(false);
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const query = useQuery();
  const queriesRef = useRef({
    forType: query.get('for') && +query.get('for'),
    email: query.get('email'),
    follow_order: FormsFollowOrderTypes.Yes.key,
    editor_role:
      (query.get('editor_role') && +query.get('editor_role'))
      || FormsRolesEnum.InvitedMembers.key,
    role_type:
      (query.get('role_type') && +query.get('role_type'))
      || FormsAssistRoleTypesEnum.Editor.key,
  });
  const [isOpenSideMenu, setIsOpenSideMenu] = useState(true);
  const [activeConnections, setActiveConnections] = useState({
    space: null,
    folder: null,
  });
  const [onboardingList, setOnboardingList] = useState(() => ({
    spaces: [],
    folders: [],
    flows: [],
  }));
  const [selectedConnection, setSelectedConnection] = useState({
    space_uuid: null,
    folder_uuid: null,
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is set the no data state if there is no invitations
   * */
  const getIsWithoutData = useCallback((newValue) => {
    setIsNoData((item) => (item !== newValue ? newValue : item));
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the list of onboarding from child
   * */
  const getReturnedData = useCallback((newValue) => {
    setOnboardingList(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the list of onboarding from child
   * */
  const getIsActiveCollapseItem = useMemo(
    () =>
      ({ type, item }) =>
        type === OnboardingTypesEnum.Spaces.key
        && item.uuid === selectedConnection.space_uuid,
    [selectedConnection.space_uuid],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the list of onboarding from child
   * */
  const onActiveCollapseChange = useCallback(() => {
    if (selectedConnection.space_uuid) {
      const spaceItem = onboardingList.spaces.find(
        (space) => space.uuid === selectedConnection.space_uuid,
      );
      if (selectedConnection.folder_uuid) {
        const folderItem = onboardingList.folders.find(
          (folder) => folder.uuid === selectedConnection.folder_uuid,
        );
        setActiveConnections((items) => ({
          ...items,
          space: spaceItem,
          folder: folderItem,
        }));
      } else
        setActiveConnections((items) => ({
          ...items,
          space: spaceItem,
          folder: null,
        }));
    } else if (selectedConnection.folder_uuid) {
      const folderItem = onboardingList.folders.find(
        (folder) => folder.uuid === selectedConnection.folder_uuid,
      );
      setActiveConnections((items) => ({
        ...items,
        space: null,
        folder: folderItem,
      }));
    }
  }, [
    onboardingList.folders,
    onboardingList.spaces,
    selectedConnection.folder_uuid,
    selectedConnection.space_uuid,
  ]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the selected connection from child
   * */
  const getSelectedConnection = useCallback((newValue) => {
    setSelectedConnection(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to generate the redirect link to form for each flow
   * */
  const onInvitationCardClicked = useCallback(
    (item) => async () => {
      setIsLoadingLink(true);
      const response = await (
        (queriesRef.current.forType === FormsForTypesEnum.Candidate.key
          && GetOnboardingFlowURLRecipient)
        || GetOnboardingFlowURL
      )({
        uuid: item.uuid,
        ...queriesRef.current,
        ...(queriesRef.current.forType === FormsForTypesEnum.Candidate.key
          && candidateReducer && {
          company_uuid: candidateReducer.company?.uuid,
          token: candidateReducer.token,
          account_uuid: candidateReducer.account?.uuid,
        }),
      });
      setIsLoadingLink(false);
      if (response && response.status === 200)
        GlobalHistory.push(
          `${response.data.results.form_link}&source=${NavigationSourcesEnum.OnboardingInvitationsToFormBuilder.key}`,
        );
      else showError(t(`${translationPath}generate-form-link-failed`), response);
    },
    [t, candidateReducer],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the is loading from child
   * */
  const getIsLoading = useCallback((newValue) => {
    setIsLoading(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to toggle the side menu
   * */
  const onOpenedSideMenuChanged = useCallback((newValue) => {
    setIsOpenSideMenu(newValue);
  }, []);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get connection event from child
   * */
  const getOnConnectionsClicked = useCallback(
    ({ key, selectedItem, isCollapseAction }) => {
      if (!isCollapseAction && key === OnboardingTypesEnum.Flows.key)
        onInvitationCardClicked(selectedItem)();
    },
    [onInvitationCardClicked],
  );

  useEffect(() => {
    onActiveCollapseChange();
  }, [selectedConnection, onboardingList, onActiveCollapseChange]);
  useEffect(() => {
    let redirect_uri = query.get('redirect_uri');
    if (redirect_uri) {
      redirect_uri = decodeURIComponent(
        window.location.href.split('&redirect_uri=')[1],
      );
      let urlObj = new URL(window.location.href);
      let searchParams = urlObj.searchParams;
      searchParams.delete('redirect_uri');
      GlobalHistory.replace(`/onboarding/invitations?${searchParams.toString()}`);
      GlobalHistory.push(
        `/${redirect_uri}&source=${NavigationSourcesEnum.OnboardingInvitationsToFormBuilder.key}`,
      );
    }
  }, [query]);
  return (
    <div className="invitations-page page-wrapper">
      <div className="open-side-menu-wrapper">
        <ButtonBase
          className="btns-icon theme-transparent mx-0"
          onClick={() => onOpenedSideMenuChanged(true)}
        >
          <span className="fas fa-bars" />
        </ButtonBase>
      </div>
      <div className={`invitation-side-menu${(isOpenSideMenu && ' is-open') || ''}`}>
        <OnboardingMenuSection
          forSource={OnboardingMenuForSourceEnum.Invitations}
          getIsWithoutData={getIsWithoutData}
          getMenuHeader={() => (
            <div className="onboarding-side-menu-header">
              <div>
                <span className="menu-icon-wrapper">
                  <span className="fas fa-flag" />
                </span>
                <span className="fw-bold mx-2">
                  {t(`${translationPath}invitations`)}
                </span>
              </div>
              <ButtonBase
                className="btns theme-transparent miw-0 mx-0"
                onClick={() => onOpenedSideMenuChanged(false)}
              >
                <span className="fas fa-angle-double-left" />
              </ButtonBase>
            </div>
          )}
          isGlobalLoading={isLoadingLink}
          isWithSelectTheFirstItem
          getReturnedData={getReturnedData}
          getIsActiveCollapseItem={getIsActiveCollapseItem}
          getSelectedConnection={getSelectedConnection}
          getIsLoading={getIsLoading}
          getOnConnectionsClicked={getOnConnectionsClicked}
        />
      </div>
      <div className="invitations-page-content-wrapper">
        <div className="d-flex-v-center-h-end mx-3">
          <img
            className="brand-logo"
            alt={
              (candidateReducer
                && candidateReducer?.company?.name
                && (candidateReducer?.company?.name?.[i18next.language]
                  || candidateReducer?.company?.name?.en))
              || t('Shared:elevatus-logo')
            }
            src={
              (candidateReducer
                && candidateReducer?.company
                && candidateReducer?.company?.logo)
              || Logo
            }
          />
        </div>

        {(!isLoading && (
          <>
            {(activeConnections.space || activeConnections.folder) && (
              <>
                <div className="invitations-page-header">
                  <span className="header-text-x2 fz-30px c-gray">
                    <span>{t(`${translationPath}welcome-to`)}</span>
                    <span className="px-1 c-black-light">
                      {(candidateReducer
                        && candidateReducer?.company?.name
                        && (candidateReducer?.company?.name?.[i18next.language]
                          || candidateReducer?.company?.name?.en))
                        || ''}{' '}
                      {(activeConnections.space && activeConnections.space.title)
                        || (activeConnections.folder && activeConnections.folder.title)}
                    </span>
                    {/*<span>*/}
                    {/*  {(activeConnections.space && t(`${translationPath}space`))*/}
                    {/*    || (activeConnections.folder && t(`${translationPath}folder`))}*/}
                    {/*</span>*/}
                  </span>
                </div>
                <div className="invitations-page-body">
                  {(activeConnections.folder && (
                    <div className="group-items-wrapper">
                      <div className="group-item-header">
                        <span>
                          <span className={activeConnections.folder.icon} />
                          <span className="px-1">
                            {activeConnections.folder.title}
                          </span>
                        </span>
                      </div>
                      <div className="group-item-body">
                        {activeConnections.folder.flows.map((element) => (
                          <InvitationsCardSection
                            key={`flowCardKey${element.uuid}-${activeConnections.folder.uuid}-${activeConnections.folder.space_uuid}`}
                            item={element}
                            isGlobalLoading={isLoadingLink}
                            onInvitationCardClicked={onInvitationCardClicked}
                            parentTranslationPath={parentTranslationPath}
                            translationPath={translationPath}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                    || (activeConnections.space && (
                      <>
                        {activeConnections.space.folders.map(
                          (item) =>
                            item.flows.length > 0 && (
                              <div
                                className="group-items-wrapper"
                                key={`groupCardKey${item.uuid}-${item.space_uuid}`}
                              >
                                <div className="group-item-header">
                                  <span>
                                    <span>{activeConnections.space.title}</span>
                                    <span className="px-1">-</span>
                                    <span className={item.icon} />
                                    <span className="px-1">{item.title}</span>
                                  </span>
                                </div>
                                <div className="group-item-body">
                                  {item.flows.map((element) => (
                                    <InvitationsCardSection
                                      key={`flowCardKey${element.uuid}-${item.uuid}-${item.space_uuid}`}
                                      item={element}
                                      isGlobalLoading={isLoadingLink}
                                      onInvitationCardClicked={
                                        onInvitationCardClicked
                                      }
                                      parentTranslationPath={parentTranslationPath}
                                      translationPath={translationPath}
                                    />
                                  ))}
                                </div>
                              </div>
                            ),
                        )}
                        {activeConnections.space.flows.length > 0 && (
                          <div className="group-items-wrapper">
                            <div className="group-item-header">
                              <span>{activeConnections.space.title}</span>
                            </div>
                            <div className="group-item-body">
                              {activeConnections.space.flows.map((item) => (
                                <InvitationsCardSection
                                  key={`flowCardKey${item.uuid}-${item.space_uuid}`}
                                  item={item}
                                  isGlobalLoading={isLoadingLink}
                                  onInvitationCardClicked={onInvitationCardClicked}
                                  parentTranslationPath={parentTranslationPath}
                                  translationPath={translationPath}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ))}
                </div>
              </>
            )}

            {onboardingList.flows && onboardingList.flows.length > 0 && (
              <>
                <div className="invitations-page-header">
                  <span className="c-gray">
                    <span>{t(`${translationPath}seperated-flows`)}</span>
                  </span>
                </div>
                <div className="invitations-page-body">
                  <div className="group-item-body">
                    {onboardingList.flows.map((item) => (
                      <InvitationsCardSection
                        key={`disconnectedFlowCardKey${item.uuid}`}
                        item={item}
                        isGlobalLoading={isLoadingLink}
                        onInvitationCardClicked={onInvitationCardClicked}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )) || (
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

        {isNoData && <PageMessagesStatic />}
      </div>
    </div>
  );
};

export default InvitationsPage;
