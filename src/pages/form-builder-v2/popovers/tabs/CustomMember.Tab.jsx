import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
  SharedPhoneControl,
} from '../../../setups/shared';
import { SwitchComponent, UploaderComponent } from '../../../../components';
import { getErrorByName } from '../../../../helpers';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import {
  DynamicFormTypesEnum,
  FormsMembersTypesEnum,
  UploaderPageEnum,
} from '../../../../enums';
import {
  GetAllSetupsDirectManagers,
  GetAllSetupsPositions,
  getSetupsPositionsById,
} from '../../../../services';
import * as Yup from 'yup';

import { ButtonBase } from '@mui/material';
import { emailExpression, phoneExpression, urlExpression } from '../../../../utils';
import { getUniqueID } from 'shared/utils';
import { useSelector } from 'react-redux';

const CustomMemberTab = ({
  arrayKey,
  type,
  state,
  uuidKey,
  onStateChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const branchesReducer = useSelector((state) => state?.branchesReducer);
  const [localeState, setLocaleState] = useState({
    uuid: getUniqueID(),
    name: '',
    phoneNumber: null,
    countryCode: null,
    profilePicUuid: null,
    profilePic: [],
    linkedin: '',
    isHeadOfDepartment: false,
    positionUuid: '',
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
      name: '',
      phoneNumber: null,
      countryCode: null,
      profilePicUuid: null,
      profilePic: [],
      linkedin: '',
      isHeadOfDepartment: false,
      positionUuid: '',
      type,
    });
  }, [type]);
  const schema = useRef(
    Yup.object().shape({
      name: Yup.string().required(t('Shared:required')),
      email: Yup.string()
        .required(t('Shared:required'))
        .matches(emailExpression, {
          message: t('Shared:invalid-email'),
          excludeEmptyString: true,
        }),
      phoneNumber: Yup.string()
        .nullable()
        .matches(phoneExpression, {
          message: t('Shared:invalid-phone-number'),
          excludeEmptyString: true,
        }),
      linkedin: Yup.string().nullable().matches(urlExpression, {
        message: 'Invalid URL',
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
      value: localeState,
    });
    handleResetState();
    setIsSubmitted(false);
    setTimeout(() => setErrors({}));
  };
  const savedMembers = useMemo(
    () => (state?.meetMember || []).filter((item) => item.type === type),
    [state?.meetMember, type],
  );

  const handleSelectMember = useCallback(
    (e) => {
      if (e.value) setLocaleState(e.value);
      else handleResetState();
    },
    [handleResetState],
  );

  const disabledCheck = useMemo(
    () =>
      !(localeState.uuid && localeState.name && localeState.email)
      || Object.keys(errors).length > 0,
    [localeState, errors],
  );
  const onUploadChanged = (newFiles) => {
    if (newFiles.length && newFiles[0].uuid)
      setLocaleState((item) => ({
        ...item,
        profilePic: newFiles || [],
        profilePicUuid: newFiles[0].uuid,
      }));
    else
      setLocaleState((item) => ({
        ...item,
        profilePic: [],
        profilePicUuid: null,
      }));
  };

  return (
    <div className="form-member-tab-wrapper tab-wrapper">
      <div className="list-wrapper mb-0 p-1">
        <div className="list-items-wrapper">
          {savedMembers?.length > 0 ? (
            <SharedAutocompleteControl
              isFullWidth
              searchKey="search"
              initValuesKey="uuid"
              initValuesTitle="name"
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
            <div className="d-flex-center">
              <div className="d-flex-column-center mb-3">
                <span className="p-1">{t('profile-image')}</span>
                <UploaderComponent
                  uploadedFiles={localeState.profilePic}
                  uploaderPage={UploaderPageEnum.ProfileImage}
                  wrapperClasses=" uploader-wrapper profile-meet-member-custom"
                  dropHereText="Profile Image"
                  uploadedFileChanged={(newFiles) => onUploadChanged(newFiles)}
                />
              </div>
              {/*<div className="d-inline-flex   mb-3">*/}
              <SwitchComponent
                idRef="isHeadOfDepartmentSwitchRef"
                label="head-of-department"
                isChecked={localeState.isHeadOfDepartment}
                isReversedLabel
                isFlexEnd
                onChange={(event, isChecked) => {
                  onLocaleStateChange({
                    id: 'isHeadOfDepartment',
                    value: isChecked,
                  });
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              {/*</div>*/}
            </div>

            <SharedAPIAutocompleteControl
              errors={errors}
              searchKey="search"
              title="position-title"
              stateKey="positionUuid"
              errorPath="positionUuid"
              isSubmitted={isSubmitted}
              editValue={localeState.positionUuid}
              onValueChanged={(e) => {
                setLocaleState((item) => ({
                  ...item,
                  positionUuid: e?.value?.uuid || '',
                  positionTitle: e?.value || '',
                }));
              }}
              placeholder="position-title"
              controlWrapperClasses="px-0"
              translationPath={translationPath}
              getDataAPI={GetAllSetupsPositions}
              getItemByIdAPI={getSetupsPositionsById}
              parentTranslationPath={parentTranslationPath}
              isEntireObject
              getOptionLabel={(option) =>
                option.name[i18next.language] || option.name.en
              }
              extraProps={{
                ...(localeState.position_uuid && {
                  with_than: [localeState.position_uuid],
                }),
              }}
            />
            <SharedInputControl
              errors={errors}
              isFullWidth
              title="name"
              isSubmitted={isSubmitted}
              stateKey="name"
              errorPath="name"
              type="string"
              onValueChanged={onLocaleStateChange}
              editValue={localeState.name}
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
            <SharedPhoneControl
              isFullWidth
              errors={errors}
              stateKey="phoneNumber"
              countryCodeKey="countryCode"
              errorPath="phoneNumber"
              isSubmitted={isSubmitted}
              editValue={localeState.phoneNumber}
              currentCountryCode={localeState.countryCode}
              title="phone"
              onValueChanged={onLocaleStateChange}
              placeholder="Phone"
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              excludeCountries={branchesReducer?.branches?.excluded_countries}
            />
            <SharedInputControl
              editValue={localeState.linkedin}
              translationPath={translationPath}
              parentTranslationPath={parentTranslationPath}
              stateKey="linkedin"
              title="linkedin"
              errorPath="linkedin"
              errors={errors}
              isSubmitted={isSubmitted}
              onValueChanged={onLocaleStateChange}
              isFullWidth
            />
            <div className="d-flex-center">
              <ButtonBase
                className="btns theme-solid"
                disabled={disabledCheck}
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

CustomMemberTab.propTypes = {
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

export default CustomMemberTab;
