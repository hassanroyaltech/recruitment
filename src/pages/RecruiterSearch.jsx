/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CardBody, Col, Row } from 'reactstrap';

import Loader from '../components/Elevatus/Loader';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { SharedAPIAutocompleteControl } from './setups/shared';
import {
  GetAllEvaRecPipelineTeams,
  GetAllSetupsEmployees,
  GetAllSetupsUsers,
  GetInitialJobTeam,
} from '../services';
import { DynamicFormTypesEnum, JobInviteRecruiterTypesEnum } from '../enums';
import { showError } from '../helpers';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import InviteTeamsComponent from './evarec/create/components/invite-teams/InviteTeams.Component';

// const createOption = (label) => ({
//   label,
//   value: label,
//   isDisabled: false,
// });
const translationPath = 'RecruiterSearchComponent.';
const RecruiterSearch = (props) => {
  const { t } = useTranslation(['EvaSSESSPipeline', 'CreateJob']);
  const timerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    data: [],
    alert: null,
    options: props.options,
    openSureModal: false,
    openDoneModal: false,
    loadingInvite: false,
    dropdownoptions: props.options ? props.options : [],
    isLoading: false,
    value: [],
    userType: null,
  });

  const getData = useCallback(async () => {
    setLoading(true);
    const response = await GetAllEvaRecPipelineTeams({});
    setLoading(false);
    if (response && response.status === 200)
      setState((prevState) => ({
        ...prevState,
        dropdownoptions: response.data.results,
      }));
    else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [t]);

  // const handleChange = (newValue) => {
  //   props.setNumberOfDeleted(state.options?.length);
  //   setState((prevState) => ({
  //     ...prevState,
  //     options: newValue || [],
  //   }));
  //   props.setEmailsData(newValue);
  // };
  // const handleCreate = (inputValue) => {
  //   setState((prevState) => ({
  //     ...prevState,
  //     isLoading: true,
  //   }));
  //   const re
  //     = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  //   const valid = re.test(String(inputValue).toLowerCase());
  //   if (valid) {
  //     const newOption = createOption(inputValue);
  //     state.value.push(newOption);
  //     setState((prevState) => ({
  //       ...prevState,
  //       options: prevState.value,
  //       isLoading: false,
  //     }));
  //     props.setEmailsData(state.value);
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       isLoading: false,
  //       error: t(`${translationPath}invalid-email`),
  //     }));
  //     setTimeout(() => {
  //       setState((prevState) => ({
  //         ...prevState,
  //         error: '',
  //       }));
  //     }, 2000);
  //   }
  // };

  const getJobResponsibleTeam = useCallback(
    async (jobUUID) => {
      const response = await GetInitialJobTeam({ job_uuid: jobUUID });

      if (response && response.status === 200) {
        const results = response.data?.results;
        props.setInvitedTeams((prevState) => ({
          ...prevState,
          job_poster:
            (results?.job_poster && [
              {
                ...results?.job_poster,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
          job_recruiter:
            (results?.job_recruiter && [
              {
                ...results?.job_recruiter,
                type: JobInviteRecruiterTypesEnum.UsersAndEmployees.key,
              },
            ])
            || [],
        }));
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t],
  );
  useEffect(() => {
    if (!timerRef.current && props.messageValue !== state.message)
      setState((items) => ({
        ...items,
        message: props.messageValue,
      }));
  }, [props.messageValue, state.message]);

  useEffect(() => {
    if (props.jobUUID) void getJobResponsibleTeam(props.jobUUID);
  }, [getJobResponsibleTeam, props.jobUUID]);

  useEffect(() => {
    void getData();
  }, [getData]);

  useEffect(() => {
    props.setNumberOfDeleted(state.options?.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.options?.length]);

  return (
    <>
      {loading ? (
        <CardBody className="text-center">
          <Row>
            <Col xl="12">
              <Loader width="730px" height="49vh" speed={1} color="primary" />
            </Col>
          </Row>
        </CardBody>
      ) : (
        <>
          <div className="h6 font-weight-normal" style={{ color: '#899298' }}>
            {props.meeting ? (
              t(`${translationPath}guest-email-description`)
            ) : (
              <span className="c-black">
                {t(`${translationPath}team-members-description`)}
              </span>
            )}
          </div>
          {/** In Invite Team Members to VA OR JOB create a new option is not
          // * allowed => use Select component */}
          {props.create ? (
            <>
              <div className="mb-3 c-black">
                <div>
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    inlineLabel="user"
                    placeholder="select-user"
                    stateKey="recruiters"
                    onValueChanged={(newValue) => {
                      props.setSharedRecruiters((items) => ({
                        ...items,
                        users: newValue.value,
                      }));
                    }}
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }` || 'N/A'
                    }
                    getDataAPI={GetAllSetupsUsers}
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                    searchKey="search"
                    type={DynamicFormTypesEnum.array.key}
                  />
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    inlineLabel="employee"
                    uniqueKey="user_uuid"
                    placeholder="select-employee"
                    stateKey="recruiters"
                    onValueChanged={(newValue) => {
                      props.setSharedRecruiters((items) => ({
                        ...items,
                        employees: newValue.value,
                      }));
                    }}
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }` || 'N/A'
                    }
                    getDataAPI={GetAllSetupsEmployees}
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                    extraProps={{
                      all_employee: 1,
                    }}
                    searchKey="search"
                    type={DynamicFormTypesEnum.array.key}
                  />
                </div>
                {/*<CreatableSelect*/}
                {/*  isDisabled={state.isLoading}*/}
                {/*  isLoading={state.isLoading}*/}
                {/*  onCreateOption={handleCreate}*/}
                {/*  value={state.options}*/}
                {/*  isClearable={false}*/}
                {/*  isMulti*/}
                {/*  placeholder=" "*/}
                {/*  onChange={handleChange}*/}
                {/*  options={*/}
                {/*    (props.candidates && [*/}
                {/*      {*/}
                {/*        label: props.candidates,*/}
                {/*        value: props.candidates,*/}
                {/*        isDisabled: false,*/}
                {/*      },*/}
                {/*    ])*/}
                {/*    || (!props.meeting && state.dropdownoptions)*/}
                {/*    || null*/}
                {/*  }*/}
                {/*/>*/}
              </div>
              {/*<Inputs*/}
              {/*  idRef="shareMessageRef"*/}
              {/*  value={state.message || ''}*/}
              {/*  themeClass="theme-solid"*/}
              {/*  error={props.isMessageError}*/}
              {/*  isSubmitted={props.isSubmitted}*/}
              {/*  helperText={*/}
              {/*    (props.helperText && t(`${translationPath}${props.helperText}`))*/}
              {/*    || undefined*/}
              {/*  }*/}
              {/*  labelValue="message"*/}
              {/*  parentTranslationPath="EvaSSESSPipeline"*/}
              {/*  translationPath={translationPath}*/}
              {/*  onInputBlur={(event) => {*/}
              {/*    const {*/}
              {/*      target: { value },*/}
              {/*    } = event;*/}
              {/*    if (timerRef.current) {*/}
              {/*      clearTimeout(timerRef.current);*/}
              {/*      timerRef.current = null;*/}
              {/*      if (props.onMessageChanged) props.onMessageChanged(value);*/}
              {/*    }*/}
              {/*  }}*/}
              {/*  onInputChanged={(event) => {*/}
              {/*    const {*/}
              {/*      target: { value },*/}
              {/*    } = event;*/}
              {/*    setState((items) => ({*/}
              {/*      ...items,*/}
              {/*      message: value,*/}
              {/*    }));*/}
              {/*    if (props.onMessageChanged) {*/}
              {/*      if (timerRef.current) clearTimeout(timerRef.current);*/}
              {/*      timerRef.current = setTimeout(() => {*/}
              {/*        timerRef.current = null;*/}
              {/*        props.onMessageChanged(value);*/}
              {/*      }, GlobalInputDelay);*/}
              {/*    }*/}
              {/*  }}*/}
              {/*/>*/}
            </>
          ) : (
            <>
              {props.type === 'ATS' ? (
                <>
                  <div style={{ minHeight: '120px' }}>
                    <Autocomplete
                      fullWidth
                      multiple
                      autoHighlight
                      options={state.dropdownoptions || []}
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
                      label={t(`team-mates`, { ns: 'CreateJob' })}
                      variant="outlined"
                      value={props?.invitedTeams?.teams}
                      onChange={(e, value) => {
                        props?.setInvitedTeams((item) => ({
                          ...item,
                          teams: value,
                        }));
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t(`team-mates`, { ns: 'CreateJob' })}
                          variant="outlined"
                          inputProps={{
                            ...params.inputProps,
                          }}
                          value={props?.invitedTeams?.teams}
                        />
                      )}
                    />
                    {props.jobUUID && (
                      <InviteTeamsComponent
                        form={props.invitedTeams}
                        setForm={props.setInvitedTeams}
                        translationPath=""
                        parentTranslationPath="CreateJob"
                        jobRequisitionUUID={props.jobUUID}
                      />
                    )}
                  </div>
                </>
              ) : (
                <>
                  <SharedAPIAutocompleteControl
                    isHalfWidth
                    inlineLabel="user"
                    placeholder="select-user"
                    stateKey="recruiters"
                    uniqueKey="uuid"
                    editValue={props.invitedTeams?.users}
                    onValueChanged={(newValue) =>
                      props.setInvitedTeams((items) => ({
                        ...items,
                        users: newValue.value,
                      }))
                    }
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }` || 'N/A'
                    }
                    getDataAPI={GetAllSetupsUsers}
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                    searchKey="search"
                    type={DynamicFormTypesEnum.array.key}
                    extraProps={{
                      with_than: props.invitedTeams?.users,
                    }}
                  />
                  <SharedAPIAutocompleteControl
                    isEntireObject
                    isHalfWidth
                    inlineLabel="employee"
                    placeholder="select-employee"
                    uniqueKey="user_uuid"
                    stateKey="employees"
                    editValue={props.invitedTeams.employees?.map(
                      (item) => item.user_uuid,
                    )}
                    onValueChanged={(newValue) => {
                      props.setInvitedTeams((items) => ({
                        ...items,
                        employees: newValue.value,
                      }));
                    }}
                    getOptionLabel={(option) =>
                      `${
                        option.first_name
                        && (option.first_name[i18next.language] || option.first_name.en)
                      }${
                        option.last_name
                        && ` ${
                          option.last_name[i18next.language] || option.last_name.en
                        }`
                      }` || 'N/A'
                    }
                    getDataAPI={GetAllSetupsEmployees}
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                    extraProps={{
                      all_employee: 0,
                      with_than: props.invitedTeams.employees?.map(
                        (item) => item.uuid,
                      ),
                    }}
                    searchKey="search"
                    type={DynamicFormTypesEnum.array.key}
                  />
                </>
              )}
            </>

          // <Select
          //   isDisabled={state.isLoading}
          //   isLoading={state.isLoading}
          //   isClearable={false}
          //   isMulti
          //   theme={(theme) => ({
          //     ...theme,
          //     colors: {
          //       ...theme.colors,
          //       ...selectColors,
          //     },
          //   })}
          //   value={state.options}
          //   styles={customSelectStyles}
          //   placeholder={t(`${translationPath}select-users`)}
          //   onChange={handleChange}
          //   options={
          //     (props.candidates && [
          //       {
          //         label: props.candidates,
          //         value: props.candidates,
          //         isDisabled: false,
          //       },
          //     ])
          //     || (!props.meeting && state.dropdownoptions)
          //     || null
          //   }
          // />
          )}
          {state.error && state.error}
        </>
      )}
    </>
  );
};
export default RecruiterSearch;
