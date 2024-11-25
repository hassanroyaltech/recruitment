import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { VisasAndBlocksTab } from '../../../../dashboard/tabs';
import ButtonBase from '@mui/material/ButtonBase';

export const RequestSearchForVisaTab = ({
  state,
  deselectVisasHandler,
  getTotalSelectedVisas,
  getIsDisabledRow,
  getIsDisabledFieldsOrActions,
  onSelectCheckboxChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [filter, setFilter] = useState({
    company: null,
    is_expired: false,
    occupation: undefined,
    nationality: undefined,
    gender: undefined,
    religion: undefined,
    issue_place: undefined,
    status: undefined,
    search: undefined,
  });

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
            onClick={deselectVisasHandler}
            disabled={getIsDisabledFieldsOrActions()}
          >
            <span className="fas fa-times" />
            <span className="px-1">{t(`${translationPath}deselect`)}</span>
          </ButtonBase>
        </div>
      )}

      <VisasAndBlocksTab
        filter={filter}
        onFilterChanged={onFilterChanged}
        getIsDisabledRow={(row) => getIsDisabledRow(row)}
        onSelectCheckboxChanged={onSelectCheckboxChanged}
        globalSelectedRows={state.selectedVisas}
        isWithoutTableActions
        isWithCheckAll={false}
        parentTranslationPath={parentTranslationPath}
        // translationPath={translationPath}
      />
    </div>
  );
};

RequestSearchForVisaTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onSelectCheckboxChanged: PropTypes.func.isRequired,
  getTotalSelectedVisas: PropTypes.func.isRequired,
  deselectVisasHandler: PropTypes.func.isRequired,
  getIsDisabledRow: PropTypes.func.isRequired,
  getIsDisabledFieldsOrActions: PropTypes.func.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
