/**
 * ----------------------------------------------------------------------------------
 * @title CandidateCard.jsx
 * ----------------------------------------------------------------------------------
 * This component allows us to fill out the details of the candidate we want to
 * invite:
 * - First name
 * - Last name
 * - Email
 * - Phone number (optional)
 * ----------------------------------------------------------------------------------
 */

// React and reactstrap
import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import { Col, Row } from 'reactstrap';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { getIsAllowedSubscription } from '../../../helpers';
import { SubscriptionServicesEnum } from '../../../enums';
import NoPermissionComponent from '../../../shared/NoPermissionComponent/NoPermissionComponent';
import ButtonBase from '@mui/material/ButtonBase';

/**
 * CandidateCard component
 */
const CandidateCard = (props) => {
  const { t } = useTranslation(props.parentTranslationPath);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);

  const timerRef = useRef(null);
  const [state, setState] = useState({
    email: props.candidateValue.email || '',
    first_name: props.candidateValue.first_name || '',
    last_name: props.candidateValue.last_name || '',
    phone: props.candidateValue.phone || '',
  });
  const handleInputChange = (e) => {
    const { value, name } = e.target;
    setState((items) => ({ ...items, [name]: value }));
    if (props.invite) props.setFlag(false);
  };

  // const permissions = useSelector(
  //   (reducerState) => reducerState?.permissionsReducer?.permissions,
  // );
  const subscriptions = useSelector(
    (reducerState) => reducerState?.userSubscriptionsReducer?.subscriptions,
  );

  const onPopperOpen = (event) => {
    if (
      !getIsAllowedSubscription({
        serviceKey: SubscriptionServicesEnum.EvaSSESS.key,
        subscriptions,
      })
    ) {
      setAnchorEl(event.currentTarget);
      setPopperOpen(true);
    }
  };

  const updateParent = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      props.setCandidates({ ...state }, props.number);
    }, 400);
  }, [state]);

  useEffect(() => {
    updateParent();
  }, [updateParent, state]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return (
    <>
      <div className="d-flex">
        <Row className="w-100">
          <Col xs="12" sm="6" md="3" className="px-2">
            <TextField
              id="first-name"
              name="first_name"
              label={t(`${props.translationPath}first-name`)}
              variant="outlined"
              className="form-control-alternative w-100"
              type="text"
              onChange={handleInputChange}
              value={state.first_name}
              // disabled={
              //   !getIsAllowedPermissionV2({
              //     permissions,
              //     permissionsId: CreateAssessmentPermissions.UpdateEvaSsessApplication.key
              //   })
              // }
            />
            {props.invite && props.errors ? (
              props.errors.length > 0 ? (
                props.errors.map((error, key) => (
                  <p key={key} className="mb-0 mt-1 text-xs text-danger">
                    {error[0]?.includes(`user_invited.${props.index}.first_name`)
                      ? error[1][0].replace(`user_invited.${props.index}.`, '')
                      : ''}
                  </p>
                ))
              ) : (
                <p className="mb-0 mt-1 text-xs text-danger" />
              )
            ) : (
              ''
            )}
          </Col>
          <Col xs="12" sm="6" md="3" className="px-2">
            <TextField
              id="last-name"
              name="last_name"
              label={t(`${props.translationPath}last-name`)}
              variant="outlined"
              className="form-control-alternative w-100"
              type="text"
              onChange={handleInputChange}
              value={state.last_name}
              // disabled={
              //   !getIsAllowedPermissionV2({
              //     permissions,
              //     permissionsId: CreateAssessmentPermissions.UpdateEvaSsessApplication.key
              //   })
              // }
            />
            {props.invite && props.errors ? (
              props.errors.length > 0 ? (
                props.errors.map((error, key) => (
                  <p key={key} className="mb-0 mt-1 text-xs text-danger">
                    {error[0]?.includes(`user_invited.${props.index}.last_name`)
                      ? error[1][0].replace(`user_invited.${props.index}.`, '')
                      : ''}
                  </p>
                ))
              ) : (
                <p className="mb-0 mt-1 text-xs text-danger" />
              )
            ) : (
              ''
            )}
          </Col>
          <Col xs="12" sm="6" md="3" className="px-2">
            <TextField
              id="email-address"
              name="email"
              label={t(`${props.translationPath}email-address`)}
              variant="outlined"
              className="form-control-alternative w-100"
              type="email"
              onChange={handleInputChange}
              value={state.email}
              // disabled={
              //   !getIsAllowedPermissionV2({
              //     permissions,
              //     permissionsId: CreateAssessmentPermissions.UpdateEvaSsessApplication.key
              //   })
              // }
            />
            {props.invite && props.errors ? (
              props.errors.length > 0 ? (
                props.errors.map((error, key) => (
                  <p key={key} className="mb-0 mt-1 text-xs text-danger">
                    {error[0]?.includes(`user_invited.${props.index}.email`)
                      ? error[1][0].replace(`user_invited.${props.index}.`, '')
                      : ''}
                  </p>
                ))
              ) : (
                <p className="mb-0 mt-1 text-xs text-danger">
                  {/* {console.log(props.errors)} */}
                  {/* {props.errors[0]?.includes(`user_invited.${props.index}.email`) ? 'This Email Address is already invited' : props.errors} */}
                </p>
              )
            ) : (
              ''
            )}
          </Col>
          <Col xs="12" sm="6" md="3" className="px-2">
            <TextField
              id="phone-number"
              name="phone"
              label={t(`${props.translationPath}phone-number`)}
              variant="outlined"
              className="form-control-alternative w-100"
              type="text"
              onChange={handleInputChange}
              value={state.phone}
              // disabled={
              //   !getIsAllowedPermissionV2({
              //     permissions,
              //     permissionsId: CreateAssessmentPermissions.UpdateEvaSsessApplication.key
              //   })
              // }
            />
          </Col>
        </Row>
        {props.number !== props.candidates?.length - 1 && (
          <ButtonBase
            // disabled={
            //   !getIsAllowedPermissionV2({
            //     permissions,
            //     permissionsId:
            //       CreateAssessmentPermissions.UpdateEvaSsessApplication.key,
            //   })
            // }
            onMouseEnter={onPopperOpen}
            className="btns-icon theme-transparent mx-2 mt-2"
            onClick={props.removeCandidate}
          >
            <span className="fas fa-times" />
          </ButtonBase>
        )}
        {props.number === props.candidates?.length - 1 && (
          <ButtonBase
            // disabled={
            //   !getIsAllowedPermissionV2({
            //     permissions,
            //     permissionsId: CreateAssessmentPermissions.UpdateEvaSsessApplication.key
            //   })
            // }
            onMouseEnter={onPopperOpen}
            className="btns-icon theme-transparent mx-2 mt-2"
            onClick={props.addCandidate}
          >
            <span className="fas fa-plus" />
          </ButtonBase>
        )}
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
export default CandidateCard;
