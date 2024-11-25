import React, { useCallback, useRef, useState } from 'react';
import { MassAllocationTab } from '../../visa/visa-all-requests/tabs/mass-allocation/MassAllocation.Tab';
import { useTranslation } from 'react-i18next';
// ********** DON'T FIX THIS ESLINT WARNING ********** //
import { VisaMassAllocationFiltersDialog } from '../../visa/dialogs/visa-mass-allocation-filters/VisaMassAllocationFilters.Dialog';
import { AssigneeTypesEnum, OffersStatusesEnum } from '../../../enums';
import { useSelector } from 'react-redux';

const parentTranslationPath = 'VisaPage';
const translationPath = 'VisaMassAllocationTab.';

const VisaMassAllocationPage = () => {
  const { t } = useTranslation(parentTranslationPath);
  const userReducer = useSelector((state) => state.userReducer);
  const [isOpenDialogs, setIsOpenDialogs] = useState({
    mass_allocation_filters: false,
  });
  const filterInit = useRef({
    reserve_for: null,
    requested_from: null,
    query: null,
    order_type: 'DESC',
    order_by: '1',
    offer_status: [
      {
        ...OffersStatusesEnum.Completed,
        status: t(`${translationPath}${OffersStatusesEnum.Completed.status}`),
      },
    ],
    ...(userReducer?.results?.user?.user_type === AssigneeTypesEnum.User.key && {
      assigned_users: [userReducer.results.user],
    }),
    ...(userReducer?.results?.user?.user_type === AssigneeTypesEnum.Employee.key && {
      assigned_employees: [userReducer.results.user],
    }),
  });
  const [filter, setFilter] = useState(filterInit.current);

  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  const onIsOpenDialogsChanged = useCallback(
    (key, newValue) => () => {
      setIsOpenDialogs((items) => ({ ...items, [key]: newValue }));
    },
    [],
  );

  return (
    <div className="p-4">
      <div className="approve-applicants-header-wrapper">
        <div className="header-section">
          <div className="header-text-wrapper">
            <span className="header-text-x2">
              {t(`${translationPath}visa-mass-allocation`)}
            </span>
          </div>
          <div className="description-text">
            <span>{t(`${translationPath}visa-mass-allocation-description`)}</span>
          </div>
        </div>
      </div>
      <div className="content-wrapper">
        <MassAllocationTab
          filter={filter}
          setFilter={setFilter}
          filterInit={filterInit}
          onIsOpenDialogsChanged={onIsOpenDialogsChanged}
          parentTranslationPath="VisaPage"
        />
      </div>
      {isOpenDialogs.mass_allocation_filters && (
        <VisaMassAllocationFiltersDialog
          isOpen={isOpenDialogs.mass_allocation_filters}
          isOpenChanged={onIsOpenDialogsChanged(
            'mass_allocation_filters',
            false,
            true,
          )}
          translationPath={translationPath}
          parentTranslationPath={parentTranslationPath}
          onFilterChanged={onFilterChanged}
          filter={filter}
        />
      )}
    </div>
  );
};

export default VisaMassAllocationPage;
