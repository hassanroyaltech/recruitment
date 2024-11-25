import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { ButtonBase, Divider } from '@mui/material';
import './Forms.Style.scss';
import {
  DeleteForm,
  GetAllBuilderForms,
  GetAllBuilderTemplates,
  GetBuilderFormTypes,
  BuilderFormStatusChange,
  SendFormV2Reminder,
  CreateBuilderForm,
} from 'services';
import { useEventListener } from 'hooks';
import {
  showError,
  showSuccess,
  GlobalHistory,
  GlobalDisplayDateTimeFormat, GlobalDisplayDateFormat
} from 'helpers';
import { PopoverComponent, DialogComponent } from 'components/index';
import i18next from 'i18next';
import moment from 'moment';
import {
  NavigationSourcesEnum,
  FormsActionsEnum,
  FormsStatusesEnum,
  DefaultFormsTypesEnum,
  FormsAssignTypesEnum,
} from '../../../../../enums';
import { SharedInputControl } from 'pages/setups/shared';
import { useSelector } from 'react-redux';
import { DeadlineExtendDialog } from '../OffersTab/Dialogs/DeadlineExtend.Dialog';

export const FormsTab = ({
  candidate_uuid,
  job_candidate_uuid,
  job_stage_uuid,
  translationPath,
  job_uuid,
  code,
  formSource,
  parentTranslationPath,
  activeJobPipelineUUID,
  candidate,
}) => {
  const bodyRef = useRef(null);
  const popoverBodyRef = useRef(null);
  const { t } = useTranslation(parentTranslationPath);
  const [templateTypesList, setTemplateTypesList] = useState([]);
  const [isDeadlineExtendDialog, setIsDeadlineExtendDialog] = useState(false);
  const [formsList, setFormsList] = useState({
    results: [],
    totalCount: 0,
  });
  const userReducer = useSelector(
    (reducerState) => reducerState?.userReducer?.results?.user,
  );

  const [isLoading, setIsLoading] = useState([]);
  const [filter, setFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    status: '',
    use_for: 'list',
  });
  const [templatesFilter, setTemplatesFilter] = useState({
    limit: 10,
    page: 1,
    search: '',
    code,
  });
  const [formTemplatesList, setFormTemplatesList] = useState({
    results: [],
    totalCount: 0,
  });
  const [popoverAttachedWith, setPopoverAttachedWith] = useState({
    templateMenu: null,
    templateType: null,
    formActions: null,
  });
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const isLoadingRef = useRef(false);
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

  const getCandidateFormsHandler = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading((items) => {
      items.push('getCandidateFormsHandler');
      return [...items];
    });
    const res = await GetAllBuilderForms({
      assign_uuid: job_candidate_uuid,
      ...filter,
    });
    isLoadingRef.current = false;
    setIsLoading((items) => {
      items.pop();
      return [...items];
    });
    if (res && res.status === 200)
      if (filter.page === 1)
        setFormsList({
          results: res.data.results || [],
          totalCount: res.data.paginate?.total || 0,
        });
      else
        setFormsList((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
        }));
    else setFormsList({ results: [], totalCount: 0 });
  }, [job_candidate_uuid, filter]);

  const getSelectedTypeItem = useMemo(
    () => () =>
      templateTypesList.find((item) => item.code === templatesFilter.code) || {},
    [templateTypesList, templatesFilter.code],
  );

  const getFormsTemplates = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading((items) => {
      items.push('getFormsTemplates');
      return [...items];
    });
    const res = await GetAllBuilderTemplates(templatesFilter);
    isLoadingRef.current = false;
    setIsLoading((items) => {
      items.pop();
      return [...items];
    });
    if (res && res.status === 200)
      if (templatesFilter.page === 1)
        setFormTemplatesList({
          results: res.data.results || [],
          totalCount: res.data.paginate.total || 0,
        });
      else
        setFormTemplatesList((items) => ({
          results: items.results.concat(res.data.results || []),
          totalCount: res.data.paginate.total || 0,
        }));
    else setFormsList({ results: [], totalCount: 0 });
  }, [templatesFilter]);

  const onScrollHandler = useCallback(() => {
    if (
      bodyRef.current.offsetHeight + bodyRef.current.scrollTop
        >= bodyRef.current.scrollHeight - 5
      && formsList.results.length < formsList.totalCount
      && !isLoadingRef.current
      && isLoading.length === 0
    )
      setFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [formsList.results.length, formsList.totalCount, isLoading.length]);

  const onScrollTemplatesHandler = useCallback(() => {
    if (
      popoverBodyRef.current.offsetHeight + popoverBodyRef.current.scrollTop
        >= popoverBodyRef.current.scrollHeight
      && formTemplatesList.results.length < formTemplatesList.totalCount
      && !isLoadingRef.current
      && isLoading.length === 0
    )
      setTemplatesFilter((items) => ({ ...items, page: items.page + 1 }));
  }, [
    formTemplatesList.results.length,
    formTemplatesList.totalCount,
    isLoading.length,
  ]);

  const deleteFormHandler = useCallback(
    async (uuid) => {
      if (!uuid) return;
      setIsLoading((items) => {
        items.push('deleteFormHandler');
        return [...items];
      });
      const response = await DeleteForm({ data: { uuid: [uuid] } });
      setIsLoading((items) => {
        items.pop();
        return [...items];
      });
      if (response && (response.status === 201 || response.status === 200)) {
        showSuccess(t(`${translationPath}form-deleted-successfully`));
        setFilter((items) => ({
          ...items,
          page: 1,
          search: '',
          status: '',
        }));
        setConfirmDeleteDialog(false);
      } else showError(t('Shared:failed-to-get-saved-data'), response);
    },
    [t, translationPath],
  );

  const formStatusChangeHandler = useCallback(
    async ({ newStatus, form_uuid }) => {
      setIsLoading((items) => {
        items.push('formStatusChangeHandler');
        return [...items];
      });
      const response = await BuilderFormStatusChange({
        form_status: newStatus,
        form_uuid: form_uuid,
      });
      setIsLoading((items) => {
        items.pop();
        return [...items];
      });
      if (response && response.status === 200) {
        setFilter((items) => ({ ...items, page: 1 }));
        showSuccess(t(`${translationPath}form-status-updated-successfully`));
      } else showError(t(`${translationPath}form-status-update-failed`), response);
    },
    [t, translationPath],
  );
  const SendReminderHandler = useCallback(
    async (form_uuid, pipelineUUID) => {
      setIsLoading((items) => {
        items.push('sendRemainder');
        return [...items];
      });
      const response = await SendFormV2Reminder({
        form_uuid: form_uuid,
        pipeline_uuid: pipelineUUID,
      });
      setIsLoading((items) => {
        items.pop();
        return [...items];
      });
      if (response && (response.status === 200 || response.status === 201)) {
        showSuccess(t(`${translationPath}reminder-sent-successfully`));
        setFilter((items) => ({ ...items, page: 1 }));
      } else showError(t(`${translationPath}failed-to-send-reminder`), response);
    },
    [t, translationPath],
  );
  const cardActionsHandler = useCallback(
    (actionKey, form) => () => {
      if (actionKey === FormsActionsEnum.Edit.key)
        return GlobalHistory.push(
          `/forms?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }${job_stage_uuid ? `stage_uuid=${job_stage_uuid}&` : ''}form_uuid=${
            form?.uuid
          }&source=${formSource}&${
            job_uuid ? `job_uuid=${job_uuid}&` : ''
          }editor_role=sender&template_uuid=${
            form?.template_uuid
          }&code=${code}&assign_uuid=${job_candidate_uuid}&candidate_uuid=${candidate_uuid}`,
        );
      if (actionKey === FormsActionsEnum.NotSharableEdit.key)
        return GlobalHistory.push(
          `/forms?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }${job_stage_uuid ? `stage_uuid=${job_stage_uuid}&` : ''}form_uuid=${
            form?.uuid
          }&source=${
            NavigationSourcesEnum.CandidateNotSharableFormsToFormBuilder.key
          }&${
            job_uuid ? `job_uuid=${job_uuid}&` : ''
          }editor_role=sender&template_uuid=${
            form?.template_uuid
          }&code=${code}&assign_uuid=${job_candidate_uuid}&candidate_uuid=${candidate_uuid}`,
        );
      if (actionKey === FormsActionsEnum.View.key)
        return GlobalHistory.push(
          `/forms?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }form_uuid=${form?.uuid}&source=${
            NavigationSourcesEnum.CandidateFormViewToFormBuilder.key
          }&${
            job_uuid ? `job_uuid=${job_uuid}&` : ''
          }editor_role=sender&template_uuid=${
            form?.template_uuid
          }&code=${code}&assign_uuid=${job_candidate_uuid}&candidate_uuid=${candidate_uuid}`,
        );
      if (actionKey === FormsActionsEnum.WithdrawToEdit.key)
        formStatusChangeHandler({
          newStatus: FormsActionsEnum.WithdrawToEdit.updateFormStatus,
          form_uuid: form.uuid,
        });
      if (actionKey === FormsActionsEnum.RevokeToEdit.key)
        formStatusChangeHandler({
          newStatus: FormsActionsEnum.RevokeToEdit.updateFormStatus,
          form_uuid: form.uuid,
        });
      if (actionKey === FormsActionsEnum.Remind.key)
        SendReminderHandler(form.uuid, activeJobPipelineUUID);
    },
    [
      activeJobPipelineUUID,
      job_stage_uuid,
      formSource,
      job_uuid,
      code,
      job_candidate_uuid,
      candidate_uuid,
      formStatusChangeHandler,
      SendReminderHandler,
    ],
  );

  const getTemplateTypesHandler = useCallback(async () => {
    setIsLoading((items) => {
      items.push('getTemplateTypesHandler');
      return [...items];
    });
    const response = await GetBuilderFormTypes({
      job_stage_uuid,
    });
    if (response && response.status === 200) {
      const {
        data: { results },
      } = response;
      const localResults = results.filter(
        (result) => result.code !== DefaultFormsTypesEnum.Flows.key,
      );
      if (localResults.length > 0)
        setTemplatesFilter(
          (items) =>
            ((!items.code
              || !localResults.some((item) => item.code === items.code)) && {
              ...items,
              code: results[0].code,
            })
            || items,
        );
      setTemplateTypesList(localResults);
    } else showError(t('Shared:failed-to-get-saved-data'), response);
    setIsLoading((items) => {
      items.pop();
      return [...items];
    });
  }, [job_stage_uuid, t]);

  useEffect(() => {
    getCandidateFormsHandler();
  }, [getCandidateFormsHandler, filter]);

  useEffect(() => {
    if (templatesFilter.code) getFormsTemplates();
  }, [getFormsTemplates, templatesFilter]);

  useEffect(() => {
    if (getTemplateTypesHandler) getTemplateTypesHandler();
  }, [getTemplateTypesHandler]);

  useEffect(() => {
    // to make the popover is open, so I make it inside the next thread
    if (popoverAttachedWith.templateMenu)
      setTimeout(() => {
        if (popoverBodyRef.current) onScrollTemplatesHandler();
      });
  }, [onScrollTemplatesHandler, popoverAttachedWith.templateMenu]);

  const redirectionHandler = useCallback(
    async (formData) => {
      if (formData?.is_with_recipient)
        GlobalHistory.push(
          `/forms?${
            activeJobPipelineUUID ? `pipeline_uuid=${activeJobPipelineUUID}&` : ''
          }${
            activeJobPipelineUUID
              ? `job_pipeline_uuid=${activeJobPipelineUUID}&`
              : ''
          }${
            job_stage_uuid ? `stage_uuid=${job_stage_uuid}&` : ''
          }&source=${formSource}&${
            job_uuid ? `job_uuid=${job_uuid}&` : ''
          }editor_role=sender&template_uuid=${
            formData.uuid
          }&code=${code}&assign_uuid=${job_candidate_uuid}&candidate_uuid=${candidate_uuid}`,
        );
      else {
        const candidataName = `${candidate?.basic_information?.first_name} ${candidate?.basic_information?.last_name}`;
        const data = {
          ...formData,
          assign: [
            {
              type: FormsAssignTypesEnum.JobCandidate.key,
              uuid: job_candidate_uuid,
              name: { en: candidataName, ar: candidataName },
            },
          ],
          form_status: FormsStatusesEnum.Draft.key,
          invited_member: [],
          position_level: [],
          spaces: [],
          tags: [],
          assign_to_assist: [],
          categories: [],
          connections: [],
          code,
          source: formSource,
          status: true,
          editor_role: 'sender',
          workflow_approval_fields:
            formData?.workflow_approval_fields?.map((it, idx) => ({
              ...it,
              order: idx + 1,
            })) || [],
          sender: {
            avatar: '',
            name: `${
              userReducer.first_name?.[i18next.language]
              || userReducer.first_name?.en
              || ''
            } ${
              userReducer.last_name?.[i18next.language]
              || userReducer.last_name?.en
              || ''
            }`,
          },
          extra_queries: {
            assign_uuid: job_candidate_uuid,
            candidate_uuid,
            email: userReducer?.email,
            // is_view  false
            job_uuid: job_uuid,
            pipeline_uuid: activeJobPipelineUUID,
            stage_uuid: job_stage_uuid,
          },
        };
        const response = await CreateBuilderForm(data);
        if (response && (response.status === 201 || response.status === 200)) {
          showSuccess(
            response.data.message
              || t(`${translationPath}form-created-successfully`),
          );
          const form_uuid = response?.data?.results?.forms?.[0]?.form_uuid;
          if (form_uuid)
            GlobalHistory.push(
              `/forms?${
                activeJobPipelineUUID
                  ? `pipeline_uuid=${activeJobPipelineUUID}&`
                  : ''
              }${
                job_stage_uuid ? `stage_uuid=${job_stage_uuid}&` : ''
              }form_uuid=${form_uuid}&source=${
                NavigationSourcesEnum.CandidateNotSharableFormsToFormBuilder.key
              }&${
                job_uuid ? `job_uuid=${job_uuid}&` : ''
              }editor_role=sender&template_uuid=${
                formData?.template_uuid
              }&code=${code}&assign_uuid=${job_candidate_uuid}&candidate_uuid=${candidate_uuid}`,
            );
        } else showError(t(`${translationPath}form-create-failed`), response);
      }
    },
    [
      activeJobPipelineUUID,
      candidate?.basic_information?.first_name,
      candidate?.basic_information?.last_name,
      candidate_uuid,
      code,
      formSource,
      job_candidate_uuid,
      job_stage_uuid,
      job_uuid,
      t,
      translationPath,
      userReducer?.email,
      userReducer.first_name,
      userReducer.last_name,
    ],
  );
  useEventListener('scroll', onScrollHandler, bodyRef.current);
  useEventListener('scroll', onScrollTemplatesHandler, popoverBodyRef.current);

  return (
    <div className="d-flex-column-center">
      <div className="top-header d-flex-h-between mb-2 full-width">
        <div></div>
        <div>
          <ButtonBase
            onClick={(e) => {
              popoverToggleHandler('templateType', e);
            }}
            disabled={
              isLoading.length > 0
              // || !selectedCandidateDetails?.can_create_new_offer
              // || !getIsAllowedPermissionV2({
              //   defaultPermissions: {
              //     SuperFormBuilderType:
              //     ManageFormBuilderTypesPermissions.SuperFormBuilderType,
              //     SendOffer: ManageApplicationsPermissions.SendOffer,
              //     SendContract: ManageApplicationsPermissions.SendContract,
              //   },
              //   permissions: permissionsReducer,
              // })
            }
            className="btns theme-transparent"
          >
            <span>
              {getSelectedTypeItem().name || t(`${translationPath}select-form-type`)}
            </span>
            <span
              className={`px-2 fas fa-chevron-${
                (popoverAttachedWith.templateType && 'up') || 'down'
              }`}
            />
          </ButtonBase>
          <ButtonBase
            onClick={(e) => {
              popoverToggleHandler('templateMenu', e);
            }}
            disabled={isLoading.length > 0}
            className="btns theme-transparent"
          >
            <span className="fas fa-plus" />
            <span className="px-1">{t(`${translationPath}create-new`)}</span>
          </ButtonBase>
        </div>
      </div>

      <div className="d-flex-h-between full-width">
        <div>
          {searchExpanded ? (
            <SharedInputControl
              idRef="searchRef"
              title="search"
              placeholder="search"
              // themeClass="theme-filled"
              stateKey="search"
              endAdornment={
                <span
                  className="end-adornment-wrapper"
                  onClick={() => setSearchExpanded(false)}
                  onKeyDown={() => setSearchExpanded(false)}
                  role="button"
                  tabIndex={0}
                >
                  <span className="fas fa-search" />
                </span>
              }
              onValueChanged={(newValue) => {
                setFilter((items) => ({ ...items, search: newValue?.value || '' }));
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
              editValue={filter.search}
            />
          ) : (
            <ButtonBase
              className="btns-icon theme-transparent"
              onClick={() => setSearchExpanded(true)}
            >
              <span className="fas fa-search" />
            </ButtonBase>
          )}
        </div>
      </div>

      <div className="mt-3 mb-3 full-width">
        <Divider />
      </div>
      <div
        style={{ overflow: 'auto', maxHeight: '60vh', width: '100%' }}
        ref={bodyRef}
      >
        <div>
          {formsList
            && formsList.results
            && formsList.results.map((form, formIdx) => (
              <div key={`form-${formIdx}`}>
                <div
                  key={form.uuid}
                  style={{ backgroundColor: '#fff' }}
                  className="pt-4"
                >
                  <div className="d-flex-h-between full-width px-2">
                    <div className="d-flex">
                      <div className="mx-2">
                        <span className="fa-2x fas fa-file" />
                      </div>
                      <div className="mx-2">
                        <div className="form-title">{form.title}</div>
                        <div className="form-details">
                          <span className="fz-12px">
                            {`${t(`${translationPath}created-by`)} ${
                              form.created_by?.name?.[i18next.language]
                              || form.created_by?.name?.en
                            } ${moment(form.created_at)
                              .locale(i18next.language)
                              .format(GlobalDisplayDateTimeFormat)}`}
                          </span>
                        </div>
                        {form.deadline_date && (
                          <div className="form-details">
                            <span className="fz-12px">
                              {`${t(`${translationPath}deadline-at`)} ${moment(
                                form.deadline_date,
                              ).format(GlobalDisplayDateFormat)}`}
                            </span>
                          </div>
                        )}
                        {form.member && form.member.name && (
                          <div className="form-details mb-3">
                            {`${t(`${translationPath}created-for`)} ${
                              form.member.name[i18next.language]
                              || form.member.name.en
                            }`}
                          </div>
                        )}
                        <div className="form-status mb-3">
                          <span
                            className="fz-12px p-1"
                            style={{ backgroundColor: '#24253314' }}
                          >
                            {t(
                              `${translationPath}${
                                Object.values(FormsStatusesEnum).find(
                                  (item) => item.key === form.form_status,
                                )?.status
                              }`,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex fj-end">
                      <div className="d-flex fa-start fj-end max-width-fit">
                        {Object.values(FormsStatusesEnum)
                          .find((item) => item.key === form.form_status)
                          ?.actions.filter(
                            (item) =>
                              !item.isForNotSharableOnly
                              || (item.isForNotSharableOnly && !form.is_with_recipient),
                          )
                          .map((item) => (
                            <ButtonBase
                              key={`${form.uuid}${item.key}`}
                              className="btns theme-outline sm-btn"
                              disabled={isLoading.length > 0}
                              onClick={cardActionsHandler(item.key, form)}
                            >
                              <span className="px-1">
                                {t(`${translationPath}${item.value}`)}
                              </span>
                            </ButtonBase>
                          ))}
                      </div>
                      <div className="more-btns">
                        <ButtonBase
                          onClick={(e) => {
                            popoverToggleHandler('formActions', e);
                            setSelectedItem(form);
                          }}
                          className="btns-icon theme-transparent m-0"
                        >
                          <span className="fas fa-ellipsis-h" />
                        </ButtonBase>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="my-3 full-width">
                  <Divider />
                </div>
              </div>
            ))}
        </div>
      </div>
      <PopoverComponent
        idRef="templateTypePopoverRef"
        attachedWith={popoverAttachedWith?.templateType}
        handleClose={() => popoverToggleHandler('templateType')}
        component={
          <div className="d-flex-column">
            {templateTypesList
              && templateTypesList.map((type) => (
                <ButtonBase
                  key={type.uuid}
                  className={`btns theme-transparent fj-start${
                    (type.code === templatesFilter.code && ' is-active') || ''
                  }`}
                  onClick={() => {
                    setFormTemplatesList({
                      results: [],
                      totalCount: 0,
                    });
                    setTemplatesFilter((items) => ({
                      ...items,
                      page: 1,
                      code: type.code,
                    }));
                    popoverToggleHandler('templateType');
                  }}
                >
                  <span className="px-2">{type.name}</span>
                </ButtonBase>
              ))}
          </div>
        }
      />
      <PopoverComponent
        idRef="templateMenuPopoverRef"
        attachedWith={popoverAttachedWith.templateMenu}
        handleClose={() => popoverToggleHandler('templateMenu')}
        component={
          <div
            className="template-menu-popover-contents d-flex-column"
            ref={popoverBodyRef}
          >
            {formTemplatesList.results.map((item) => (
              <ButtonBase
                key={item.uuid}
                className="btns theme-transparent fj-start"
                onClick={() => {
                  popoverToggleHandler('templateMenu');
                  redirectionHandler(item);
                }}
              >
                <span className="px-2">{item.title}</span>
                {item.is_with_recipient && (
                  <span className="px-1">({t(`${translationPath}shareable`)})</span>
                )}
              </ButtonBase>
            ))}
          </div>
        }
      />
      <PopoverComponent
        idRef="formActionsPopoverRef"
        attachedWith={popoverAttachedWith.formActions}
        handleClose={() => popoverToggleHandler('formActions')}
        component={
          <div className="d-flex-column">
            {selectedItem && selectedItem.deadline_date && (
              <ButtonBase
                className="btns theme-transparent fj-start"
                onClick={() => {
                  setIsDeadlineExtendDialog(true);
                  popoverToggleHandler('formActions');
                }}
              >
                <span className="px-2">
                  {t(`${translationPath}extend-deadline-date`)}
                </span>
              </ButtonBase>
            )}
            <ButtonBase
              className="btns theme-transparent fj-start"
              disabled={isLoading.length > 0}
              onClick={() => {
                setConfirmDeleteDialog(true);
                popoverToggleHandler('formActions');
              }}
            >
              <span className="px-2">{t(`${translationPath}delete`)}</span>
            </ButtonBase>
          </div>
        }
      />
      {isDeadlineExtendDialog && (
        <DeadlineExtendDialog
          isOpen={isDeadlineExtendDialog}
          onClose={() => setIsDeadlineExtendDialog(false)}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          onSave={() => {
            setFilter((items) => ({
              ...items,
              page: 1,
              search: '',
              status: '',
            }));
          }}
          currentDeadlineDate={selectedItem.deadline_date}
          form_uuid={selectedItem.uuid}
          form_type="form"
        />
      )}
      <DialogComponent
        isConfirm
        dialogContent={
          <div className="d-flex-column-center">
            <span className="fas fa-exclamation-triangle c-danger fa-4x mb-2" />
            <span>{t(`${translationPath}form-delete-description`)}</span>
          </div>
        }
        api
        isSaving={isLoading.length > 0}
        isOpen={confirmDeleteDialog}
        onSubmit={(e) => {
          e.preventDefault();
          void deleteFormHandler(selectedItem && selectedItem.uuid);
        }}
        onCloseClicked={() => setConfirmDeleteDialog(false)}
        onCancelClicked={() => setConfirmDeleteDialog(false)}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
    </div>
  );
};

FormsTab.propTypes = {
  candidate_uuid: PropTypes.string.isRequired,
  job_candidate_uuid: PropTypes.string.isRequired,
  parentTranslationPath: PropTypes.string,
  job_uuid: PropTypes.string,
  job_stage_uuid: PropTypes.string,
  code: PropTypes.oneOf(
    Object.values(DefaultFormsTypesEnum).map((item) => item.key),
  ),
  defaultStatus: PropTypes.oneOf(
    Object.values(FormsStatusesEnum).map((item) => item.key),
  ),
  formSource: PropTypes.oneOf(
    Object.values(NavigationSourcesEnum).map((item) => item.key),
  ),
  translationPath: PropTypes.string,
  activeJobPipelineUUID: PropTypes.string,
};
FormsTab.defaultProps = {
  parentTranslationPath: 'EvarecCandidateModel',
  translationPath: 'FormsTab.',
  formSource: NavigationSourcesEnum.CandidateFormsToFormBuilder.key,
  job_uuid: undefined,
  defaultStatus: undefined,
  code: DefaultFormsTypesEnum.Forms.key,
  selectedCandidateDetails: undefined,
  activeJobPipelineUUID: undefined,
};
