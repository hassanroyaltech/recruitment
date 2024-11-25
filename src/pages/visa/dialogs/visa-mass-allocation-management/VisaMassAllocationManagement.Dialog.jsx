import React, { useReducer, useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { CollapseComponent, DialogComponent } from '../../../../components';
import {
  SetupsReducer,
  SetupsReset,
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
  SharedInputControl,
} from '../../../setups/shared';
import {
  DefaultFormsTypesEnum,
  DynamicFormTypesEnum,
  NavigationSourcesEnum,
  OffersStatusesEnum,
} from '../../../../enums';
import i18next from 'i18next';
import {
  GetAllBuilderTemplates,
  GetAllVisaGenders,
  GetAllVisaIssuePlaces,
  GetAllVisaNationalities,
  GetAllVisaOccupations,
  GetAllVisaReligions,
  GetVisaGenderById,
  GetVisaIssuePlaceById,
  GetVisaNationalityById,
  GetVisaOccupationById,
  GetVisaReligionById,
} from '../../../../services';
import TablesComponent from '../../../../components/Tables/Tables.Component';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  ButtonBase,
} from '@mui/material';
import {
  GetAllMassAllocationVisas,
  MassAllocateVisa,
} from '../../../../services/VisaMassAllocation.Services';
import { showError, showSuccess } from '../../../../helpers';
import './VisaMassAllocationManagementDialog.Style.scss';
import { RequestAttachmentsTab } from '../visa-requests-management/tabs';
import { OffersTab } from '../../../../components/Views/CandidateModals/evarecCandidateModal/OffersTab';
import Alert from '@mui/material/Alert';

export const VisaMassAllocationManagementDialog = ({
  isOpen,
  isOpenChanged,
  translationPath,
  parentTranslationPath,
  selectedApplicant,
  ProfileSourcesTypes,
  onSave,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [state, setState] = useReducer(
    SetupsReducer,
    {
      attachmentsDetails: [],
      attachments: [],
    },
    SetupsReset,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [visas, setVisas] = useState({
    results: [],
    totalCount: 0,
    note: null,
    form_templates: null,
  });
  const [openFilters, setOpenFilters] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [localFilter, setLocalFilter] = useState({
    page: 1,
    limit: 10,
    block_number: null,
    occupation: null,
    gender:
      (selectedApplicant?.gender?.uuid && [selectedApplicant?.gender?.uuid]) || null,
    religion: null,
    nationality:
      (selectedApplicant?.nationality?.length
        && selectedApplicant?.nationality?.map((it) => it.uuid))
      || null,
    issue_place: null,
    reserve_for:
      (selectedApplicant?.source_uuid?.uuid && [
        selectedApplicant?.source_uuid?.uuid,
      ])
      || null,
    order_by: 'block_number',
    order_type: 'DESC',
  });
  const defaultTableColumnsRef = useRef([
    {
      id: 'block_number',
      input: 'block_number',
      label: 'block-number',
      isSortable: true,
    },
    {
      id: 'occupation',
      input: 'occupation',
      label: 'occupation',
      isSortable: true,
      component: (item) =>
        item.occupation?.[i18next.language] || item.occupation?.en,
    },
    {
      id: 'nationality',
      input: 'nationality',
      label: 'nationality',
      isSortable: true,
      component: (item) =>
        item.nationality?.[i18next.language] || item.nationality?.en,
    },
    {
      id: 'gender',
      input: 'gender',
      label: 'gender',
      isSortable: true,
      component: (item) => item.gender?.[i18next.language] || item.gender?.en,
    },
    {
      id: 'religion',
      input: 'religion',
      label: 'religion',
      isSortable: true,
      component: (item) => item.religion?.[i18next.language] || item.religion?.en,
    },
    {
      id: 'issue_place',
      input: 'issue_place',
      label: 'arriving-from',
      isSortable: true,
      component: (item) =>
        item.issue_place?.[i18next.language] || item.issue_place?.en,
    },
    {
      id: 'allocated',
      input: 'allocated',
      label: 'allocated',
      isSortable: true,
    },
    {
      id: 'available',
      input: 'available',
      label: 'available',
      isSortable: true,
    },
  ]);
  const [tableColumns] = useState(defaultTableColumnsRef.current);
  const [currentStep, setCurrentStep] = useState(1);

  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  const onPageIndexChanged = (newIndex) => {
    setLocalFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setLocalFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const GetAllMassAllocationVisasHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await GetAllMassAllocationVisas(localFilter);
    setIsLoading(false);
    if (response && response.status === 200)
      setVisas({
        results: response.data.results || [],
        totalCount: response.data.paginate?.total,
      });
    else {
      setVisas({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [localFilter, t]);

  const MassAllocateVisaHandler = useCallback(async () => {
    setIsLoading(true);
    const response = await MassAllocateVisa({
      reserve_for: selectedApplicant?.source_uuid?.uuid,
      job_uuid: selectedApplicant?.job_uuid?.uuid,
      candidate_uuid: selectedApplicant?.user_uuid,
      visa_uuid: selectedRows?.[0]?.reserved_visa_uuid,
      request_uuid: state.request_uuid || selectedRows?.[0]?.request_uuid,
      note: state.note,
      form_templates: state.form_templates,
      attachments: state.attachments,
      is_mass_allocated: true,
    });
    setIsLoading(false);
    if (response && response.status === 200) {
      showSuccess(t(`${translationPath}visa-allocated-successfully`));
      isOpenChanged();
      if (onSave) onSave();
    } else showError(t('Shared:failed-to-get-saved-data'), response);
  }, [
    isOpenChanged,
    selectedApplicant,
    selectedRows,
    state.attachments,
    state.form_templates,
    state.note,
    t,
    translationPath,
    onSave,
  ]);

  useEffect(() => {
    GetAllMassAllocationVisasHandler();
  }, [localFilter, GetAllMassAllocationVisasHandler]);

  return (
    <DialogComponent
      titleText="check-reserved-visas"
      maxWidth="lg"
      contentFooterClasses="px-0 pb-0"
      contentClasses="px-3 pb-0"
      wrapperClasses=""
      dialogContent={
        <div className="w-100">
          {currentStep === 1 && (
            <div className="step-1">
              <div className="w-100 d-flex-v-center-h-end mb-3">
                <ButtonBase
                  className="btns theme-transparent collapse-btn"
                  onClick={() => setOpenFilters((item) => !item)}
                >
                  <span className="fas fa-filter" />
                </ButtonBase>
              </div>
              <CollapseComponent
                isOpen={openFilters}
                wrapperClasses="w-100 px-2"
                component={
                  <div className="filters-section mb-3">
                    <div>
                      <SharedAutocompleteControl
                        isQuarterWidth
                        placeholder="press-enter-to-add"
                        title="block-number"
                        isFreeSolo
                        stateKey="block_number"
                        onValueChanged={onStateChanged}
                        type={DynamicFormTypesEnum.array.key}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        editValue={state.block_number || []}
                      />
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        searchKey="search"
                        stateKey="occupation"
                        placeholder="occupation"
                        title="occupation"
                        getDataAPI={GetAllVisaOccupations}
                        getItemByIdAPI={GetVisaOccupationById}
                        editValue={state.occupation}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        onValueChanged={onStateChanged}
                        autocompleteThemeClass="theme-outline"
                        controlWrapperClasses="px-2"
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        extraProps={
                          state.occupation?.length && { with_than: state.occupation }
                        }
                        type={DynamicFormTypesEnum.array.key}
                      />
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        searchKey="search"
                        stateKey="nationality"
                        placeholder="nationality"
                        title="nationality"
                        getDataAPI={GetAllVisaNationalities}
                        getItemByIdAPI={GetVisaNationalityById}
                        editValue={state.nationality}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        onValueChanged={onStateChanged}
                        autocompleteThemeClass="theme-outline"
                        controlWrapperClasses="px-2"
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        extraProps={
                          state.nationality?.length && {
                            with_than: state.nationality,
                          }
                        }
                        type={DynamicFormTypesEnum.array.key}
                      />
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        searchKey="search"
                        stateKey="gender"
                        placeholder="gender"
                        title="gender"
                        getDataAPI={GetAllVisaGenders}
                        getItemByIdAPI={GetVisaGenderById}
                        editValue={state.gender}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        onValueChanged={onStateChanged}
                        autocompleteThemeClass="theme-outline"
                        controlWrapperClasses="px-2"
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        extraProps={
                          state.gender?.length && { with_than: state.gender }
                        }
                        type={DynamicFormTypesEnum.array.key}
                      />
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        searchKey="search"
                        stateKey="religion"
                        placeholder="religion"
                        title="religion"
                        getDataAPI={GetAllVisaReligions}
                        getItemByIdAPI={GetVisaReligionById}
                        editValue={state.religion}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        onValueChanged={onStateChanged}
                        autocompleteThemeClass="theme-outline"
                        controlWrapperClasses="px-2"
                        translationPath={translationPath}
                        parentTranslationPath={parentTranslationPath}
                        extraProps={state.religion && { with_than: state.religion }}
                        type={DynamicFormTypesEnum.array.key}
                      />
                      <SharedAPIAutocompleteControl
                        isQuarterWidth
                        title="arriving-from"
                        stateKey="issue_place"
                        errorPath="issue_place"
                        searchKey="search"
                        placeholder="select-arriving-from"
                        onValueChanged={onStateChanged}
                        editValue={state.issue_place}
                        getDataAPI={GetAllVisaIssuePlaces}
                        getItemByIdAPI={GetVisaIssuePlaceById}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                        getOptionLabel={(option) =>
                          (option.name
                            && (option.name[i18next.language]
                              || option.name.en
                              || 'N/A'))
                          || 'N/A'
                        }
                        extraProps={
                          state.uuid
                          && state.issue_place && { with_than: state.issue_place }
                        }
                        type={DynamicFormTypesEnum.array.key}
                      />
                    </div>
                    <ButtonBase
                      className="btns theme-solid mx-2"
                      onClick={() => {
                        setLocalFilter((items) => ({
                          ...state,
                          page: items.page,
                          limit: items.limit,
                          reserve_for: items.reserve_for,
                        }));
                      }}
                    >
                      {t(`${translationPath}check-reservations`)}
                    </ButtonBase>
                  </div>
                }
              />
              {visas.results.length === 0 && (
                <Alert severity="warning">{`${t(
                  `${translationPath}no-visa-reservation-match-filters`,
                )}${
                  localFilter.gender?.[0] === selectedApplicant.gender?.uuid
                  && selectedApplicant?.gender?.name
                    ? ` - ${t(`${translationPath}gender`)}: ${
                      selectedApplicant?.gender?.name
                    }`
                    : ''
                }${
                  selectedApplicant.nationality?.some((item) =>
                    localFilter.nationality?.includes(item.uuid),
                  )
                    ? ` - ${t(
                      `${translationPath}nationality`,
                    )}: ${selectedApplicant.nationality
                      .map((it) => it.name)
                      ?.join(', ')}`
                    : ''
                }`}</Alert>
              )}
              <TablesComponent
                data={visas.results}
                isLoading={isLoading}
                headerData={tableColumns}
                pageIndex={localFilter.page - 1}
                pageSize={localFilter.limit}
                totalItems={visas.totalCount}
                isDynamicDate
                uniqueKeyInput="uuid"
                themeClasses="theme-transparent"
                parentTranslationPath={parentTranslationPath}
                translationPath={translationPath}
                onPageIndexChanged={onPageIndexChanged}
                onPageSizeChanged={onPageSizeChanged}
                isWithCheck
                getIsDisabledRow={(row) =>
                  !!selectedRows.length && row.uuid !== selectedRows[0]?.uuid
                }
                onSelectCheckboxChanged={({ selectedRows }) =>
                  setSelectedRows(selectedRows)
                }
                sortColumnClicked={(columnId, currentOrderDirection) => {
                  setLocalFilter((it) => ({
                    ...it,
                    order_by: columnId,
                    order_type: currentOrderDirection?.toUpperCase(),
                    page: 1,
                  }));
                }}
                tableOptions={{
                  sortFrom: 2,
                }}
              />
            </div>
          )}
          {currentStep === 2 && (
            <div className="step-2 mx-4">
              <div className="general visa-section-border p-2">
                <Accordion defaultExpanded elevation={0}>
                  <AccordionSummary aria-controls="accordion" id="pinned-dashboards">
                    <div className="d-flex-v-center">
                      <div>
                        <span className="fas fa-caret-down" />
                      </div>
                      <div className="mx-3 fz-16px">
                        {t(`${translationPath}visa-general-info`)}
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="visa-grid-1-1">
                      {[
                        {
                          label: 'user-type',
                          value:
                            ProfileSourcesTypes[selectedApplicant.source_type]
                              ?.value
                            && t(
                              `${translationPath}${
                                ProfileSourcesTypes[selectedApplicant.source_type]
                                  ?.value
                              }`,
                            ),
                        },
                        {
                          label: 'request-from',
                          value: selectedApplicant.source_uuid?.name,
                        },
                        {
                          label: 'visa-for',
                          value: `${selectedApplicant?.first_name} ${selectedApplicant?.last_name}`,
                        },
                        {
                          label: 'first-name',
                          value: selectedApplicant?.first_name,
                        },
                        {
                          label: 'last-name',
                          value: selectedApplicant?.last_name,
                        },
                        {
                          label: 'occupation',
                          value:
                            selectedRows[0]?.occupation?.[i18next.language]
                            || selectedRows[0]?.occupation?.en,
                        },
                        {
                          label: 'gender',
                          value:
                            selectedRows[0]?.gender?.[i18next.language]
                            || selectedRows[0]?.gender?.en,
                        },
                        {
                          label: 'nationality',
                          value:
                            selectedRows[0]?.nationality?.[i18next.language]
                            || selectedRows[0]?.nationality?.en,
                        },
                        {
                          label: 'religion',
                          value:
                            selectedRows[0]?.religion?.[i18next.language]
                            || selectedRows[0]?.religion?.en,
                        },
                        {
                          label: 'arriving-from',
                          value:
                            selectedRows[0]?.issue_place?.[i18next.language]
                            || selectedRows[0]?.issue_place?.en,
                        },
                      ].map((item, idx) => (
                        <div
                          key={`visa-info-${idx}-${item.uuid}`}
                          className="px-1 py-2 mx-3 visa-grid-1-3"
                        >
                          <span className="fw-bold">
                            {t(`${translationPath}${item.label}`)}
                          </span>
                          <span className="mx-2">{item.value}</span>
                        </div>
                      ))}
                    </div>
                    <div className="px-3 pt-3 mt-3 visa-grid-1-4">
                      <span className="fw-bold">
                        {t(`${translationPath}form-templates`)}
                      </span>
                      <SharedAPIAutocompleteControl
                        isFullWidth
                        placeholder="select-form-templates"
                        stateKey="form_templates"
                        searchKey="search"
                        editValue={state.form_templates}
                        onValueChanged={onStateChanged}
                        translationPath={translationPath}
                        getDataAPI={GetAllBuilderTemplates}
                        parentTranslationPath={parentTranslationPath}
                        type={DynamicFormTypesEnum.array.key}
                        getOptionLabel={(option) => option.title || 'N/A'}
                        extraProps={{
                          code: DefaultFormsTypesEnum.Visa.key,
                          with_than: state.form_templates || [],
                        }}
                        wrapperClasses="px-2"
                      />
                      <span className="fw-bold">{t(`${translationPath}note`)}</span>
                      <SharedInputControl
                        isFullWidth
                        stateKey="note"
                        placeholder="note-description"
                        editValue={state.note}
                        wrapperClasses="px-2"
                        multiline
                        rows={4}
                        isLoading={isLoading}
                        onValueChanged={onStateChanged}
                        parentTranslationPath={parentTranslationPath}
                        translationPath={translationPath}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="forms visa-section-border p-2 my-3">
                <Accordion elevation={0}>
                  <AccordionSummary aria-controls="accordion" id="pinned-dashboards">
                    <div className="d-flex-v-center">
                      <div>
                        <span className="fas fa-caret-down" />
                      </div>
                      <div className="mx-3 fz-16px">
                        {t(`${translationPath}forms`)}
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <OffersTab
                      candidate_uuid={selectedApplicant?.user_uuid}
                      code={DefaultFormsTypesEnum.Visa.key}
                      form_builder={{
                        sent_multiple_request: true,
                        next_approved: false,
                      }}
                      isBlankPage={true}
                      isForm
                      formSource={NavigationSourcesEnum.VisaRequestToFormBuilder.key}
                      defaultStatus={OffersStatusesEnum.Draft.key}
                      job_uuid={selectedApplicant?.job_uuid?.uuid}
                      manualFormsTitle="new-visa-form"
                      selectedCandidateDetails={{
                        can_create_new_offer: true,
                      }}
                    />
                  </AccordionDetails>
                </Accordion>
              </div>
              <div className="attachments visa-section-border p-2 my-3">
                <Accordion elevation={0}>
                  <AccordionSummary aria-controls="accordion" id="pinned-dashboards">
                    <div className="d-flex-v-center">
                      <div>
                        <span className="fas fa-caret-down" />
                      </div>
                      <div className="mx-3 fz-16px">
                        {t(`${translationPath}attachments`)}
                      </div>
                    </div>
                  </AccordionSummary>
                  <AccordionDetails>
                    <RequestAttachmentsTab
                      state={state}
                      onStateChanged={onStateChanged}
                      isLoading={isLoading}
                      getIsDisabledFieldsOrActions={() => {}}
                      parentTranslationPath={parentTranslationPath}
                      translationPath={translationPath}
                    />
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          )}
        </div>
      }
      isOpen={isOpen}
      onSubmit={(e) => {
        e.preventDefault();
        if (currentStep === 1) setCurrentStep((item) => item + 1);
        else if (currentStep === 2) MassAllocateVisaHandler();
      }}
      onCancelClicked={isOpenChanged}
      onCloseClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
      saveText={currentStep === 1 ? 'next' : 'allocate'}
      saveIsDisabled={!selectedRows.length}
    />
  );
};

VisaMassAllocationManagementDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  selectedApplicant: PropTypes.shape({
    user_uuid: PropTypes.string,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    source_type: PropTypes.number,
    job_uuid: PropTypes.shape({ name: PropTypes.string, uuid: PropTypes.string }),
    gender: PropTypes.shape({ name: PropTypes.string, uuid: PropTypes.string }),
    source_uuid: PropTypes.shape({ name: PropTypes.string, uuid: PropTypes.string }),
    nationality: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        uuid: PropTypes.string,
      }),
    ),
  }),
  ProfileSourcesTypes: PropTypes.shape({
    value: PropTypes.shape({ key: PropTypes.number, value: PropTypes.string }),
  }),
  onSave: PropTypes.func.isRequired,
};
