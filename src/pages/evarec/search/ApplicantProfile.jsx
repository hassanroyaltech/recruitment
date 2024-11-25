import React, { useCallback, useEffect, useState } from 'react';
// Import evarecAPI
import { evarecAPI } from 'api/evarec';
import ProfileTab from 'components/Views/CandidateModals/evarecCandidateModal/SummaryTab/ProfileTab';
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../helpers';
import { ProfileManagementComponent } from '../../../components/ProfileManagement/ProfileManagement.Component';
import { ProfileManagementFeaturesEnum } from '../../../enums';
import { SearchDatabasePermissions } from '../../../permissions';
import { useQuery } from '../../../hooks';

const parentTranslationPath = 'EvarecRecSearch';

const ApplicantProfile = () => {
  const { t } = useTranslation(parentTranslationPath);
  const query = useQuery();
  const [companyUUID, setCompanyUUID] = useState(null);
  // const profileUuid = window.location.pathname.split('/');
  const candidateProfileUuid = window.location.pathname.substring(
    window.location.pathname.lastIndexOf('/') + 1,
  );
  const [isEditProfile, setIsEditProfile] = useState(false);

  const [candidateInformation, setCandidateInformation] = useState({});
  const [loading, setLoading] = useState(false);

  const getSearchDBProfile = useCallback(
    (profile_uuid, company_uuid) => {
      setLoading(true);
      evarecAPI
        .viewCandidateProfile(profile_uuid, company_uuid)
        .then((result) => {
          setCandidateInformation(result.data.results);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          showError(t('Shared:failed-to-get-saved-data'), err);
        });
    },
    [t],
  );

  const onEditProfileClicked = useCallback(() => {
    setIsEditProfile((item) => !item);
  }, []);

  const onProfileSaved = useCallback(() => {
    setIsEditProfile((item) => !item);
    getSearchDBProfile(candidateProfileUuid, companyUUID);
  }, [candidateProfileUuid, getSearchDBProfile, companyUUID]);

  useEffect(() => {
    const company_uuid = query.get('company_uuid');
    setCompanyUUID(company_uuid);
    if (candidateProfileUuid) getSearchDBProfile(candidateProfileUuid, company_uuid);
  }, [query, candidateProfileUuid, getSearchDBProfile]);

  return (
    (loading && <Loader />)
    || (!isEditProfile && (
      <div className=" container justify-content-center align-items-center mt-7">
        <ProfileTab
          profile={candidateInformation}
          mode
          company_uuid={
            candidateInformation
            && candidateInformation.identity
            && candidateInformation.identity.company_uuid
          }
          onEditProfileClicked={onEditProfileClicked}
        />
      </div>
    )) || (
      <div className="page-wrapper">
        <ProfileManagementComponent
          onSave={onProfileSaved}
          onFailed={onEditProfileClicked}
          candidate_uuid={
            candidateInformation
            && candidateInformation.identity
            && candidateInformation.identity.uuid
          }
          company_uuid={
            candidateInformation
            && candidateInformation.identity
            && candidateInformation.identity.company_uuid
          }
          profile_uuid={candidateInformation && candidateInformation.profile_uuid}
          from_feature={ProfileManagementFeaturesEnum.SearchDB.key}
          componentPermission={SearchDatabasePermissions}
        />
      </div>
    )
  );
};

export default ApplicantProfile;
