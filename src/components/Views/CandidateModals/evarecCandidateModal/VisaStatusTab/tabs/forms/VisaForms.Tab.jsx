import React from 'react';
import {
  DefaultFormsTypesEnum,
  NavigationSourcesEnum,
  OffersStatusesEnum,
} from '../../../../../../../enums';
import PropTypes from 'prop-types';
import { OffersTab } from '../../../OffersTab';

export const VisaFormsTab = ({
  candidate_uuid,
  stage_uuid,
  pipeline_uuid,
  job_uuid,
  isBlankPage,
  formSource,
  // onDetailsChanged,
  // onChangeTheActiveJobData
}) => (
  <div className="visa-forms-tab tab-wrapper">
    <OffersTab
      candidate_uuid={candidate_uuid}
      stage_uuid={stage_uuid}
      code={DefaultFormsTypesEnum.Visa.key}
      pipeline_uuid={pipeline_uuid}
      form_builder={{
        sent_multiple_request: true,
        next_approved: false,
      }}
      isBlankPage={isBlankPage}
      isForm
      formSource={formSource}
      defaultStatus={OffersStatusesEnum.Draft.key}
      job_uuid={job_uuid}
      manualFormsTitle="new-visa-form"
      selectedCandidateDetails={{
        can_create_new_offer: true,
      }}
      // onDetailsChanged={onDetailsChanged}
      // onChangeTheActiveJobData={onChangeTheActiveJobData}
    />
  </div>
);

VisaFormsTab.propTypes = {
  activeJobPipelineUUID: PropTypes.string,
  candidate_uuid: PropTypes.string.isRequired,
  stage_uuid: PropTypes.string,
  pipeline_uuid: PropTypes.string,
  job_uuid: PropTypes.string.isRequired,
  formSource: PropTypes.oneOf(
    Object.values(NavigationSourcesEnum).map((item) => item.key),
  ),
  isBlankPage: PropTypes.bool,
};

VisaFormsTab.defaultProps = {
  formSource: NavigationSourcesEnum.FromVisaStatusToFormBuilder.key,
};
