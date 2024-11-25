import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useTitle } from '../../hooks';
import ButtonBase from '@mui/material/ButtonBase';
import { SharedInputControl } from '../setups/shared';
import {
  RecipientLoginGroupVerification,
  RecipientLoginVerification,
} from '../../services';
import {
  removeCandidate,
  updateCandidate,
} from '../../stores/actions/candidateActions';
import { getErrorByName, GlobalHistory, showError } from '../../helpers';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { emailExpression } from '../../utils';
import './RecipientLogin.Style.scss';
import { CandidateTypes } from '../../stores/types/candidateTypes';

const parentTranslationPath = 'FormBuilderPage';
const translationPath = '';

const RecipientLoginPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  useTitle(t(`${translationPath}recipient-login`));
  const isInitRef = useRef(true);
  const candidateReducer = useSelector((state) => state?.candidateReducer);
  const [errors, setErrors] = useState({});
  const query = useQuery();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState(null);
  const [queryData, setQueryData] = useState({
    key: '',
    branch_name: '',
    job_title: '',
    position_title: '',
    branch_logo: '',
  });

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          email: yup
            .string()
            .nullable()
            .matches(emailExpression, {
              message: t('Shared:invalid-email'),
              excludeEmptyString: true,
            })
            .required(t('Shared:this-field-is-required')),
        }),
      },
      { email },
    );
    setErrors(result);
  }, [email, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    setIsLoading(true);
    const response = await (
      (queryData.form_uuid && RecipientLoginVerification)
      || RecipientLoginGroupVerification
    )({
      key: queryData.key,
      email: email?.toLowerCase(),
    });
    setIsSubmitted(false);
    setIsLoading(false);
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      dispatch(updateCandidate(results));
      if (!queryData.form_uuid)
        GlobalHistory.push(`/onboarding/invitations?${query.toString()}`);
      else
        GlobalHistory.push(
          `/forms?editor_role=${queryData.editor_role}&form_uuid=${queryData.form_uuid}&code=${queryData.code}&invited_uuid=${queryData.invited_uuid}&role_type=${queryData.role_type}&utm_sources=${queryData.utm_sources}&for=${queryData.for}`,
        );
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  };

  useEffect(() => {
    const key = query.get('verification_form_key');
    const form_uuid = query.get('form_uuid');
    const invited_uuid = query.get('invited_uuid');
    const role_type = query.get('role_type');
    const code = query.get('code');
    const editor_role = query.get('editor_role');
    const utm_sources = query.get('utm_sources');
    const forUserType = query.get('for');
    let extra = query.get('extra');
    if (extra) extra = JSON.parse(window.atob(extra));

    if (key)
      setQueryData({
        ...extra,
        form_uuid,
        invited_uuid,
        role_type,
        code,
        editor_role,
        utm_sources: (utm_sources && +utm_sources) || undefined, // 1 for email, 2 for notifications
        for: (forUserType && +forUserType) || undefined, // 1 for candidate, 2 for system user
        key,
      });
  }, [query]);

  // this to call errors updater when email changed
  useEffect(() => {
    getErrors();
  }, [getErrors, email]);

  useEffect(() => {
    if (
      isInitRef.current
      && candidateReducer
      && (candidateReducer.reducer_status === CandidateTypes.SUCCESS
        || candidateReducer.reducer_status === CandidateTypes.SUBMITTED
        || candidateReducer.reducer_status === CandidateTypes.REJECTED)
    )
      dispatch(removeCandidate());

    isInitRef.current = false;
  }, [dispatch, candidateReducer]);
  const isOnboardingInvitation = useMemo(
    () => !queryData.form_uuid,
    [queryData.form_uuid],
  );
  return (
    <form noValidate onSubmit={saveHandler} className="recipient-login-page">
      <div className="recipient-login-box-wrapper">
        <div className={'d-flex-center'}>
          <img
            width="130"
            className="mb-3"
            src={queryData.branch_logo}
            alt={t(`${translationPath}branch-logo`)}
          />
        </div>
        {isOnboardingInvitation ? (
          <>
            <div className="header-description text-center mb-2">
              <span>{t(`${translationPath}welcome-to-onboarding-portal`)}</span>
            </div>
            <div className="header-description text-center mb-2">
              <span>{t(`${translationPath}excited-to-have-you-join-us`)}</span>
            </div>
            <div className="description-text mb-3">
              {t(`${translationPath}insert-your-email-get-started`)}
            </div>
          </>
        ) : (
          <>
            <div className="header-description text-center mb-2">
              <span>
                {t(`${translationPath}recipient-login-first-part-description`)}
              </span>
              <span className="px-1">{queryData.branch_name}</span>
              <span>
                {t(`${translationPath}recipient-login-second-part-description`)}
              </span>
            </div>
            <div className="description-text text-center mb-3">
              {t(`${translationPath}recipient-login-email-description`)}
            </div>
          </>
        )}
        <SharedInputControl
          placeholder="enter-email"
          editValue={email}
          stateKey="email"
          onValueChanged={({ value }) => {
            setEmail(value);
          }}
          isSubmitted={isSubmitted}
          isRequired
          isFullWidth
          errors={errors}
          errorPath="email"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <ButtonBase
          className="btns theme-solid w-100 mih-40px mx-0"
          sx={{
            maxWidth: 344,
          }}
          type="submit"
          disabled={isLoading}
        >
          <span>{t(`${translationPath}sign-in`)}</span>
        </ButtonBase>
      </div>
    </form>
  );
};

export default RecipientLoginPage;
