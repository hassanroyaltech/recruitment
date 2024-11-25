import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getErrorByName, showError, showSuccess } from '../../../../helpers';
import {
  CreateOnboardingFolders,
  CreateOnboardingSpaces,
  UpdateOnboardingFolders,
  UpdateOnboardingSpaces,
} from '../../../../services';
import {
  SetupsReducer,
  SetupsReset,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import { useTranslation } from 'react-i18next';
import { DialogComponent } from '../../../../components';
import FontAwesomeIcons from '../../../../assets/jsons/all-fontawesome-free-icons-v5.15.json';
import './ConnectionsManagement.Style.scss';
import * as yup from 'yup';
import { WorkflowsPeriodTypesEnum } from '../../../../enums';
import FormMembersPopover from '../../../form-builder-v2/popovers/FormMembers.Popover';
import { ButtonBase } from '@mui/material';
import { SpaceAndFoldersTabsData } from './tabs-data/ConnectionsManagment.TabsData';

export const ConnectionsManagementDialog = ({
  activeItem,
  space_uuid,
  isOpen,
  isFolders,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState(() => ({}));
  const [iconsList] = useState(() => FontAwesomeIcons);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
  });
  const stateInitRef = useRef({
    isFolders,
    space_uuid,
    uuid: null,
    title: null,
    icon: null,
    // has_owner: false,
    has_reminder: false,
    period: 1,
    period_type: WorkflowsPeriodTypesEnum.Days.key,
    repeat: null,
    is_flows_sequential: true,
    is_folders_sequential: true,
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  // const [periodTypes] = useState(() =>
  //   Object.values(WorkflowsPeriodTypesEnum).map((item) => ({
  //     ...item,
  //     value: t(item.value),
  //   })),
  // );
  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
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
          isFolders: yup.boolean().nullable(),
          title: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          icon: yup
            .string()
            .nullable()
            .when(
              'isFolders',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          period: yup
            .number()
            .nullable()
            .when(
              'has_reminder',
              (value, field) =>
                (value
                  && field
                    .required(t('Shared:this-field-is-required'))
                    .min(1, `${t(`Shared:this-field-must-be-more-than`)} ${0}`))
                || field,
            ),
          period_type: yup
            .number()
            .nullable()
            .when(
              'has_reminder',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          repeat: yup
            .number()
            .nullable()
            .when(
              'has_reminder',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
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
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) {
      if (errors.name) showError(errors.name.message);
      return;
    }
    setIsLoading(true);
    const response = await (
      (isFolders
        && ((activeItem && UpdateOnboardingFolders) || CreateOnboardingFolders))
      || (activeItem && UpdateOnboardingSpaces)
      || CreateOnboardingSpaces
    )(state);
    setIsLoading(false);
    if (
      response
      && (response.status === 200 || response.status === 201 || response.status === 202)
    ) {
      if (!isFolders && !activeItem)
        window?.ChurnZero?.push([
          'trackEvent',
          `Onboarding - Build Space`,
          `Build Space`,
          1,
          {},
        ]);
      showSuccess(
        t(
          `${translationPath}${
            (activeItem
              && `${(isFolders && 'folder') || 'space'}-updated-successfully`)
            || `${(isFolders && 'folder') || 'space'}-created-successfully`
          }`,
        ),
      );
      if (onSave) onSave();
      if (isOpenChanged) isOpenChanged();
    } else
      showError(
        t(
          `${translationPath}${
            (activeItem && `${(isFolders && 'folder') || 'space'}-update-failed`)
            || `${(isFolders && 'folder') || 'space'}-create-failed`
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
    if (activeItem) setState({ id: 'destructObject', value: activeItem });
  }, [activeItem]);
  const onPopoverAttachedWithChanged = useCallback((key, newValue) => {
    setPopoverAttachedWith((items) => ({ ...items, [key]: newValue }));
  }, []);

  const popoverToggleHandler = useCallback(
    (popoverKey, event = null) => {
      onPopoverAttachedWithChanged(
        popoverKey,
        (event && event.currentTarget) || null,
      );
    },
    [onPopoverAttachedWithChanged],
  );

  // const onInvitedMemberDeleteClicked = useCallback(
  //   (index, items) => (event) => {
  //     event.preventDefault();
  //     event.stopPropagation();
  //     const localItems = [...items];
  //     localItems.splice(index, 1);
  //     setState({
  //       id: 'members',
  //       value: localItems,
  //     });
  //   },
  //   [],
  // );
  const responsePeriodHandler = (key, type) => () => {
    let localResponsePeriod = state?.[key] || 0;
    if (type === 'increment') localResponsePeriod += 1;
    else localResponsePeriod -= 1;
    onStateChanged({
      id: key,
      value: localResponsePeriod,
    });
  };

  return (
    <DialogComponent
      maxWidth="sm"
      titleText={
        (isFolders && ((activeItem && 'update-folder') || 'new-folder'))
        || (activeItem && 'update-space')
        || 'create-a-space'
      }
      contentClasses="px-0"
      dialogContent={
        <div className="connections-management-content-dialog-wrapper">
          <SharedInputControl
            inlineLabel={`${(isFolders && 'folder') || 'space'}-name`}
            editValue={state.title}
            isDisabled={isLoading}
            placeholder={`${(isFolders && 'folder') || 'space'}-name`}
            isSubmitted={isSubmitted}
            errors={errors}
            errorPath="title"
            stateKey="title"
            onValueChanged={onStateChanged}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          {isFolders && (
            <SharedAutocompleteControl
              isFullWidth
              initValuesKey="key"
              isDisabled={isLoading}
              isSubmitted={isSubmitted}
              initValues={iconsList}
              inputStartAdornment={({ selectedOption }) =>
                (selectedOption && (
                  <span className="d-inline-flex-center pl-3-reversed">
                    <span className={selectedOption.key} />
                  </span>
                ))
                || undefined
              }
              optionComponent={({ option }) => (
                <>
                  <span className={option.key} />
                  <span className="px-2">{option.title}</span>
                </>
              )}
              isWithPagination
              stateKey="icon"
              initValuesTitle="label"
              onValueChanged={onStateChanged}
              inlineLabel="select-icon"
              editValue={state.icon}
              placeholder="select-icon"
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              errorPath={'icon'}
              errors={errors}
            />
          )}
          {(!space_uuid || (space_uuid && !isFolders)) && (
            <div>
              {/*<div className="box-field-wrapper">*/}
              {/*  <div className="inline-label-wrapper">*/}
              {/*    <span>{t(`${translationPath}has-owner`)}</span>*/}
              {/*  </div>*/}
              {/*  <div className="mt-1">*/}
              {/*    <ButtonBase*/}
              {/*      className="btns btns-icon theme-transparent mx-0"*/}
              {/*      onClick={() => {*/}
              {/*        onStateChanged({*/}
              {/*          id: 'has_owner',*/}
              {/*          value: !state.has_owner,*/}
              {/*        });*/}
              {/*      }}*/}
              {/*    >*/}
              {/*      <span*/}
              {/*        className={`fas fa-toggle-${*/}
              {/*          state?.has_owner ? 'on c-black' : 'off'*/}
              {/*        }`}*/}
              {/*      />*/}
              {/*    </ButtonBase>*/}
              {/*    <span className="fz-13px px-1 font-weight-400">*/}
              {/*      {t(`${translationPath}has-owner-desc`)}*/}
              {/*    </span>*/}
              {/*  </div>*/}
              {/*</div>*/}
              {/*<div className="box-field-wrapper">*/}
              {/*  <div className="inline-label-wrapper">*/}
              {/*    <span>{t(`${translationPath}members`)}</span>*/}
              {/*  </div>*/}
              {/*  <div*/}
              {/*    className="invite-box-wrapper"*/}
              {/*    onClick={(event) => popoverToggleHandler('members', event)}*/}
              {/*    onKeyUp={() => {}}*/}
              {/*    role="button"*/}
              {/*    tabIndex={0}*/}
              {/*  >*/}
              {/*    <div className="invite-box-body-wrapper">*/}
              {/*      {state?.members?.map((item, index, items) => (*/}
              {/*        <AvatarsComponent*/}
              {/*          key={`invitedMembersKey${item.uuid}`}*/}
              {/*          avatar={item}*/}
              {/*          avatarImageAlt="member"*/}
              {/*          onTagBtnClicked={onInvitedMemberDeleteClicked(index, items)}*/}
              {/*          avatarTheme={AvatarsThemesEnum.TagAvatar.theme}*/}
              {/*          translationPath={translationPath}*/}
              {/*          parentTranslationPath={parentTranslationPath}*/}
              {/*        />*/}
              {/*      ))}*/}
              {/*      <span*/}
              {/*        className={`c-gray-primary px-2${*/}
              {/*          (state?.members?.length > 0 && ' mt-2') || ''*/}
              {/*        }`}*/}
              {/*      >*/}
              {/*        {t(`${translationPath}search-member`)}*/}
              {/*      </span>*/}
              {/*    </div>*/}
              {/*  </div>*/}
              {/*</div>*/}
              {!isFolders && (
                <div className="box-field-wrapper">
                  <div className="inline-label-wrapper">
                    <span>{t(`${translationPath}is-folders-sequential`)}</span>
                  </div>
                  <div className="mt-1">
                    <ButtonBase
                      className="btns btns-icon theme-transparent mx-0"
                      onClick={() => {
                        onStateChanged({
                          id: 'is_folders_sequential',
                          value: !state.is_folders_sequential,
                        });
                      }}
                    >
                      <span
                        className={`fas fa-toggle-${
                          state?.is_folders_sequential ? 'on c-black' : 'off'
                        }`}
                      />
                    </ButtonBase>
                  </div>
                </div>
              )}
              <div className="box-field-wrapper">
                <div className="inline-label-wrapper">
                  <span>{t(`${translationPath}is-flows-sequential`)}</span>
                </div>
                <div className="mt-1">
                  <ButtonBase
                    className="btns btns-icon theme-transparent mx-0"
                    onClick={() => {
                      onStateChanged({
                        id: 'is_flows_sequential',
                        value: !state.is_flows_sequential,
                      });
                    }}
                  >
                    <span
                      className={`fas fa-toggle-${
                        state?.is_flows_sequential ? 'on c-black' : 'off'
                      }`}
                    />
                  </ButtonBase>
                </div>
              </div>
              <div className="box-field-wrapper">
                <div className="inline-label-wrapper">
                  <span>{t(`${translationPath}auto-reminder`)}</span>
                </div>
                <div className="mt-1">
                  <ButtonBase
                    className="btns btns-icon theme-transparent mx-0"
                    onClick={() => {
                      onStateChanged({
                        id: 'destructObject',
                        value: {
                          has_reminder: !state.has_reminder,
                          period_type: WorkflowsPeriodTypesEnum.Days.key,
                        },
                      });
                    }}
                  >
                    <span
                      className={`fas fa-toggle-${
                        state?.has_reminder ? 'on c-black' : 'off'
                      }`}
                    />
                  </ButtonBase>
                </div>
              </div>
              {state?.has_reminder && (
                <>
                  <div className="box-field-wrapper">
                    <div className="inline-label-wrapper">
                      <span>{t(`${translationPath}send-reminder-every`)}</span>
                    </div>
                    <div className="d-flex">
                      <SharedInputControl
                        editValue={state?.period}
                        stateKey="period"
                        isSubmitted={isSubmitted}
                        errors={errors}
                        errorPath="period"
                        onValueChanged={onStateChanged}
                        type="number"
                        min={0}
                        floatNumbers={0}
                        startAdornment={
                          <ButtonBase
                            className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                            disabled={!state?.period || state?.period <= 0}
                            onClick={responsePeriodHandler('period', 'decrement', 1)}
                          >
                            <span className="fas fa-minus" />
                          </ButtonBase>
                        }
                        endAdornment={
                          <>
                            {' '}
                            <ButtonBase
                              className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                              onClick={responsePeriodHandler(
                                'period',
                                'increment',
                                1,
                              )}
                            >
                              <span className="fas fa-plus" />
                            </ButtonBase>
                            <span className={'px-1'}>{t('days')}</span>
                          </>
                        }
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isHalfWidth
                      />

                      {/*<SharedAutocompleteControl*/}
                      {/*  editValue={state?.period_type}*/}
                      {/*  placeholder="select-period"*/}
                      {/*  // title="condition"*/}
                      {/*  stateKey="period_type"*/}
                      {/*  errorPath="period_type"*/}
                      {/*  onValueChanged={onStateChanged}*/}
                      {/*  isSubmitted={isSubmitted}*/}
                      {/*  errors={errors}*/}
                      {/*  initValues={periodTypes}*/}
                      {/*  disableClearable*/}
                      {/*  initValuesTitle="value"*/}
                      {/*  parentTranslationPath={parentTranslationPath}*/}
                      {/*  translationPath={translationPath}*/}
                      {/*  isFullWidth*/}
                      {/*/>*/}
                    </div>
                  </div>
                  <div className="box-field-wrapper">
                    <div className="inline-label-wrapper">
                      <span>{t(`${translationPath}for`)}</span>
                    </div>
                    <div className="d-flex">
                      <SharedInputControl
                        editValue={state?.repeat}
                        stateKey="repeat"
                        errorPath="repeat"
                        isSubmitted={isSubmitted}
                        errors={errors}
                        placeholder=""
                        onValueChanged={onStateChanged}
                        type="number"
                        min={0}
                        floatNumbers={0}
                        startAdornment={
                          <ButtonBase
                            className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                            disabled={!state?.repeat || state?.repeat <= 0}
                            onClick={responsePeriodHandler('repeat', 'decrement', 1)}
                          >
                            <span className="fas fa-minus" />
                          </ButtonBase>
                        }
                        endAdornment={
                          <>
                            <ButtonBase
                              className="btns theme-solid miw-32px w-32px h-32px bg-gray-lighter c-gray-primary"
                              onClick={responsePeriodHandler(
                                'repeat',
                                'increment',
                                1,
                              )}
                            >
                              <span className="fas fa-plus" />
                            </ButtonBase>
                            <span className="px-1">{t('times')}</span>
                          </>
                        }
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        isHalfWidth
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="info-box-wrapper">
            <div className="info-box-content-wrapper">
              <span className="fas fa-info-circle" />
              <span className="px-2">
                {t(
                  `${translationPath}${
                    (isFolders && 'folder') || 'space'
                  }-management-description`,
                )}
              </span>
            </div>
          </div>
          {popoverAttachedWith.members && (
            <FormMembersPopover
              arrayKey="members"
              values={state.members}
              popoverTabs={SpaceAndFoldersTabsData}
              getListAPIProps={() => ({
                all_users: 1,
                ...(state.members
                  && state.members.length > 0 && {
                  with_than: state.members.map((item) => item.uuid),
                }),
              })}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
              }}
              onSave={(newValue) => {
                onStateChanged({
                  id: 'members',
                  value: newValue.members,
                });
              }}
            />
          )}
        </div>
      }
      wrapperClasses="connections-management-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={Boolean(activeItem)}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ConnectionsManagementDialog.propTypes = {
  activeItem: PropTypes.instanceOf(Object),
  isOpen: PropTypes.bool.isRequired,
  isFolders: PropTypes.bool.isRequired,
  onSave: PropTypes.func.isRequired,
  isOpenChanged: PropTypes.func.isRequired,
  space_uuid: PropTypes.string,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
