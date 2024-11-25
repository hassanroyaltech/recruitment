import React from 'react';
import PropTypes from 'prop-types';
import { DialogComponent } from '../../../../../components';
import { ProfileManagementComponent } from '../../../../../components/ProfileManagement/ProfileManagement.Component';
import { ProfileManagementFeaturesEnum } from '../../../../../enums';

export const CandidateManagementDialog = ({
  isOpen,
  onSave,
  isOpenChanged,
  isFullWidthFields,
  candidate_uuid,
  profile_uuid,
  pipeline_uuid,
  job_uuid,
  company_uuid,
  job_requirement,
  feature,
  activeItem,
  parentTranslationPath,
  translationPath,
  componentPermission,
}) => (
  <DialogComponent
    maxWidth="xl"
    isWithFullScreen
    titleText={`${(activeItem && 'edit-candidate-profile') || 'add-new-candidate'}`}
    isEdit={!!activeItem}
    isFixedHeight
    dialogContent={
      <div className="candidate-management-dialog-wrapper">
        <ProfileManagementComponent
          onSave={onSave}
          onFailed={isOpenChanged}
          isFullWidthFields={isFullWidthFields}
          candidate_uuid={candidate_uuid}
          feature={feature}
          profile_uuid={profile_uuid}
          company_uuid={company_uuid}
          job_uuid={job_uuid}
          pipeline_uuid={pipeline_uuid}
          job_requirement={job_requirement}
          from_feature={ProfileManagementFeaturesEnum.SearchDB.key}
          componentPermission={componentPermission}
        />
      </div>
    }
    wrapperClasses="candidate-management-dialog-wrapper"
    isOpen={isOpen}
    onCloseClicked={isOpenChanged}
    parentTranslationPath={parentTranslationPath}
    translationPath={translationPath}
  />
);

CandidateManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  activeItem: PropTypes.instanceOf(Object),
  isOpenChanged: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  isFullWidthFields: PropTypes.bool,
  candidate_uuid: PropTypes.string,
  company_uuid: PropTypes.string,
  profile_uuid: PropTypes.string,
  job_uuid: PropTypes.string,
  pipeline_uuid: PropTypes.string,
  job_requirement: PropTypes.string,
  feature: PropTypes.oneOf(
    Object.values(ProfileManagementFeaturesEnum).map((item) => item.key),
  ),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};
CandidateManagementDialog.defaultProps = {
  parentTranslationPath: 'ProfileManagementComponent',
  translationPath: '',
  activeItem: undefined,
  candidate_uuid: undefined,
  company_uuid: undefined,
  job_uuid: undefined,
  pipeline_uuid: undefined,
  job_requirement: undefined,
  profile_uuid: undefined,
  feature: ProfileManagementFeaturesEnum.DrApproval.key,
  isFullWidthFields: undefined,
};
