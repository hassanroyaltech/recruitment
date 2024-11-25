import {
  AvatarsComponent,
  DialogComponent,
  PopoverComponent,
} from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedInputControl,
} from '../../../setups/shared';
import {
  AnalyticsDashboardIconEnum,
  AnalyticsDashboardMembersTypesEnum,
  AvatarsThemesEnum,
} from '../../../../enums';
import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
  useReducer,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { GetCustomDashboardById } from '../../../../services';
import { showError } from '../../../../helpers';
import FormMembersPopover from '../../../form-builder-v2/popovers/FormMembers.Popover';
import './DashboardManagementDialog.Style.scss';
import { DashboardAssignTabsData } from './tabs-data/DashboardAssign.TabsData';
import i18next from 'i18next';
const getItemName = (item) =>
  (item.name
    && (typeof item.name === 'object'
      ? item.name[i18next.language] || item.name.en
      : item.name))
  || (item.title && (item.title[i18next.language] || item.title.en || item.title))
  || `${
    item.first_name
    && (typeof item.first_name === 'object'
      ? item.first_name[i18next.language] || item.first_name.en
      : item.first_name)
  }${
    item.last_name
    && ` ${
      typeof item.last_name === 'object'
        ? item.last_name[i18next.language] || item.last_name?.en || ''
        : item.last_name
    }`
  }`
  || '';
export const DashboardManagementDialog = ({
  isOpen,
  setIsOpen,
  parentTranslationPath,
  isLoading,
  data,
  setData,
  onSave,
  uuid,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    members: null,
    icons: null,
  });
  const stateInitRef = useRef({
    invited_members: [],
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const onStateChanged = (newValue) => {
    setState(newValue);
  };
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
  const GetDashboardIconHandler = useMemo(
    () => (icon) =>
      icon
      && Object.values(AnalyticsDashboardIconEnum).find((item) => icon === item.value)
        ?.icon,
    [],
  );

  const GetCustomDashboardHandler = useCallback(async () => {
    const response = await GetCustomDashboardById({ uuid });
    if (response && response.status === 200) {
      const results = response.data.results || {};
      setData(results);
      const promises = [];
      Object.values(AnalyticsDashboardMembersTypesEnum).forEach((item) => {
        if (results?.[item.dataKey]?.length > 0)
          promises.push({
            ...item,
            members: results?.[item.dataKey],
            params: {
              limit: 1,
              with_than: (results?.[item.dataKey] || []).map((item) => item.uuid),
              all_employee: 1,
              use_for: 'dropdown',
            },
          });
      });
      if (promises.length > 0) {
        const promisesRes = await Promise.allSettled(
          promises.map((item) => item.getDataApi(item.params)),
        );
        if (promisesRes) {
          let temp = [];
          promisesRes.forEach((resItem, index) => {
            if (resItem.status === 'fulfilled' && resItem?.value?.status === 200) {
              const localeResponse = resItem.value.data.results || [];
              const localeMembers = promises[index].members;
              localeMembers.forEach((member) => {
                const memberData = localeResponse.find(
                  (el) => el.uuid === member.uuid,
                );
                if (memberData)
                  temp.push({
                    permission: member.permission,
                    type: promises[index].key,
                    name: getItemName(memberData),
                    uuid: member.uuid,
                  });
              });
            } else showError(t('Shared:failed-to-get-saved-data'), promisesRes);
          });
          setState({
            id: 'invited_members',
            value: temp,
          });
        }
      }
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [setData, t, uuid]);

  useEffect(() => {
    if (uuid) GetCustomDashboardHandler();
  }, [GetCustomDashboardHandler, uuid]);

  const onInvitedMemberDeleteClicked = useCallback(
    (index, items) => (event) => {
      event.preventDefault();
      event.stopPropagation();
      const localItems = [...items];
      localItems.splice(index, 1);
      setState({
        id: 'invited_members',
        value: localItems,
      });
    },
    [],
  );

  const invitedUsersDueTypes = useMemo(() => {
    let temp = {};
    Object.values(AnalyticsDashboardMembersTypesEnum).forEach((item) => {
      temp[item.dataKey] = (state.invited_members || [])
        .filter((el) => el?.type === item.key)
        .map((el) => ({
          uuid: el.uuid,
          permission: el.permission,
        }));
    });
    return temp;
  }, [state.invited_members]);

  return (
    <DialogComponent
      titleText={`${uuid ? 'edit' : 'create'}-dashboard`}
      saveText={`${uuid ? 'save' : 'create'}`}
      maxWidth="sm"
      dialogContent={
        <div className="create-edit-custom-dashboard-dialog-wrapper">
          <div
            className="d-flex-center w-100 mb-3"
            style={{
              justifyContent: 'start',
            }}
          >
            <div
              style={{
                width: '20%',
              }}
            >
              {t('set-name')}
            </div>
            <div
              style={{
                width: '80%',
              }}
            >
              <SharedInputControl
                isFullWidth
                idRef="customDashboardNameRef"
                placeholder={t('enter-set-name')}
                stateKey="title"
                onValueChanged={(newValue) => {
                  setData((items) => ({
                    ...items,
                    title: newValue.value,
                  }));
                }}
                parentTranslationPath={parentTranslationPath}
                wrapperClasses="mb-0"
                editValue={
                  data.title === 'Untitled' ? `${t('Untitled')}` : data.title
                }
              />
            </div>
          </div>
          <div
            className="d-flex-center w-100 mb-3"
            style={{
              justifyContent: 'start',
            }}
          >
            <div
              style={{
                width: '20%',
              }}
            >
              {t('assign')}
            </div>
            <div
              style={{
                width: '80%',
              }}
            >
              <div
                className="invite-box-wrapper"
                onClick={(event) => popoverToggleHandler('members', event)}
                onKeyUp={() => {}}
                role="button"
                tabIndex={0}
              >
                <div className="invite-box-body-wrapper">
                  {state.invited_members.map((item, index, items) => (
                    <AvatarsComponent
                      key={`invitedMembersKey${item.uuid}`}
                      avatar={item}
                      avatarImageAlt="member"
                      onTagBtnClicked={onInvitedMemberDeleteClicked(index, items)}
                      avatarTheme={AvatarsThemesEnum.TagAvatar.theme}
                      translationPath=""
                      parentTranslationPath={parentTranslationPath}
                    />
                  ))}
                  <span
                    className={`c-gray-primary px-2${
                      (state.invited_members.length > 0 && ' mt-2') || ''
                    }`}
                  >
                    {t(`search-member`)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="d-flex-center w-100"
            style={{
              justifyContent: 'start',
            }}
          >
            <div
              style={{
                width: '20%',
              }}
            >
              {t('set-icon')}
            </div>
            <div
              style={{
                width: '80%',
              }}
            >
              <ButtonBase
                className="btns btn-outline-light theme-outline mx-0"
                onClick={(event) => popoverToggleHandler('icons', event)}
              >
                <span className={GetDashboardIconHandler(data?.icon)} />
                <span className="fas fa-caret-down px-3 py-2" />
              </ButtonBase>
            </div>
            {popoverAttachedWith.icons && (
              <PopoverComponent
                idRef="chart-type-ref"
                attachedWith={popoverAttachedWith.icons}
                handleClose={() => {
                  popoverToggleHandler('icons', null);
                }}
                component={
                  <div className="d-flex-column p-2 w-100">
                    {Object.values(AnalyticsDashboardIconEnum).map((item, idx) => (
                      <ButtonBase
                        key={`${idx}-${item.value}-popover-dashboard-icon`}
                        className="d-flex-center btns theme-transparent"
                        onClick={() => {
                          setData((items) => ({
                            ...items,
                            icon: item.value,
                          }));
                          popoverToggleHandler('icons', null);
                        }}
                      >
                        <span className={item.icon} />
                      </ButtonBase>
                    ))}
                  </div>
                }
              />
            )}
          </div>
          {popoverAttachedWith.members && (
            <FormMembersPopover
              arrayKey="invited_members"
              values={state.invited_members}
              popoverTabs={DashboardAssignTabsData}
              getListAPIProps={() => ({
                all_employee: 1,
                ...(state.invited_members
                  && state.invited_members.length > 0 && {
                  with_than: state.invited_members.map((item) => item.uuid),
                }),
              })}
              popoverAttachedWith={popoverAttachedWith.members}
              handleClose={() => {
                popoverToggleHandler('members', null);
              }}
              onSave={(newValue) => {
                onStateChanged({
                  id: 'invited_members',
                  value: newValue.invited_members,
                });
              }}
            />
          )}
        </div>
      }
      isSaving={isLoading}
      isOpen={isOpen}
      isOldTheme
      onSubmit={(e) => {
        e.preventDefault();
        onSave({ invitedMembers: invitedUsersDueTypes });
      }}
      onCloseClicked={() => setIsOpen()}
      onCancelClicked={() => setIsOpen()}
      parentTranslationPath={parentTranslationPath}
      wrapperClasses="create-dashboard-dialog-wrapper"
    />
  );
};

DashboardManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  data: PropTypes.shape({
    icon: PropTypes.oneOfType([
      PropTypes.elementType,
      PropTypes.func,
      PropTypes.node,
    ]),
    title: PropTypes.string,
  }).isRequired,
  setData: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  uuid: PropTypes.string,
};
