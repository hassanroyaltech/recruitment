// React and reactstrap
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Card, CardBody, Col, Row } from 'reactstrap';

// Loader
import Loader from '../../../../components/Elevatus/Loader';

// MUI
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import { getIsAllowedPermissionV2, showError } from '../../../../helpers';
import { ManageApplicationsPermissions } from '../../../../permissions';
import { useSelector } from 'react-redux';
import {
  GetAllEvaRecPipelineTeams,
  GetInitialJobOnboardingTeam,
} from '../../../../services';
import InviteTeamsComponent from '../components/invite-teams/InviteTeams.Component';
import { JobInviteRecruiterTypesEnum } from '../../../../enums';
import i18next from 'i18next';

const translationPath = '';
const parentTranslationPath = 'CreateJob';

/**
 * This is where you invite team members
 * The third step in creating/editing an application form
 * @param form
 * @param setForm
 * @param edit
 * @param jobRequisitionUUID
 * @returns {JSX.Element}
 * @constructor
 */
export const InviteTeamForm = ({ form, setForm, edit, jobRequisitionUUID }) => {
  const { t } = useTranslation(parentTranslationPath);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(false);
  const permissions = useSelector(
    (reducerState) => reducerState?.permissionsReducer?.permissions,
  );
  const userReducer = useSelector((reducerState) => reducerState.userReducer);
  const [state, setState] = useState({
    dropDownOptions: [],
    value: [],
  });
  /**
   * async function to retrieve team data from getTeams API
   * and store the response in dropDownOptions state
   */
  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await GetAllEvaRecPipelineTeams({});
      setLoading(false);
      if (response && response.status === 200)
        setState((prevState) => ({
          ...prevState,
          dropDownOptions: response.data.results,
        }));
      else showError(t('Shared:failed-to-get-saved-data'), response);
    } catch (error) {
      showError(t('Shared:failed-to-get-saved-data'), error);
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    getData();
  }, [getData]);

  const getInitialJobOnboardingTeam = useCallback(async () => {
    if (edit || isMountedRef.current) return;
    try {
      isMountedRef.current = true;
      const response = await GetInitialJobOnboardingTeam({
        with_than: [],
        ...(jobRequisitionUUID && { job_requisition_uuid: jobRequisitionUUID }),
      });

      if (response && response.status === 200) {
        const results = response.data?.results;
        setForm((prevState) => ({
          ...prevState,
          hod:
            (results?.hod && [
              {
                ...results?.hod,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
          recruiter:
            (results?.recruiter && [
              {
                ...results?.recruiter,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
          hiring_manager:
            (results?.hm && [
              {
                ...results?.hm,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
          job_poster: (prevState.job_poster.length > 0 && prevState.job_poster) || [
            {
              value: userReducer.results.user.uuid,
              label: `${
                userReducer.results.user.first_name?.[i18next.language]
                || userReducer.results.user.first_name?.en
              } ${
                userReducer.results.user.last_name?.[i18next.language]
                || userReducer.results.user.last_name?.en
              }`,
              type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
            },
          ],
          job_recruiter: (prevState.job_recruiter.length > 0
            && prevState.job_recruiter) || [
            {
              value: userReducer.results.user.uuid,
              label: `${
                userReducer.results.user.first_name?.[i18next.language]
                || userReducer.results.user.first_name?.en
              } ${
                userReducer.results.user.last_name?.[i18next.language]
                || userReducer.results.user.last_name?.en
              }`,
              type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
            },
          ],
        }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    } catch (error) {
      showError(t('Shared:failed-to-get-saved-data'), error);
    }
  }, [
    edit,
    jobRequisitionUUID,
    setForm,
    t,
    userReducer.results.user.first_name,
    userReducer.results.user.last_name,
    userReducer.results.user.uuid,
  ]);

  useEffect(() => {
    void getInitialJobOnboardingTeam();
  }, [getInitialJobOnboardingTeam]);

  /**
   * Return JSX
   */
  return (
    <>
      <Card className="step-card">
        {loading ? (
          <CardBody className="text-center">
            <Row>
              <Col xl="12">
                <Loader width="730px" height="49vh" speed={1} color="primary" />
              </Col>
            </Row>
          </CardBody>
        ) : (
          <div className="pl-4 pr-4 pb-3">
            <h6 className="h6">{t(`${translationPath}invite-team`)}</h6>
            <div className="h6 font-weight-normal text-gray">
              {t(
                `${translationPath}type-the-team-members-you-want-assign-to-works-on-this-job`,
              )}
              :
            </div>
            <div>
              <Autocomplete
                fullWidth
                multiple
                autoHighlight
                options={state.dropDownOptions || []}
                getOptionLabel={(option) =>
                  option.label
                  || `${option.first_name || ''} ${option.last_name || ''}`
                  || ''
                }
                isOptionEqualToValue={(option, value) =>
                  option?.value === value?.value
                }
                className="mt-4"
                id="team_mate"
                name="team_mate"
                label={t(`${translationPath}team-mates`)}
                variant="outlined"
                value={form?.teams || []}
                disabled={
                  !getIsAllowedPermissionV2({
                    permissions,
                    permissionId: ManageApplicationsPermissions.MangeTeams.key,
                  })
                }
                onChange={(e, value) => {
                  setState((prevState) => ({
                    ...prevState,
                    value,
                  }));
                  setForm((item) => ({ ...item, teams: value }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t(`${translationPath}team-mates`)}
                    variant="outlined"
                    inputProps={{
                      ...params.inputProps,
                    }}
                    value={form?.teams}
                  />
                )}
              />
            </div>
            <hr className="my-3" />
            {/*<InviteTeamsComponent*/}
            {/*  form={form}*/}
            {/*  setForm={setForm}*/}
            {/*  translationPath={translationPath}*/}
            {/*  parentTranslationPath={parentTranslationPath}*/}
            {/*  jobRequisitionUUID={jobRequisitionUUID}*/}
            {/*/>*/}
            <h6 className="h6 my-2">
              {t(`${translationPath}invite-team-member-to-onboarding`)}
            </h6>
            <InviteTeamsComponent
              form={form}
              setForm={setForm}
              isJobOnboarding
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              jobRequisitionUUID={jobRequisitionUUID}
            />
          </div>
        )}
      </Card>
    </>
  );
};
