import React, { useEffect, useReducer, useRef, useState, useCallback } from 'react';
// import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../../../../../shared';
import {
  GetAllSetupsCompetencies,
  getSetupsCompetenciesById,
} from '../../../../../../../../../services';
import {
  DynamicFormTypesEnum,
  CompetencyLevelsEnums,
  CompetencySourcesEnums,
} from '../../../../../../../../../enums';
import { showError } from '../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../shared/helpers';

export const CompetencyForm = ({
  lookup,
  translationPath,
  parentTranslationPath,
  setStateFunc,
  isSubmitted,
  setIsLoading,
  errors,
  activeItem,
  isOpenChanged,
  filter,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const stateInitRef = useRef({
    competency_uuid: '',
    competency_source: 0,
    competency_level: 0,
    employee_uuid: '',
  });
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );
  const [CompetencySources] = useState(() => Object.values(CompetencySourcesEnums));
  const [CompetencyLevels] = useState(() => Object.values(CompetencyLevelsEnums));
  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
  };

  // TODO: handle the case where we
  // dont edit competency source or level and make their value and integer

  const onSetEditValues = useCallback(() => {
    lookup.viewAPI({ uuid: activeItem.uuid }).then((res) => {
      if (res && res.status === 200) {
        if (res.data?.results)
          Object.entries(res.data.results).forEach((item) =>
            onStateChanged({ id: item[0], value: item[1] }),
          );
        else showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
      } else {
        showError(t('Shared:failed-to-get-saved-data'), res);
        setIsLoading(false);
        isOpenChanged();
      }
    });
  }, [activeItem, lookup, isOpenChanged, setIsLoading, t]);

  useEffect(() => {
    if (filter?.employee_uuid)
      onStateChanged({ id: 'employee_uuid', value: filter.employee_uuid });
  }, [filter]);

  useEffect(() => {
    setStateFunc(state);
  }, [state, setStateFunc]);

  useEffect(() => {
    activeItem && onSetEditValues();
  }, [activeItem, onSetEditValues]);

  return (
    <div>
      <SharedAPIAutocompleteControl
        isHalfWidth
        title="competency-uuid"
        errors={errors}
        isSubmitted={isSubmitted}
        stateKey="competency_uuid"
        errorPath="competency_uuid"
        placeholder="select-competency"
        onValueChanged={onStateChanged}
        editValue={state.competency_uuid}
        translationPath={translationPath}
        searchKey="search"
        getDataAPI={GetAllSetupsCompetencies}
        getItemByIdAPI={getSetupsCompetenciesById}
        type={DynamicFormTypesEnum.select.key}
        parentTranslationPath={parentTranslationPath}
        getOptionLabel={(option) => option?.name?.en}
        extraProps={{
          ...(state.competency_uuid && { with_than: [state.competency_uuid] }),
        }}
      />
      <SharedAutocompleteControl
        isHalfWidth
        title="competency-source"
        initValues={CompetencySources}
        editValue={state.competency_source}
        onValueChanged={(newValue) =>
          newValue?.value
          && setState({
            id: newValue.id,
            value: CompetencySourcesEnums[newValue.value]?.key,
          })
        }
        errors={errors}
        stateKey="competency_source"
        errorPath="competency_source"
        isSubmitted={isSubmitted}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        placeholder="select-competency-source"
        getOptionLabel={(option) => option.title}
      />
      <SharedAutocompleteControl
        isHalfWidth
        title="competency-level"
        initValues={CompetencyLevels}
        editValue={state.competency_level}
        onValueChanged={(newValue) =>
          newValue?.value
          && setState({
            id: newValue.id,
            value: CompetencyLevelsEnums[newValue.value].key,
          })
        }
        errors={errors}
        stateKey="competency_level"
        errorPath="competency_level"
        isSubmitted={isSubmitted}
        translationPath={translationPath}
        parentTranslationPath={parentTranslationPath}
        placeholder="select-competency-level"
        getOptionLabel={(option) => option.title}
      />
    </div>
  );
};

CompetencyForm.propTypes = {
  lookup: PropTypes.shape({
    key: PropTypes.number,
    label: PropTypes.string,
    valueSingle: PropTypes.string,
    feature_name: PropTypes.string,
    updateAPI: PropTypes.func,
    createAPI: PropTypes.func,
    viewAPI: PropTypes.func,
    listAPI: PropTypes.func,
    deleteAPI: PropTypes.func,
  }),
  translationPath: PropTypes.string,
  parentTranslationPath: PropTypes.string,
  setStateFunc: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool,
  setIsLoading: PropTypes.func.isRequired,
  errors: PropTypes.shape({}),
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpenChanged: PropTypes.func,
  filter: PropTypes.shape({
    employee_uuid: PropTypes.string,
  }),
};

CompetencyForm.defaultProps = {
  activeItem: undefined,
  lookup: undefined,
  isOpenChanged: undefined,
  translationPath: '',
  filter: undefined,
  parentTranslationPath: '',
  isSubmitted: false,
  errors: {},
};
