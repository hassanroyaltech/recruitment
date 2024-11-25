import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import { getErrorByName, showError, showSuccess } from '../../../../../../helpers';
import { CheckboxesComponent, DialogComponent } from '../../../../../../components';
import {
  GetAllJobCategories,
  GetSetupsUserCompanyDetails,
  UpdateSetupsUserCompanyDetails,
} from '../../../../../../services';
import { SharedAPIAutocompleteControl } from '../../../../shared';
import { DynamicFormTypesEnum } from '../../../../../../enums';

export const UsersInfoDialog = ({
  onSave,
  isOpen,
  activeItem,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const schema = useRef(null);
  const [errors, setErrors] = useState(() => ({}));
  const defaultState = [
    {
      name: '',
      user_uuid: activeItem && activeItem.uuid,
      is_active: false,
      is_cc_email: false,
      company_uuid: '',
      ats_category_uuid: [],
    },
  ];
  const [state, setState] = useState(defaultState);

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await GetSetupsUserCompanyDetails({
      user_uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) setState(response.data.results);
  }, [activeItem]);

  /**
   * @author Manaf Hijazi (m.hijazi@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    // if (Object.keys(errors).length > 0) return;

    setIsLoading(true);
    const payload = {
      user_companies: state
        .filter((item) => item.is_active)
        .map((item) => ({ ...item, user_uuid: activeItem && activeItem.uuid })),
    };

    const response = await UpdateSetupsUserCompanyDetails(payload);
    setIsLoading(false);
    if (response && (response.status === 200 || response.status === 201)) {
      showSuccess(t(`${translationPath}user-updated-successfully`));
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else showError(t(`${translationPath}user-update-failed`), response);
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.array().of(
      yup.object().shape({
        ats_category_uuid: yup
          .array()
          .test(
            'is-min',
            `${t('please-select-at-least')} ${1}`,
            (value) => value && value.length > 0,
          )
          .nullable(),
      }),
    );
  }, [t, translationPath]);

  return (
    <DialogComponent
      maxWidth="md"
      titleText="user-info"
      dialogContent={
        <div className="setups-management-content-dialog-wrapper">
          <div className="px-2">
            <div className="d-flex pb-1">
              <div className="pr-2-reversed text-primary font-weight-bold">
                {t(`${translationPath}name`)}:
              </div>
              <div>
                {`${
                  activeItem.first_name[i18next.language] || activeItem.first_name.en
                } 
                ${
    activeItem.last_name[i18next.language] || activeItem.last_name.en
    }`}
              </div>
            </div>

            <div className="d-flex pb-1">
              <div className="pr-2-reversed text-primary font-weight-bold">
                {t(`${translationPath}email`)}:
              </div>
              <div>{activeItem.email || ''}</div>
            </div>

            <div className="d-flex pb-1">
              <div className="pr-2-reversed text-primary font-weight-bold">
                {t(`${translationPath}job-title`)}:
              </div>
              <div>{activeItem.job_title || ''}</div>
            </div>
          </div>

          <div className="px-2 pt-3 d-flex flex-column">
            <div className="d-inline-flex c-black header-text pb-3">
              <span>{t(`${translationPath}branch-access`)}</span>
            </div>
            {state
              && state.map((item, index) => (
                <div
                  key={`${index + 1}-company-item`}
                  className="d-flex align-items-start"
                >
                  <div className="w-25 pr-2-reversed d-inline-flex c-black pt-2">
                    <span>{`${item.name[i18next.language] || item.name.en}`}</span>
                  </div>
                  <div className="w-25 d-flex">
                    <CheckboxesComponent
                      wrapperClasses="pr-3-reversed"
                      singleChecked={item.is_active}
                      idRef="is-active-checkbox-label"
                      label={t(`${translationPath}is-active`)}
                      onSelectedCheckboxChanged={(event, isChecked) => {
                        setState((items) => {
                          const currentItemIndex = items.findIndex(
                            (el) => el.company_uuid === item.company_uuid,
                          );

                          if (currentItemIndex !== -1)
                            items[currentItemIndex].is_active = isChecked;

                          return [...items];
                        });
                      }}
                    />
                    <CheckboxesComponent
                      idRef="cc-checkbox-label"
                      singleChecked={item.is_cc_email}
                      label={t(`${translationPath}carbon-copy`)}
                      onSelectedCheckboxChanged={(event, isChecked) => {
                        setState((items) => {
                          const currentItemIndex = items.findIndex(
                            (el) => el.company_uuid === item.company_uuid,
                          );

                          if (currentItemIndex !== -1)
                            items[currentItemIndex].is_cc_email = isChecked;

                          return [...items];
                        });
                      }}
                    />
                  </div>
                  <div className="w-100">
                    <SharedAPIAutocompleteControl
                      isFullWidth
                      errors={errors}
                      title="select-category"
                      isSubmitted={isSubmitted}
                      placeholder="select-category"
                      getDataAPI={GetAllJobCategories}
                      idRef="categoriesAutocompleteRef"
                      translationPath={translationPath}
                      editValue={item.ats_category_uuid}
                      type={DynamicFormTypesEnum.array.key}
                      getOptionLabel={(option) =>
                        option?.[
                          (i18next.language !== 'en'
                            && `title_${i18next.language}`)
                            || 'title'
                        ] || ''
                      }
                      parentTranslationPath={parentTranslationPath}
                      stateKey={`[${index}].ats_category_uuid`}
                      errorPath={
                        item.is_active ? `[${index}].ats_category_uuid` : ''
                      }
                      onValueChanged={(newValue) =>
                        setState((items) => {
                          const currentItemIndex = items.findIndex(
                            (el) => el.company_uuid === item.company_uuid,
                          );

                          if (currentItemIndex !== -1)
                            items[currentItemIndex].ats_category_uuid
                              = newValue && newValue.value;
                          return [...items];
                        })
                      }
                      extraProps={{
                        ...(state.ats_category_uuid?.length && {
                          with_than: state.ats_category_uuid,
                        }),
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      }
      isOpen={isOpen}
      isSaving={isLoading}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      translationPath={translationPath}
      isEdit={(activeItem && true) || undefined}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="setups-management-dialog-wrapper"
    />
  );
};

UsersInfoDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  onSave: PropTypes.func,
  isOpenChanged: PropTypes.func,
  translationPath: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
};
UsersInfoDialog.defaultProps = {
  onSave: undefined,
  activeItem: undefined,
  isOpenChanged: undefined,
  translationPath: 'UsersInfoDialog.',
};
