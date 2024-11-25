import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { GoogleMapComponent } from '../../../../../../components';
import './LocationMap.Style.scss';

export const LocationMapTab = ({ state, onStateChanged, errors, isSubmitted }) => {
  const [localLocations, setLocalLocations] = useState([]);
  const [localMapCenter, setLocalMapCenter] = useState();
  /**
   * @param locationsString
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is convert the string that include locations
   * to array or lat,lng
   * @return [{lat:latitude,lng:longitude}]
   */
  const parseStringToLocations = useMemo(
    () => (locationsString) =>
      (locationsString
        && locationsString.split('&').map((item) => ({
          lat: +item.split(',')[0],
          lng: +item.split(',')[1],
        })))
      || [],
    [],
  );

  /**
   * @param newLocation
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to get the new location(s)
   * from search of child google map and add (only the new)
   * to the map locations var iframe_map to be sent to back
   */
  const onSearchLocationsChange = (newLocation) => {
    const newLocationsAfterFilterWithExist = newLocation.filter(
      (item) =>
        localLocations.findIndex(
          (element) => element.lat === item.lat && element.lng === item.lng,
        ) === -1,
    );
    if (newLocationsAfterFilterWithExist.length === 0) return;
    const convertLocationsBackToString = `${newLocation[0].lat},${newLocation[0].lng}`;
    // const convertLocationsBackToString = newLocation
    // .concat(localLocations)
    // .map((item) => `${item.lat},${item.lng}`)
    // .join('&');
    setLocalMapCenter(newLocationsAfterFilterWithExist[0]);
    // setLocalLocations((items) => newLocationsAfterFilterWithExist.concat(items));
    setLocalLocations(() => [{ ...newLocationsAfterFilterWithExist[0] }]);
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'iframe_map',
        value: convertLocationsBackToString,
      });
  };

  /**
   * @param markerLocation
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this method is to remove the marker on click on it
   */
  const onMarkerClicked = (markerLocation) => {
    const copyLocalLocations = [...localLocations];
    const markerIndex = copyLocalLocations.findIndex(
      (item) => item.lat === markerLocation.lat && item.lng === markerLocation.lng,
    );
    if (markerIndex !== -1) {
      copyLocalLocations.splice(markerIndex, 1);
      setLocalLocations(copyLocalLocations);
      const convertLocationsBackToString = copyLocalLocations
        .map((item) => `${item.lat},${item.lng}`)
        .join('&');
      if (onStateChanged)
        onStateChanged({
          parentId: 'section_data',
          id: 'iframe_map',
          value: convertLocationsBackToString,
        });
    }
  };
  const onMapClickedHandler = (newLocation) => {
    const copyLocations = [...localLocations];
    copyLocations.push({ ...newLocation });
    setLocalLocations(() => [{ ...newLocation }]);
    const convertLocationsBackToString = [{ ...newLocation }]
      .map((item) => `${item.lat},${item.lng}`)
      .join('&');
    if (onStateChanged)
      onStateChanged({
        parentId: 'section_data',
        id: 'iframe_map',
        value: convertLocationsBackToString,
      });
  };
  /**
   * @author Aladdin Al-awadat (a.alawadat@elevatus.io)
   * @Description this is to update localLocation on this tab active
   */
  useEffect(() => {
    if (
      state.section_data
      && state.section_data.iframe_map
      && localLocations.length === 0
    ) {
      setLocalLocations(parseStringToLocations(state.section_data.iframe_map));
      setLocalMapCenter(parseStringToLocations(state.section_data.iframe_map)[0]);
    }
  }, [localLocations.length, parseStringToLocations, state.section_data]);
  return (
    <div className="location-map-tab-wrapper tab-wrapper">
      <GoogleMapComponent
        defaultZoom={16}
        locations={localLocations}
        center={localMapCenter}
        isSubmitted={isSubmitted}
        onSearchLocationsChange={onSearchLocationsChange}
        helperText={
          (errors['section_data.iframe_map']
            && errors['section_data.iframe_map'].message)
          || undefined
        }
        onMarkerClicked={onMarkerClicked}
        onMapClicked={onMapClickedHandler}
      />
    </div>
  );
};

LocationMapTab.propTypes = {
  state: PropTypes.instanceOf(Object).isRequired,
  onStateChanged: PropTypes.func,
  isSubmitted: PropTypes.bool,
  errors: PropTypes.instanceOf(Object),
};
LocationMapTab.defaultProps = {
  onStateChanged: undefined,
  isSubmitted: false,
  errors: {},
};
