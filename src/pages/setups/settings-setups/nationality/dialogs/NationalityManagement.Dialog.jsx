/* eslint-disable no-param-reassign */
import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { DialogComponent, SwitchComponent } from '../../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedInputControl,
} from '../../../../setups/shared';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import * as yup from 'yup';
import {
  CreateNationalitySetting,
  GetAllSetupsNationality,
  UpdateNationalitySetting,
} from '../../../../../services';
import i18next from 'i18next';
import { DynamicFormTypesEnum } from '../../../../../enums';
import { regexExpression } from '../../../../../utils';

export const NationalityManagementDialog = ({
  isOpen,
  activeItem,
  onSave,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const stateInitRef = useRef({
    regex: '',
    status: true,
    nationality_uuid: '',
  });
  const [errors, setErrors] = useState(() => ({}));
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          uuid: yup.string().nullable(),
          regex: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required'))
            .matches(regexExpression, {
              message: t(`${translationPath}invalid-regex`),
              excludeEmptyString: true,
            }),
          nationality_uuid: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t, translationPath]);

  const getEditInit = useCallback(() => {
    if (activeItem)
      setState({
        id: 'edit',
        value: {
          regex: activeItem?.regex || '',
          status: activeItem?.status || '',
          nationality_uuid: activeItem?.nationality_uuid || '',
          uuid: activeItem?.uuid || '',
        },
      });
  }, [activeItem]);

  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const localState = { ...state };

    let response;
    if (activeItem) response = await UpdateNationalitySetting(localState);
    else response = await CreateNationalitySetting(localState);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(
        t(
          `${translationPath}${
            (activeItem && 'setting-updated-successfully')
            || 'setting-created-successfully'
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && 'setting-update-failed') || 'setting-create-failed'
          }`,
        ),
        response,
      );
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  return (
    <>
      <DialogComponent
        titleText={
          (activeItem && 'edit-nationality-setting') || 'add-new-nationality-setting'
        }
        dialogContent={
          <div>
            <div className="c-gray-primary mb-2">
              <span>{t(`${translationPath}setting-management-description`)}</span>
            </div>

            <div className="d-flex px-2 mb-2">
              <SwitchComponent
                idRef="StatusSwitchRef"
                label="active"
                isChecked={state.status}
                isReversedLabel
                isFlexEnd
                onChange={(e, isChecked) => {
                  setState({ id: 'status', value: isChecked });
                }}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
              />
            </div>
            <div>
              <SharedAPIAutocompleteControl
                placeholder="select-nationality"
                title="nationality"
                stateKey="nationality_uuid"
                errorPath="nationality_uuid"
                errors={errors}
                onValueChanged={onStateChanged}
                idRef="nationality"
                getOptionLabel={(option) =>
                  option.name ? option.name[i18next.language] || option.name.en : ''
                }
                type={DynamicFormTypesEnum.select.key}
                getDataAPI={GetAllSetupsNationality}
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                searchKey="search"
                editValue={state.nationality_uuid}
                extraProps={{
                  with_than:
                    (state.nationality_uuid && [state.nationality_uuid]) || null,
                }}
                isSubmitted={isSubmitted}
                isRequired={true}
              />
              <SharedInputControl
                stateKey="regex"
                placeholder="regex"
                title="regex"
                errorPath="regex"
                isSubmitted={isSubmitted}
                errors={errors}
                editValue={state.regex}
                onValueChanged={onStateChanged}
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                isRequired={true}
              />
            </div>
          </div>
        }
        saveIsDisabled={isLoading}
        isOpen={isOpen}
        onSubmit={saveHandler}
        onCancelClicked={isOpenChanged}
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </>
  );
};

NationalityManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  activeItem: PropTypes.instanceOf(Object),
};

NationalityManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'NationalityManagementDialog.',
};
