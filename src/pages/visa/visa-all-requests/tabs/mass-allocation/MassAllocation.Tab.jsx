import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { showError } from '../../../../../helpers';
import { ProfileSourcesTypesEnum } from '../../../../../enums';
import TablesComponent from '../../../../../components/Tables/Tables.Component';
import { useTranslation } from 'react-i18next';
import { ButtonBase } from '@mui/material';
import { GetAllApplicantsForVisaMassAllocation } from '../../../../../services/VisaMassAllocation.Services';
import i18next from 'i18next';
// ********** DON'T FIX THIS ESLINT WARNING ********** //
import { VisaMassAllocationManagementDialog } from '../../../dialogs/visa-mass-allocation-management/VisaMassAllocationManagement.Dialog';

const translationPath = 'VisaMassAllocationTab.';
export const MassAllocationTab = ({
  filter,
  setFilter,
  filterInit,
  isForceToReload,
  onIsOpenDialogsChanged,
  parentTranslationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const localFilterInit = useRef({
    page: 1,
    limit: 10,
  });
  const [localFilter, setLocalFilter] = useState({
    ...(filter || {}),
    ...localFilterInit.current,
  });
  const isLoadingRef = useRef(false);
  const [applicants, setApplicants] = useState({
    results: [],
    totalCount: 0,
  });
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const ProfileSourcesTypes = useMemo(
    () =>
      Object.values(ProfileSourcesTypesEnum).reduce(
        (a, v) => ({ ...a, [v.key]: v }),
        {},
      ),
    [],
  );

  const defaultTableColumnsRef = useRef([
    {
      id: 0,
      input: 'select-visa',
      label: 'select-visa',
      component: (item) => (
        <div className="d-flex-v-center">
          <ButtonBase
            className="btns btns-icon theme-transparent my-1"
            onClick={() => {
              setSelectedApplicant(item);
            }}
            disabled={item.has_allocation}
          >
            <span
              className={`fas fa-plus ${
                item.has_allocation ? 'c-gray' : 'c-accent-secondary'
              }`}
            />
          </ButtonBase>
        </div>
      ),
    },
    {
      id: 1,
      input: 'first_name',
      label: 'first-name',
    },
    {
      id: 2,
      input: 'last_name',
      label: 'last-name',
    },
    {
      id: 3,
      input: 'email',
      label: 'email',
    },
    {
      id: 4,
      input: 'applicant_number',
      label: 'applicant-number',
    },
    {
      id: 5,
      input: 'reference_number',
      label: 'reference-number',
    },
    {
      id: 6,
      input: 'source_type',
      label: 'source-type',
      component: (item) =>
        ProfileSourcesTypes[item.source_type]?.value
        && t(`${translationPath}${ProfileSourcesTypes[item.source_type]?.value}`),
    },
    {
      id: 7,
      input: 'source_uuid.name',
      label: 'source',
    },
    {
      id: 8,
      input: 'nationality',
      label: 'nationality',
      component: (item) => item.nationality.map((it) => it.name).join(', '),
    },
    {
      id: 9,
      input: 'gender.name',
      label: 'gender',
    },
    {
      id: 10,
      input: 'job_uuid.name',
      label: 'job-name',
    },
    {
      id: 11,
      input: 'category_uuid',
      label: 'job-family',
      component: (item) =>
        item?.category_uuid?.[i18next.language] || item?.category_uuid?.en || '',
    },
    {
      id: 12,
      input: 'job_title_name',
      label: 'requisition-job-title',
      component: (item) =>
        item?.job_title_name?.[i18next.language] || item?.job_title_name?.en || '',
    },
    {
      id: 13,
      input: 'position_name',
      label: 'position-name',
      component: (item) =>
        item?.position_name?.[i18next.language] || item?.position_name?.en || '',
    },
    {
      id: 14,
      input: 'position_title_name',
      label: 'position-title-name',
      component: (item) =>
        item?.position_title_name?.[i18next.language]
        || item?.position_title_name?.en
        || '',
    },
    {
      id: 15,
      input: 'req_company',
      label: 'job-requisition-branch',
      component: (item) =>
        item?.req_company?.[i18next.language] || item?.req_company?.en || '',
    },
    {
      id: 16,
      input: 'assigned_user_uuid.name',
      label: 'assigned-user',
    },
  ]);
  const [tableColumns] = useState(defaultTableColumnsRef.current);

  const onPageIndexChanged = (newIndex) => {
    setLocalFilter((items) => ({ ...items, page: newIndex + 1 }));
  };

  const onPageSizeChanged = (newPageSize) => {
    setLocalFilter((items) => ({ ...items, page: 1, limit: newPageSize }));
  };

  const getAllApplicantsForVisaMassAllocation = useCallback(async () => {
    isLoadingRef.current = true;
    setIsLoading(true);
    const response = await GetAllApplicantsForVisaMassAllocation({
      ...localFilter,
      assigned_user_uuid: [
        ...(localFilter.assigned_users?.map((it) => it.uuid) || []),
        ...(localFilter.assigned_employees?.map(
          (it) => it.employee_uuid || it.user_uuid,
        ) || []),
      ],
      offer_status: localFilter.offer_status?.map((it) => it.key),
      has_allocation: localFilter.has_allocation?.key,
      gender: localFilter.gender?.map((it) => it.uuid),
      nationality: localFilter.nationality?.map((it) => it.uuid),
      category_uuid: localFilter.category_uuid?.map((it) => it.uuid),
      source_type: localFilter.source_type?.key,
      source_uuid: localFilter.source_uuid?.map((it) => it.user_uuid || it.uuid),
      job_title_uuid: localFilter.job_title_uuid?.map((it) => it.uuid),
      position_title_uuid: localFilter.position_title_uuid?.map((it) => it.uuid),
      position_uuid: localFilter.position_uuid?.map((it) => it.uuid),
      company_uuid: localFilter.company_uuid?.map((it) => it.uuid),
      job_uuid: localFilter.job_uuid?.map((it) => it.uuid),
    });
    setIsLoading(false);
    isLoadingRef.current = false;
    if (response && response.status === 200)
      setApplicants({
        results: response.data.results || [],
        totalCount: response.data.paginate?.total,
      });
    else {
      setApplicants({ results: [], totalCount: 0 });
      showError(t('Shared:failed-to-get-saved-data'), response);
    }
  }, [localFilter, t]);

  const ChipsArray = useMemo(
    () =>
      Object.keys(localFilter || {}).filter(
        (item) =>
          !['limit', 'page', 'order_type', 'order_by'].includes(item)
          && localFilter[item]
          && ((Array.isArray(localFilter[item]) && localFilter[item].length > 0)
            || !Array.isArray(localFilter[item])),
      ),
    [localFilter],
  );

  const GetChipsValue = useCallback((chip, value) => {
    switch (chip) {
    case 'offer_status':
      return value.map((item) => item.status).join(', ');
    case 'gender':
    case 'nationality':
    case 'job_uuid':
    case 'category_uuid':
    case 'assigned_users':
    case 'assigned_employees':
    case 'source_uuid':
    case 'company_uuid':
    case 'position_title_uuid':
    case 'position_uuid':
    case 'job_title_uuid':
      return value
        .map(
          (item) =>
            ((item.first_name || item.last_name)
                && `${
                  item.first_name
                  && (typeof item.first_name === 'string'
                    ? item.first_name
                    : item.first_name[i18next.language] || item.first_name.en)
                }${
                  (item.last_name
                    && ` ${
                      typeof item.last_name === 'string'
                        ? item.last_name
                        : item.last_name[i18next.language] || item.last_name.en
                    }`)
                  || ''
                }`)
              || (item.name && (item.name?.[i18next.language] || item.name?.en))
              || (item.title
                && (typeof item.title === 'string'
                  ? item.title
                  : item.title?.[i18next.language] || item.title?.en)),
        )
        .join(', ');
    case 'source_type':
      return value?.value;
    case 'has_allocation':
      return value.label;
    default:
      return value;
    }
  }, []);

  useEffect(() => {
    setLocalFilter((items) => ({
      ...items,
      ...(filter || {}),
      page: 1,
    }));
  }, [filter, isForceToReload]);

  useEffect(() => {
    if (isLoadingRef.current) return;
    getAllApplicantsForVisaMassAllocation();
  }, [localFilter, getAllApplicantsForVisaMassAllocation]);

  return (
    <div className="requested-to-reserve-tab-wrapper tab-wrapper">
      <div className="actions-section-wrapper">
        <div className="d-inline-flex px-3 mb-3 mt-2">
          <span>
            <span>{t(`Shared:showing`)}</span>
            <span className="px-1">
              <span>{applicants.totalCount}</span>
            </span>
          </span>
        </div>
        <div className="d-inline-flex flex-wrap">
          <ButtonBase
            className="btns theme-transparent miw-0 mb-3"
            onClick={() => onIsOpenDialogsChanged('mass_allocation_filters', true)()}
          >
            <span>{t(`Shared:filters`)}</span>
          </ButtonBase>
        </div>
      </div>
      {!!ChipsArray?.length && (
        <div className="mass-allocation-chips d-flex-v-center">
          <ButtonBase
            className="mass-allocation-chip btns theme-outline"
            onClick={() => {
              setLocalFilter(localFilterInit.current);
              setFilter({
                ...filterInit.current,
                offer_status: null,
                assigned_users: null,
                assigned_employees: null,
              });
            }}
          >
            <span>{t(`${translationPath}reset-filters`)}</span>
          </ButtonBase>
          <div>
            {ChipsArray.map((chip, chipIdx) => (
              <ButtonBase
                className="mass-allocation-chip btns theme-transparent"
                key={`${chip}-${chipIdx}`}
                onClick={() => {
                  setLocalFilter((items) => {
                    let itemsClone = { ...items };
                    delete itemsClone[chip];
                    return itemsClone;
                  });
                  setFilter((items) => {
                    let itemsClone = { ...items };
                    delete itemsClone[chip];
                    return itemsClone;
                  });
                }}
              >
                <span>{`${t(
                  `${translationPath}${chip
                    .replaceAll('_uuid', '')
                    .replaceAll('_', '-')}`,
                )}: ${GetChipsValue(chip, localFilter[chip])}`}</span>
                <span className="fas fa-times px-2" />
              </ButtonBase>
            ))}
          </div>
        </div>
      )}
      <TablesComponent
        data={applicants.results}
        isLoading={isLoading}
        headerData={tableColumns}
        pageIndex={localFilter.page - 1}
        pageSize={localFilter.limit}
        totalItems={applicants.totalCount}
        isDynamicDate
        uniqueKeyInput="uuid"
        themeClasses="theme-transparent"
        isWithoutBoxWrapper
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        onPageIndexChanged={onPageIndexChanged}
        onPageSizeChanged={onPageSizeChanged}
      />
      {selectedApplicant && (
        <VisaMassAllocationManagementDialog
          isOpen={!!selectedApplicant}
          isOpenChanged={() => {
            setSelectedApplicant(null);
          }}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          selectedApplicant={selectedApplicant}
          ProfileSourcesTypes={ProfileSourcesTypes}
          onSave={() => setLocalFilter((it) => ({ ...it }))}
        />
      )}
    </div>
  );
};

MassAllocationTab.propTypes = {
  filter: PropTypes.instanceOf(Object),
  setFilter: PropTypes.func.isRequired,
  filterInit: PropTypes.shape({ current: PropTypes.shape({}) }),
  isForceToReload: PropTypes.bool,
  onIsOpenDialogsChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
};
