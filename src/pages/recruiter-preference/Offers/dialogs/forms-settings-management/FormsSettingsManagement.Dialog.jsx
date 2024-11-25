import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import {
  DeleteFormsSetting,
  GetAllFormsSettings,
  GetAllSetupsJobTargetTypes,
  UpdateFormsSetting,
} from '../../../../../services';
import {
  ConfirmDeleteDialog,
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../setups/shared';
import { getErrorByName, showError, showSuccess } from '../../../../../helpers';
import { DialogComponent, SwitchComponent } from '../../../../../components';
import {
  BranchesSlugSendTypesEnum,
  BranchesSlugsEnum,
  SystemActionsEnum,
} from '../../../../../enums';
import { ButtonBase } from '@mui/material';
import i18next from 'i18next';

export const FormsSettingsManagementDialog = ({
  isOpen,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [savedSlugs, setSavedSlugs] = useState([]);
  const [branchesSlugsTypes] = useState(() =>
    Object.values(BranchesSlugsEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [branchesSlugSendTypes] = useState(() =>
    Object.values(BranchesSlugSendTypesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );

  const stateInitRef = useRef({
    slugs: [],
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get update the state
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          slugs: yup.array().of(
            yup.object().shape({
              slug: yup
                .string()
                .nullable()
                .required(t('Shared:this-field-is-required')),
              settings: yup.mixed().when('slug', {
                is: BranchesSlugsEnum.WhoManySentBasedJobTarget.key,
                then: yup
                  .array()
                  .nullable()
                  .of(
                    yup.object().shape({
                      job_target_uuid: yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                      sent_type: yup
                        .string()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                    }),
                  )
                  .min(1, `${t('please-add-at-least')} ${1} ${t('job-target')}`),
                otherwise: yup
                  .object()
                  .when('slug', {
                    is: BranchesSlugsEnum.ApprovedCandidate.key,
                    then: yup.object().shape({
                      next_approved: yup
                        .boolean()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                    }),
                    otherwise: yup.object().shape({
                      download_pdf_offer: yup
                        .boolean()
                        .nullable()
                        .required(t('Shared:this-field-is-required')),
                    }),
                  })
                  .nullable(),
              }),
            }),
          ),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
    });
  }, [state, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get branch slugs settings
   */
  const getAllFormsSettings = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllFormsSettings();
    setIsLoading(false);
    if (response && response.status === 200) {
      setState({ id: 'slugs', value: response.data.results });
      setSavedSlugs([...response.data.results]);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
    // if (isOpenChanged) isOpenChanged();
  }, [t]);

  const onAddNewSlugHandler = () => {
    const localState = { ...state };
    localState.slugs.push({
      slug: null,
      settings: [],
    });
    setState({ id: 'slugs', value: localState.slugs });
  };

  const onAddJobTargetHandler = useCallback(
    ({ slugIndex, settings }) =>
      () => {
        const localSettings = [...settings];
        localSettings.push({
          job_target_uuid: null,
          sent_type: null,
        });
        setState({
          parentId: 'slugs',
          parentIndex: slugIndex,
          subParentId: 'settings',
          value: localSettings,
        });
      },
    [],
  );

  const onRemoveSlugHandler = useCallback(
    ({ slug, index, slugs }) =>
      () => {
        if (savedSlugs.some((item) => item.slug === slug.slug)) {
          setActiveItem(slug);
          setIsOpenConfirmDialog(true);
        } else {
          const localSlugs = [...slugs];
          localSlugs.splice(index, 1);
          setState({ id: 'slugs', value: localSlugs });
        }
      },
    [savedSlugs],
  );

  const onRemoveJobTargetHandler = useCallback(
    ({ slugIndex, settingIndex, settings }) =>
      () => {
        const localSettings = [...settings];
        localSettings.splice(settingIndex, 1);
        setState({
          parentId: 'slugs',
          parentIndex: slugIndex,
          id: 'settings',
          value: localSettings,
        });
      },
    [],
  );

  const getAvailableFormsSettings = useMemo(
    () => (slugIndex, slugs) =>
      branchesSlugsTypes.filter(
        (element) =>
          !slugs.some(
            (item, index) =>
              item.slug && index !== slugIndex && item.slug === element.key,
          ),
      ),
    [branchesSlugsTypes],
  );

  const getIsDisabledJobTargets = useMemo(
    () => (settings, settingIndex) => (option) =>
      settings.some(
        (item, index) =>
          item.job_target_uuid === option.uuid && index !== settingIndex,
      ),
    [],
  );

  /**
   * @param event
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving the forms settings
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    setIsLoading(true);
    // this is to save all slugs at once
    const response = await Promise.all(
      state.slugs.map((item) => UpdateFormsSetting(item)),
    );
    setIsLoading(false);
    if (!response || response.some((item) => item.status !== 200))
      if (response)
        response
          .filter((item) => item.status !== 200)
          .map((item) => {
            showError(t(`${translationPath}forms-settings-update-failed`), item);
            return undefined;
          });
      else showError(t(`${translationPath}forms-settings-update-failed`));
    else {
      showSuccess(t(`${translationPath}forms-settings-updated-successfully`));
      if (isOpenChanged) isOpenChanged();
    }
  };

  // this is to get the saved form settings
  useEffect(() => {
    getAllFormsSettings();
  }, [getAllFormsSettings]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <>
      <DialogComponent
        isWithFullScreen
        titleText="forms-settings-management"
        maxWidth="md"
        dialogContent={
          <div className="forms-settings-management-dialog-wrapper">
            {state.slugs
              && state.slugs.map((item, index, slugs) => (
                <div className="slug-item-wrapper" key={`slugsKey${index}`}>
                  <div className="slug-item-body">
                    <SharedAutocompleteControl
                      isHalfWidth
                      initValues={getAvailableFormsSettings(index, slugs)}
                      parentId="slugs"
                      parentIndex={index}
                      stateKey="slug"
                      disableClearable
                      isLoading={isLoading}
                      isSubmitted={isSubmitted}
                      errors={errors}
                      errorPath={`slugs[${index}].slug`}
                      onValueChanged={(newValue) => {
                        if (
                          newValue.value
                          === BranchesSlugsEnum.WhoManySentBasedJobTarget.key
                        )
                          onStateChanged({ ...newValue, id: 'settings', value: [] });
                        else if (
                          newValue.value === BranchesSlugsEnum.ApprovedCandidate.key
                        )
                          onStateChanged({
                            ...newValue,
                            id: 'settings',
                            value: { next_approved: false },
                          });
                        else if (
                          newValue.value
                          === BranchesSlugsEnum.DownloadPDFForRecipient.key
                        )
                          onStateChanged({
                            ...newValue,
                            id: 'settings',
                            value: { download_pdf_offer: true },
                          });
                        onStateChanged(newValue);
                      }}
                      inlineLabel="settings-type"
                      editValue={item.slug}
                      placeholder="select-settings-type"
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                    <ButtonBase
                      className="btns-icon theme-transparent"
                      onClick={onRemoveSlugHandler({
                        slug: item,
                        index,
                        slugs,
                      })}
                    >
                      <span className={SystemActionsEnum.delete.icon} />
                    </ButtonBase>
                    {item.slug && (
                      <div className="settings-wrapper">
                        {(item.slug
                          === BranchesSlugsEnum.WhoManySentBasedJobTarget.key && (
                          <>
                            {item.settings.map((setting, settingIndex, settings) => (
                              <div
                                className="d-flex"
                                key={`settingsKeys${index}-${settingIndex}`}
                              >
                                <div className="d-flex flex-wrap">
                                  <SharedAPIAutocompleteControl
                                    isHalfWidth
                                    errors={errors}
                                    searchKey="search"
                                    inlineLabel="job-target"
                                    parentId="slugs"
                                    parentIndex={index}
                                    subParentId="settings"
                                    subParentIndex={settingIndex}
                                    stateKey="job_target_uuid"
                                    errorPath={`slugs[${index}].settings[${settingIndex}].job_target_uuid`}
                                    isSubmitted={isSubmitted}
                                    editValue={setting.job_target_uuid}
                                    onValueChanged={onStateChanged}
                                    placeholder="select-job-target"
                                    getDisabledOptions={getIsDisabledJobTargets(
                                      settings,
                                      settingIndex,
                                    )}
                                    getDataAPI={GetAllSetupsJobTargetTypes}
                                    parentTranslationPath={parentTranslationPath}
                                    translationPath={translationPath}
                                    getOptionLabel={(option) =>
                                      option.name[i18next.language] || option.name.en
                                    }
                                  />
                                  <SharedAutocompleteControl
                                    isHalfWidth
                                    initValues={branchesSlugSendTypes}
                                    parentId="slugs"
                                    parentIndex={index}
                                    subParentId="settings"
                                    subParentIndex={settingIndex}
                                    stateKey="sent_type"
                                    disableClearable
                                    isLoading={isLoading}
                                    isSubmitted={isSubmitted}
                                    errors={errors}
                                    errorPath={`slugs[${index}].settings[${settingIndex}].sent_type`}
                                    onValueChanged={onStateChanged}
                                    inlineLabel="send-type"
                                    editValue={setting.sent_type}
                                    placeholder="select-send-type"
                                    parentTranslationPath={parentTranslationPath}
                                    translationPath={translationPath}
                                  />
                                </div>
                                <ButtonBase
                                  className="btns-icon theme-transparent"
                                  onClick={onRemoveJobTargetHandler({
                                    slugIndex: index,
                                    settingIndex,
                                    settings,
                                  })}
                                >
                                  <span className={SystemActionsEnum.delete.icon} />
                                </ButtonBase>
                              </div>
                            ))}
                            <ButtonBase
                              className="btns theme-transparent mt-1 mb-3"
                              onClick={onAddJobTargetHandler({
                                slugIndex: index,
                                settings: item.settings,
                              })}
                            >
                              <span className="fas fa-plus" />
                              <span className="px-2">
                                {t(`${translationPath}add-job-target`)}
                              </span>
                            </ButtonBase>
                          </>
                        ))
                          || (item.slug === BranchesSlugsEnum.ApprovedCandidate.key && (
                            <>
                              <SwitchComponent
                                idRef="nextApprovedSwitchRef"
                                label={
                                  BranchesSlugsEnum.ApprovedCandidate.switchValue
                                }
                                isChecked={item.settings.next_approved}
                                isReversedLabel
                                isFlexEnd
                                onChange={(event, newValue) => {
                                  setState({
                                    parentId: 'slugs',
                                    parentIndex: index,
                                    subParentId: 'settings',
                                    id: 'next_approved',
                                    value: newValue,
                                  });
                                }}
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                              />
                            </>
                          ))
                          || (item.slug
                            === BranchesSlugsEnum.DownloadPDFForRecipient.key && (
                            <>
                              <SwitchComponent
                                idRef="downloadPDFForRecipientSwitchRef"
                                label={
                                  BranchesSlugsEnum.DownloadPDFForRecipient
                                    .switchValue
                                }
                                isChecked={item?.settings?.download_pdf_offer}
                                isReversedLabel
                                isFlexEnd
                                onChange={(event, newValue) => {
                                  setState({
                                    parentId: 'slugs',
                                    parentIndex: index,
                                    subParentId: 'settings',
                                    id: 'download_pdf_offer',
                                    value: newValue,
                                  });
                                }}
                                parentTranslationPath={parentTranslationPath}
                                translationPath={translationPath}
                              />
                            </>
                          ))}
                      </div>
                    )}
                  </div>
                  <div className="separator-h mb-3" />
                </div>
              ))}
            {state.slugs.length < Object.keys(BranchesSlugsEnum).length && (
              <ButtonBase
                className="btns theme-transparent"
                disabled={isLoading}
                onClick={onAddNewSlugHandler}
              >
                <span className="fas fa-plus" />
                <span className="px-2">{t(`${translationPath}add-new-type`)}</span>
              </ButtonBase>
            )}
          </div>
        }
        isSaving={isLoading}
        isOpen={isOpen}
        saveIsDisabled={state.slugs.length === 0}
        isEdit
        onSubmit={saveHandler}
        onCancelClicked={isOpenChanged}
        onCloseClicked={isOpenChanged}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {isOpenConfirmDialog && activeItem && (
        <ConfirmDeleteDialog
          onSave={() => {
            setSavedSlugs((items) => {
              const localItems = [...items];
              const itemIndex = localItems.findIndex(
                (item) => item.slug === activeItem.slug,
              );
              if (itemIndex !== -1) {
                localItems.splice(itemIndex, 1);
                return localItems;
              }
              return items;
            });
            const localSlugs = [...state.slugs];
            const localSlugIndex = localSlugs.findIndex(
              (item) => item.slug === activeItem.slug,
            );
            if (localSlugIndex !== -1) {
              localSlugs.splice(localSlugIndex, 1);
              setState({ id: 'slugs', value: localSlugs });
            }
            setActiveItem(null);
            setIsOpenConfirmDialog(false);
          }}
          saveType="submit"
          isOpenChanged={() => {
            setIsOpenConfirmDialog(false);
          }}
          apiProps={{
            slug: activeItem.slug,
          }}
          deleteApi={DeleteFormsSetting}
          successMessage="form-setting-deleted-successfully"
          errorMessage="form-setting-delete-failed"
          descriptionMessage="form-setting-delete-description"
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          isOpen={isOpenConfirmDialog}
        />
      )}
    </>
  );
};

FormsSettingsManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
};
FormsSettingsManagementDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'FormsSettingsManagementDialog.',
};
