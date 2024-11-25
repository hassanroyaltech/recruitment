import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useTransition,
} from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { SetupsReducer, SetupsReset } from '../../../helpers';
import { SwitchComponent } from '../../../../../../components';
import { getErrorByName } from '../../../../../../helpers';
import * as yup from 'yup';
import { GetAllSetupsCandidatePropertyModals } from '../../../../../../services';
import i18next from 'i18next';
import {
  SharedAPIAutocompleteControl,
  SharedAutocompleteControl,
} from '../../../controls';
import { LookupsTypesEnum } from '../../../../../../enums';

export const CandidatePropertiesExtrasComponent = ({
  activeItem,
  parentState,
  onParentStateChanged,
  // extraErrors,
  onExtraErrorsChanged,
  errorsKey,
  isParentLoading,
  isParentSubmitted,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [errors, setErrors] = useState(() => ({}));
  const [lookupsTypes] = useState(
    Object.values(LookupsTypesEnum).map((item) => ({
      ...item,
      value: t(item.value),
    })),
  );
  const stateInitRef = useRef({
    from_lookup: false,
    lookup_key: null,
    lookup_type: null,
    is_required: false,
    fill_from: 'user',
    ...parentState,
  });

  const [, startTransition] = useTransition();
  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is sent new value for state from child
   */
  const onStateChanged = (newValue) => {
    setState(newValue);
    startTransition(() => {
      onParentStateChanged(newValue);
    });
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    getErrorByName(
      {
        current: yup.object().shape({
          from_lookup: yup.boolean().nullable(),
          lookup_key: yup
            .string()
            .nullable()
            .when(
              'from_lookup',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          lookup_type: yup
            .string()
            .nullable()
            .when(
              'from_lookup',
              (value, field) =>
                (value && field.required(t('Shared:this-field-is-required')))
                || field,
            ),
          is_required: yup.boolean().nullable(),
          fill_from: yup.string().nullable(),
        }),
      },
      state,
    ).then((result) => {
      setErrors(result);
      startTransition(() => {
        onExtraErrorsChanged({ [errorsKey]: result });
      });
    });
  }, [errorsKey, onExtraErrorsChanged, state, t]);

  /**
   * @param id
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to update the switch
   */
  const onSwitchChangedHandler = (id) => (event, isChecked) => {
    onStateChanged({
      id,
      value: isChecked,
    });
  };

  // to update the (local) state on parent state changed to make sure on edit have the same values
  useEffect(() => {
    setState({ id: 'edit', value: { ...stateInitRef.current, ...parentState } });
  }, [parentState]);

  // to update the (parent) state on parent state changed to make sure on edit have the same values
  useEffect(() => {
    if (!activeItem)
      onParentStateChanged({ id: 'edit', value: { ...stateInitRef.current } });
  }, [activeItem, onParentStateChanged]);

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state]);

  return (
    <div className="candidate-properties-extras-component-wrapper px-2">
      <SwitchComponent
        idRef="fromLookupSwitchRef"
        label="from-lookup"
        isChecked={state.from_lookup}
        isReversedLabel
        isFlexEnd
        isDisabled={isParentLoading || Boolean(activeItem && activeItem.uuid)}
        switchLabelClasses="fw-bold c-black-light"
        onChange={(event, isChecked) => {
          onSwitchChangedHandler('from_lookup')(event, isChecked);
          if (!isChecked && state.lookup_key)
            onStateChanged({
              id: 'lookup_key',
              value: null,
            });
          if (!isChecked && state.lookup_type)
            onStateChanged({
              id: 'lookup_type',
              value: null,
            });
        }}
        parentTranslationPath={parentTranslationPath}
        translationPath={translationPath}
      />
      {state.from_lookup && (
        <>
          <SharedAPIAutocompleteControl
            isHalfWidth
            isRequired
            title="lookup-source"
            errors={errors}
            placeholder="select-lookup-source"
            stateKey="lookup_key"
            isDisabled={isParentLoading || Boolean(activeItem && activeItem.uuid)}
            isSubmitted={isParentSubmitted}
            editValue={state.lookup_key}
            uniqueKey="key"
            errorPath="lookup_key"
            onValueChanged={onStateChanged}
            getDataAPI={GetAllSetupsCandidatePropertyModals}
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
            getOptionLabel={(option) =>
              option.name[i18next.language] || option.name.en
            }
          />
          <SharedAutocompleteControl
            isHalfWidth
            isDisabled={isParentLoading || Boolean(activeItem && activeItem.uuid)}
            initValues={lookupsTypes}
            stateKey="lookup_type"
            onValueChanged={onStateChanged}
            title="lookup-type"
            editValue={state.lookup_type}
            errors={errors}
            isSubmitted={isParentSubmitted}
            errorPath="lookup_type"
            placeholder="select-lookup-type"
            isRequired
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
          <div className="d-inline-flex px-2">
            <SwitchComponent
              idRef="isRequiredPropertiesSwitchRef"
              label="required"
              isChecked={state.is_required}
              isReversedLabel
              isFlexEnd
              isDisabled={isParentLoading}
              switchLabelClasses="fw-bold c-black-light"
              onChange={(event, isChecked) => {
                onSwitchChangedHandler('is_required')(event, isChecked);
              }}
              parentTranslationPath={parentTranslationPath}
              translationPath={translationPath}
            />
          </div>
        </>
      )}
    </div>
  );
};

CandidatePropertiesExtrasComponent.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  parentState: PropTypes.instanceOf(Object).isRequired,
  onParentStateChanged: PropTypes.func.isRequired,
  // extraErrors: PropTypes.instanceOf(Object).isRequired,
  onExtraErrorsChanged: PropTypes.func.isRequired,
  errorsKey: PropTypes.string.isRequired,
  isParentLoading: PropTypes.bool.isRequired,
  isParentSubmitted: PropTypes.bool.isRequired,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string.isRequired,
};
