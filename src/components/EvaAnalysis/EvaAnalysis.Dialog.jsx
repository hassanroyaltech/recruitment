import React from 'react';
import PropTypes from 'prop-types';
import { DialogComponent } from '../index';
import { EvaAnalysisTab } from './Tabs/EvaAnalysis.Tab';

const translationPath = 'EvaAnalysisTab.';
const parentTranslationPath = 'EvarecCandidateModel';

export const EvaAnalysisDialog = ({
  source,
  job_uuid,
  media_uuid,
  profile_uuid,
  user_uuid,
  isOpen,
  isOpenChanged,
  email,
  resume_uuid,
}) => (
  <DialogComponent
    maxWidth="md"
    titleText="eva-analysis"
    contentClasses="px-0 m-2"
    dialogContent={
      <EvaAnalysisTab
        source={source}
        job_uuid={job_uuid}
        profile_uuid={profile_uuid}
        media_uuid={media_uuid}
        candidate_user_uuid={user_uuid}
        email={email}
        resume_uuid={resume_uuid}
      />
    }
    isOpen={isOpen}
    onCloseClicked={isOpenChanged}
    parentTranslationPath={parentTranslationPath}
    translationPath={translationPath}
  />
);

EvaAnalysisDialog.propTypes = {
  source: PropTypes.oneOf(['rms', 'candidate-modal', 'search-database']),
  data: PropTypes.shape({
    basic_information: PropTypes.shape({
      personal_name: PropTypes.string,
      email: PropTypes.array,
      phone_number: PropTypes.array,
      dob: PropTypes.string,
      description: PropTypes.string,
      gender: PropTypes.string,
      address: PropTypes.string,
    }),
    education: PropTypes.array,
    experience: PropTypes.array,
    language_proficiency: PropTypes.array,
    skills: PropTypes.array,
  }),
  job_uuid: PropTypes.string.isRequired,
  media_uuid: PropTypes.string,
  profile_uuid: PropTypes.string,
  user_uuid: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  email: PropTypes.string,
  resume_uuid: PropTypes.string,
};
EvaAnalysisDialog.defaultProps = {
  isOpenChanged: undefined,
  parentTranslationPath: '',
  email: undefined,
  resume_uuid: undefined,
};
