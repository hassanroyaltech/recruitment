import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
  Divider,
} from '@mui/material';

import {
  DropCandidateOnboardingInvitation,
  GetOnboardingInvitationsCandidate,
} from 'services';
import {
  getIsAllowedPermissionV2,
  GlobalDateFormat,
  showError,
  showSuccess,
} from 'helpers';
import i18next from 'i18next';
import moment from 'moment';
import {
  PipelineMoveToTypesEnum,
  OnboardingMenuForSourceEnum,
  OnboardingTeamsTypesEnum,
  AvatarsThemesEnum,
} from '../../../../../enums';
import './Onboarding.Style.scss';
import { MoveToManagementDialog } from '../../../../../pages/evarec/pipelines/managements/pipeline/sections/pipeline-header/dialogs';
import { OnboardingMenuSection } from '../../../../../pages/onboarding/sections';
import { AvatarsComponent } from '../../../../Avatars/Avatars.Component';
import { ManageOnboardingPermissions } from '../../../../../permissions';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';

export const OnboardingTab = ({
  translationPath,
  job_candidate_uuid,
  job_uuid,
  activeJob,
  parentTranslationPath,
  selectedCandidateDetails,
  activeJobPipelineUUID,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [expandedAccordions, setExpandedAccordions] = useState([]);
  const isLoadingRef = useRef(false);

  const [invitationData, setInvitationData] = useState();
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    invite: false,
  });
  const onIsOpenDialogsChanged = useCallback((key, newValue) => {
    setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
  }, []);
  const getOnboardingInvitationsCandidate = useCallback(async () => {
    if (!job_candidate_uuid) return;
    isLoadingRef.current = true;
    setIsLoading(true);
    const res = await GetOnboardingInvitationsCandidate({
      job_candidate_uuid,
    });
    isLoadingRef.current = true;
    setIsLoading(false);
    if (res && res.status === 200) setInvitationData(res.data.results);
    else setInvitationData();
  }, [job_candidate_uuid]);

  const dropCandidateOnboardingInvitation = useCallback(async () => {
    if (!job_candidate_uuid) return;
    setIsUpdating(true);
    const res = await DropCandidateOnboardingInvitation({
      job_candidate_uuid,
    });
    setIsUpdating(false);
    if (res && (res.status === 200 || res.status === 201)) {
      showSuccess(t(`${translationPath}invitation-dropped-successfully`));
      getOnboardingInvitationsCandidate();
    } else showError(t(`${translationPath}drop-invitation-failed`), res);
  }, [getOnboardingInvitationsCandidate, job_candidate_uuid, t, translationPath]);

  useEffect(() => {
    getOnboardingInvitationsCandidate();
  }, [getOnboardingInvitationsCandidate]);

  const handleExpandAccordion = useCallback((key, ex) => {
    setExpandedAccordions((items) => {
      if (ex) return [...items, key];
      else return items.filter((it) => it !== key);
    });
  }, []);
  const getIsDatesDisabled = useCallback(
    (key, permissionId) => {
      if (invitationData?.invited_before)
        return (
          !invitationData[key]
          || !getIsAllowedPermissionV2({
            permissions,
            permissionId,
          })
        );
      return false;
    },
    [invitationData, permissions],
  );
  const onboardingTeams = useMemo(
    () => invitationData?.onboarding_teams || activeJob?.onboarding_teams || {},
    [activeJob?.onboarding_teams, invitationData?.onboarding_teams],
  );
  const preDefinedKeys = useMemo(() => {
    if (!invitationData?.invited_before) return null;
    return {
      ...invitationData,
      is_update: invitationData.invited_before,
      join_date: invitationData.expected_joining_date,
      start_date: invitationData.onboarding_start_date,
      subjectEmail: invitationData.subject_email,
      bodyEmail: invitationData.body_email,
      attachmentsEmail: invitationData.attachments_email || [],
      emailLanguageId: invitationData.email_language_id || '',
      emailTemplateUUID: invitationData.email_template_uuid || '',
    };
  }, [invitationData]);

  return (
    <div className="onboarding-tab-wrapper pb-4">
      <div className="d-flex-v-center-h-end mb-2 w-100">
        <ButtonBase
          onClick={() => {
            onIsOpenDialogsChanged('invite', true);
          }}
          disabled={isLoading || isUpdating}
          className="btns theme-transparent"
        >
          <span className="fas fa-plus" />
          <span className="px-1">{t(`${translationPath}invite`)}</span>
        </ButtonBase>
      </div>
      <div className="my-1">
        <Divider />
      </div>
      {invitationData?.invited_before ? (
        <>
          <div className="d-flex-h-between bg-white px-2 pt-3">
            <div className="mx-2">
              <div className={'mb-1'}>
                <span>{t(`${translationPath}date-joined`)} : </span>
                {(invitationData.expected_joining_date && (
                  <span className="px-2 fw-bold">
                    {moment(invitationData.expected_joining_date)
                      .locale(i18next.language)
                      .format(GlobalDateFormat)}
                  </span>
                ))
                  || ''}
              </div>
              <div>
                <span>{t(`${translationPath}start-onboarding-from`)} : </span>
                {(invitationData.onboarding_start_date && (
                  <span className="px-2 fw-bold">
                    {moment(invitationData.onboarding_start_date)
                      .locale(i18next.language)
                      .format(GlobalDateFormat)}
                  </span>
                ))
                  || ''}
              </div>
            </div>

            <div className="d-inline-flex  ">
              <div className="d-flex fa-start fj-end ">
                <ButtonBase
                  className="btns theme-outline sm-btn"
                  disabled={isLoading || isUpdating}
                  onClick={() => {
                    onIsOpenDialogsChanged('invite', true);
                  }}
                >
                  <span className="px-1">{t(`${translationPath}edit`)}</span>
                </ButtonBase>
                <ButtonBase
                  className="btns theme-outline sm-btn"
                  disabled={isLoading || isUpdating}
                  onClick={() => {
                    dropCandidateOnboardingInvitation();
                  }}
                >
                  {isUpdating && <i className="fas fa-circle-notch fa-spin" />}
                  <span className="px-1">{t(`${translationPath}drop`)}</span>
                </ButtonBase>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <div className="py-1 ">
              <Divider />
            </div>
            <Accordion
              expanded={expandedAccordions.includes('directory')}
              onChange={(e, ex) => {
                handleExpandAccordion('directory', ex);
              }}
            >
              <AccordionSummary
                expandIcon={<span className="fas fa-chevron-down" />}
              >
                <span className="fw-bold fz-12px">
                  {t(`${translationPath}directory`)}
                </span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="my-2 pb-3">
                  <OnboardingMenuSection
                    forSource={OnboardingMenuForSourceEnum.CandidateProfile}
                    directoryData={invitationData}
                    isWithSelectTheFirstItem={true}
                  />
                </div>
              </AccordionDetails>
            </Accordion>
            <Accordion
              expanded={expandedAccordions.includes('teams')}
              onChange={(e, ex) => {
                handleExpandAccordion('teams', ex);
              }}
            >
              <AccordionSummary
                expandIcon={<span className="fas fa-chevron-down" />}
              >
                <span className="fw-bold fz-12px">
                  {t(`${translationPath}onboarding-team`)}
                </span>
              </AccordionSummary>
              <AccordionDetails>
                <div className="my-2 pb-3">
                  {Object.values(OnboardingTeamsTypesEnum).map((el) => (
                    <React.Fragment key={el.key}>
                      <div className="box-field-wrapper">
                        <div className="inline-label-wrapper mb-1">
                          <span>{t(`${translationPath}${el.value}`)}:</span>
                        </div>
                        <div className="invite-box-wrapper">
                          <div className="invite-box-body-wrapper">
                            {(invitationData?.onboarding_teams?.[el.key] || []).map(
                              (item) => (
                                <AvatarsComponent
                                  key={`${el.key}Key${item.uuid}`}
                                  avatar={item}
                                  avatarImageAlt="member"
                                  avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                                  translationPath={translationPath}
                                  parentTranslationPath={parentTranslationPath}
                                />
                              ),
                            )}
                            <span
                              className={`c-gray-primary px-2 pb-2${
                                (invitationData.onboarding_teams?.[el.key].length
                                  > 0
                                  && ' mt-2')
                                || ''
                              }`}
                            ></span>
                          </div>
                        </div>
                      </div>
                      <div className="my-">
                        <Divider />
                      </div>
                    </React.Fragment>
                  ))}
                </div>
              </AccordionDetails>
            </Accordion>
          </div>
        </>
      ) : (
        ''
      )}

      {isOpenDialogs.invite && (
        <MoveToManagementDialog
          jobUUID={job_uuid}
          jobPipelineUUID={activeJobPipelineUUID}
          activeJob={activeJob}
          selectedCandidates={[{ candidate: selectedCandidateDetails }]}
          isOpen={isOpenDialogs.invite}
          selectedPipelineMoveToType={PipelineMoveToTypesEnum.Flow.key}
          onSave={getOnboardingInvitationsCandidate}
          isOpenChanged={() => onIsOpenDialogsChanged('invite', false)}
          parentTranslationPath="EvaRecPipelines"
          translationPath="PipelineManagement."
          titleText={'move-to-flow'}
          onboardingTeams={onboardingTeams}
          isEdit={invitationData?.invited_before}
          preDefinedKeys={preDefinedKeys}
          isJoinDateDisabled={getIsDatesDisabled(
            'can_edit_join_date',
            ManageOnboardingPermissions.UpdateJoiningDate.key,
          )}
          isStartDateDisabled={getIsDatesDisabled(
            'can_edit_start_date',
            ManageOnboardingPermissions.UpdateStartOnboardingDate.key,
          )}
        />
      )}
    </div>
  );
};

OnboardingTab.propTypes = {
  translationPath: PropTypes.string,
  job_candidate_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  activeJob: PropTypes.instanceOf(Object),
  parentTranslationPath: PropTypes.string,
  selectedCandidateDetails: PropTypes.instanceOf(Object),
  activeJobPipelineUUID: PropTypes.string,
};
OnboardingTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: 'OnboardingTab.',
};
