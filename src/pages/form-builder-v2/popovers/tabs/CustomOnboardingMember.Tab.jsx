import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { getErrorByName } from '../../../../helpers';
import { useTranslation } from 'react-i18next';
import { DynamicFormTypesEnum, FormsMembersTypesEnum } from '../../../../enums';
import * as Yup from 'yup';

import { ButtonBase } from '@mui/material';
import { emailExpression } from '../../../../utils';
import { getUniqueID } from 'shared/utils';

const CustomOnboardingMemberTab = ({
  arrayKey,
  type,
  state,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [localeState, setLocaleState] = useState({
    uuid: getUniqueID(),
    email: '',
    first_name: '',
    last_name: '',
    type,
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const onLocaleStateChange = useCallback(({ id, value }) => {
    setLocaleState((item) => ({ ...item, [id]: value || '' }));
  }, []);
  const handleResetState = useCallback(() => {
    setLocaleState({
      uuid: getUniqueID(),
      email: '',
      first_name: '',
      last_name: '',
      type,
    });
  }, [type]);
  const schema = useRef(
    Yup.object().shape({
      first_name: Yup.string().required(t('Shared:required')),
      last_name: Yup.string().required(t('Shared:required')),
      email: Yup.string()
        .required(t('Shared:required'))
        .matches(emailExpression, {
          message: t('Shared:invalid-email'),
          excludeEmptyString: true,
        }),
    }),
  );

  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, localeState);
    setErrors(result);
  }, [localeState]);
  useEffect(() => {
    getErrors();
  }, [getErrors]);
  const getIsSelectedItemIndex = useMemo(
    () =>
      ({ itemUUID }) =>
        state[arrayKey]
          ? state[arrayKey].findIndex((item) => item.uuid === itemUUID)
          : -1,
    [arrayKey, state],
  );
  const saveHandler = (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    const itemIndex = getIsSelectedItemIndex({ itemUUID: localeState.uuid });
    onStateChanged({
      parentId: arrayKey,
      parentIndex: itemIndex === -1 ? state[arrayKey].length : itemIndex,
      value: { ...localeState, email: (localeState?.email || '').toLowerCase() },
    });
    handleResetState();
    setIsSubmitted(false);
    setTimeout(() => setErrors({}));
  };
  const savedMembers = useMemo(
    () => (state?.[arrayKey] || []).filter((item) => item.type === type),
    [arrayKey, state, type],
  );

  const handleSelectMember = useCallback(
    (e) => {
      if (e.value) setLocaleState(e.value);
      else handleResetState();
    },
    [handleResetState],
  );

  const disabledSave = useMemo(
    () =>
      !(
        localeState.uuid
        && localeState.first_name
        && localeState.last_name
        && localeState.email
      ) || Object.keys(errors).length > 0,
    [localeState, errors],
  );

  return (
    <div className="form-member-tab-wrapper tab-wrapper">
      <div className="list-wrapper mb-0 p-1">
        <div className="list-items-wrapper">
          {savedMembers?.length > 0 ? (
            <SharedAutocompleteControl
              isFullWidth
              searchKey="search"
              initValuesKey="uuid"
              getOptionLabel={(option) => `${option.first_name} ${option.last_name}`}
              initValues={savedMembers}
              stateKey="value"
              isEntireObject
              onValueChanged={handleSelectMember}
              type={DynamicFormTypesEnum.select.key}
              title="select-member"
              editValue={
                (getIsSelectedItemIndex({ itemUUID: localeState.uuid }) !== -1
                  && localeState.uuid)
                || ''
              }
              placeholder="select-member"
              sharedClassesWrapper="mt-1"
              parentTranslationPath={parentTranslationPath}
            />
          ) : null}
          <div className="card border-light p-1 my-1">
            <SharedInputControl
              errors={errors}
              isFullWidth
              title="first-name"
              isSubmitted={isSubmitted}
              stateKey="first_name"
              errorPath="first_name"
              type="string"
              onValueChanged={onLocaleStateChange}
              editValue={localeState.first_name}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              errors={errors}
              isFullWidth
              title="last-name"
              isSubmitted={isSubmitted}
              stateKey="last_name"
              errorPath="last_name"
              type="string"
              onValueChanged={onLocaleStateChange}
              editValue={localeState.last_name}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <SharedInputControl
              errors={errors}
              isFullWidth
              title="email"
              isSubmitted={isSubmitted}
              stateKey="email"
              errorPath="email"
              onValueChanged={onLocaleStateChange}
              editValue={localeState.email}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
            />
            <div className="d-flex-center">
              <ButtonBase
                className="btns theme-solid"
                disabled={disabledSave}
                onClick={saveHandler}
              >
                {t('save')}
              </ButtonBase>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

CustomOnboardingMemberTab.propTypes = {
  listAPI: PropTypes.func.isRequired,
  listAPIDataPath: PropTypes.string,
  listAPITotalPath: PropTypes.string,
  imageAltValue: PropTypes.string,
  type: PropTypes.oneOf(
    Object.values(FormsMembersTypesEnum).map((item) => item.key),
  ),
  dropdownsProps: PropTypes.shape({
    job_uuid: PropTypes.string,
    job_pipeline_uuid: PropTypes.string,
    stage_uuid: PropTypes.string,
    selected_candidates: PropTypes.arrayOf(PropTypes.string),
  }),
  isWithJobsFilter: PropTypes.bool,
  listAPIProps: PropTypes.instanceOf(Object),
  arrayKey: PropTypes.string.isRequired,
  getIsDisabledItem: PropTypes.func,
  state: PropTypes.instanceOf(Object).isRequired,
  uuidKey: PropTypes.string.isRequired,
  typeKey: PropTypes.string.isRequired,
  onStateChanged: PropTypes.func.isRequired,
  getListAPIProps: PropTypes.func,
  isImage: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  extraStateData: PropTypes.instanceOf(Object).isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

export default CustomOnboardingMemberTab;
