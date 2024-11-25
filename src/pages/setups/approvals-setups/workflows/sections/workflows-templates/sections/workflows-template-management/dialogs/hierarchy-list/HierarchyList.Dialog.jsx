import React, { useCallback, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { getErrorByName, showError } from '../../../../../../../../../../helpers';
import { SetupsReducer, SetupsReset } from '../../../../../../../../shared';
import {
  CheckboxesComponent,
  DialogComponent,
} from '../../../../../../../../../../components';
import { getSetupsHierarchy } from '../../../../../../../../../../services';
import './HierarchyList.Style.scss';

export const HierarchyListDialog = ({
  activeItem,
  isOpen,
  onSave,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isLoading, setIsLoading] = useState(false);
  const [hierarchies, setHierarchies] = useState([]);
  const schema = useRef(null);
  const stateInitRef = useRef({
    selected_hierarchies: [],
  });
  const [errors, setErrors] = useState(() => ({}));

  const [state, setState] = useReducer(
    SetupsReducer,
    stateInitRef.current,
    SetupsReset,
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getErrors = useCallback(() => {
    if (schema.current)
      getErrorByName(schema, state).then((result) => {
        setErrors(result);
      });
    else
      setTimeout(() => {
        getErrors();
      });
  }, [state]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getIsSelectedHierarchy = useCallback(
    (uuid) => state.selected_hierarchies.includes(uuid),
    [state.selected_hierarchies],
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check if the string is html or not
   */
  const getEditInit = useCallback(async () => {
    setIsLoading(true);
    const response = await getSetupsHierarchy({
      uuid: activeItem && activeItem.uuid,
    });
    setIsLoading(false);
    if (response && response.status === 200) setHierarchies(response.data.results);
    else
      setHierarchies([
        {
          uuid: 'h1',
          value: 'CEO',
        },
        {
          uuid: 'h2',
          value: 'CTO',
        },
        {
          uuid: 'h3',
          value: 'Welcome',
        },
      ]);
    // else showError(t('Shared:failed-to-get-saved-data'), response);
    // isOpenChanged();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeItem, t]);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    if (Object.keys(errors).length > 0) {
      showError(errors.selected_hierarchies.message);
      return;
    }

    if (onSave) onSave(state.selected_hierarchies);
    if (isOpenChanged) isOpenChanged();
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, state, state.selected_hierarchies]);

  // this to get saved data on edit init
  useEffect(() => {
    if (activeItem) getEditInit();
  }, [activeItem, getEditInit]);

  // this to init errors schema
  useEffect(() => {
    schema.current = yup.object().shape({
      selected_hierarchies: yup
        .array()
        .of(yup.string())
        .nullable()
        .min(
          1,
          `${t('please-select-at-least')} ${1} ${t(
            `${translationPath}hierarchical-node`,
          )}`,
        ),
    });
  }, [t, translationPath]);

  return (
    <DialogComponent
      maxWidth="sm"
      titleText="add-approvals-by-hierarchy"
      dialogContent={
        <div className="hierarchy-list-content-dialog-wrapper">
          {hierarchies.map((item, index) => (
            <div className="hierarchy-item-wrapper" key={`hierarchItem${index + 1}`}>
              <CheckboxesComponent
                idRef={`hierarchyRef${index + 1}`}
                singleChecked={getIsSelectedHierarchy(item.uuid)}
                onSelectedCheckboxChanged={(event, isChecked) => {
                  const localSelectedHierarchies = [
                    ...(state.selected_hierarchies || []),
                  ];

                  if (isChecked) localSelectedHierarchies.push(item.uuid);
                  else {
                    const hierarchyIndex = localSelectedHierarchies.indexOf(
                      item.uuid,
                    );
                    if (hierarchyIndex !== -1)
                      localSelectedHierarchies.splice(hierarchyIndex, 1);
                  }
                  setState({
                    id: 'selected_hierarchies',
                    value: localSelectedHierarchies,
                  });
                }}
                label={item.value}
              />
            </div>
          ))}
        </div>
      }
      wrapperClasses="hierarchy-list-dialog-wrapper"
      isSaving={isLoading}
      isOpen={isOpen}
      isEdit={(activeItem && true) || undefined}
      onSubmit={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

HierarchyListDialog.propTypes = {
  activeItem: PropTypes.shape({
    uuid: PropTypes.string,
  }),
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  onSave: PropTypes.func,
};
HierarchyListDialog.defaultProps = {
  isOpenChanged: undefined,
  onSave: undefined,
  activeItem: undefined,
  translationPath: 'HierarchyListDialog.',
};
