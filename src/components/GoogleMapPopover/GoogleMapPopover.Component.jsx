import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ButtonBase } from '@mui/material';
import { PopoverComponent } from '../Popover/Popover.Component';
import { Inputs } from '../Inputs/Inputs.Component';
import { GoogleMapComponent } from '../GoogleMap/GoogleMap.Component';

export const GoogleMapPopoverComponent = memo(
  ({
    value,
    onInputChanged,
    isDisabled,
    isDisabledInput,
    idRef,
    label,
    themeClass,
    labelValue,
    inputPlaceholder,
    isSubmitted,
    helperText,
    error,
    parentTranslationPath,
    translationPath,
    defaultCenter,
    defaultZoom,
    onMapClicked,
    onMarkerClicked,
    center,
    locations,
    searchLocation,
    onSearchLocationsChange,
    googleMapWrapper,
    scriptId,
  }) => {
    const inputRef = useRef(null);
    const [localValue, setLocalValue] = useState(value);
    const [popoverAttachedWith, setPopoverAttachedWith] = useState(null);
    const mapPopoverCloseHandler = useCallback(() => {
      setPopoverAttachedWith(null);
    }, []);
    const mapToggleHandler = useCallback(() => {
      setPopoverAttachedWith(inputRef.current);
    }, []);
    useEffect(() => {
      if (!popoverAttachedWith && value !== localValue) setLocalValue(value);
    }, [localValue, popoverAttachedWith, value]);

    return (
      <div className="google-map-popover-component-wrapper">
        <Inputs
          idRef={idRef}
          refs={inputRef}
          value={localValue}
          labelValue={labelValue}
          label={label}
          themeClass={themeClass}
          inputPlaceholder={inputPlaceholder}
          endAdornment={
            <div className="end-adornment-wrapper">
              <ButtonBase
                className="btns-icon theme-solid mx-2"
                style={{
                  color: localValue,
                }}
                disabled={isDisabled}
                onClick={mapToggleHandler}
              >
                <span className="fas fa-map-marker-alt" />
              </ButtonBase>
            </div>
          }
          error={error}
          helperText={helperText}
          isSubmitted={isSubmitted}
          isDisabled={isDisabled || isDisabledInput}
          onInputChanged={(event) => {
            const { target } = event;
            if (onInputChanged) {
              setLocalValue(target.value);
              onInputChanged(target.value);
            }
          }}
          parentTranslationPath={parentTranslationPath}
          translationPath={translationPath}
        />
        <PopoverComponent
          idRef={`mapPopoverRef${idRef}`}
          attachedWith={popoverAttachedWith}
          handleClose={mapPopoverCloseHandler}
          paperStyle={{
            minWidth:
              (inputRef.current && inputRef.current.offsetWidth) || undefined,
          }}
          component={
            <GoogleMapComponent
              scriptId={scriptId}
              defaultCenter={defaultCenter}
              defaultZoom={defaultZoom}
              locations={locations}
              isSubmitted={isSubmitted}
              helperText={helperText}
              onMarkerClicked={onMarkerClicked}
              onMapClicked={onMapClicked}
              googleMapWrapper={googleMapWrapper}
              center={center}
              onSearchLocationsChange={onSearchLocationsChange}
              searchLocation={searchLocation}
            />
          }
        />
      </div>
    );
  },
);

GoogleMapPopoverComponent.displayName = 'GoogleMapPopoverComponent';

GoogleMapPopoverComponent.propTypes = {
  value: PropTypes.string,
  onInputChanged: PropTypes.func,
  idRef: PropTypes.string,
  themeClass: PropTypes.string,
  labelValue: PropTypes.string,
  label: PropTypes.string,
  inputPlaceholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  isDisabledInput: PropTypes.bool,
  isSubmitted: PropTypes.bool,
  helperText: PropTypes.string,
  error: PropTypes.bool,
  parentTranslationPath: PropTypes.string,
  translationPath: PropTypes.string,

  locations: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      lat: PropTypes.number,
      lng: PropTypes.number,
      text: PropTypes.string,
      data: PropTypes.arrayOf(PropTypes.instanceOf(Object)), // for popover content
      component: PropTypes.oneOfType([
        PropTypes.elementType,
        PropTypes.func,
        PropTypes.node,
      ]),
    }),
  ).isRequired,
  searchLocation: PropTypes.instanceOf(Object),
  center: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  defaultCenter: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  // hoverDistance: PropTypes.number,
  defaultZoom: PropTypes.number,
  onSearchLocationsChange: PropTypes.func,
  onMapClicked: PropTypes.func,
  onMarkerClicked: PropTypes.func,
  // onChange: PropTypes.func,
  googleMapWrapper: PropTypes.string,
  scriptId: PropTypes.string,
};
GoogleMapPopoverComponent.defaultProps = {
  value: undefined,
  onInputChanged: undefined,
  idRef: 'GoogleMapPopoverComponentRef',
  themeClass: 'theme-solid',
  labelValue: undefined,
  label: undefined,
  inputPlaceholder: undefined,
  isDisabled: false,
  isDisabledInput: false,
  isSubmitted: false,
  helperText: undefined,
  error: false,
  parentTranslationPath: undefined,
  translationPath: undefined,
  searchLocation: undefined,
  center: undefined,
  defaultCenter: undefined,
  defaultZoom: undefined,
  onSearchLocationsChange: undefined,
  onMapClicked: undefined,
  onMarkerClicked: undefined,
  googleMapWrapper: undefined,
  scriptId: undefined,
};
