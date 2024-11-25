import React, { memo, useEffect, useReducer, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { PopoverComponent, TabsComponent } from '../../../../components';
import './Directories.Style.scss';
import { SetupsReducer, SetupsReset } from '../../../setups/shared';
import { DirectoriesTabs } from '../../tabs-data';

const DirectoriesPopover = ({
  values,
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
  extraStateData,
  transformOrigin,
  getIsDisabledItem,
  parentTranslationPath,
  translationPath,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [directoriesTabsData] = useState(() => DirectoriesTabs);

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

  return (
    <PopoverComponent
      idRef={`directoriesPopoverRef${arrayKey}`}
      attachedWith={popoverAttachedWith}
      handleClose={() => {
        if (onSave) onSave(state);
        if (handleClose) handleClose();
      }}
      transformOrigin={transformOrigin}
      popoverClasses="directories-popover-wrapper"
      component={
        <TabsComponent
          isPrimary
          isWithLine
          labelInput="label"
          idRef={`directoriesPopoverTabsRef${arrayKey}`}
          tabsHeaderClasses={` mt-3`}
          data={directoriesTabsData}
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
            imageAltValue,
            extraStateData,
            onStateChanged,
            getIsDisabledItem,
            parentTranslationPath,
            translationPath,
          }}
        />
      }
    />
  );
};

DirectoriesPopover.propTypes = {
  values: PropTypes.instanceOf(Array),
  arrayKey: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  imageAltValue: PropTypes.string,
  isDisabled: PropTypes.bool,
  extraStateData: PropTypes.instanceOf(Object),
  listAPIProps: PropTypes.instanceOf(Object),
  transformOrigin: PropTypes.instanceOf(Object),
  getListAPIProps: PropTypes.func,
  uuidKey: PropTypes.string,
  typeKey: PropTypes.string,
  popoverAttachedWith: PropTypes.instanceOf(Object),
  handleClose: PropTypes.func,
  getIsDisabledItem: PropTypes.func,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,
};

DirectoriesPopover.defaultProps = {
  uuidKey: 'uuid',
  typeKey: 'type',
  isDisabled: false,
  imageAltValue: 'directory',
  extraStateData: {},
  visibleFormMembers: [],
  parentTranslationPath: 'OnboardingPage',
  translationPath: '',
};

export default memo(DirectoriesPopover);
