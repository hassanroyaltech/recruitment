/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react/prop-types */
// React components
import React, { useCallback, useEffect, useRef, useState } from 'react';

// React strap components
import { Button, ButtonGroup, Card, Col, FormGroup, Row } from 'reactstrap';

// Shared component
import Loader from 'components/Elevatus/Loader';
import classnames from 'classnames';

// import Moment to format date and time
import moment from 'moment';

// Select
import Select from 'react-select';

// HTTP requests config
import axios from 'api/middleware';
import { generateHeaders } from 'api/headers';
import urls from 'api/urls';
import { CheckboxesComponent } from 'components/Checkboxes/Checkboxes.Component';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { ButtonBase, IconButton } from '@mui/material';
import * as yup from 'yup';
import TimePickerInput from '../../Elevatus/TimePickerInput';
import {
  SharedInputControl,
  SharedAutocompleteControl,
} from '../../../pages/setups/shared';
import { getErrorByName, GlobalSavingDateFormat, showError } from '../../../helpers';
import { emailExpression, urlExpression } from '../../../utils';
import DatePickerComponent from '../../Datepicker/DatePicker.Component';
import { PipelineBulkSelectTypesEnum } from '../../../enums';
import { PrioritizeUserTimezone } from '../../../helpers/Timezone.Helper';

const translationPath = 'MeetingDetailsComponent.';
const MeetingDetails = ({
  onSend,
  onBack,
  timezones,
  state,
  setState,
  type,
  applicantsList,
  selectedConfirmedStages,
  totalSelectedCandidates,
  date,
  setSend,
  disableSendButton,
  noBack,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath || 'EvaSSESSPipeline');
  const [loading, setLoading] = useState(true);
  const [dateExpanded, setDateExpanded] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'))?.results;
  const companyId = useSelector((statel) => statel?.companyIdReducer);
  const [users, setUsers] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));

  // ref for errors schema for form errors
  const schema = useRef(
    yup.object().shape({
      candidates: yup
        .array()
        .nullable()
        .of(
          yup.object().shape({
            first_name: yup
              .string()
              .nullable()
              .required(t(`${translationPath}this-field-is-required`)),
            last_name: yup
              .string()
              .nullable()
              .required(t(`${translationPath}this-field-is-required`)),
            email: yup
              .string()
              .nullable()
              .matches(emailExpression, {
                message: t('Shared:invalid-email'),
                excludeEmptyString: true,
              })
              .required(t(`${translationPath}this-field-is-required`)),
          }),
        ),
      title: yup
        .string()
        .nullable()
        .required(t('this-field-is-required'))
        .min(3, 'Title should at least have 3 characters'), // TODO Diana:Add localization
      timezone: yup
        .string()
        .nullable()
        .test('isRequired', t('this-field-is-required'), (value) => value),
      description: yup
        .string()
        .nullable()
        .required(t('this-field-is-required'))
        .min(3, 'Description should at least have 3 characters'), // TODO Diana:Add localization
      to_time: yup.string().nullable().required(t('this-field-is-required')),
      from_time: yup.string().nullable().required(t('this-field-is-required')),
      interview_link: yup
        .string()
        .nullable()
        .matches(urlExpression, {
          message: t(`${translationPath}invalid-link`),
          excludeEmptyString: true,
        }),
    }),
  );

  // Add some delay syncing fields appearance in offline meeting.
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  });

  /**
   * Get Company Users data from dropdown API.
   */
  const getUsers = useCallback(async () => {
    await axios
      // Updated to new API that have permissions
      .get(urls.preferences.USERS_DROPDOWN, {
        params: {
          company_uuid: companyId || user.company_id,
          limit: 100,
        },
        headers: generateHeaders(),
      })
      .then((res) => {
        setUsers(
          res?.data?.results.map((item) => ({
            uuid: item?.uuid,
            // Split user name to first_name, last_name.
            first_name: item?.name.split(' ').slice(0, -1).join(' '),
            last_name: item?.name.split(' ').slice(-1).join(' '),
          })),
        );
        // setUsers(res.data.results);
      })
      .catch((err) => {
        showError(t('Shared:failed-to-get-saved-data'), err);
      });
  }, [t, companyId, user.company_id]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    setState((items) => ({
      ...items,
      date: date || moment(items.date).locale('en').format('YYYY-MM-DD'),
    }));
  }, [date, setState, state.date, user.company_id, user.token]);

  // Handle Fields values
  // eslint-disable-next-line max-len
  const handleChangeField = (field) => (value) =>
    setState((items) => ({ ...items, [field]: value }));

  const handleChangeFieldVal = (field) => (val) =>
    handleChangeField(field)(val.value);

  // handle onChange method => save the selected option for teams
  const handleChange = (field) => (newValue) => {
    setState((prevState) => ({
      ...prevState,
      value: newValue,
    }));
    setState((items) => ({ ...items, [field]: newValue }));
  };

  const handleChecked = () => {
    setSend((item) => ({ send: !item.send }));
  };

  const saveHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (errors.to_time || errors.from_time) setDateExpanded(true);
    if (Object.keys(errors).length > 0) return;
    onSend(state);
  };

  // a method to update errors for form on state changed
  const getErrors = useCallback(() => {
    getErrorByName(schema, state).then((result) => {
      setErrors(result);
    });
  }, [state]);

  // Add the selected candidate to the candidates array
  const handleAddCandidate = useCallback(
    (list, isFromUseEffect) => {
      if (!isFromUseEffect) return;
      setState((prevState) => ({
        ...prevState,
        candidates: list.map((item) => ({
          type: PipelineBulkSelectTypesEnum.Candidate.key,
          uuid:
            item.candidate?.uuid
            || item.uuid
            || (item.identity && item.identity.uuid),
          isFirst: true,
          isDisabled: true,
          stage_uuid: item.stage?.uuid || null,
          first_name:
            item.candidate?.name?.split(' ')?.[0]
            || item.basic_information?.first_name
            || '',
          last_name:
            item.candidate?.name?.split(' ')?.[1]
            || item.basic_information?.last_name
            || '',
          email: item.candidate?.email || item.basic_information?.email || '',
        })),
      }));
    },
    [setState],
  );

  useEffect(() => {
    if (applicantsList?.length) handleAddCandidate(applicantsList, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAddCandidate]);

  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  /**
   * @note If the Meeting is scheduled from overview calendar,
   * then the default date will be the clicked date in the calendar
   */
  return (
    <div className="my-4 w-100">
      {loading ? (
        <Loader />
      ) : (
        <>
          <Row>
            <Col xl={12}>
              <FormGroup>
                <label className="form-control-label d-block mb-3">
                  {t(`${translationPath}choose-your-event-color`)}
                </label>
                <ButtonGroup
                  className="btn-group-toggle btn-group-colors event-tag"
                  data-toggle="buttons"
                >
                  <Button
                    className={classnames('bg-info', {
                      active: state.radios === 'bg-info',
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-info',
                      }))
                    }
                  />
                  <Button
                    className={classnames('bg-warning', {
                      active: state.radios === 'bg-warning',
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-warning',
                      }))
                    }
                  />
                  <Button
                    className={classnames('bg-danger', {
                      active: state.radios === 'bg-danger',
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-danger',
                      }))
                    }
                  />
                  <Button
                    className={classnames('bg-success', {
                      active: state.radios === 'bg-success',
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-success',
                      }))
                    }
                  />
                  <Button
                    className={classnames('bg-default', {
                      active: state.radios === 'bg-default',
                    })}
                    color=""
                    type="button"
                    onClick={() =>
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-default',
                      }))
                    }
                  />
                  <Button
                    className={classnames('bg-primary', {
                      active: state.radios === 'bg-primary',
                    })}
                    color=""
                    type="button"
                    onClick={() => {
                      setState((prevState) => ({
                        ...prevState,
                        radios: 'bg-primary',
                      }));
                    }}
                  />
                </ButtonGroup>
              </FormGroup>
            </Col>
            <Col xs={12} sm={6} className="mb-4">
              <SharedInputControl
                isFullWidth
                editValue={state?.title || ''}
                onValueChanged={handleChangeFieldVal('title')}
                title="meeting-title"
                stateKey="title"
                // isDisabled
                idRef="title"
                themeClass="theme-solid"
                errors={errors}
                errorPath="title"
                isSubmitted={isSubmitted}
                parentTranslationPath="EvaSSESSPipeline"
                translationPath={translationPath}
              />
            </Col>
            <Col xs={12} sm={6} className="mb-4">
              <SharedAutocompleteControl
                editValue={state.timezone || null}
                placeholder={t(`${translationPath}time-zone`)}
                title={t(`${translationPath}time-zone`)}
                stateKey="timezone"
                onValueChanged={handleChangeFieldVal('timezone')}
                getOptionLabel={(option) => option.value} // check which one should be used
                initValues={PrioritizeUserTimezone(timezones)}
                errors={errors}
                errorPath="timezone"
                isSubmitted={isSubmitted}
              />
            </Col>
            {type === 'other' && (
              <>
                <Col xs={12} sm={6} className="mb-4">
                  <SharedInputControl
                    isFullWidth
                    editValue={state.interview_link || ''}
                    onValueChanged={handleChangeFieldVal('interview_link')}
                    title="meeting-link"
                    stateKey="interview_link"
                    // isDisabled
                    idRef="interview_link"
                    themeClass="theme-solid"
                    errors={errors}
                    errorPath="interview_link"
                    isSubmitted={isSubmitted}
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                  />
                </Col>
                <Col xs={12} sm={6} className="mb-4">
                  <SharedInputControl
                    isFullWidth
                    editValue={state.location || ''}
                    onValueChanged={handleChangeFieldVal('location')}
                    title="meeting-location"
                    stateKey="location"
                    // isDisabled
                    idRef="location"
                    themeClass="theme-solid"
                    errors={errors}
                    errorPath="location"
                    isSubmitted={isSubmitted}
                    isRequired
                    parentTranslationPath="EvaSSESSPipeline"
                    translationPath={translationPath}
                  />
                </Col>
              </>
            )}
            <Col xs={12} sm={12} className="mb-4">
              <SharedInputControl
                isFullWidth
                editValue={
                  moment(state.date).locale(i18next.language).format('YYYY-MM-DD')
                  || null
                }
                title="date-and-time"
                stateKey="date-and-time"
                // isDisabled
                idRef="date-and-time"
                themeClass="theme-solid"
                errors={errors}
                errorPath="date-and-time"
                isSubmitted={isSubmitted}
                isReadOnly
                onInputClick={() => setDateExpanded(!dateExpanded)}
                parentTranslationPath="EvaSSESSPipeline"
                translationPath={translationPath}
              />
              {dateExpanded && (
                <div className="meeting-date-time-picker">
                  <div className="d-inline-flex">
                    <DatePickerComponent
                      isFullWidth
                      disablePast
                      inputPlaceholder="YYYY-MM-DD"
                      value={state.date || null}
                      onChange={(date) => handleChangeField('date')(date.value)}
                      displayFormat={GlobalSavingDateFormat}
                      datePickerWrapperClasses="px-0"
                      inline={true}
                    />
                  </div>
                  <div className="d-inline-flex-column w-100 px-3 pt-2">
                    <h6 className="h7 mb-2">{t(`${translationPath}time-start`)}</h6>
                    <Card className="py-2">
                      <TimePickerInput
                        className="w-100"
                        onChange={(time) => {
                          setState((prevState) => ({
                            ...prevState,
                            from_time: time,
                          }));
                        }}
                        value={state.from_time || ''}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        errorPath="from_time"
                      />
                      {state.errors && state.errors.from_time ? (
                        state.errors.from_time.length > 1 ? (
                          state.errors.from_time.map((error, index) => (
                            <p
                              key={`from_timeErrorsKey${index + 1}`}
                              className="m-0 text-xs text-danger"
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="m-0 text-xs text-danger">
                            {state.errors.from_time}
                          </p>
                        )
                      ) : (
                        ''
                      )}
                    </Card>
                    <h6 className="h7 mb-2">{t(`${translationPath}time-end`)}</h6>
                    <Card className="py-2">
                      <TimePickerInput
                        className="w-100"
                        onChange={(time) => {
                          state.from_time && time > state.from_time
                            ? setState((prevState) => ({
                              ...prevState,
                              to_time: time,
                              to_time_error: '',
                            }))
                            : setState((prevState) => ({
                              ...prevState,
                              to_time_error: t(
                                `${translationPath}valid-date-time-description`,
                              ),
                            }));
                        }}
                        value={state.to_time || ''}
                        isSubmitted={isSubmitted}
                        errors={errors}
                        errorPath="to_time"
                      />
                      {state.errors && state.errors.to_time ? (
                        state.errors.to_time.length > 1 ? (
                          state.errors.to_time.map((error, index) => (
                            <p
                              key={`to_timeErrorsKey${index + 1}`}
                              className="m-0 text-xs text-danger"
                            >
                              {error}
                            </p>
                          ))
                        ) : (
                          <p className="m-o text-xs text-danger">
                            {state.errors.to_time}
                          </p>
                        )
                      ) : (
                        <p className="m-o text-xs text-danger">
                          {state.to_time_error}
                        </p>
                      )}
                    </Card>
                  </div>
                </div>
              )}
            </Col>
            <Col
              xs={12}
              sm={12}
              className="mb-4"
              onKeyDown={(e) => e.stopPropagation()}
            >
              <SharedInputControl
                isFullWidth
                editValue={state.description || ''}
                onValueChanged={handleChangeFieldVal('description')}
                title="meeting-description"
                stateKey="description"
                // isDisabled
                idRef="description"
                themeClass="theme-solid"
                errors={errors}
                errorPath="description"
                isSubmitted={isSubmitted}
                multiline
                rows={3}
                parentTranslationPath="EvaSSESSPipeline"
                translationPath={translationPath}
              />
            </Col>
          </Row>
          <Col xs={12} sm={12} className="mb-4">
            <h6 className="form-control-label d-block mb-4">
              {t(`${translationPath}team-members`)}
            </h6>
            <Card
              className="p-3 pb-4 mb-0 mt-4"
              style={{ minHeight: '120px', zIndex: 2 }}
            >
              <Select
                isMulti
                placeholder={t(`${translationPath}team-members`)}
                isDisabled={state.isLoading}
                isLoading={state.isLoading}
                value={state?.recruiters || null}
                isClearable
                options={users}
                getOptionLabel={({ first_name, last_name }) =>
                  `${first_name} ${last_name}`
                }
                getOptionValue={({ uuid }) => uuid}
                onChange={handleChange('recruiters')}
              />
            </Card>
          </Col>
          <Col xs={12} sm={12} className="mb-4">
            <h6 className="form-control-label d-block mb-2">
              {t(`${translationPath}guests`)}
            </h6>
            <Card className="p-3 pb-4 mb-0 mt-4" style={{ minHeight: '120px' }}>
              <div className="mb-3 d-flex fa-center fj-between pt-3 px-2">
                <h6 className="form-control-label">
                  {t(`${translationPath}guests-description`)}
                </h6>
                <ButtonBase
                  className="btns theme-solid"
                  onClick={() => {
                    const localCandidatesState = [...(state.candidates || [])];
                    localCandidatesState.push({
                      first_name: '',
                      last_name: '',
                      email: '',
                    });
                    setState((prevState) => ({
                      ...prevState,
                      candidates: localCandidatesState,
                    }));
                  }}
                >
                  <i className="fas fa-plus-circle pr-2-reversed" />
                  {t(`${translationPath}add-new-guest`)}
                </ButtonBase>
              </div>
              {state.candidates
                && (state.candidates || [])
                  .sort((a, b) => (a.isFirst ? -1 : b.isFirst ? 1 : 0))
                  .map((item, index) => (
                    <div key={`${index + 1}-candidate`} className="d-flex">
                      <SharedInputControl
                        isQuarterWidth
                        errors={(!item.isDisabled && errors) || {}}
                        stateKey="first_name"
                        parentId="candidates"
                        parentIndex={index}
                        errorPath={`candidates[${index}].first_name`}
                        editValue={item.first_name}
                        isSubmitted={isSubmitted}
                        isDisabled={item.isDisabled}
                        title="first-name"
                        parentTranslationPath={
                          parentTranslationPath || 'EvaSSESSPipeline'
                        }
                        translationPath={translationPath}
                        onValueChanged={({ value }) => {
                          setState((prevState) => {
                            prevState.candidates[index].first_name = value;
                            return {
                              ...prevState,
                              candidates: prevState.candidates,
                            };
                          });
                        }}
                      />
                      <SharedInputControl
                        isQuarterWidth
                        errors={(!item.isDisabled && errors) || {}}
                        stateKey="last_name"
                        parentId="candidates"
                        parentIndex={index}
                        errorPath={`candidates[${index}].last_name`}
                        editValue={item.last_name}
                        isSubmitted={isSubmitted}
                        isDisabled={item.isDisabled}
                        title="last-name"
                        parentTranslationPath={
                          parentTranslationPath || 'EvaSSESSPipeline'
                        }
                        translationPath={translationPath}
                        onValueChanged={({ value }) => {
                          setState((prevState) => {
                            prevState.candidates[index].last_name = value;
                            return {
                              ...prevState,
                              candidates: prevState.candidates,
                            };
                          });
                        }}
                      />
                      <SharedInputControl
                        isQuarterWidth
                        errors={(!item.isDisabled && errors) || {}}
                        stateKey="email"
                        parentId="candidates"
                        parentIndex={index}
                        errorPath={`candidates[${index}].email`}
                        editValue={item.email}
                        isSubmitted={isSubmitted}
                        isDisabled={item.isDisabled}
                        title="email"
                        parentTranslationPath={
                          parentTranslationPath || 'EvaSSESSPipeline'
                        }
                        translationPath={translationPath}
                        onValueChanged={({ value }) => {
                          setState((prevState) => {
                            prevState.candidates[index].email = value;
                            return {
                              ...prevState,
                              candidates: prevState.candidates,
                            };
                          });
                        }}
                      />
                      <div>
                        <IconButton
                          disabled={item.isDisabled}
                          onClick={() => {
                            const localCandidatesState = [...state.candidates];
                            localCandidatesState.splice(index, 1);
                            setState((prevState) => ({
                              ...prevState,
                              candidates: localCandidatesState,
                            }));
                          }}
                        >
                          <i
                            className={`fas fa-minus-circle ${
                              item.isDisabled ? 'c-gray-light' : 'c-danger'
                            }`}
                          />
                        </IconButton>
                      </div>
                    </div>
                  ))}
              {selectedConfirmedStages && selectedConfirmedStages.length > 0 && (
                <div className="px-2 mb-3">
                  <span>+</span>
                  <span className="px-1">
                    {totalSelectedCandidates - applicantsList.length}
                  </span>
                  <span>{t(`${translationPath}selected-candidates`)}</span>
                </div>
              )}
            </Card>
          </Col>

          {type !== 'other' && (
            <Col xs={12} sm={12} className="mb-1">
              <CheckboxesComponent
                idRef="sendEmailFromElevatusRef"
                onSelectedCheckboxChanged={handleChecked}
                label={t(`${translationPath}send-email-from-elevatus`)}
              />
            </Col>
          )}

          <div
            className="d-flex justify-content-center w-100"
            style={{ marginTop: 80 }}
          >
            {!noBack && (
              <Button style={{ width: '220px' }} className="mx-2" onClick={onBack}>
                {t(`${translationPath}back`)}
              </Button>
            )}
            <Button
              className={`mx-2 ${disableSendButton ? 'is-disabled' : ''}`}
              disabled={disableSendButton}
              color="primary"
              style={{ width: '220px' }}
              onClick={saveHandler}
            >
              {t(`${translationPath}send-invitation`)}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MeetingDetails;
