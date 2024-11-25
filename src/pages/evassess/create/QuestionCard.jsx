/* eslint-disable no-nested-ternary */
/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
/**
 * ----------------------------------------------------------------------------------
 * @title QuestionCard.jsx
 * ----------------------------------------------------------------------------------
 * This module contains the QuestionCard component in which individual questions
 * in the EVA-SSESS questionnaire can be defined.
 * ----------------------------------------------------------------------------------
 */

import React, { useState, useEffect } from 'react';
import { Card } from 'reactstrap';
import ChipsInput from 'components/Elevatus/ChipsInput';
import BarLoader from 'components/Elevatus/BarLoader';
import TextField from '@mui/material/TextField';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAllowedSubscription } from '../../../helpers';
import { SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import ButtonBase from '@mui/material/ButtonBase';

const QuestionCard = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );
  // const permissions = useSelector(
  //     (reducerState) => reducerState?.permissionsReducer?.permissions,
  // );
  const [state, setState] = useState({
    questionList: props.questionValue,
    expected_keyword: props.questionValue.expected_keyword
      ? props.questionValue.expected_keyword.map(
        (response) => response.title || response,
      )
      : [],
    tags: [],
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaRec.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  // Tags are the Keywords
  const handleTags = (tags) => {
    setState((items) => ({
      ...items,
      tags,
      expected_keyword: tags,
    }));

    props.setQuestionValue(tags, 'expected_keyword', props.number);
    setState((items) => ({ ...items, questionList: props.questionValue }));
  };

  const handleInputChange = (e) => {
    props.setQuestionValue(e.target.value, e.target.name, props.number);

    setState((items) => ({ ...items, questionList: props.questionValue }));
  };

  const removeQuestion = () => {
    if (props.removeQuestion) {
      props.removeQuestion(props.number);
      setState((items) => ({ ...items, questionList: props.questionValue }));
    }
  };

  const addQuestion = () => {
    if (props.addQuestion) {
      props.addQuestion();
      setState((items) => ({ ...items, questionList: props.questionValue }));
    }
  };

  const questionList = props.questionValue;
  if (props.loading) return <BarLoader />;

  return (
    <>
      <div className="w-100 p-relative">
        <div className="d-flex w-100 mb-2 py-2">
          {/* Question Text Field (with filter dropdown) */}
          <TextField
            disabled={!props.canEdit}
            label={t(`${props.translationPath}add-a-question`)}
            variant="outlined"
            className="form-control-alternative w-100"
            name="title"
            required
            autoComplete=""
            value={questionList.title ? questionList.title : ''}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
              displayEmpty: true,
            }}
          />

          {props.removeQuestion ? (
            <ButtonBase
              className="btns-icon theme-transparent mx-2 mt-2"
              disabled={!props.canEdit}
              onClick={removeQuestion}
            >
              <span className="fas fa-times" />
            </ButtonBase>
          ) : props.addQuestion ? (
            <ButtonBase
              className="btns-icon theme-transparent mx-2 mt-2"
              disabled={!props.canEdit}
              onClick={addQuestion}
            >
              <span className="fas fa-plus" />
            </ButtonBase>
          ) : null}
        </div>
        <div onMouseEnter={onPopperOpen} className="w-100 mb-3">
          {/* The model answer text area */}
          <TextField
            disabled={
              !props.canEdit
              // || !getIsAllowedPermissionV2({
              //     permissions,
              //     permissionId: CurrentFeatures.ai_model_answer.permissionsId,
              //   })
            }
            label={t(`${props.translationPath}model-answer`)}
            variant="outlined"
            className="form-control-md border-primary w-100"
            name="model_answer"
            multiline
            rows={4}
            maxRows={8}
            style={{ background: '#f9f9f9' }}
            autoComplete=""
            value={questionList.model_answer ? questionList.model_answer : ''}
            onChange={handleInputChange}
            SelectProps={{
              native: true,
              displayEmpty: true,
            }}
          />
        </div>

        <div onMouseEnter={onPopperOpen} className="w-100 mb-3">
          <Card className="p-2 pb-2 mb-0 chips-input-card w-100">
            <ChipsInput
              onChange={handleTags}
              chips={state.expected_keyword}
              InputComp={(item) => (
                <TextField
                  disabled={
                    !props.canEdit
                    // || !getIsAllowedPermissionV2({
                    //     permissions,
                    //     permissionId: CurrentFeatures.ai_keywords.permissionsId,
                    //   })
                  }
                  label={t(`${props.translationPath}expected-keywords`)}
                  variant="outlined"
                  className="form-control-alternative w-100"
                  name="keyword-tags"
                  SelectProps={{
                    native: true,
                    displayEmpty: true,
                  }}
                  {...item}
                />
              )}
            />
          </Card>
        </div>

        <div
          onMouseEnter={onPopperOpen}
          className="d-inline-flex w-50 m-ps-100 pr-3-reversed mb-3"
        >
          {/* Time Limit DROPDOWN */}
          {props.timeLimits?.length && (
            <TextField
              id="select-time-limit"
              label={t(`${props.translationPath}time-limit-in-seconds`)}
              variant="outlined"
              select
              required
              className="form-control-alternative w-100"
              name="time_limit"
              disabled={
                !props.canEdit
                // || !getIsAllowedPermissionV2({
                //     permissions,
                //     permissionId: CurrentFeatures.time_limit.permissionsId,
                //   })
              }
              onChange={handleInputChange}
              value={
                // getIsAllowedPermissionV2({
                //   permissions,
                //   permissionId: CurrentFeatures.time_limit.permissionsId,
                // })
                //   ? questionList.time_limit
                //     ? questionList.time_limit
                //     : ''
                //   : props.timeLimits && props.timeLimits[0]
                // props.timeLimits && props.timeLimits[0]
                questionList.time_limit ? questionList.time_limit + '' : ''
              }
              SelectProps={{
                native: true,
                displayEmpty: true,
              }}
            >
              {/* This enables reset of field */}
              <option value="" />
              {props.timeLimits?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </TextField>
          )}
        </div>
        <div
          onMouseEnter={onPopperOpen}
          className="d-inline-flex w-50 m-ps-100 pl-3-reversed mb-3"
        >
          {/* Number of retakes DROPDOWN */}
          {props.retakes?.length && (
            <TextField
              id="select-number-of-retakes"
              label={t(`${props.translationPath}number-of-retakes-allowed`)}
              variant="outlined"
              select
              required
              className="form-control-alternative w-100"
              name="number_of_retake"
              disabled={
                !props.canEdit
                // || !getIsAllowedPermissionV2({
                //     permissions,
                //     permissionId: CurrentFeatures.retakes.permissionsId,
                //   })
              }
              onChange={handleInputChange}
              value={
                // getIsAllowedPermissionV2({
                //   permissions,
                //   permissionId: CurrentFeatures.retakes.permissionsId,
                // })
                //   ? questionList.number_of_retake
                //     ? questionList.number_of_retake
                //     : ''
                //   : props.retakes && props.retakes[0]
                // props.retakes && props.retakes[0]
                questionList.number_of_retake || questionList.number_of_retake === 0
                  ? +questionList.number_of_retake
                  : ''
              }
              SelectProps={{
                native: true,
                displayEmpty: true,
              }}
            >
              {/* This enables reset of field */}
              <option value="" />
              {props.retakes?.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </TextField>
          )}
        </div>
      </div>

      <NoPermissionComponent
        anchorEl={anchorEl}
        popperOpen={popperOpen}
        setAnchorEl={setAnchorEl}
        setPopperOpen={setPopperOpen}
      />
    </>
  );
};
export default QuestionCard;
