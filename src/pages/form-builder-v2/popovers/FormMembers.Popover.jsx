import React, { memo, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PopoverComponent, TabsComponent } from '../../../components';
import { SetupsReducer, SetupsReset } from '../../setups/shared';
import './FormMembers.Style.scss';

const FormMembersPopover = ({
  values,
  popoverTabs,
  popoverAttachedWith,
  handleClose,
  arrayKey,
  uuidKey,
  typeKey,
  onSave,
  isDisabled,
  listAPIProps,
  getListAPIProps,
  imageAltValue,
  // visibleFormMembers,
  extraStateData,
  // isFromAssist,
  // isFromAssign,
  transformOrigin,
  getIsDisabledItem,
  dropdownsProps,
  isWithJobsFilter,
  getPropsByType,
  parentTranslationPath,
  translationPath,
  nameKey,
  isDisabledTextSearch,
  jobUUID,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [popoverTabsData, setPopoverTabsData] = useState(() => []);

  const stateInitRef = useRef({
    [arrayKey]: [],
  });

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
  };

  useEffect(() => {
    if (values && values.length > 0) setState({ id: arrayKey, value: values });
  }, [arrayKey, values]);

  useEffect(() => {
    setPopoverTabsData(
      popoverTabs,
      //   .filter((item) =>
      //   visibleFormMembers.some(
      //     (element) =>
      //       item.props.type === element
      //       && (item.props.type !== FormsMembersTypesEnum.Candidates.key
      //         || (item.props.type === FormsMembersTypesEnum.Candidates.key
      //           && isWithJobsFilter === item.props.isWithJobsFilter))
      //       && ((isFromAssist !== undefined
      //         ? item.props.isFromAssist === isFromAssist
      //         : isFromAssign !== undefined
      //           && item.props.isFromAssign === isFromAssign)
      //         || (!item.props.isFromAssist
      //           && !item.props.isFromAssign
      //           && isFromAssist === undefined
      //           && isFromAssign === undefined))
      //   )
      // )
    );
  }, [popoverTabs]);

  return (
    <PopoverComponent
      idRef={`formMembersPopoverRef${arrayKey}`}
      attachedWith={popoverAttachedWith}
      handleClose={() => {
        if (onSave) onSave(state);
        if (handleClose) handleClose();
      }}
      transformOrigin={transformOrigin}
      popoverClasses="form-members-popover-wrapper"
      component={
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef={`formMembersPopoverTabsRef${arrayKey}`}
          tabsHeaderClasses={` mt-3`}
          data={popoverTabsData}
          currentTab={activeTab}
          onTabChanged={(event, currentTab) => {
            setActiveTab(currentTab);
          }}
          scrollButtons={false}
          visibleScrollbar
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
          dynamicComponentProps={{
            arrayKey,
            listAPIProps,
            getListAPIProps,
            uuidKey,
            typeKey,
            isDisabled,
            state,
            imageAltValue:
              imageAltValue
              || (activeTab !== -1 && popoverTabsData[activeTab]?.label),
            extraStateData,
            onStateChanged,
            getIsDisabledItem,
            dropdownsProps,
            isWithJobsFilter,
            getPropsByType,
            parentTranslationPath,
            translationPath,
            nameKey,
            isDisabledTextSearch,
            jobUUID,
          }}
        />
      }
    />
  );
};

FormMembersPopover.propTypes = {
  values: PropTypes.instanceOf(Array),
  popoverTabs: PropTypes.instanceOf(Array),
  arrayKey: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  imageAltValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  // isFromAssist: PropTypes.bool,
  // isFromAssign: PropTypes.bool,
  // visibleFormMembers: PropTypes.arrayOf(
  //   PropTypes.oneOf(Object.values(FormsMembersTypesEnum).map((item) => item.key))
  // ),
  extraStateData: PropTypes.instanceOf(Object),
  listAPIProps: PropTypes.instanceOf(Object),
  transformOrigin: PropTypes.instanceOf(Object),
  getListAPIProps: PropTypes.func,
  uuidKey: PropTypes.string,
  typeKey: PropTypes.string,
  popoverAttachedWith: PropTypes.instanceOf(Object),
  handleClose: PropTypes.func,
  getIsDisabledItem: PropTypes.func,
  isWithJobsFilter: PropTypes.bool,
  getPropsByType: PropTypes.func,
  dropdownsProps: PropTypes.shape({
    job_uuid: PropTypes.string,
    job_pipeline_uuid: PropTypes.string,
    selected_candidates: PropTypes.arrayOf(PropTypes.string),
  }),
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
  nameKey: PropTypes.string,
  isDisabledTextSearch: PropTypes.bool,
  jobUUID: PropTypes.string,
};

FormMembersPopover.defaultProps = {
  uuidKey: 'uuid',
  typeKey: 'type',
  isDisabled: false,
  isHideTextSearch: false,
  imageAltValue: 'user',
  extraStateData: {},
  // visibleFormMembers: [],
  parentTranslationPath: 'FormBuilderPage',
  translationPath: '',
};

export default memo(FormMembersPopover);
