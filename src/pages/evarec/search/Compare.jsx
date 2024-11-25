/**
 * -----------------------------------------------------------------------------------
 * @title Compare.jsx
 * -----------------------------------------------------------------------------------
 * This module contains the Compare Modal which we use it in Search-Database to compare
 * Two Candidates Profiles
 * -----------------------------------------------------------------------------------
 */
// Import react, reactstrap
import React, { useCallback, useEffect, useState } from 'react';
import { Modal, ModalBody } from 'reactstrap';

// Import Summary Component
import SummaryTab from 'components/Views/CandidateModals/evarecCandidateModal/SummaryTab/index';

// Import evarecAPI
import { evarecAPI } from 'api/evarec';

// Import Loader Component
import Loader from 'components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import { showError } from '../../../helpers';
import { ProfileManagementComponent } from '../../../components/ProfileManagement/ProfileManagement.Component';
import { ProfileManagementFeaturesEnum } from '../../../enums';
import { ManageApplicationsPermissions } from '../../../permissions';

export const Compare = ({ isOpen, onClose, uuid }) => {
  const { t } = useTranslation('Shared');
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [profileData, setProfileData] = useState({});

  const onEditProfileClicked = useCallback((profile) => {
    setIsEditProfile((item) => !item);
    setProfileData(profile);
  }, []);

  const getCandidateProfile = useCallback(() => {
    setLoading(true);
    evarecAPI
      .compareCandidate(uuid)
      .then((res) => {
        setProfile(res.data.results);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        showError(t('failed-to-get-saved-data'), error);
      });
  }, [t, uuid]);

  const onProfileSaved = useCallback(() => {
    setIsEditProfile((item) => !item);
    getCandidateProfile();
  }, [getCandidateProfile]);

  /**
   * Effect to get candidate profile data
   * @note Need Refactor once API is ready, For now we are using static profile_uuid.
   *
   */
  useEffect(() => {
    if (uuid) getCandidateProfile();
  }, [getCandidateProfile, uuid]);

  return (
    <Modal
      className="modal-dialog-centered"
      isOpen={isOpen}
      toggle={onClose}
      style={{ maxWidth: '90vw' }}
    >
      <div className="min-vh-30">
        <div className="modal-header border-0">
          <button
            type="button"
            className="close"
            data-dismiss="modal"
            aria-hidden="true"
            onClick={onClose}
          >
            <i className="fas fa-times" />
          </button>
        </div>
        <ModalBody className="modal-body pt-0 mx-3 px-5">
          {(loading && <Loader />)
            || (!isEditProfile && (
              <div className="d-flex pt-3 text-gray table-responsive">
                {/* <--- Candidate Profiles--> */}
                {profile.map((element, index) => (
                  <div
                    className="d-inline-flex w-435px miw-50 px-3"
                    key={`profileKey${index + 1}`}
                  >
                    <SummaryTab
                      mode="search-database"
                      profile={element}
                      company_uuid={
                        Object.keys(profileData || {})?.length
                        && profileData.identity
                        && profileData.identity.company_uuid
                      }
                      onEditProfileClicked={() => onEditProfileClicked(element)}
                    />
                  </div>
                ))}
              </div>
            )) || (
            <ProfileManagementComponent
              onSave={onProfileSaved}
              onFailed={onEditProfileClicked}
              candidate_uuid={
                Object.keys(profileData)?.length
                  && profileData.identity
                  && profileData.identity.uuid
              }
              company_uuid={
                Object.keys(profileData)?.length
                  && profileData.identity
                  && profileData.identity.company_uuid
              }
              profile_uuid={
                Object.keys(profileData)?.length && profileData.profile_uuid
              }
              from_feature={ProfileManagementFeaturesEnum.SearchDB.key}
              componentPermission={ManageApplicationsPermissions}
            />
          )}
        </ModalBody>
      </div>
    </Modal>
  );
};

export default Compare;
