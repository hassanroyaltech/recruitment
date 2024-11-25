import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  FormsAssistRoleTypesEnum,
  FormsAssistTypesEnum,
  FormsMembersTypesEnum,
  FormsRolesEnum,
} from '../../../../enums';
import { SetupsReducer, SetupsReset } from '../../../setups/shared';
import {
  PopoverComponent,
  SwitchComponent,
  AvatarsComponent,
} from '../../../../components';
import ButtonBase from '@mui/material/ButtonBase';
import FormMembersPopover from '../FormMembers.Popover';
import './RoleTypes.Style.scss';
import { getErrorByName } from '../../../../helpers';
import * as yup from 'yup';
import { FormFieldAssistTabs } from '../../tabs-data/FormFieldAssist.Tabs';

const RoleTypesPopover = ({
  idRef,
  editValue,
  roleTypeKey,
  popoverAttachedWith,
  popoverToggleHandler,
  onSave,
  handleClose,
  arrayKey,
  roleKey,
  typeKey,
  uuidKey,
  getFilteredRoleTypes,
  avatarImageAlt,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [membersPopoverProps, setMembersPopoverProps] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const stateInitRef = useRef({
    [arrayKey]: [],
    [roleTypeKey]: null,
  });

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  const [errors, setErrors] = useState({});

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  /**
   * @param currentRole - current role item key
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the role enum item by key
   */
  const getSelectedRoleEnumItem = useMemo(
    () => (currentRole) =>
      getFilteredRoleTypes().find((item) => item.key === currentRole) || {},
    [getFilteredRoleTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the current assign list based on role editor or viewer
   */
  const getAssistMembers = useMemo(
    () =>
      ({ role }) =>
        (state[arrayKey] && state[arrayKey].filter((item) => item.role === role))
        || [],
    [arrayKey, state],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to open the members (assign list) popover
   */
  const membersPopoverToggleHandler = useCallback(
    (membersPopoverPropsItem) => (event) => {
      setMembersPopoverProps(membersPopoverPropsItem);
      popoverToggleHandler('members', event);
    },
    [popoverToggleHandler],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return if the current role types have variables or not
   */
  const getIsWithVariables = useMemo(
    () => () =>
      getFilteredRoleTypes().some(
        (item) => item.key === FormsRolesEnum.Variables.key,
      ),
    [getFilteredRoleTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is return the current role type enum
   */
  const getCurrentRoleTypeEnum = useMemo(
    () =>
      ({ key }) =>
        getFilteredRoleTypes().find((item) => item.key === key) || {},
    [getFilteredRoleTypes],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get form errors
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(
      {
        current: yup.object().shape({
          [roleTypeKey]: yup
            .string()
            .nullable()
            .required(t('Shared:this-field-is-required')),
          [arrayKey]: yup
            .array()
            .nullable()
            .when(
              `${roleTypeKey}`,
              (value, field) =>
                (value
                  && getCurrentRoleTypeEnum({ key: value }).minAssignToAssist
                  && getAssistMembers({ role: FormsAssistRoleTypesEnum.Editor.key })
                    .length
                    < getCurrentRoleTypeEnum({ key: value }).minAssignToAssist
                  && field.min(
                    getCurrentRoleTypeEnum({ key: value }).minAssignToAssist,
                    `${t('Shared:please-select-at-least')} ${
                      getCurrentRoleTypeEnum({ key: value }).minAssignToAssist
                    } ${t(`${translationPath}assign-to-complete-or-assist`)}`,
                  ))
                || field,
            )
            .required(t('Shared:this-field-is-required')),
        }),
      },
      state,
    );
    setErrors(result);
  }, [
    arrayKey,
    getAssistMembers,
    getCurrentRoleTypeEnum,
    roleTypeKey,
    state,
    t,
    translationPath,
  ]);

  useEffect(() => {
    if (editValue)
      setState({
        id: 'edit',
        value: {
          [arrayKey]: editValue[arrayKey],
          [roleTypeKey]: editValue[roleTypeKey],
        },
      });
  }, [arrayKey, editValue, roleTypeKey]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <PopoverComponent
      idRef={`roleTypesPopoverRef${idRef}`}
      attachedWith={popoverAttachedWith.filledBy}
      handleOpen={() => {
        setIsSubmitted((item) => (item ? !item : item));
      }}
      handleClose={() => {
        setIsSubmitted(true);
        if (Object.keys(errors).length > 0) return;
        if (onSave) onSave(state);
        if (handleClose) handleClose();
      }}
      popoverClasses={`role-types-popover-wrapper${
        (!getIsWithVariables() && ' is-small-width') || ''
      }`}
      component={
        <div className="role-types-wrapper">
          <div className="description-text mb-3">
            <span>
              {t(
                `${translationPath}select-role${
                  (getIsWithVariables() && '-or-create-a-task') || ''
                }`,
              )}
            </span>
          </div>
          {getFilteredRoleTypes().map((item) => (
            <div
              className="role-type-item-wrapper"
              key={`rolesTypesKeys${item.key}`}
            >
              {(item.isSwitch && (
                <div className="role-type-item">
                  <div className="separator-h my-2" />
                  <div className="switch-item-content-wrapper">
                    <label htmlFor={`${item.key}Ref`} className="px-2">
                      {item.popoverValue}
                    </label>
                    <span className="d-inline-flex">
                      <SwitchComponent
                        idRef={`${item.key}Ref`}
                        isChecked={item.key === state[roleTypeKey]}
                        labelPlacement="end"
                        isFlexEnd
                        onChange={(event, isChecked) => {
                          if (isChecked)
                            onStateChanged({
                              id: 'destructObject',
                              value: { [roleTypeKey]: item.key, [arrayKey]: [] },
                            });
                          else
                            onStateChanged({
                              id: 'destructObject',
                              value: {
                                [roleTypeKey]: FormsRolesEnum.InvitedMembers.key,
                                [arrayKey]: [],
                              },
                            });
                        }}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                    </span>
                  </div>
                  {item.popoverDescription && (
                    <div className="description-text mb-3">
                      {item.popoverDescription}
                    </div>
                  )}
                </div>
              )) || (
                <div className="role-type-item">
                  <ButtonBase
                    className="btns theme-transparent w-100 fj-between"
                    onClick={() => {
                      setState({
                        id: 'destructObject',
                        value: {
                          [roleTypeKey]: item.key,
                          [arrayKey]: [],
                        },
                      });
                    }}
                  >
                    <span className="d-inline-flex-center">
                      <span className="d-inline-flex-center ff-default lh-100">
                        <span className="fz-30px c-accent-secondary-lighter">
                          &bull;
                        </span>
                      </span>
                      <span className="px-2">{item.popoverValue}</span>
                    </span>
                    {item.key === state[roleTypeKey] && (
                      <span className="fas fa-check" />
                    )}
                  </ButtonBase>
                  {item.popoverDescription && (
                    <div className="description-text mb-3">
                      {item.popoverDescription}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          {getSelectedRoleEnumItem(state[roleTypeKey]).isWithAssignToAssist && (
            <div className="d-flex mb-3 flex-wrap">
              <div className="description-text d-flex mb-2">
                <span>{t(`${translationPath}assign-to-complete-or-assist`)}</span>
              </div>
              <AvatarsComponent
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                idRef={`assignAvatarsRef${idRef}`}
                avatarImageAlt={avatarImageAlt}
                avatars={getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Editor.key,
                })}
                onGroupClicked={membersPopoverToggleHandler({
                  arrayKey: arrayKey,
                  values: getAssistMembers({
                    role: FormsAssistRoleTypesEnum.Editor.key,
                  }),
                  popoverTabs: FormFieldAssistTabs,
                  visibleFormMembers: Object.values(FormsAssistTypesEnum).map(
                    (item) => item.key,
                  ),
                  getIsDisabledItem: ({ memberItem }) =>
                    getAssistMembers({
                      role: FormsAssistRoleTypesEnum.Viewer.key,
                    }).some((item) =>(item[uuidKey] && item[uuidKey] === memberItem[uuidKey]) || (item.key && item.key === memberItem.key)),
                  getListAPIProps: () => ({
                    all_employee: 1,
                    ...(getAssistMembers({
                      role: FormsAssistRoleTypesEnum.Editor.key,
                    }).length > 0 && {
                      with_than: getAssistMembers({
                        role: FormsAssistRoleTypesEnum.Editor.key,
                      }).map((item) => item.uuid),
                    }),
                  }),
                  extraStateData: { [roleKey]: FormsAssistRoleTypesEnum.Editor.key },
                })}
              />
              {isSubmitted && errors[arrayKey] && (
                <div className="c-error py-1">
                  <span>{errors[arrayKey].message}</span>
                </div>
              )}
              {getSelectedRoleEnumItem(state[roleTypeKey]).isWithAssignToView && (
                <div className="separator-h mt-3" />
              )}
            </div>
          )}
          {getSelectedRoleEnumItem(state[roleTypeKey]).isWithAssignToView && (
            <div className="d-flex mb-3 flex-wrap">
              <div className="description-text d-flex mb-2">
                <span>{t(`${translationPath}assign-to-view-response`)}</span>
              </div>
              <AvatarsComponent
                translationPath={translationPath}
                parentTranslationPath={parentTranslationPath}
                idRef={`assignAvatarsRef${idRef}`}
                avatarImageAlt={avatarImageAlt}
                avatars={getAssistMembers({
                  role: FormsAssistRoleTypesEnum.Viewer.key,
                })}
                onGroupClicked={membersPopoverToggleHandler({
                  arrayKey: arrayKey,
                  values: getAssistMembers({
                    role: FormsAssistRoleTypesEnum.Viewer.key,
                  }),
                  popoverTabs: FormFieldAssistTabs,
                  visibleFormMembers: Object.values(FormsAssistTypesEnum).map(
                    (item) => item.key,
                  ),
                  getIsDisabledItem: ({ memberItem }) =>
                    getAssistMembers({
                      role: FormsAssistRoleTypesEnum.Editor.key,
                    }).some((item) =>(item[uuidKey] && item[uuidKey] === memberItem[uuidKey]) || (item.key && item.key === memberItem.key)),
                  getListAPIProps: () => ({
                    all_employee: 1,
                    ...(getAssistMembers({
                      role: FormsAssistRoleTypesEnum.Viewer.key,
                    }).length > 0 && {
                      with_than: getAssistMembers({
                        role: FormsAssistRoleTypesEnum.Viewer.key,
                      }).map((item) => item[uuidKey]),
                    }),
                  }),
                  extraStateData: { [roleKey]: FormsAssistRoleTypesEnum.Viewer.key },
                })}
              />
            </div>
          )}

          {popoverAttachedWith.members && (
            <FormMembersPopover
              {...membersPopoverProps}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
                setMembersPopoverProps(null);
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              onSave={(newValue) => {
                const localState = { ...state };

                localState[arrayKey] = localState[arrayKey].filter(
                  (item) => item.role !== membersPopoverProps.extraStateData.role,
                );
                localState[arrayKey].push(...newValue[arrayKey]);
                onStateChanged({
                  id: arrayKey,
                  value: localState[arrayKey],
                });
              }}
              typeKey={typeKey}
              uuidKey={uuidKey}
              listAPIProps={
                (state[arrayKey] && {
                  with_than: [state[arrayKey]],
                })
                || undefined
              }
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          )}
        </div>
      }
    />
  );
};

RoleTypesPopover.propTypes = {
  idRef: PropTypes.string.isRequired,
  editValue: PropTypes.instanceOf(Object),
  // editValue: PropTypes.shape({
  //   [roleTypesPopoverSharedProps.arrayKey]: PropTypes.shape({
  //     [roleTypesPopoverSharedProps.typeKey]: PropTypes.oneOf(
  //       Object.values(FormsAssistTypesEnum).map((item) => item.key)
  //     ),
  //     [RoleTypesPopover.props.uuidKey]: PropTypes.string,
  //     [RoleTypesPopover.props.roleKey]: PropTypes.oneOf(
  //       Object.values(FormsAssistRoleTypesEnum).map((item) => item.key)
  //     ),
  //   }),
  //   [RoleTypesPopover.props.roleTypeKey]: PropTypes.oneOf(
  //     Object.values(FormsRolesEnum).map((item) => item.key)
  //   ),
  // }),
  onSave: PropTypes.func.isRequired,
  getFilteredRoleTypes: PropTypes.func.isRequired,
  imageAltValue: PropTypes.string,
  avatarImageAlt: PropTypes.string,
  isDisabled: PropTypes.bool,
  isFromAssist: PropTypes.bool,
  visibleFormMembers: PropTypes.arrayOf(
    PropTypes.oneOf(Object.values(FormsMembersTypesEnum).map((item) => item.key)),
  ),
  extraStateData: PropTypes.instanceOf(Object),
  listAPIProps: PropTypes.instanceOf(Object),
  getListAPIProps: PropTypes.func,
  popoverToggleHandler: PropTypes.func,
  uuidKey: PropTypes.string,
  arrayKey: PropTypes.string,
  roleKey: PropTypes.string,
  typeKey: PropTypes.string,
  roleTypeKey: PropTypes.string,
  popoverAttachedWith: PropTypes.shape({
    filledBy: PropTypes.instanceOf(Object),
    members: PropTypes.instanceOf(Object),
  }).isRequired,
  handleClose: PropTypes.func,
  getIsDisabledItem: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};

RoleTypesPopover.defaultProps = {
  uuidKey: 'uuid',
  typeKey: 'type',
  roleKey: 'role',
  arrayKey: 'assign',
  roleTypeKey: 'fillBy',
  isDisabled: false,
  imageAltValue: 'user',
  avatarImageAlt: 'assigned-member',
  extraStateData: {},
  visibleFormMembers: [],
};

export default memo(RoleTypesPopover);
