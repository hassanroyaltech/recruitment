import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { DynamicFormTypesEnum, ReviewTypesEnum } from 'enums';
import {
  DynamicFormAutocompleteControl,
  DynamicFormDateInputControl,
  DynamicFormInputControl,
  DynamicFormRichTextInputControl,
  DynamicFormUploaderControl,
} from './controls';
import { GroupControlsByParentKey } from '../../../../helpers';

export const DynamicFormHandler = ({
  controlItem,
  // state,
  controls,
  editValue,
  reviewType,
  onEditValueChanged,
  errors,
  isSubmitted,
  isRequired,
  errorPath,
}) => {
  const [component, setComponent] = useState(null);

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get group name title & display it
   * if parent_key exist & index of current item is 0 in groups items
   */
  const getGroupName = useMemo(
    // eslint-disable-next-line react/display-name
    () => () => {
      if (
        GroupControlsByParentKey(controlItem, controls).length === 0
        || GroupControlsByParentKey(controlItem, controls).findIndex(
          (item) => item.name === controlItem.name,
        ) > 0
      )
        return null;
      return (
        <div className="group-name-wrapper">
          <span>{controlItem.parent_title}</span>
        </div>
      );
    },
    [controlItem, controls],
  );

  // /**
  //  * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
  //  * @Description this method is to get max & min value for effected by fields
  //  * if it has a parent_key (grouped controls) length more then 0
  //  */
  // const getValueOfRelatedGroupItems = useMemo(
  //   () => (groupedControls) => {
  //     const effectedByControl = groupedControls.find(
  //       (item) => item.name !== controlItem.name,
  //     );
  //     const currentMaxAndMin = {
  //       max: undefined,
  //       min: undefined,
  //     };
  //     if (!effectedByControl) return currentMaxAndMin;
  //     if (effectedByControl.max || effectedByControl.max === 0)
  //       currentMaxAndMin.max = (state[reviewType]
  //           && state[reviewType][controlItem.parent_key]
  //           && (state[reviewType][controlItem.parent_key][effectedByControl.name]
  //             || state[reviewType][controlItem.parent_key][effectedByControl.name]
  //               === 0)
  //           && +state[reviewType][controlItem.parent_key][effectedByControl.name]
  //             - 1)
  //         || effectedByControl.max - 1;
  //     if (effectedByControl.min || effectedByControl.min === 0)
  //       currentMaxAndMin.min = (state[reviewType]
  //           && state[reviewType][controlItem.parent_key]
  //           && (state[reviewType][controlItem.parent_key][effectedByControl.name]
  //             || state[reviewType][controlItem.parent_key][effectedByControl.name]
  //               === 0)
  //           && +state[reviewType][controlItem.parent_key][effectedByControl.name]
  //             + 1)
  //         || effectedByControl.min + 1;
  //     return currentMaxAndMin;
  //   },
  //   [controlItem.name, controlItem.parent_key, reviewType, state],
  // );

  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to identify the current control & sent for it the necessary data
   */
  const getControl = useCallback(() => {
    const localProps = {
      controlItem,
      editValue,
      reviewType,
      onEditValueChanged,
      errors,
      isSubmitted,
      isRequired,
      errorPath,
      // maxByOtherField:
      //   GroupControlsByParentKey().length > 0
      //     ? getValueOfRelatedGroupItems(GroupControlsByParentKey()).max
      //     : undefined,
      // minByOtherField:
      //   GroupControlsByParentKey().length > 0
      //     ? getValueOfRelatedGroupItems(GroupControlsByParentKey()).min
      //     : undefined,
      // controls,
    };
    console.log({
      localProps,
      controlItem,
      editValue,
      reviewType,
      onEditValueChanged,
      errors,
      isSubmitted,
      isRequired,
      errorPath,
    })
    if (
      controlItem.type === DynamicFormTypesEnum.array.key
      || controlItem.type === DynamicFormTypesEnum.select.key
    )
      setComponent(<DynamicFormAutocompleteControl {...localProps} isRequired={controlItem.validation === "required"} />);
    else if (
      controlItem.type === DynamicFormTypesEnum.number.key
      || controlItem.type === DynamicFormTypesEnum.text.key
      || controlItem.type === DynamicFormTypesEnum.email.key
      || controlItem.type === DynamicFormTypesEnum.url.key
    )
      setComponent(<DynamicFormInputControl {...localProps} isRequired={controlItem.validation === "required"} />);
    else if (controlItem.type === DynamicFormTypesEnum.uploader.key)
      setComponent(<DynamicFormUploaderControl {...localProps} isRequired={controlItem.validation === "required"} />);
    else if (controlItem.type === DynamicFormTypesEnum.date.key)
      setComponent(<DynamicFormDateInputControl {...localProps} isRequired={controlItem.validation === "required"} />);
    else if (controlItem.type === DynamicFormTypesEnum.richText.key)
      setComponent(<DynamicFormRichTextInputControl {...localProps} isRequired={controlItem.validation === "required"} />);
  }, [
    controlItem,
    editValue,
    reviewType,
    onEditValueChanged,
    errors,
    isSubmitted,
    isRequired,
    errorPath,
  ]);
  useEffect(() => {
    getControl();
  }, [getControl]);
  return (
    <>
      {getGroupName()}
      {component}
    </>
  );
};

DynamicFormHandler.propTypes = {
  // state: PropTypes.instanceOf(Object).isRequired,
  controlItem: PropTypes.shape({
    current_values: PropTypes.instanceOf(Array),
    parent_key: PropTypes.string,
    parent_title: PropTypes.string,
    name: PropTypes.string,
    validation: PropTypes.string,
    type: PropTypes.oneOf(
      Object.values(DynamicFormTypesEnum).map((item) => item.key),
    ),
  }).isRequired,
  controls: PropTypes.instanceOf(Array),
  editValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.instanceOf(Array),
    PropTypes.instanceOf(Object),
  ]),
  reviewType: PropTypes.oneOf(Object.values(ReviewTypesEnum).map((item) => item.key))
    .isRequired,
  onEditValueChanged: PropTypes.func,
  errors: PropTypes.instanceOf(Object),
  isSubmitted: PropTypes.bool.isRequired,
  isRequired: PropTypes.bool.isRequired,
  errorPath: PropTypes.string,
};
DynamicFormHandler.defaultProps = {
  editValue: undefined,
  onEditValueChanged: undefined,
  errors: {},
  controls: [],
};
