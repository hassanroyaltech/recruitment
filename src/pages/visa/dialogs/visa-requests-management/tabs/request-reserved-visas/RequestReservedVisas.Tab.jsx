import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import ButtonBase from '@mui/material/ButtonBase';
import { RequestedToReserveTab } from '../../../../visa-all-requests/tabs';
import i18next from 'i18next';
import { VisaRequestsStatusesEnum } from '../../../../../../enums';

export const RequestReservedVisasTab = ({
  state,
  deselectVisasHandler,
  getIsConfirmType,
  getIsAllocation,
  getIsReservationTypes,
  getTotalSelectedVisas,
  getIsDisabledFieldsOrActions,
  getIsDisabledRow,
  onSelectCheckboxChanged,
  parentTranslationPath,
  translationPath,
  hideFilters,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [visaStatusesList] = useState(() =>
    Object.values(VisaRequestsStatusesEnum).map((item) => ({
      ...item,
      value: t(`${translationPath}${item.value}`),
    })),
  );
  const [filter, setFilter] = useState({
    reserve_for: state.reserve_for || state.requested_from,
    reserve_for_type: state.reserve_for_type || state.requested_from_type,
    query: null,
  });

  /**
   * @param nameObject - object
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to return the full name of the send object
   */
  const getFullName = useMemo(
    () => (nameObject) =>
      `${
        (nameObject.first_name
          && typeof nameObject.first_name === 'object'
          && (nameObject.first_name[i18next.language] || nameObject.first_name.en))
        || nameObject.first_name
        || ''
      }${
        (nameObject.last_name
          && typeof nameObject.last_name === 'object'
          && ` ${nameObject.last_name[i18next.language] || nameObject.last_name.en}`)
        || (nameObject.last_name && ` ${nameObject.last_name}`)
        || ''
      }`,
    [],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get visa status details by key
   */
  const getVisaStatusByKey = useMemo(
    () => (key) => visaStatusesList.find((item) => item.key === key) || {},
    [visaStatusesList],
  );

  /**
   * @param newValue - this is an object of the new value for the keys
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update filter from child
   */
  const onFilterChanged = useCallback((newValue) => {
    setFilter((items) => ({ ...items, ...newValue }));
  }, []);

  return (
    <div className="request-search-for-visa-tab-wrapper tab-wrapper">
      {state.selectedVisas.length > 0 && (
        <div className="d-flex-v-center">
          <div className="bg-primary c-white fw-bold p-2 br-1rem mx-2">
            {`${getTotalSelectedVisas()} ${t(`${translationPath}visa-selected`)}${
              (state.is_reserved && ` (${t(`${translationPath}from-reserved`)})`)
              || ''
            }`}
          </div>
          <ButtonBase
            className="btns theme-transparent mx-2"
            disabled={getIsDisabledFieldsOrActions()}
            onClick={deselectVisasHandler}
          >
            <span className="fas fa-times" />
            <span className="px-1">{t(`${translationPath}deselect`)}</span>
          </ButtonBase>
        </div>
      )}

      <RequestedToReserveTab
        filter={filter}
        setFilter={setFilter}
        onFilterChanged={onFilterChanged}
        getIsDisabledRow={(row) => getIsDisabledRow(row, true)}
        onSelectCheckboxChanged={onSelectCheckboxChanged}
        globalSelectedRows={state.selectedVisas}
        isWithCheck={
          (getIsConfirmType() && !getIsReservationTypes()) || getIsAllocation()
        }
        getFullName={getFullName}
        isDetailedVisas
        getVisaStatusByKey={getVisaStatusByKey}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
        hideFilters={hideFilters}
      />
    </div>
  );
};

RequestReservedVisasTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onSelectCheckboxChanged: PropTypes.func.isRequired,
  getIsConfirmType: PropTypes.func.isRequired,
  getIsAllocation: PropTypes.func,
  getIsReservationTypes: PropTypes.func.isRequired,
  getTotalSelectedVisas: PropTypes.func.isRequired,
  deselectVisasHandler: PropTypes.func.isRequired,
  getIsDisabledRow: PropTypes.func.isRequired,
  getIsDisabledFieldsOrActions: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
  hideFilters: PropTypes.bool,
};
