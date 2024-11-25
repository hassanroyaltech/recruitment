import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import { DialogComponent } from '../../../../../../components';
import { SharedAutocompleteControl } from '../../../../shared';
import { getErrorByName } from '../../../../../../helpers';

export const ParentAddDialog = ({
  isOpen,
  onAddItemClicked,
  getAvailableParents,
  isOpenChanged,
  parentTranslationPath,
  translationPath,
}) => {
  const { t } = useTranslation(parentTranslationPath);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [parentUUID, setParentUUID] = useState(null);

  // this to init errors schema
  const schema = useRef(
    yup.object().shape({
      parent_uuid: yup.string().nullable().required(t('this-field-is-required')),
    }),
  );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to check the errors status
   */
  const getErrors = useCallback(async () => {
    const result = await getErrorByName(schema, { parent_uuid: parentUUID });
    setErrors(result);
  }, [parentUUID]);

  /**
   * @param newValue
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is send new value for state from child
   */
  const onStateChanged = (newValue) => {
    setParentUUID(newValue.value);
  };

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to handle saving
   */
  const saveHandler = async (event) => {
    event.preventDefault();
    setIsSubmitted(true);
    if (Object.keys(errors).length > 0) return;
    if (onAddItemClicked) onAddItemClicked(parentUUID);
    if (isOpenChanged) isOpenChanged();
  };

  // this to call errors updater when state changed
  useEffect(() => {
    getErrors();
  }, [getErrors, parentUUID]);

  return (
    <DialogComponent
      titleText="add-new-node"
      maxWidth="xs"
      saveText="add"
      isOpen={isOpen}
      dialogContent={
        <div className="parent-add-dialog-wrapper px-2">
          <SharedAutocompleteControl
            isFullWidth
            editValue={parentUUID}
            placeholder="select-parent-node"
            title="parent-node"
            stateKey="parent_uuid"
            errorPath="parent_uuid"
            onValueChanged={onStateChanged}
            isSubmitted={isSubmitted}
            errors={errors}
            getOptionLabel={(option) =>
              (option.title
                && (option.title[i18next.language] || option.title.en))
              || 'N/A'
            }
            initValues={getAvailableParents()}
            initValuesKey="uuid"
            initValuesTitle="name"
            parentTranslationPath={parentTranslationPath}
            translationPath={translationPath}
          />
        </div>
      }
      saveType="button"
      onSaveClicked={saveHandler}
      onCloseClicked={isOpenChanged}
      onCancelClicked={isOpenChanged}
      parentTranslationPath={parentTranslationPath}
      translationPath={translationPath}
    />
  );
};

ParentAddDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  isOpenChanged: PropTypes.func,
  parentTranslationPath: PropTypes.string.isRequired,
  translationPath: PropTypes.string,
  getAvailableParents: PropTypes.func.isRequired,
  onAddItemClicked: PropTypes.func.isRequired,
};
ParentAddDialog.defaultProps = {
  isOpenChanged: undefined,
  translationPath: 'ParentAddDialog.',
};
