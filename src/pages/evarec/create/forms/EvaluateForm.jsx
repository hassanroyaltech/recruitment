// React and reactstrap
import React, { useCallback, useState } from 'react';
import { Card } from 'reactstrap';

import { useTranslation } from 'react-i18next';
import { GetAllScorecardTemplates } from '../../../../services';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { styled } from '@mui/material/styles';

import { WorkflowsPeriodTypesEnum } from '../../../../enums';
import { value } from 'lodash/seq';
import ScorecardAssignComponent from '../components/scorecard-assign/ScorecardAssign.Component';
import { getIsAllowedPermissionV2 } from '../../../../helpers';
import { ScorecardPermissions } from '../../../../permissions';
import { useSelector } from 'react-redux';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

export default function EvaluateForm({ edit, form, setForm, jobRequisitionUUID }) {
  const permissionsReducer = useSelector(
    (state) => state?.permissionsReducer?.permissions,
  );
  const [jobUUID] = useState(
    edit
      ? window.location.pathname.substring(
        window.location.pathname.lastIndexOf('/') + 1,
      )
      : '',
  );
  const { t } = useTranslation(parentTranslationPath);

  /**
   * Return JSX
   */
  return (
    <Card className="step-card ">
      <h6 className="h6">{t(`${translationPath}evaluate`)}</h6>
      <div
        className="mt-1 mb-2 font-weight-normal text-gray"
        style={{ opacity: 0.66 }}
      >
        {t(`${translationPath}evaluate-description`)}
      </div>
      <ScorecardAssignComponent
        jobUUID={edit && jobUUID}
        isViewCommittee={true}
        isViewDecisionMakers={true}
        isViewReminder={true}
        isViewSelectScorecard={true}
        isViewReminderInputs={true}
        form={form}
        setForm={setForm}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        jobRequisitionUUID={jobRequisitionUUID}
        isAssignDisabled={
          edit
          && !getIsAllowedPermissionV2({
            permissionId: ScorecardPermissions.ScorecardEditAssignee.key,
            permissions: permissionsReducer,
          })
        }
      />
    </Card>
  );
}
