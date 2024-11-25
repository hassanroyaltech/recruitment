/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../../../setups/shared';
import {
  getErrorByName,
  showError,
  showSuccess,
} from '../../../../../../../helpers';
import * as yup from 'yup';
import './VisaTypeManagement.Style.scss';
import {
  GetAllVisaGenders,
  GetAllVisaOccupations,
  GetVisaGenderById,
  GetVisaOccupationById,
  UpdateVisaType,
  GetVisaTypeById,
  GetAllVisaNationalities,
  GetVisaNationalityById,
  GetAllVisaReligions,
  GetVisaReligionById,
  GetAllVisaIssuePlaces,
  GetVisaIssuePlaceById,
  GetAllVisaBlockIssuePlaces,
  GetVisaBlockIssuePlaceById,
} from '../../../../../../../services';
import i18next from 'i18next';

export const VisaTypeManagementDialog = ({
  isOpen,
  blockState,
  onBlockStateChanged,
  blockErrors,
  activeItem, // this is from table (to have the table text)
  onSave,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateInitRef = useRef({
    uuid: (activeItem && activeItem.uuid) || undefined,
    occupation: null, // to save the value if uuid (saved)
    occupationText: null, // to save only the text values
    nationality: null,
    nationalityText: null,
    gender: null,
    genderText: null,
    religion: null,
    religionText: null,
    issue_place: null,
    issue_placeText: null,
    head_count: null,
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    if (newValue.value && Object.hasOwn(newValue.value, 'uuid')) {
      setState({ ...newValue, value: newValue.value.uuid });
      setState({
        ...newValue,
        id: `${newValue.id}Text`,
        value:
          (newValue.value.name
            && (newValue.value.name[i18next.language] || newValue.value.name.en))
          || 'N/A',
      });
    } else setState(newValue);
  };

  /**
   * @param key - the key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  // const onAutoCompleteInputChanged = (key) => (newEventValue) => {
  //   if (!newEventValue || !newEventValue.target) return;
  //   const {
  //     target: { value },
  //   } = newEventValue;
  //   setState({ id: key, value });
  //   setState({ id: `${key}Text`, value });
  // };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle the validations of the form
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          uuid: yup.string().nullable(),
          occupation: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          nationality: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          gender: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          religion: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          issue_place: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          head_count: yup
            .number()
            .nullable()
            .required(t('Shared:this-field-is-required'))
            .min(1, `${t(`Shared:this-field-must-be-more-than`)} ${0}`),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetVisaTypeById({
      visa_uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200)
      setState({
        id: 'edit',
        value: response.data.results,
      });
    else {
      showError(t('Shared:failed-to-get-saved-data'), response);
      isOpenChanged();
    }
  }, [activeItem, isOpenChanged, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (activeItem && activeItem.uuid) {
      setIsLoading(true);
      const response = await UpdateVisaType(state);
      setIsLoading(false);
      if (response && (response.status === 200 || response.status === 201)) {
        showSuccess(
          t(
            `${translationPath}${
              (activeItem && activeItem.uuid && 'visa-type-updated-successfully')
              || 'visa-type-created-successfully'
            }`,
          ),
        );
        if (onSave) onSave({ isReloading: true });
        if (isOpenChanged) isOpenChanged();
      } else
        showError(
          t(
            `${translationPath}${
              (activeItem && activeItem.uuid && 'visa-type-update-failed')
              || 'visa-type-create-failed'
            }`,
          ),
          response,
        );
    } else {
      if (onSave)
        onSave({
          visaTypeForTable: state,
        });
      if (isOpenChanged) isOpenChanged();
    }
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem && activeItem.uuid) getEditInit();
  }, [activeItem, getEditInit]);

  // this to get saved data on edit unsaved type
  useEffect(() => {
    if (activeItem && !activeItem.uuid)
      setState({ id: 'edit', value: { ...activeItem } });
  }, [activeItem]);

  return (
    <DialogComponent
      titleText={(activeItem && 'edit-visa-type') || 'new-visa-type'}
      titleIcon="fas fa-ticket-alt"
      dialogContent={
        <div className="visa-type-management-content-dialog-wrapper">
          <div className="header-text my-1">
            <span>
              {t(
                `${translationPath}${
                  (activeItem && 'editing-visa-type') || 'adding-new-visa-type'
                }`,
              )}
            </span>
          </div>
          <div className="c-gray-primary mb-4">
            <span>{t(`${translationPath}visa-type-management-description`)}</span>
          </div>
          <div className="mb-3">
            <span>{t(`${translationPath}visa-type-details`)}</span>
          </div>
          {blockState && (
            <>
              <SharedInputControl
                isHalfWidth
                inlineLabel="block-id"
                stateKey="block_number"
                placeholder="block-id"
                errorPath="block_number"
                // isSubmitted={isSubmitted}
                errors={blockErrors}
                isDisabled
                editValue={blockState.block_number}
                // isDisabled={Boolean(activeItem && activeItem.uuid)}
                onValueChanged={onBlockStateChanged || undefined}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
              <SharedAPIAutocompleteControl
                isHalfWidth
                inlineLabel="block-issue-place"
                errors={blockErrors}
                // isSubmitted={isSubmitted}
                stateKey="block_place_of_issue"
                errorPath="block_place_of_issue"
                searchKey="search"
                placeholder="select-block-issue-place"
                onValueChanged={onBlockStateChanged}
                isDisabled
                // editValue={
                //   (IsUUID(blockState.block_place_of_issue)
                //     && blockState.block_place_of_issue)
                //   || undefined
                // }
                editValue={blockState.block_place_of_issue}
                getDataAPI={GetAllVisaBlockIssuePlaces}
                getItemByIdAPI={GetVisaBlockIssuePlaceById}
                // type={DynamicFormTypesEnum.select.key}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isLoading={isLoading}
                getOptionLabel={(option) =>
                  (option.name
                    && (option.name[i18next.language] || option.name.en || 'N/A'))
                  || 'N/A'
                }
                // inputValue={
                //   (!IsUUID(blockState.block_place_of_issue)
                //     && blockState.block_place_of_issue)
                //   || ''
                // }
                // onInputChange={onAutoCompleteInputChanged('block_place_of_issue')}
                extraProps={
                  activeItem
                  && activeItem.uuid
                  // && IsUUID(blockState.block_place_of_issue)
                  && blockState.block_place_of_issue && {
                    with_than: [blockState.block_place_of_issue],
                  }
                }
              />
              {/*<SharedAPIAutocompleteControl*/}
              {/*  isHalfWidth*/}
              {/*  inlineLabel="company"*/}
              {/*  errors={errors}*/}
              {/*  isSubmitted={isSubmitted}*/}
              {/*  stateKey="company"*/}
              {/*  errorPath="company"*/}
              {/*  searchKey="search"*/}
              {/*  placeholder="select-company"*/}
              {/*  onValueChanged={onStateChanged}*/}
              {/*  editValue={state.company}*/}
              {/*  translationPath={translationPath}*/}
              {/*  getDataAPI={GetAllSetupsBranches}*/}
              {/*  type={DynamicFormTypesEnum.select.key}*/}
              {/*  getItemByIdAPI={GetSetupsBranchesById}*/}
              {/*  parentTranslationPath={parentTranslationPath}*/}
              {/*  isLoading={isLoading}*/}
              {/*  getOptionLabel={(option) =>*/}
              {/*    option.name[i18next.language] || option.name.en*/}
              {/*  }*/}
              {/*  extraProps={*/}
              {/*    blockUUID && state.company && { with_than: [state.company] }*/}
              {/*  }*/}
              {/*/>*/}
            </>
          )}
          <SharedAPIAutocompleteControl
            isHalfWidth
            inlineLabel="occupation"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="occupation"
            errorPath="occupation"
            searchKey="search"
            placeholder="select-occupation"
            onValueChanged={onStateChanged}
            isEntireObject
            // editValue={(IsUUID(state.occupation) && state.occupation) || undefined}
            editValue={state.occupation}
            getDataAPI={GetAllVisaOccupations}
            getItemByIdAPI={GetVisaOccupationById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isLoading={isLoading}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            // inputValue={(!IsUUID(state.occupation) && state.occupation) || ''}
            // onInputChange={
            //   (!IsUUID(state.occupation)
            //     && onAutoCompleteInputChanged('occupation'))
            //   || undefined
            // }
            extraProps={
              activeItem
              // && IsUUID(state.occupation)
              && state.occupation && { with_than: [state.occupation] }
            }
          />
          <SharedAPIAutocompleteControl
            isHalfWidth
            inlineLabel="gender"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="gender"
            errorPath="gender"
            searchKey="search"
            placeholder="select-gender"
            onValueChanged={onStateChanged}
            isEntireObject
            // editValue={(IsUUID(state.gender) && state.gender) || undefined}
            editValue={state.gender}
            getDataAPI={GetAllVisaGenders}
            getItemByIdAPI={GetVisaGenderById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isLoading={isLoading}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            // inputValue={(!IsUUID(state.gender) && state.gender) || ''}
            // onInputChange={
            //   (!IsUUID(state.gender) && onAutoCompleteInputChanged('gender'))
            //   || undefined
            // }
            extraProps={
              activeItem
              // && IsUUID(state.gender)
              && state.gender && { with_than: [state.gender] }
            }
          />
          <SharedAPIAutocompleteControl
            isHalfWidth
            inlineLabel="nationality"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="nationality"
            errorPath="nationality"
            searchKey="search"
            placeholder="select-nationality"
            onValueChanged={onStateChanged}
            isEntireObject
            // editValue={(IsUUID(state.nationality) && state.nationality) || undefined}
            editValue={state.nationality}
            getDataAPI={GetAllVisaNationalities}
            getItemByIdAPI={GetVisaNationalityById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isLoading={isLoading}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            // inputValue={(!IsUUID(state.nationality) && state.nationality) || ''}
            // onInputChange={onAutoCompleteInputChanged('nationality')}
            extraProps={
              activeItem
              // && IsUUID(state.nationality)
              && state.nationality && { with_than: [state.nationality] }
            }
          />
          <SharedAPIAutocompleteControl
            isHalfWidth
            inlineLabel="religion"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="religion"
            errorPath="religion"
            searchKey="search"
            placeholder="select-religion"
            onValueChanged={onStateChanged}
            isEntireObject
            // editValue={(IsUUID(state.religion) && state.religion) || undefined}
            editValue={state.religion}
            getDataAPI={GetAllVisaReligions}
            getItemByIdAPI={GetVisaReligionById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isLoading={isLoading}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            // inputValue={(!IsUUID(state.religion) && state.religion) || ''}
            // onInputChange={onAutoCompleteInputChanged('religion')}
            extraProps={
              activeItem
              // && IsUUID(state.religion)
              && state.religion && { with_than: [state.religion] }
            }
          />
          <SharedAPIAutocompleteControl
            isHalfWidth
            inlineLabel="arriving-from"
            errors={errors}
            isSubmitted={isSubmitted}
            stateKey="issue_place"
            errorPath="issue_place"
            searchKey="search"
            placeholder="select-arriving-from"
            onValueChanged={onStateChanged}
            isEntireObject
            // editValue={(IsUUID(state.issue_place) && state.issue_place) || undefined}
            editValue={state.issue_place}
            getDataAPI={GetAllVisaIssuePlaces}
            getItemByIdAPI={GetVisaIssuePlaceById}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            isLoading={isLoading}
            getOptionLabel={(option) =>
              (option.name
                && (option.name[i18next.language] || option.name.en || 'N/A'))
              || 'N/A'
            }
            // inputValue={(!IsUUID(state.issue_place) && state.issue_place) || ''}
            // onInputChange={
            //   (!IsUUID(state.issue_place)
            //     && onAutoCompleteInputChanged('issue_place'))
            //   || undefined
            // }
            extraProps={
              activeItem
              // && IsUUID(state.issue_place)
              && state.issue_place && { with_than: [state.issue_place] }
            }
          />
          <SharedInputControl
            isHalfWidth
            inlineLabel="number-of-visas"
            stateKey="head_count"
            placeholder="enter-number-of-visas"
            errorPath="head_count"
            isSubmitted={isSubmitted}
            type="number"
            min={0}
            errors={errors}
            editValue={state.head_count}
            isDisabled={Boolean(activeItem && activeItem.uuid)}
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      wrapperClasses="visa-type-management-dialog-wrapper"
      isOpen={isOpen}
      onSubmit={saveHandler}
      isEdit={Boolean(activeItem)}
      saveText={(activeItem && 'update-visa-type') || 'add-visa-type'}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

VisaTypeManagementDialog.propTypes = {
  blockState: PropTypes.shape({
    block_number: PropTypes.string,
    block_place_of_issue: PropTypes.string,
  }),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onBlockStateChanged: PropTypes.func,
  blockErrors: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};

VisaTypeManagementDialog.defaultProps = {
  blockState: undefined,
  onBlockStateChanged: undefined,
  isOpenChanged: undefined,
  translationPath: 'VisaTypeManagementDialog.',
};
